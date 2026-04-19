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
