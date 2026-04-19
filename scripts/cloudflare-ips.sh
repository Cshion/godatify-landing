#!/bin/bash
# ==============================================================================
# Cloudflare IP Management Script
# ==============================================================================
# Fetches latest Cloudflare IP ranges and updates firewall rules.
# This script can update UFW, iptables, or just output the IPs.
#
# Usage:
#   ./cloudflare-ips.sh [command]
#
# Commands:
#   list          List current Cloudflare IP ranges (default)
#   ufw           Update UFW firewall rules
#   iptables      Update iptables rules
#   nginx         Update Nginx real_ip configuration
#   all           Update all (nginx + ufw)
#   check         Check if local rules are up to date
#
# Environment Variables:
#   DRY_RUN=1     Show what would be done without making changes
#
# Cron Example (weekly update):
#   0 4 * * 0 /path/to/cloudflare-ips.sh all >> /var/log/cloudflare-update.log 2>&1
# ==============================================================================

set -e

# Configuration
CF_IPV4_URL="https://www.cloudflare.com/ips-v4"
CF_IPV6_URL="https://www.cloudflare.com/ips-v6"
NGINX_CF_FILE="/etc/nginx/cloudflare-ips.conf"
DRY_RUN="${DRY_RUN:-0}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1" >&2; }
log_step() { echo -e "${BLUE}[STEP]${NC} $1"; }

# ==============================================================================
# Fetch Cloudflare IPs
# ==============================================================================
fetch_cf_ips() {
    log_step "Fetching Cloudflare IP ranges..."
    
    CF_IPV4=$(curl -sf "$CF_IPV4_URL")
    CF_IPV6=$(curl -sf "$CF_IPV6_URL")
    
    if [ -z "$CF_IPV4" ]; then
        log_error "Failed to fetch Cloudflare IPv4 ranges"
        exit 1
    fi
    
    log_info "Fetched $(echo "$CF_IPV4" | wc -l | tr -d ' ') IPv4 ranges"
    log_info "Fetched $(echo "$CF_IPV6" | wc -l | tr -d ' ') IPv6 ranges"
}

# ==============================================================================
# List Command
# ==============================================================================
cmd_list() {
    fetch_cf_ips
    
    echo ""
    echo "Cloudflare IPv4 Ranges:"
    echo "========================"
    echo "$CF_IPV4"
    echo ""
    echo "Cloudflare IPv6 Ranges:"
    echo "========================"
    echo "$CF_IPV6"
}

# ==============================================================================
# UFW Update Command
# ==============================================================================
cmd_ufw() {
    if ! command -v ufw &> /dev/null; then
        log_error "UFW is not installed"
        exit 1
    fi
    
    fetch_cf_ips
    
    log_step "Updating UFW firewall rules..."
    
    if [ "$DRY_RUN" = "1" ]; then
        log_warn "DRY RUN - No changes will be made"
    fi
    
    # Get current Cloudflare rules count
    CURRENT_RULES=$(sudo ufw status | grep -c "Cloudflare" || echo "0")
    log_info "Current Cloudflare rules: $CURRENT_RULES"
    
    # Remove existing Cloudflare rules by comment
    log_info "Removing old Cloudflare rules..."
    if [ "$DRY_RUN" != "1" ]; then
        # Get rule numbers for Cloudflare rules (in reverse order to avoid index shift)
        RULE_NUMBERS=$(sudo ufw status numbered | grep "Cloudflare" | awk -F'[][]' '{print $2}' | sort -rn)
        for num in $RULE_NUMBERS; do
            sudo ufw --force delete $num 2>/dev/null || true
        done
    fi
    
    # Add IPv4 rules
    log_info "Adding Cloudflare IPv4 rules..."
    for ip in $CF_IPV4; do
        if [ "$DRY_RUN" = "1" ]; then
            echo "  Would add: ufw allow from $ip to any port 80,443 proto tcp"
        else
            sudo ufw allow from "$ip" to any port 80 proto tcp comment "Cloudflare IPv4" 2>/dev/null || true
            sudo ufw allow from "$ip" to any port 443 proto tcp comment "Cloudflare IPv4" 2>/dev/null || true
        fi
    done
    
    # Add IPv6 rules
    log_info "Adding Cloudflare IPv6 rules..."
    for ip in $CF_IPV6; do
        if [ "$DRY_RUN" = "1" ]; then
            echo "  Would add: ufw allow from $ip to any port 80,443 proto tcp"
        else
            sudo ufw allow from "$ip" to any port 80 proto tcp comment "Cloudflare IPv6" 2>/dev/null || true
            sudo ufw allow from "$ip" to any port 443 proto tcp comment "Cloudflare IPv6" 2>/dev/null || true
        fi
    done
    
    # Show status
    NEW_RULES=$(sudo ufw status | grep -c "Cloudflare" || echo "0")
    log_info "Updated! New Cloudflare rule count: $NEW_RULES"
    
    if [ "$DRY_RUN" != "1" ]; then
        echo ""
        log_info "UFW Status (first 20 rules):"
        sudo ufw status | head -25
    fi
}

