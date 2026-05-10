# Cloudflare Configuration Guide

Complete setup guide for Cloudflare with Vercel (frontend) and EC2 (backend).

---

## Table of Contents

1. [Initial Setup](#initial-setup)
2. [DNS Configuration](#dns-configuration)
3. [SSL/TLS Configuration](#ssltls-configuration)
4. [Caching & Performance](#caching--performance)
5. [Security Settings](#security-settings)
6. [Page Rules](#page-rules)
7. [Cache Rules](#cache-rules)
8. [Workers (Optional)](#workers-optional)
9. [Troubleshooting](#troubleshooting)
10. [Cloudflare Proxy Mode with EC2](#cloudflare-proxy-mode-with-ec2)
11. [Cloudflare Tunnel (Recommended)](#cloudflare-tunnel-recommended-for-ec2)

---

## Initial Setup

### 1. Add Your Domain

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click **Add a Site**
3. Enter your domain: `godatify.com`
4. Select a plan (Free works great for most use cases)
5. Cloudflare will scan existing DNS records

### 2. Update Nameservers

Update your domain registrar's nameservers to Cloudflare's:
```
ns1.cloudflare.com
ns2.cloudflare.com
```

Wait 24-48 hours for propagation (usually faster).

---

## DNS Configuration

### Required DNS Records

Navigate to **DNS** → **Records** and add:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| CNAME | `@` | `cname.vercel-dns.com` | ✅ Proxied | Auto |
| CNAME | `www` | `cname.vercel-dns.com` | ✅ Proxied | Auto |
| A | `api` | `<EC2-ELASTIC-IP>` | ✅ Proxied | Auto |

### Why CNAME for Root Domain?

Cloudflare supports CNAME flattening, which allows you to use a CNAME at the apex (root) domain. This points your main domain to Vercel while getting Cloudflare's benefits.

### Vercel Domain Verification

1. In Vercel Dashboard, add your domain
2. Vercel may provide a TXT record for verification:
   ```
   Type: TXT
   Name: _vercel
   Content: vc-domain-verify=<verification-code>
   ```
3. Add this to Cloudflare DNS (DNS-only, not proxied)

---

## SSL/TLS Configuration

### SSL Mode: Full (Strict)

Navigate to **SSL/TLS** → **Overview**:

1. Set encryption mode to **Full (strict)**
2. This requires valid certificates on both:
   - Vercel (automatic)
   - EC2 (via Let's Encrypt/Certbot)

### Why Full (Strict)?

| Mode | Browser→Cloudflare | Cloudflare→Origin | Security |
|------|-------------------|-------------------|----------|
| Flexible | HTTPS | HTTP | ⚠️ Half-encrypted |
| Full | HTTPS | HTTPS (any cert) | ⚠️ Allows self-signed |
| Full (Strict) | HTTPS | HTTPS (valid cert) | ✅ End-to-end |

### Edge Certificates

Navigate to **SSL/TLS** → **Edge Certificates**:

- [ ] **Always Use HTTPS**: ✅ Enable
- [ ] **Minimum TLS Version**: TLS 1.2
- [ ] **Opportunistic Encryption**: ✅ Enable
- [ ] **TLS 1.3**: ✅ Enable
- [ ] **Automatic HTTPS Rewrites**: ✅ Enable

### HSTS (HTTP Strict Transport Security)

Enable HSTS in **SSL/TLS** → **Edge Certificates** → **HTTP Strict Transport Security (HSTS)**:

```
Status: On
Max Age: 6 months (recommended) or 1 year
Include subdomains: Yes
Preload: Yes (after testing)
No-Sniff Header: Yes
```

⚠️ **Warning:** Only enable preload after confirming HTTPS works perfectly. It's hard to undo.

---

## Caching & Performance

### Cache Levels

Navigate to **Caching** → **Configuration**:

| Setting | Value |
|---------|-------|
| Caching Level | Standard |
| Browser Cache TTL | Respect Existing Headers |
| Always Online | On |

### Tiered Cache

Enable **Tiered Cache** for better cache hit rates:
1. **Caching** → **Tiered Cache**
2. Enable **Smart Tiered Cache Topology**

### Development Mode

When testing changes, enable **Development Mode**:
- Temporarily bypasses cache (3 hours)
- Useful during deployments
- **Caching** → **Configuration** → **Development Mode**

---

## Security Settings

Navigate to **Security** → **Settings**:

### Recommended Settings

| Setting | Value | Notes |
|---------|-------|-------|
| Security Level | Medium | Low for trusted traffic |
| Challenge Passage | 30 minutes | How long challenges remain valid |
| Browser Integrity Check | On | Blocks bad bots |
| Privacy Pass Support | On | Reduces CAPTCHAs for legit users |

### Bot Fight Mode

**Security** → **Bots** → **Bot Fight Mode**: ✅ Enable

This blocks known malicious bots automatically.

### WAF (Web Application Firewall)

On paid plans, enable WAF rules:
1. **Security** → **WAF** → **Managed Rules**
2. Enable **Cloudflare Managed Ruleset**
3. Enable **OWASP Core Ruleset** (if available)

### Firewall Rules (Free Plan)

Create custom rules in **Security** → **WAF** → **Custom Rules**:

**Block Bad Bots:**
```
(cf.client.bot) and not (cf.bot_management.verified_bot)
```
Action: Block

**Rate Limit API:**
```
(http.request.uri.path contains "/api/" and http.request.method eq "POST")
```
Action: Rate limit (100 requests per minute)

---

## Page Rules

Navigate to **Rules** → **Page Rules**.

Free plan includes 3 page rules. Use them wisely:

### Rule 1: Force HTTPS

```
URL: *godatify.com/*
Setting: Always Use HTTPS
```

### Rule 2: Cache API Responses

```
URL: api.godatify.com/api/*
Settings:
  - Cache Level: Cache Everything
  - Edge Cache TTL: 4 hours
  - Browser Cache TTL: 1 hour
```

### Rule 3: Bypass Cache for Admin

```
URL: api.godatify.com/admin/*
Settings:
  - Cache Level: Bypass
  - Security Level: High
```

---

## Cache Rules

Modern replacement for Page Rules. Navigate to **Caching** → **Cache Rules**.

### Rule 1: Cache Next.js Static Assets

```yaml
Name: Cache Next.js Static
When: (starts_with(http.request.uri.path, "/_next/static/"))
Then:
  - Eligible for cache: Yes
  - Edge TTL: Override - 1 year
  - Browser TTL: Override - 1 year
```

### Rule 2: Cache Public Images

```yaml
Name: Cache Public Images
When: (starts_with(http.request.uri.path, "/images/"))
Then:
  - Eligible for cache: Yes
  - Edge TTL: Override - 1 week
  - Browser TTL: Override - 1 day
```

### Rule 3: Cache API GET Requests

```yaml
Name: Cache API GETs
When: (http.host eq "api.godatify.com" and http.request.method eq "GET" and starts_with(http.request.uri.path, "/api/"))
Then:
  - Eligible for cache: Yes
  - Edge TTL: Override - 4 hours
  - Browser TTL: Override - 1 hour
  - Cache Key: Include query string
```

### Rule 4: Never Cache Admin

```yaml
Name: Bypass Admin Cache
When: (http.host eq "api.godatify.com" and starts_with(http.request.uri.path, "/admin"))
Then:
  - Eligible for cache: Bypass
```

---

## Workers (Optional)

Cloudflare Workers can add edge functionality. Here are useful examples:

### Example 1: Add Security Headers

```javascript
// workers/security-headers.js
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const response = await fetch(request)
  const newHeaders = new Headers(response.headers)
  
  // Security headers
  newHeaders.set('X-Content-Type-Options', 'nosniff')
  newHeaders.set('X-Frame-Options', 'DENY')
  newHeaders.set('X-XSS-Protection', '1; mode=block')
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  newHeaders.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders
  })
}
```

### Example 2: Geographic Redirects

```javascript
// Redirect non-Spanish visitors to English version
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const country = request.cf?.country
  const url = new URL(request.url)
  
  // Spanish-speaking countries
  const spanishCountries = ['MX', 'ES', 'AR', 'CO', 'PE', 'CL']
  
  if (!spanishCountries.includes(country) && url.pathname === '/') {
    return Response.redirect(url.origin + '/en', 302)
  }
  
  return fetch(request)
}
```

### Example 3: API Response Caching with Custom Keys

```javascript
// Cache API responses with custom cache keys
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)
  
  // Only cache GET requests to /api/
  if (request.method !== 'GET' || !url.pathname.startsWith('/api/')) {
    return fetch(request)
  }
  
  const cacheKey = new Request(url.toString(), request)
  const cache = caches.default
  
  // Check cache
  let response = await cache.match(cacheKey)
  if (response) {
    return response
  }
  
  // Fetch from origin
  response = await fetch(request)
  
  // Clone and cache successful responses
  if (response.ok) {
    const responseToCache = response.clone()
    responseToCache.headers.set('Cache-Control', 'public, max-age=14400') // 4 hours
    event.waitUntil(cache.put(cacheKey, responseToCache))
  }
  
  return response
}
```

### Deploying Workers

1. **Workers & Pages** → **Create Application** → **Create Worker**
2. Paste your code
3. **Settings** → **Triggers** → Add routes:
   - `godatify.com/*`
   - `api.godatify.com/*`

---

## Troubleshooting

### Common Issues

#### 522 Error (Connection Timed Out)

**Cause:** Cloudflare cannot reach your origin server.

**Solutions:**
1. Check EC2 is running: `pm2 status`
2. Check security groups allow Cloudflare IPs
3. Verify Nginx is running: `sudo systemctl status nginx`
4. Test direct connection: `curl -I http://<EC2-IP>:80`

#### 521 Error (Web Server Down)

**Cause:** Origin server refused connection.

**Solutions:**
1. Restart Nginx: `sudo systemctl restart nginx`
2. Check Nginx config: `sudo nginx -t`
3. Review logs: `sudo tail -f /var/log/nginx/error.log`

#### SSL Errors

**Cause:** Certificate mismatch or misconfiguration.

**Solutions:**
1. Ensure SSL mode is **Full (strict)**
2. Verify EC2 has valid Let's Encrypt cert
3. Check cert expiration: `sudo certbot certificates`
4. Renew if needed: `sudo certbot renew`

#### Cache Not Working

**Solutions:**
1. Check cache headers: `curl -I https://godatify.com`
2. Look for `cf-cache-status` header:
   - `HIT` = Served from cache
   - `MISS` = Fetched from origin
   - `BYPASS` = Cache bypassed
   - `DYNAMIC` = Not cacheable
3. Purge cache and test: **Caching** → **Purge Everything**

### Cloudflare IP Ranges

If using firewall rules, allow Cloudflare IPs:

```bash
# Add to EC2 security group or UFW
# IPv4
curl https://www.cloudflare.com/ips-v4

# IPv6  
curl https://www.cloudflare.com/ips-v6
```

### Useful Diagnostic Commands

```bash
# Check if Cloudflare is proxying
dig godatify.com +short
# Should return Cloudflare IPs, not your server IP

# Check SSL certificate
openssl s_client -connect godatify.com:443 -servername godatify.com

# Test API through Cloudflare
curl -I https://api.godatify.com/_health

# Check cache status
curl -sI https://godatify.com | grep -i cf-cache-status
```

### Purging Cache

**Via Dashboard:**
1. **Caching** → **Configuration** → **Purge Cache**
2. Options:
   - Purge Everything (full purge)
   - Purge by URL (specific pages)
   - Purge by Prefix (e.g., `/blog/*`)
   - Purge by Tag (requires Enterprise)

**Via API:**
```bash
# Purge everything
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"purge_everything":true}'

# Purge specific URLs
curl -X POST "https://api.cloudflare.com/client/v4/zones/<ZONE_ID>/purge_cache" \
  -H "Authorization: Bearer <API_TOKEN>" \
  -H "Content-Type: application/json" \
  --data '{"files":["https://godatify.com/","https://api.godatify.com/api/home"]}'
```

---

## Quick Reference

### DNS Records Summary

| Record | Name | Value | Proxy |
|--------|------|-------|-------|
| CNAME | @ | cname.vercel-dns.com | ✅ |
| CNAME | www | cname.vercel-dns.com | ✅ |
| A | api | EC2-ELASTIC-IP | ✅ |

### Security Checklist

- [ ] SSL/TLS mode: Full (strict)
- [ ] Always Use HTTPS: On
- [ ] Minimum TLS: 1.2
- [ ] HSTS: Enabled
- [ ] Bot Fight Mode: On
- [ ] Security Level: Medium+ 

### Performance Checklist

- [ ] Tiered Cache: Enabled
- [ ] Cache rules configured
- [ ] Static assets: Long cache TTL
- [ ] API responses: Moderate cache TTL
- [ ] Admin panel: Cache bypassed

---

## Cloudflare Proxy Mode with EC2

This section covers how to use Cloudflare's **proxied (orange cloud)** mode with your EC2 backend to get full DDoS protection, WAF, caching, and SSL termination—without using DNS-only mode.

### Why Proxy Mode?

Using Cloudflare with proxy **enabled** (orange cloud ☁️) provides:

| Feature | Benefit |
|---------|---------|
| **DDoS Protection** | Automatic mitigation of L3/L4/L7 attacks |
| **Web Application Firewall (WAF)** | Block SQL injection, XSS, and other attacks |
| **Edge Caching** | Serve content from 200+ PoPs worldwide |
| **Hide Real Server IP** | Attackers can't target your EC2 directly |
| **SSL Termination** | Cloudflare handles TLS handshakes at the edge |
| **Bot Management** | Automatic bad bot blocking |
| **Analytics** | Traffic insights, threat reports |

### Why Cloudflare Sometimes Suggests DNS-Only

Cloudflare's default onboarding may recommend DNS-only (gray cloud) because:
1. Some apps break when client IP appears as Cloudflare IP
2. WebSocket and non-HTTP traffic may need special handling
3. Certificate complexities with origin servers

**But these are all solvable!** Here's how to configure everything properly.

---

### 1. SSL Configuration

Use **Full (Strict)** SSL mode for end-to-end encryption.

#### Option A: Cloudflare Origin Certificate (Recommended)

Cloudflare issues free 15-year certificates trusted **only by Cloudflare**. Since all traffic goes through Cloudflare, this is ideal.

**Generate the certificate:**

1. Go to **SSL/TLS** → **Origin Server** → **Create Certificate**
2. Keep defaults: RSA 2048, 15 years
3. Download both files:
   - `origin.pem` (certificate)
   - `origin-key.pem` (private key)

**Install on EC2:**

```bash
# Create directory
sudo mkdir -p /etc/ssl/cloudflare

# Copy certificates
sudo nano /etc/ssl/cloudflare/origin.pem
# Paste certificate content

sudo nano /etc/ssl/cloudflare/origin-key.pem
# Paste private key content

# Secure permissions
sudo chmod 600 /etc/ssl/cloudflare/origin-key.pem
sudo chmod 644 /etc/ssl/cloudflare/origin.pem
```

#### Option B: Let's Encrypt Certificate

If you want certificates that also work for direct access (testing):

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Get certificate (requires DNS-only temporarily, or use DNS challenge)
sudo certbot certonly --nginx -d api.godatify.com

# Auto-renewal is set up automatically
# Certificates at: /etc/letsencrypt/live/api.godatify.com/
```

**Note:** For Let's Encrypt with proxy enabled, use DNS validation:
```bash
sudo certbot certonly --manual --preferred-challenges dns -d api.godatify.com
```

---

### 2. Nginx Configuration for Cloudflare Proxy

Configure Nginx to work properly with Cloudflare as a reverse proxy.

#### Full Nginx Configuration

Create/update `/etc/nginx/sites-available/api.godatify.com`:

```nginx
# Cloudflare IP ranges - auto-update these periodically
# https://www.cloudflare.com/ips-v4
# https://www.cloudflare.com/ips-v6

# Trust Cloudflare IPs for real_ip module
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/13;
set_real_ip_from 104.24.0.0/14;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;

# IPv6
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;

# Use CF-Connecting-IP header (more reliable than X-Forwarded-For)
real_ip_header CF-Connecting-IP;

server {
    listen 80;
    server_name api.godatify.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.godatify.com;

    # SSL Certificate (Cloudflare Origin Certificate)
    ssl_certificate /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin-key.pem;

    # Modern SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 1d;

    # Verify Cloudflare is the connecting client (optional extra security)
    # This checks the Cloudflare certificate
    # ssl_client_certificate /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem;
    # ssl_verify_client on;

    # Proxy settings
    location / {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        
        # Forward real visitor IP
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-Host $host;
        
        # Preserve host header
        proxy_set_header Host $host;
        
        # WebSocket support (for Strapi admin)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeouts (important for file uploads)
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # Buffer settings
        proxy_buffering on;
        proxy_buffer_size 4k;
        proxy_buffers 8 16k;
        proxy_busy_buffers_size 24k;
        
        # Max upload size (match Strapi config)
        client_max_body_size 50M;
    }

    # Health check endpoint (bypass rate limits)
    location = /_health {
        proxy_pass http://127.0.0.1:1337/_health;
        proxy_set_header Host $host;
        access_log off;
    }
}
```

**Test and reload:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

#### Script to Auto-Update Cloudflare IPs

Create `/opt/scripts/update-cloudflare-ips.sh`:

```bash
#!/bin/bash
# Update Cloudflare IP ranges for Nginx

CF_IPS_FILE="/etc/nginx/cloudflare-ips.conf"

# Fetch latest IPs
echo "# Auto-generated Cloudflare IPs - $(date)" > $CF_IPS_FILE
echo "" >> $CF_IPS_FILE

echo "# IPv4" >> $CF_IPS_FILE
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    echo "set_real_ip_from $ip;" >> $CF_IPS_FILE
done

echo "" >> $CF_IPS_FILE
echo "# IPv6" >> $CF_IPS_FILE
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do
    echo "set_real_ip_from $ip;" >> $CF_IPS_FILE
done

# Reload nginx
nginx -t && systemctl reload nginx

echo "Cloudflare IPs updated at $(date)"
```

Add cron job:
```bash
sudo chmod +x /opt/scripts/update-cloudflare-ips.sh
sudo crontab -e
# Add: 0 4 * * 0 /opt/scripts/update-cloudflare-ips.sh >> /var/log/cloudflare-update.log 2>&1
```

---

### 3. AWS Security Groups — Lock Down to Cloudflare Only

This is **critical** for security. Restrict HTTP/HTTPS access to only Cloudflare IPs, preventing direct access to your EC2.

#### Security Group Configuration

**Inbound Rules:**

| Type | Protocol | Port | Source | Description |
|------|----------|------|--------|-------------|
| SSH | TCP | 22 | Your IP / Bastion | Admin access |
| HTTPS | TCP | 443 | *Cloudflare IPv4* | See list below |
| HTTPS | TCP | 443 | *Cloudflare IPv6* | See list below |
| HTTP | TCP | 80 | *Cloudflare IPv4* | Redirect to HTTPS |
| HTTP | TCP | 80 | *Cloudflare IPv6* | Redirect to HTTPS |

**Current Cloudflare IPv4 Ranges:**
```
173.245.48.0/20
103.21.244.0/22
103.22.200.0/22
103.31.4.0/22
141.101.64.0/18
108.162.192.0/18
190.93.240.0/20
188.114.96.0/20
197.234.240.0/22
198.41.128.0/17
162.158.0.0/15
104.16.0.0/13
104.24.0.0/14
172.64.0.0/13
131.0.72.0/22
```

**Current Cloudflare IPv6 Ranges:**
```
2400:cb00::/32
2606:4700::/32
2803:f800::/32
2405:b500::/32
2405:8100::/32
2a06:98c0::/29
2c0f:f248::/32
```

#### AWS CLI Script to Update Security Group

Create `update-cf-security-group.sh`:

```bash
#!/bin/bash
# Update EC2 Security Group with latest Cloudflare IPs

SECURITY_GROUP_ID="sg-xxxxxxxxx"  # Your security group ID
REGION="us-east-1"                 # Your region

# Remove existing Cloudflare rules (identified by description)
echo "Removing old Cloudflare rules..."
aws ec2 describe-security-groups \
    --group-ids $SECURITY_GROUP_ID \
    --region $REGION \
    --query 'SecurityGroups[0].IpPermissions[?contains(IpRanges[].Description, `Cloudflare`) || contains(Ipv6Ranges[].Description, `Cloudflare`)]' \
    --output json | jq -c '.[]' | while read rule; do
        aws ec2 revoke-security-group-ingress \
            --group-id $SECURITY_GROUP_ID \
            --region $REGION \
            --ip-permissions "$rule" 2>/dev/null
done

# Add new Cloudflare IPv4 rules
echo "Adding Cloudflare IPv4 rules..."
for ip in $(curl -s https://www.cloudflare.com/ips-v4); do
    aws ec2 authorize-security-group-ingress \
        --group-id $SECURITY_GROUP_ID \
        --region $REGION \
        --protocol tcp \
        --port 443 \
        --cidr $ip \
        --tag-specifications "ResourceType=security-group-rule,Tags=[{Key=Description,Value=Cloudflare-IPv4}]" 2>/dev/null
    
    aws ec2 authorize-security-group-ingress \
        --group-id $SECURITY_GROUP_ID \
        --region $REGION \
        --protocol tcp \
        --port 80 \
        --cidr $ip \
        --tag-specifications "ResourceType=security-group-rule,Tags=[{Key=Description,Value=Cloudflare-IPv4}]" 2>/dev/null
done

# Add new Cloudflare IPv6 rules
echo "Adding Cloudflare IPv6 rules..."
for ip in $(curl -s https://www.cloudflare.com/ips-v6); do
    aws ec2 authorize-security-group-ingress \
        --group-id $SECURITY_GROUP_ID \
        --region $REGION \
        --ip-permissions "IpProtocol=tcp,FromPort=443,ToPort=443,Ipv6Ranges=[{CidrIpv6=$ip,Description=Cloudflare-IPv6}]" 2>/dev/null
    
    aws ec2 authorize-security-group-ingress \
        --group-id $SECURITY_GROUP_ID \
        --region $REGION \
        --ip-permissions "IpProtocol=tcp,FromPort=80,ToPort=80,Ipv6Ranges=[{CidrIpv6=$ip,Description=Cloudflare-IPv6}]" 2>/dev/null
done

echo "Security group updated!"
```

---

### 4. Strapi Configuration for Cloudflare Proxy

Configure Strapi to trust the proxy and work correctly with Cloudflare.

#### Update `backend/config/server.ts`

```typescript
export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', 'https://api.godatify.com'),
  
  proxy: {
    enabled: true,
    // Trust proxy headers from nginx/cloudflare
    global: true,
    // Strapi 5 automatically trusts X-Forwarded-* headers when proxy is enabled
  },

  app: {
    keys: env.array('APP_KEYS'),
  },
});
```

#### Update `backend/config/middlewares.ts`

```typescript
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 's3.amazonaws.com', '*.amazonaws.com'],
          'media-src': ["'self'", 'data:', 'blob:', 's3.amazonaws.com', '*.amazonaws.com'],
          upgradeInsecureRequests: null,
        },
      },
      // Trust Cloudflare's forwarded headers
      frameguard: {
        action: 'sameorigin',
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'https://godatify.com',
        'https://www.godatify.com',
        'https://api.godatify.com',
        // Vercel preview deployments
        /\.vercel\.app$/,
      ],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      credentials: true,
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '50mb',
      jsonLimit: '50mb',
      textLimit: '50mb',
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

#### Rate Limiting Considerations

Cloudflare's rate limiting is applied at the edge, but you may want additional protection:

1. **Cloudflare Rate Limiting Rules** (recommended):
   - **Security** → **WAF** → **Rate limiting rules**
   - Example: 100 requests/minute per IP on `/api/` paths

2. **Strapi-level rate limiting** (optional second layer):
   ```bash
   npm install @strapi/plugin-users-permissions
   # Configure in admin panel → Settings → Users & Permissions → Rate limiting
   ```

---

### 5. DNS Records Configuration

Set up DNS records with proxy enabled.

#### Required Records

| Type | Name | Content | Proxy Status | TTL |
|------|------|---------|--------------|-----|
| A | `api` | `<EC2-ELASTIC-IP>` | ✅ Proxied (Orange) | Auto |

**Verification:**
```bash
# Should return Cloudflare IPs, NOT your EC2 IP
dig api.godatify.com +short

# Example output (Cloudflare IPs):
# 104.21.xxx.xxx
# 172.67.xxx.xxx
```

If you see your EC2 IP, proxy mode is **not** enabled.

---

### 6. Testing the Setup

#### Verify Cloudflare is Active

```bash
# Check for Cloudflare headers
curl -sI https://api.godatify.com | grep -i "cf-\|server:"

# Expected output:
# server: cloudflare
# cf-ray: xxxxxxx-IAD
# cf-cache-status: DYNAMIC
```

#### Test Real IP Forwarding

Create a test endpoint in Strapi or check logs:

```bash
# In nginx access log, you should see real visitor IPs, not Cloudflare IPs
sudo tail -f /var/log/nginx/access.log
```

#### Security Verification

```bash
# Try direct access to EC2 - should timeout if security groups are correct
curl --connect-timeout 5 https://<YOUR-EC2-IP>
# Expected: Connection timed out

# Access via Cloudflare - should work
curl https://api.godatify.com/_health
# Expected: {"status":"ok"}
```

---

### 7. Advanced: Authenticated Origin Pulls

For additional security, configure Cloudflare's Authenticated Origin Pulls. This ensures only Cloudflare can connect to your origin.

**Enable in Cloudflare:**
1. **SSL/TLS** → **Origin Server** → **Authenticated Origin Pulls** → Enable

**Download Cloudflare CA Certificate:**
```bash
sudo curl -o /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem \
  https://developers.cloudflare.com/ssl/static/authenticated_origin_pull_ca.pem
```

**Update Nginx (uncomment these lines):**
```nginx
ssl_client_certificate /etc/ssl/cloudflare/authenticated_origin_pull_ca.pem;
ssl_verify_client on;
```

Now Nginx will reject any connection not from Cloudflare, even if someone discovers your EC2 IP.

---

### Quick Checklist

- [ ] SSL Mode: **Full (Strict)** in Cloudflare
- [ ] Origin Certificate installed on EC2 (or Let's Encrypt)
- [ ] Nginx configured with `real_ip_header CF-Connecting-IP`
- [ ] Security Group allows ONLY Cloudflare IPs on 80/443
- [ ] DNS A record for `api` with proxy **ON** (orange cloud)
- [ ] Strapi `proxy.enabled: true` in server config
- [ ] CORS configured for your domains
- [ ] Direct EC2 access blocked (test with curl to raw IP)
- [ ] (Optional) Authenticated Origin Pulls enabled

---

## Cloudflare Tunnel (Recommended for EC2)

Cloudflare Tunnel is a **simpler and more secure** alternative to the traditional Nginx reverse proxy approach documented above. Instead of opening ports 80/443 on EC2 and configuring Nginx, cloudflared creates an outbound-only connection from your server to Cloudflare's edge.

### Why Use Cloudflare Tunnel?

| Feature | Traditional Proxy | Cloudflare Tunnel |
|---------|------------------|-------------------|
| **Open Ports** | 80, 443 required | None (outbound only) |
| **Security Groups** | Must whitelist Cloudflare IPs | Can block ALL inbound |
| **TLS Certificates** | Manual setup (Let's Encrypt/Origin) | Automatic |
| **Nginx Required** | Yes | No |
| **IP Obfuscation** | Partial (need security groups) | Complete |
| **Setup Complexity** | High | Low |

### Architecture

```
┌──────────────┐      ┌─────────────────┐      ┌─────────────┐
│   Browser    │─────▷│ Cloudflare Edge │◁─────│   EC2       │
│              │      │ (api.godatify)  │ A    │ cloudflared │
└──────────────┘      └─────────────────┘      └─────────────┘
                              │                       │
                              │   HTTPS (TLS 1.3)     │
                              ◁───────────────────────┘
                                 Outbound connection
                                 (no inbound ports)
```

### Setup Overview (Token Method)

Cloudflare now recommends the **token method** for tunnel setup. This is simpler than the legacy credentials file method — just copy a token from the dashboard and run one command.

The setup has two parts:
1. **Automated (done by setup-ec2.sh)**: Package installation via Cloudflare's repo
2. **Manual (requires Cloudflare auth)**: Tunnel creation in dashboard, token install

### Step 1: Run setup-ec2.sh

The EC2 setup script installs cloudflared via Cloudflare's official AL2023 repository:

```bash
# On EC2
sudo ./setup-ec2.sh
```

This installs:
- `cloudflared` package via dnf (auto-updates enabled)
- Creates necessary directories and user (handled by package)
- Ready for token-based configuration

### Step 2: Create Tunnel in Cloudflare Dashboard

1. Go to **[Cloudflare Zero Trust](https://one.dash.cloudflare.com/)**
2. Navigate to **Networks → Tunnels**
3. Click **Create a tunnel**
4. Select **Cloudflared** connector
5. Name: `godatify-api`
6. **Copy the install token** shown on the "Install connector" page

### Step 3: Install the Tunnel on EC2

Run the service install command with your token:

```bash
# On EC2
sudo cloudflared service install <TOKEN>
```

This single command:
- Creates the configuration file
- Sets up the systemd service
- Enables and starts the service

### Step 4: Configure Public Hostnames

Back in the Cloudflare dashboard (same tunnel configuration page):

1. Click **Next** after the connector shows as connected
2. Add a **Public Hostname**:
   - **Subdomain**: `api`
   - **Domain**: `godatify.com`
   - **Service Type**: `HTTP`
   - **URL**: `localhost:1337`
3. Click **Save tunnel**

### Step 5: Verify Connection

```bash
# Check service status
sudo systemctl status cloudflared

# View logs
sudo journalctl -u cloudflared -f

# Test external access
curl -sf https://api.godatify.com/_health
# Expected: {"status":"ok"}

# Check Cloudflare headers
curl -sI https://api.godatify.com | grep -i "cf-\|server:"
# Expected:
# server: cloudflare
# cf-ray: xxxxxxx-IAD
```

### Security Configuration

With Cloudflare Tunnel, you can lock down EC2 security groups completely:

| Type | Port | Source | Status |
|------|------|--------|--------|
| SSH | 22 | Your IP / Bastion | ✅ Keep |
| HTTP | 80 | Any | ❌ Remove |
| HTTPS | 443 | Any | ❌ Remove |

No inbound HTTP/HTTPS ports needed! All traffic goes through the tunnel.

### Troubleshooting

#### Tunnel Won't Connect

```bash
# Check service status
sudo systemctl status cloudflared

# View detailed logs
sudo journalctl -u cloudflared -n 100

# Restart the service
sudo systemctl restart cloudflared
```

#### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| `failed to connect` | Invalid token | Re-copy token from dashboard |
| `tunnel not found` | Token expired | Create new tunnel or get fresh token |
| `502 Bad Gateway` | Strapi not running | `pm2 status`, start if needed |
| `DNS resolution failed` | Public hostname not configured | Add hostname in dashboard |

#### AL2023 Specific Issues

If you encounter issues with the package installation:

```bash
# Check repo is configured
cat /etc/yum.repos.d/cloudflared.repo

# Force reinstall
sudo dnf reinstall -y cloudflared

# Check binary location
which cloudflared
# Should be /usr/bin/cloudflared
```

### Maintenance

#### Restart Tunnel

```bash
sudo systemctl restart cloudflared
```

#### Update cloudflared

The package manager handles updates:

```bash
sudo dnf update cloudflared
sudo systemctl restart cloudflared
cloudflared --version
```

#### Reconfigure Tunnel

If you need to change the tunnel configuration:

```bash
# Remove current service
sudo cloudflared service uninstall

# Install with new token
sudo cloudflared service install <NEW_TOKEN>
```

### Tunnel vs Traditional Proxy: When to Use Which

| Use Case | Recommendation |
|----------|----------------|
| Simple API exposure | ✅ Tunnel |
| Need custom Nginx rules | Traditional Proxy |
| Maximum security (no inbound) | ✅ Tunnel |
| Multiple services/domains | Both work |
| WebSockets/streaming | ✅ Tunnel (native support) |
| Compliance (audit trail) | ✅ Tunnel (all traffic logged in CF) |

For godatify-landing, **Cloudflare Tunnel is recommended** because:
- Simpler setup (one command with token)
- Better security (no exposed ports)
- Automatic TLS management
- Native WebSocket support (Strapi admin)
- Cloudflare handles all edge concerns
