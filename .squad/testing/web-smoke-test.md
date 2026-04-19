# Web Smoke Test Checklist

> Pre-deployment verification for godatify-landing

Use this checklist before deploying changes to verify the site works correctly.

---

## 🏠 Homepage

- [ ] Homepage loads without errors
- [ ] Hero section displays correctly
- [ ] All sections render (services, testimonials, etc.)
- [ ] CTAs and buttons are clickable

## 🎨 Icons & Assets

- [ ] FontAwesome icons render (check hero, services, footer)
- [ ] Images load correctly
- [ ] No broken image placeholders

## 🧭 Navigation

- [ ] Header navigation links work
- [ ] Logo links to homepage
- [ ] Mobile hamburger menu works (responsive)
- [ ] Footer navigation links work

## 📄 All Pages Load

- [ ] `/` — Homepage
- [ ] `/blog` — Blog listing
- [ ] `/servicios` — Services
- [ ] `/casos` — Case studies
- [ ] `/contacto` — Contact page
- [ ] `/nosotros` — About us
- [ ] `/industrias` — Industries

## 📝 Forms

- [ ] Contact form renders
- [ ] Form validation works (required fields)
- [ ] Form submission sends correctly (or shows success message)

## 📱 Mobile Responsiveness

- [ ] Test on mobile viewport (375px width)
- [ ] Navigation collapses to hamburger
- [ ] Content readable without horizontal scroll
- [ ] Touch targets are appropriately sized

## 🖥️ Console & Errors

- [ ] No JavaScript errors in browser console
- [ ] No unhandled promise rejections
- [ ] No 404 errors in Network tab
- [ ] No hydration mismatches

---

## ⚠️ Known Patterns: FontAwesome + Next.js App Router

**Issue:** FontAwesome icons fail to render or flash unstyled in Next.js App Router.

**Correct Pattern:**
1. Create a client-side initialization file (e.g., `lib/fontawesome.ts`)
2. Add `'use client';` directive at the top
3. Import CSS: `import '@fortawesome/fontawesome-svg-core/styles.css';`
4. Set `config.autoAddCss = false;`
5. Add icons to the library
6. Import this file in your Icon component BEFORE using `FontAwesomeIcon`

**Reference:** [frontend/src/lib/fontawesome.ts](../../frontend/src/lib/fontawesome.ts)

---

## 📋 Quick Commands

```bash
# Run frontend locally
cd frontend && npm run dev

# Build for production (catches build errors)
cd frontend && npm run build

# Check for TypeScript errors
cd frontend && npx tsc --noEmit
```

---

*Last updated: 2026-04-19 by Lambert*