# ==============================================================================
# iptables Update Command
# ==============================================================================
cmd_iptables() {
    if ! command -v iptables &> /dev/null; then
        log_error "iptables is not installed"
        exit 1
    fi
    
    fetch_cf_ips
    
    log_step "Updating iptables firewall rules..."
    
    if [ "$DRY_RUN" = "1" ]; then
        log_warn "DRY RUN - No changes will be made"
    fi
    
    # Create Cloudflare chain if it doesn't exist
    if [ "$DRY_RUN" != "1" ]; then
        sudo iptables -N CLOUDFLARE 2>/dev/null || true
        sudo ip6tables -N CLOUDFLARE 2>/dev/null || true
        
        # Flush existing rules in chain
        sudo iptables -F CLOUDFLARE 2>/dev/null || true
        sudo ip6tables -F CLOUDFLARE 2>/dev/null || true
    fi
    
    # Add IPv4 rules
    log_info "Adding Cloudflare IPv4 rules..."
    for ip in $CF_IPV4; do
        if [ "$DRY_RUN" = "1" ]; then
            echo "  Would add: iptables -A CLOUDFLARE -s $ip -p tcp -m multiport --dports 80,443 -j ACCEPT"
        else
            sudo iptables -A CLOUDFLARE -s "$ip" -p tcp -m multiport --dports 80,443 -j ACCEPT
        fi
    done
    
    # Add IPv6 rules
    log_info "Adding Cloudflare IPv6 rules..."
    for ip in $CF_IPV6; do
        if [ "$DRY_RUN" = "1" ]; then
            echo "  Would add: ip6tables -A CLOUDFLARE -s $ip -p tcp -m multiport --dports 80,443 -j ACCEPT"
        else
            sudo ip6tables -A CLOUDFLARE -s "$ip" -p tcp -m multiport --dports 80,443 -j ACCEPT
        fi
    done
    
    # Ensure chain is referenced from INPUT
    if [ "$DRY_RUN" != "1" ]; then
        sudo iptables -C INPUT -j CLOUDFLARE 2>/dev/null || sudo iptables -I INPUT -j CLOUDFLARE
        sudo ip6tables -C INPUT -j CLOUDFLARE 2>/dev/null || sudo ip6tables -I INPUT -j CLOUDFLARE
    fi
    
    log_info "iptables rules updated!"
    
    if [ "$DRY_RUN" != "1" ]; then
        echo ""
        log_info "Saving iptables rules..."
        if command -v netfilter-persistent &> /dev/null; then
            sudo netfilter-persistent save
        elif command -v iptables-save &> /dev/null; then
            sudo iptables-save > /etc/iptables/rules.v4 2>/dev/null || true
            sudo ip6tables-save > /etc/iptables/rules.v6 2>/dev/null || true
        fi
    fi
}

# ==============================================================================
# Nginx Update Command
# ==============================================================================
cmd_nginx() {
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx is not installed"
        exit 1
    fi
    
    fetch_cf_ips
    
    log_step "Updating Nginx Cloudflare IPs configuration..."
    
    if [ "$DRY_RUN" = "1" ]; then
        log_warn "DRY RUN - No changes will be made"
        echo ""
        echo "Would write to $NGINX_CF_FILE:"
        echo "================================"
    fi
    
    # Generate config content
    CONFIG_CONTENT="# Cloudflare IP ranges - Auto-updated by cloudflare-ips.sh
# Last updated: $(date '+%Y-%m-%d %H:%M:%S')
# Source: $CF_IPV4_URL and $CF_IPV6_URL

# IPv4 ranges
"
    for ip in $CF_IPV4; do
        CONFIG_CONTENT+="set_real_ip_from $ip;
"
    done
    
    CONFIG_CONTENT+="
# IPv6 ranges
"
    for ip in $CF_IPV6; do
        CONFIG_CONTENT+="set_real_ip_from $ip;
"
    done
    
    CONFIG_CONTENT+="
# Use CF-Connecting-IP header for real client IP
real_ip_header CF-Connecting-IP;
"
    
    if [ "$DRY_RUN" = "1" ]; then
        echo "$CONFIG_CONTENT"
    else
        # Backup existing file
        if [ -f "$NGINX_CF_FILE" ]; then
            sudo cp "$NGINX_CF_FILE" "${NGINX_CF_FILE}.bak"
        fi
        
        # Write new config
        echo "$CONFIG_CONTENT" | sudo tee "$NGINX_CF_FILE" > /dev/null
        
        # Test and reload nginx
        if sudo nginx -t 2>/dev/null; then
            sudo systemctl reload nginx
            log_info "Nginx configuration updated and reloaded"
        else
            log_error "Nginx config test failed! Restoring backup..."
            sudo mv "${NGINX_CF_FILE}.bak" "$NGINX_CF_FILE"
            exit 1
        fi
    fi
}

