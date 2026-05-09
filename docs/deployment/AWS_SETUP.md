# AWS Manual Setup Guide — godatify-landing

Step-by-step guide for manually setting up AWS infrastructure for the Strapi backend.

> **Time Estimate:** 30-45 minutes

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [VPC Configuration](#vpc-configuration)
3. [Security Group](#security-group)
4. [EC2 Instance Connect Endpoint](#ec2-instance-connect-endpoint)
5. [EC2 Instance Launch](#ec2-instance-launch)
6. [EBS Data Volume (Optional)](#ebs-data-volume-optional)
7. [IAM Permissions](#iam-permissions)
8. [Secrets Reference](#secrets-reference)
9. [Post-Setup Verification](#post-setup-verification)

---

## Prerequisites

### AWS Account Requirements

- [ ] Active AWS account with billing enabled
- [ ] IAM user with AdministratorAccess (or specific permissions below)
- [ ] AWS CLI v2 installed and configured locally

### Local Tools

```bash
# Verify AWS CLI is installed (v2 required)
aws --version
# aws-cli/2.x.x ...

# Verify credentials configured
aws sts get-caller-identity
```

### Required IAM Permissions

If not using AdministratorAccess, your IAM user needs these policies:

- `AmazonEC2FullAccess` — For EC2, VPC, Security Groups, EIC
- `AmazonS3FullAccess` — For backup bucket (created later)
- `CloudWatchFullAccess` — For monitoring/alarms (optional)
- `IAMReadOnlyAccess` — For verifying permissions

---

## VPC Configuration

> **Time:** 5 minutes | **Recommendation:** Use default VPC

### Option A: Use Default VPC (Recommended)

The default VPC in each region works well. Verify it exists:

**Console:**
1. Go to **VPC** → **Your VPCs**
2. Look for VPC with "default" = "Yes"
3. Note the VPC ID (e.g., `vpc-0abc123def456789`)

**CLI:**
```bash
# List VPCs and find default
aws ec2 describe-vpcs \
  --filters "Name=is-default,Values=true" \
  --query "Vpcs[0].VpcId" \
  --region us-east-1
```

**Verify:** You should see a VPC ID like `vpc-xxxxxxxxx`

### Option B: Create New VPC (Advanced)

Only if you need network isolation:

```bash
# Create VPC
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=godatify-vpc}]' \
  --region us-east-1

# Create subnet (public)
aws ec2 create-subnet \
  --vpc-id vpc-YOUR_VPC_ID \
  --cidr-block 10.0.1.0/24 \
  --availability-zone us-east-1a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=godatify-public}]'

# Create and attach internet gateway
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=godatify-igw}]'

aws ec2 attach-internet-gateway \
  --vpc-id vpc-YOUR_VPC_ID \
  --internet-gateway-id igw-YOUR_IGW_ID

# Update route table (default route to IGW)
aws ec2 create-route \
  --route-table-id rtb-YOUR_RTB_ID \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id igw-YOUR_IGW_ID
```

---

## Security Group

> **Time:** 5 minutes | **Critical: Empty inbound rules**

This security group has **no inbound rules** because all traffic comes through Cloudflare Tunnel.

### Console

1. Go to **EC2** → **Security Groups** → **Create security group**
2. Fill in:
   - **Name:** `godatify-backend-sg`
   - **Description:** `Security group for Strapi backend - no inbound, HTTPS outbound via tunnel`
   - **VPC:** Select your VPC
3. **Inbound rules:** Leave empty (no rules!)
4. **Outbound rules:** Keep defaults (allow all outbound) or restrict to HTTPS:
   - Type: HTTPS, Port: 443, Destination: 0.0.0.0/0
   - Type: HTTP, Port: 80, Destination: 0.0.0.0/0 (for package managers)
5. Click **Create security group**
6. Note the Security Group ID (e.g., `sg-0abc123def456789`)

### CLI

```bash
# Get your VPC ID (default VPC)
VPC_ID=$(aws ec2 describe-vpcs \
  --filters "Name=is-default,Values=true" \
  --query "Vpcs[0].VpcId" \
  --output text \
  --region us-east-1)

echo "VPC ID: $VPC_ID"

# Create security group
SG_ID=$(aws ec2 create-security-group \
  --group-name godatify-backend-sg \
  --description "Security group for Strapi backend - no inbound, HTTPS outbound via tunnel" \
  --vpc-id $VPC_ID \
  --query "GroupId" \
  --output text \
  --region us-east-1)

echo "Security Group ID: $SG_ID"

# Optionally restrict outbound to HTTPS only (recommended for production)
# First, revoke default outbound rule
aws ec2 revoke-security-group-egress \
  --group-id $SG_ID \
  --protocol all \
  --cidr 0.0.0.0/0 \
  --region us-east-1

# Add HTTPS outbound
aws ec2 authorize-security-group-egress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region us-east-1

# Add HTTP outbound (for package managers)
aws ec2 authorize-security-group-egress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region us-east-1
```

**Verify:** Security group exists with no inbound rules
```bash
aws ec2 describe-security-groups \
  --group-ids $SG_ID \
  --query "SecurityGroups[0].{Inbound:IpPermissions,Outbound:IpPermissionsEgress}" \
  --region us-east-1
```

---

## EC2 Instance Connect Endpoint

> **Time:** 5-10 minutes | **Critical: Required for SSH access**

The EC2 Instance Connect Endpoint (EIC Endpoint) allows SSH access to instances **without public IPs** via IAM authentication.

### Console

1. Go to **VPC** → **Endpoints** → **Create endpoint**
2. Fill in:
   - **Name tag:** `godatify-eic-endpoint`
   - **Service category:** EC2 Instance Connect Endpoint
   - **VPC:** Select your VPC
   - **Security group:** Create a new one or use default (allow outbound TCP 22)
   - **Subnet:** Select any subnet in your VPC
3. Click **Create endpoint**
4. Wait for status to become **Available** (5-10 minutes)

### CLI

```bash
# Get a subnet ID from your VPC
SUBNET_ID=$(aws ec2 describe-subnets \
  --filters "Name=vpc-id,Values=$VPC_ID" \
  --query "Subnets[0].SubnetId" \
  --output text \
  --region us-east-1)

echo "Subnet ID: $SUBNET_ID"

# Create EIC Endpoint
aws ec2 create-instance-connect-endpoint \
  --subnet-id $SUBNET_ID \
  --security-group-ids $SG_ID \
  --tag-specifications 'ResourceType=instance-connect-endpoint,Tags=[{Key=Name,Value=godatify-eic-endpoint}]' \
  --region us-east-1
```

**Verify:** Wait for endpoint to be available
```bash
# Check endpoint status (repeat until "Available")
aws ec2 describe-instance-connect-endpoints \
  --filters "Name=tag:Name,Values=godatify-eic-endpoint" \
  --query "InstanceConnectEndpoints[0].State" \
  --output text \
  --region us-east-1
```

---

## EC2 Instance Launch

> **Time:** 10-15 minutes

### Instance Specifications

| Setting | Value | Reason |
|---------|-------|--------|
| Instance type | t4g.small | ARM64 (Graviton3), 2GB RAM, cost-effective |
| AMI | Amazon Linux 2023 (ARM64) | Optimized for EC2, long-term support |
| Architecture | ARM64 | 20% better price/performance |
| Root volume | 10 GB gp3 | Sufficient for OS + app code |
| Public IP | **None** | Cloudflare Tunnel handles ingress |
| Region | us-east-1 | Cheapest for Graviton |

### Console

1. Go to **EC2** → **Instances** → **Launch instances**
2. **Name:** `godatify-backend`
3. **AMI:**
   - Click **Browse more AMIs**
   - Search for `Amazon Linux 2023`
   - Select **Amazon Linux 2023 AMI** with **64-bit (Arm)** architecture
4. **Instance type:** `t4g.small`
5. **Key pair:** Select **Proceed without a key pair** (EIC uses IAM auth)
6. **Network settings:** Click **Edit**
   - **VPC:** Your VPC
   - **Subnet:** Any subnet
   - **Auto-assign public IP:** **Disable**
   - **Security group:** Select existing → `godatify-backend-sg`
7. **Storage:** 
   - Root volume: 10 GB, gp3
8. **Advanced details:**
   - **Metadata version:** V2 only (IMDSv2)
   - **Credit specification:** Unlimited (for t4g instances)
9. Click **Launch instance**
10. Note the Instance ID (e.g., `i-0abc123def456789`)

### CLI

```bash
# Get latest Amazon Linux 2023 ARM64 AMI
AMI_ID=$(aws ec2 describe-images \
  --owners amazon \
  --filters "Name=name,Values=al2023-ami-2023.*-arm64" "Name=state,Values=available" \
  --query "reverse(sort_by(Images, &CreationDate))[0].ImageId" \
  --output text \
  --region us-east-1)

echo "AMI ID: $AMI_ID"

# Launch instance
INSTANCE_ID=$(aws ec2 run-instances \
  --image-id $AMI_ID \
  --instance-type t4g.small \
  --subnet-id $SUBNET_ID \
  --security-group-ids $SG_ID \
  --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":10,"VolumeType":"gp3","Encrypted":true}}]' \
  --metadata-options "HttpTokens=required,HttpPutResponseHopLimit=2" \
  --credit-specification "CpuCredits=unlimited" \
  --no-associate-public-ip-address \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=godatify-backend}]' \
  --query "Instances[0].InstanceId" \
  --output text \
  --region us-east-1)

echo "Instance ID: $INSTANCE_ID"
```

**Verify:** Instance is running
```bash
# Wait for instance to be running
aws ec2 wait instance-running --instance-ids $INSTANCE_ID --region us-east-1

# Verify instance details
aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].{State:State.Name,PrivateIP:PrivateIpAddress,Type:InstanceType}" \
  --region us-east-1
```

---

## EBS Data Volume (Optional)

> **Time:** 5-10 minutes | **Recommended for production**

A separate data volume for PostgreSQL allows independent backups and easier resizing.

### Console

1. Go to **EC2** → **Volumes** → **Create volume**
2. Fill in:
   - **Volume type:** gp3
   - **Size:** 20 GB
   - **IOPS:** 3000 (default)
   - **Throughput:** 125 MB/s (default)
   - **Availability Zone:** Same as your EC2 instance
   - **Encryption:** Enable (use default key)
3. Click **Create volume**
4. Select the new volume → **Actions** → **Attach volume**
5. Select your instance → Device name: `/dev/xvdf`
6. Click **Attach**

### CLI

```bash
# Get instance availability zone
AZ=$(aws ec2 describe-instances \
  --instance-ids $INSTANCE_ID \
  --query "Reservations[0].Instances[0].Placement.AvailabilityZone" \
  --output text \
  --region us-east-1)

echo "Availability Zone: $AZ"

# Create data volume
VOLUME_ID=$(aws ec2 create-volume \
  --volume-type gp3 \
  --size 20 \
  --availability-zone $AZ \
  --encrypted \
  --tag-specifications 'ResourceType=volume,Tags=[{Key=Name,Value=godatify-data}]' \
  --query "VolumeId" \
  --output text \
  --region us-east-1)

echo "Volume ID: $VOLUME_ID"

# Wait for volume to be available
aws ec2 wait volume-available --volume-ids $VOLUME_ID --region us-east-1

# Attach to instance
aws ec2 attach-volume \
  --volume-id $VOLUME_ID \
  --instance-id $INSTANCE_ID \
  --device /dev/xvdf \
  --region us-east-1
```

**Post-attach:** Format and mount the volume (done during server setup):
```bash
# On the EC2 instance (after SSH)
# NOTE: AL2023 uses /var/lib/pgsql, NOT /var/lib/postgresql (Debian/Ubuntu path)
sudo mkfs.xfs /dev/xvdf
sudo mkdir -p /var/lib/pgsql
sudo mount /dev/xvdf /var/lib/pgsql

# Add to fstab for persistence
echo "UUID=$(sudo blkid -s UUID -o value /dev/xvdf) /var/lib/pgsql xfs defaults,noatime,nodiratime 0 2" | sudo tee -a /etc/fstab
```

---

## IAM Permissions

### For Day-to-Day Operations

Create an IAM policy for operators who need to SSH and manage the instance:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EC2InstanceConnect",
      "Effect": "Allow",
      "Action": [
        "ec2-instance-connect:OpenTunnel",
        "ec2-instance-connect:SendSSHPublicKey"
      ],
      "Resource": "arn:aws:ec2:us-east-1:ACCOUNT_ID:instance/*",
      "Condition": {
        "StringEquals": {
          "ec2:ResourceTag/Name": "godatify-backend"
        }
      }
    },
    {
      "Sid": "DescribeInstances",
      "Effect": "Allow",
      "Action": [
        "ec2:DescribeInstances",
        "ec2:DescribeInstanceConnectEndpoints"
      ],
      "Resource": "*"
    }
  ]
}
```

**Console:** Create policy at **IAM** → **Policies** → **Create policy** → JSON tab

### Attach to IAM User/Group

```bash
# Create policy (save as godatify-operator-policy.json first)
aws iam create-policy \
  --policy-name godatify-operator \
  --policy-document file://godatify-operator-policy.json

# Attach to user
aws iam attach-user-policy \
  --user-name YOUR_IAM_USERNAME \
  --policy-arn arn:aws:iam::ACCOUNT_ID:policy/godatify-operator
```

---

## Secrets Reference

### Secrets Overview

The Strapi backend requires several secrets stored in `/etc/strapi/env`.

| Category | Secret | Generated By | Notes |
|----------|--------|--------------|-------|
| Database | `DATABASE_HOST` | setup-ec2.sh | Unix socket path |
| Database | `DATABASE_NAME` | setup-ec2.sh | `strapi` |
| Database | `DATABASE_USERNAME` | setup-ec2.sh | `strapi` |
| Database | `DATABASE_PASSWORD` | setup-ec2.sh | Auto-generated |
| Strapi | `APP_KEYS` | Manual | Comma-separated base64 keys |
| Strapi | `API_TOKEN_SALT` | Manual | Salt for API tokens |
| Strapi | `ADMIN_JWT_SECRET` | Manual | Admin JWT signing key |
| Strapi | `TRANSFER_TOKEN_SALT` | Manual | Salt for transfer tokens |
| Strapi | `JWT_SECRET` | Manual | Content API JWT key |
| AWS | `AWS_ACCESS_KEY_ID` | Manual | For S3 uploads |
| AWS | `AWS_SECRET_ACCESS_KEY` | Manual | For S3 uploads |
| AWS | `AWS_REGION` | Manual | `us-east-1` |
| AWS | `AWS_BUCKET` | Manual | S3 bucket name |

### Generate Strapi Secrets

Run these commands on your local machine or on the EC2 instance:

```bash
# Generate all required secrets
echo "# Strapi Core Secrets"
echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
```

**Output example:**
```
APP_KEYS=abc123def456...,xyz789uvw012...,qrs345mno678...,jkl901ghi234...
API_TOKEN_SALT=mno567pqr890...
ADMIN_JWT_SECRET=stu123vwx456...
TRANSFER_TOKEN_SALT=yza789bcd012...
JWT_SECRET=efg345hij678...
```

### Complete Environment File Template

This is what `/etc/strapi/env` should contain:

```bash
# ==============================================================================
# Strapi Environment Configuration — godatify-landing
# ==============================================================================
# Location: /etc/strapi/env
# Permissions: 640 (root:strapi)
# ==============================================================================

# ------------------------------------------------------------------------------
# Database (auto-generated by setup-ec2.sh)
# ------------------------------------------------------------------------------
DATABASE_HOST=/var/run/postgresql
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=<auto-generated-by-setup-script>

# ------------------------------------------------------------------------------
# Strapi Core (generate manually with: openssl rand -base64 32)
# ------------------------------------------------------------------------------
APP_KEYS=<key1>,<key2>,<key3>,<key4>
API_TOKEN_SALT=<generate-me>
ADMIN_JWT_SECRET=<generate-me>
TRANSFER_TOKEN_SALT=<generate-me>
JWT_SECRET=<generate-me>

# ------------------------------------------------------------------------------
# Application
# ------------------------------------------------------------------------------
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# ------------------------------------------------------------------------------
# AWS S3 (for media uploads - configure after creating bucket)
# ------------------------------------------------------------------------------
# AWS_ACCESS_KEY_ID=<your-access-key>
# AWS_SECRET_ACCESS_KEY=<your-secret-key>
# AWS_REGION=us-east-1
# AWS_BUCKET=godatify-media
```

### Quick Secret Generation Script

Create a helper script to generate all secrets at once:

```bash
#!/bin/bash
# generate-strapi-secrets.sh

echo "# Strapi Secrets - Generated $(date -Iseconds)"
echo "# Copy these to /etc/strapi/env on your server"
echo ""
echo "APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)"
echo "API_TOKEN_SALT=$(openssl rand -base64 32)"
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)"
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)"
echo "JWT_SECRET=$(openssl rand -base64 32)"
```

Run it:
```bash
chmod +x generate-strapi-secrets.sh
./generate-strapi-secrets.sh
```

---

## Post-Setup Verification

### Checklist

Run these checks after completing all AWS setup steps:

```bash
# 1. Verify instance is running
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[0].Instances[0].State.Name" \
  --output text \
  --region us-east-1
# Expected: running

# 2. Verify no public IP
aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[0].Instances[0].PublicIpAddress" \
  --output text \
  --region us-east-1
# Expected: None (empty)

# 3. Verify security group has no inbound rules
aws ec2 describe-security-groups \
  --group-names godatify-backend-sg \
  --query "SecurityGroups[0].IpPermissions" \
  --region us-east-1
# Expected: []

# 4. Verify EIC endpoint is available
aws ec2 describe-instance-connect-endpoints \
  --filters "Name=tag:Name,Values=godatify-eic-endpoint" \
  --query "InstanceConnectEndpoints[0].State" \
  --output text \
  --region us-east-1
# Expected: create-complete

# 5. Test SSH connection via EIC
INSTANCE_ID=$(aws ec2 describe-instances \
  --filters "Name=tag:Name,Values=godatify-backend" \
  --query "Reservations[0].Instances[0].InstanceId" \
  --output text \
  --region us-east-1)

aws ec2-instance-connect ssh \
  --instance-id $INSTANCE_ID \
  --os-user ec2-user \
  --region us-east-1
# Expected: SSH connection succeeds
```

### Expected State After AWS Setup

| Resource | State | Notes |
|----------|-------|-------|
| VPC | Active | Default or custom |
| Security Group | Created | Empty inbound, HTTPS outbound |
| EIC Endpoint | Available | Takes 5-10 min to create |
| EC2 Instance | Running | t4g.small, no public IP |
| Data Volume | Attached | 20GB gp3 at /dev/xvdf |
| SSH Access | Working | Via EIC endpoint |

---

## Next Steps

After completing AWS setup:

1. **[Server Configuration](./QUICKSTART.md#phase-2-server-configuration)** — Run setup-ec2.sh
2. **[Secrets Configuration](./QUICKSTART.md#phase-3-secrets-configuration)** — Generate and configure secrets
3. **[Cloudflare Tunnel](./QUICKSTART.md#phase-4-cloudflare-tunnel)** — Set up tunnel for ingress

See [QUICKSTART.md](./QUICKSTART.md) for the complete deployment journey.

---

## Related Documentation

- [QUICKSTART.md](./QUICKSTART.md) — Linear deployment guide
- [INFRASTRUCTURE.md](./INFRASTRUCTURE.md) — Architecture details
- [RUNBOOK.md](./RUNBOOK.md) — Day-to-day operations
- [../cloudflare-setup.md](../cloudflare-setup.md) — Cloudflare configuration