# ==============================================================================
# Check Command
# ==============================================================================
cmd_check() {
    fetch_cf_ips
    
    log_step "Checking if local rules are up to date..."
    
    ISSUES=0
    
    # Check Nginx config
    if [ -f "$NGINX_CF_FILE" ]; then
        NGINX_IPS=$(grep "set_real_ip_from" "$NGINX_CF_FILE" | wc -l | tr -d ' ')
        EXPECTED_IPS=$(($(echo "$CF_IPV4" | wc -l) + $(echo "$CF_IPV6" | wc -l)))
        
        if [ "$NGINX_IPS" = "$EXPECTED_IPS" ]; then
            log_info "Nginx: ✅ Up to date ($NGINX_IPS rules)"
        else
            log_warn "Nginx: ⚠️  May need update (has $NGINX_IPS, expected $EXPECTED_IPS)"
            ISSUES=$((ISSUES + 1))
        fi
    else
        log_warn "Nginx: ⚠️  Config file not found at $NGINX_CF_FILE"
        ISSUES=$((ISSUES + 1))
    fi
    
    # Check UFW if available
    if command -v ufw &> /dev/null; then
        UFW_CF_RULES=$(sudo ufw status | grep -c "Cloudflare" || echo "0")
        # Each IP gets 2 rules (port 80 + 443)
        EXPECTED_UFW=$(($(echo "$CF_IPV4" | wc -l) * 2 + $(echo "$CF_IPV6" | wc -l) * 2))
        
        if [ "$UFW_CF_RULES" -ge "$EXPECTED_UFW" ]; then
            log_info "UFW: ✅ Up to date ($UFW_CF_RULES rules)"
        else
            log_warn "UFW: ⚠️  May need update (has $UFW_CF_RULES, expected ~$EXPECTED_UFW)"
            ISSUES=$((ISSUES + 1))
        fi
    fi
    
    echo ""
    if [ "$ISSUES" = "0" ]; then
        log_info "All checks passed! ✅"
    else
        log_warn "$ISSUES issue(s) found. Run './cloudflare-ips.sh all' to update."
    fi
}

# ==============================================================================
# All Command
# ==============================================================================
cmd_all() {
    cmd_nginx
    echo ""
    cmd_ufw
}

# ==============================================================================
# Help
# ==============================================================================
cmd_help() {
    echo ""
    echo "Cloudflare IP Management Script"
    echo "================================"
    echo ""
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  list       List current Cloudflare IP ranges"
    echo "  ufw        Update UFW firewall rules"
    echo "  iptables   Update iptables rules"
    echo "  nginx      Update Nginx real_ip configuration"
    echo "  all        Update nginx + ufw"
    echo "  check      Check if local rules are up to date"
    echo "  help       Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  DRY_RUN=1  Show what would be done without making changes"
    echo ""
    echo "Examples:"
    echo "  $0 list                    # List all Cloudflare IPs"
    echo "  $0 check                   # Check if rules need updating"
    echo "  DRY_RUN=1 $0 ufw           # Preview UFW changes"
    echo "  $0 all                     # Update nginx + ufw"
    echo ""
    echo "Cron Example (weekly update on Sunday at 4am):"
    echo "  0 4 * * 0 /path/to/cloudflare-ips.sh all >> /var/log/cloudflare-update.log 2>&1"
    echo ""
}

# ==============================================================================
# Main
# ==============================================================================
COMMAND="${1:-list}"

case "$COMMAND" in
    list)
        cmd_list
        ;;
    ufw)
        cmd_ufw
        ;;
    iptables)
        cmd_iptables
        ;;
    nginx)
        cmd_nginx
        ;;
    all)
        cmd_all
        ;;
    check)
        cmd_check
        ;;
    help|--help|-h)
        cmd_help
        ;;
    *)
        log_error "Unknown command: $COMMAND"
        cmd_help
        exit 1
        ;;
esac
