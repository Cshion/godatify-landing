# UI/UX Review — Datify Landing

> **Reviewer:** Brett (Designer/UI)  
> **Date:** 2026-04-18  
> **Scope:** Full site review — accessibility, responsiveness, performance, UX  
> **Fixes Applied:** 2026-04-18

---

## Critical Issues (Must Fix)

### 1. ✅ Skip-to-Content Link Missing — FIXED

**What:** No skip-to-main-content link for keyboard/screen reader users.

**Where:** [layout.tsx](frontend/src/app/layout.tsx)

**Why:** WCAG 2.4.1 requires bypass blocks. Users relying on keyboard navigation must tab through the entire header on every page.

**Status:** Fixed — Added skip link with sr-only + focus styles, added `id="main-content"` to page.tsx

---

### 2. ✅ FontAwesome Icons Lack Accessible Labels — FIXED

**What:** Icons using `<i className="fab/fas fa-*">` have no accessible text for screen readers.

**Where:** 
- [Footer.tsx](frontend/src/components/layout/Footer.tsx#L44-L52)
- [Hero.tsx](frontend/src/components/sections/Hero.tsx#L40)
- [Testimonials.tsx](frontend/src/components/sections/Testimonials.tsx#L85)
- Multiple other components

**Why:** Screen readers announce nothing for decorative icons, but these icons convey meaning (social links, navigation arrows).

**Status:** Fixed — Added `aria-hidden="true"` to decorative icons, improved aria-labels with sr-only text

---

### 3. ✅ Mobile Menu Lacks ARIA Attributes — FIXED

**What:** Mobile menu toggle and panel missing proper ARIA states.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L131-L148)

**Why:** Screen readers cannot determine if menu is expanded/collapsed.

**Status:** Fixed — Added `aria-expanded`, `aria-controls`, `id`, and changed div to nav element

---

### 4. ✅ Dropdown Menus Not Keyboard Accessible — FIXED

**What:** Services and Industries dropdowns only work on hover, not keyboard.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L82-L120)

**Why:** Keyboard users cannot access nested navigation.

**Status:** Fixed — Added `:focus-within` CSS rule for keyboard navigation

---

### 5. ✅ Carousel Missing Keyboard Navigation — FIXED

**What:** Carousels (Services, Cases) cannot be navigated via keyboard.

**Where:** [Carousel.tsx](frontend/src/components/ui/Carousel.tsx)

**Why:** Users who can't use a mouse or touchscreen are excluded.

**Status:** Fixed — Added Arrow key handlers, `tabIndex`, `role="region"`, `aria-roledescription`

---

### 6. ✅ Insufficient Color Contrast in Testimonials — FIXED

**What:** The description text `color: #d1d5db` on green overlay background.

**Where:** [Testimonials.module.css](frontend/src/components/sections/Testimonials.module.css#L37-L42)

**Why:** Fails WCAG AA contrast ratio (needs 4.5:1 for normal text).

**Status:** Fixed — Changed to #ffffff with 0.95 opacity

---

### 7. ✅ Focus States Not Visible on Many Elements — FIXED

**What:** Custom buttons/links often override or lack visible focus indicators.

**Where:** 
- [Header.module.css](frontend/src/components/layout/Header.module.css) — `.navLink`, `.contactCta`
- [Services.module.css](frontend/src/components/sections/Services.module.css) — `.btnOutline`
- [Carousel.module.css](frontend/src/components/ui/Carousel.module.css) — `.controlBtn`, `.dot`

**Why:** Keyboard users cannot track their current position.

**Status:** Fixed — Added `:focus-visible` styles with #26a86f outline to all interactive elements

---

### 8. ⏳ FontAwesome Loaded from External CDN — DEFERRED

**What:** Loading full FA CSS from `cdnjs.cloudflare.com`.

**Where:** [layout.tsx](frontend/src/app/layout.tsx#L31-L34)

**Why:** 
- Render-blocking external resource
- Downloads entire icon library (~60KB CSS)
- Privacy concern (third-party tracking)
- No control over availability

**Status:** Deferred — Requires npm install + all icon component rewrites (architecture change)

---

## Improvements (Should Fix)

### 9. ✅ Mobile Navigation Missing Nested Dropdowns — FIXED

**What:** Mobile menu shows flat links but desktop has Services/Industries submenus.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L144-L150)

**Why:** Mobile users cannot access service or industry subpages directly.

**Status:** Fixed — Added accordion-style nested navigation with Services and Industries dropdowns in mobile menu. Includes proper ARIA attributes, expand/collapse state, and submenu headers for sectors.

**Implementation:**
```tsx
{isMobileMenuOpen && (
  <nav className={styles.mobileMenu}>
    {/* Regular links */}
    <Link href="/nosotros">Nosotros</Link>
    
    {/* Collapsible services */}
    <details className={styles.mobileDropdown}>
      <summary>Servicios</summary>
      <div className={styles.mobileSubmenu}>
        {servicesNav.map(s => (
          <Link href={`/servicios/${s.slug}`}>{s.title}</Link>
        ))}
      </div>
    </details>
  </nav>
)}
```

---

### 10. ✅ Multiple Auto-Playing Carousels — FIXED

**What:** Services and Cases carousels both auto-play simultaneously on home page.

**Where:** 
- [Services.tsx](frontend/src/components/sections/Services.tsx#L22-L26)
- [Cases.tsx](frontend/src/components/sections/Cases.tsx#L23-L27)

**Why:** 
- Competing motion can be disorienting
- Battery drain on mobile
- Users with vestibular disorders may be affected

**Status:** Fixed — Carousel component now:
1. Uses IntersectionObserver to only auto-play when visible in viewport (30% threshold)
2. Respects `prefers-reduced-motion` media query (disables auto-play entirely)
3. Added CSS reduced motion support in Carousel.module.css

---

### 11. ✅ ScrollReveal Performance — FIXED

**What:** Uses `getBoundingClientRect()` in scroll handler without throttling.

**Where:** [ScrollReveal.tsx](frontend/src/components/ui/ScrollReveal.tsx#L6-L20)

**Why:** Triggers layout thrashing on every scroll event.

**Status:** Fixed — Replaced scroll event listener with IntersectionObserver:
- 15% threshold for triggering
- Uses rootMargin for early detection
- Unobserves elements after reveal (one-time animation)
- Respects prefers-reduced-motion by skipping animation

```tsx
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
  );
  
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  return () => observer.disconnect();
}, []);
```

---

### 12. ✅ Hero Section Missing `loading="eager"` Hint — FIXED

**What:** Hero background image loaded via CSS, no preload hint.

**Where:** [Hero.tsx](frontend/src/components/sections/Hero.tsx#L14-L19)

**Why:** LCP (Largest Contentful Paint) suffers; browser discovers image late.

**Status:** Fixed — Added preload link in layout.tsx:
```tsx
<link
  rel="preload"
  href="/images/hero-bg.jpg"
  as="image"
  fetchPriority="high"
/>
```

---

### 13. ✅ Stats Animation Runs Multiple Times — FIXED

**What:** Counter animation logic doesn't properly handle component updates.

**Where:** [Nosotros.tsx](frontend/src/components/sections/Nosotros.tsx#L19-L54)

**Why:** If `initialStats` changes (HMR, navigation), counters reset and re-animate.

**Status:** Fixed — Implemented proper animation lifecycle:
1. Added `animationIdRef` to track/invalidate in-flight animations
2. Added `timersRef` to track and clear running intervals
3. Added `clearTimers` callback for cleanup
4. Respects `prefers-reduced-motion` by showing final values immediately
5. Proper cleanup on unmount and re-render

---

### 14. Inconsistent Vertical Spacing

**What:** Section padding varies: `py-20`, `5rem 0`, `var(--space-20)`.

**Where:** 
- Testimonials: `padding: 5rem 0`
- Other sections: `py-20` (5rem)
- Clients: `var(--space-20)` (5rem)

**Why:** While currently equivalent, mixing approaches makes theming harder and can drift.

**Fix:** Standardize on CSS variables in globals.css:
```css
.section {
  padding-block: var(--space-section, 5rem);
}
@media (max-width: 768px) {
  .section {
    padding-block: var(--space-section-mobile, 4rem);
  }
}
```

---

### 15. Contact Form Missing Error States

**What:** Form only shows idle, submitting, success states — no error state UI.

**Where:** [ContactForm.tsx](frontend/src/components/contact/ContactForm.tsx#L13-L23)

**Why:** If submission fails, users see nothing or button stays in "submitting" state.

**Fix:**
```tsx
{status === 'error' && (
  <div role="alert" className={styles.errorMessage}>
    Hubo un error. Por favor intenta de nuevo.
  </div>
)}
```
```css
.error {
  background-color: #ef4444;
}
```

---

### 16. Carousel Dots Not Descriptive

**What:** Dot buttons only have "Go to slide group X" labels.

**Where:** [Carousel.tsx](frontend/src/components/ui/Carousel.tsx#L175)

**Why:** Screen reader users don't know what content is on each slide.

**Fix:** When possible, add service/case names:
```tsx
aria-label={`Ir al grupo ${idx + 1}: ${getSlideNames(idx)}`}
```

---

## Recommendations (Nice to Have)

### 17. ✅ Add Dark Mode Support — PREP IMPLEMENTED

**What:** Site only has light theme; no dark mode toggle or system preference detection.

**Why:** User preference, eye strain reduction, modern expectation.

**Status:** Implemented CSS variables prep in globals.css. Added `prefers-color-scheme: dark` media query with:
- Background colors (primary, secondary, tertiary)
- Text colors (primary, secondary, muted)
- Adjusted brand green for dark backgrounds
- Border and surface colors

**Note:** Full dark mode requires component updates to use these variables. This provides the foundation.

---

### 18. Loading States for Page Transitions

**What:** No visual feedback during Next.js route transitions.

**Why:** Users may think link click didn't register.

**Approach:** Add NProgress or custom loading bar:
```tsx
// In layout.tsx or a LoadingProvider
import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';

useEffect(() => {
  NProgress.configure({ showSpinner: false });
  // ... start/done on route change
}, []);
```

---

### 19. ✅ Micro-Interactions Enhancement — PARTIALLY IMPLEMENTED

**What:** Current interactions are functional but basic.

**Status:** Added utility classes in globals.css:
- `.btn-primary:active, .btn-secondary:active` — Subtle scale on press (0.98)
- `.card-interactive` — Lift + shadow on hover with transform
- `.link-animated` — Underline grow animation from left

**Usage:** Add classes to components for enhanced interactions. Full implementation requires adding classes to existing components.

---

### 20. Image Optimization Improvements

**What:** Images lack blur placeholders and some have unoptimized sizes.

**Where:** Various Image components

**Recommendations:**
```tsx
<Image
  src={post.image}
  alt={post.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={post.blurDataUrl || generatePlaceholder()} // Add to API
/>
```

---

### 21. Design Token Documentation

**What:** CSS variables defined but not documented for team use.

**Recommendation:** Create a style guide page at `/styleguide` or document in README:
```markdown
## Design Tokens

### Colors
- `--color-brand-green`: #1C7C54 (Primary)
- `--color-brand-green-light`: #26a86f (Hover states)
- `--color-brand-green-dark`: #135c51 (Accents)

### Spacing Scale
- `--space-4`: 1rem (16px) — Default component padding
- `--space-20`: 5rem (80px) — Section vertical padding
```

---

### 22. Reduce Reliance on Absolute Positioning

**What:** Header logo uses layered absolute Images for white/green swap.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L51-L73)

**Why:** Complexity, potential layout shifts, harder to animate.

**Alternative:** Use CSS filter or mask for logo color change:
```css
.logo img {
  filter: brightness(0) invert(1); /* White */
  transition: filter 0.3s;
}
.header.scrolled .logo img {
  filter: brightness(1) saturate(1); /* Original green */
}
```

---

## Summary

| Category | Total | Fixed | Remaining | Priority |
|----------|-------|-------|-----------|----------|
| Critical | 8 | 7 | 1 (deferred) | 🔴 Must fix before launch |
| Improvements | 8 | 5 | 3 | 🟡 Should fix soon |
| Recommendations | 6 | 2 | 4 | 🟢 Nice to have |

### Fixed Items (2026-04-19)

**Critical (7/8):**
1. ✅ Skip-to-content link
2. ✅ FontAwesome ARIA labels  
3. ✅ Mobile menu ARIA attributes
4. ✅ Dropdown keyboard accessibility
5. ✅ Carousel keyboard navigation
6. ✅ Testimonials color contrast
7. ✅ Focus states

**Improvements (5/8):**
9. ✅ Mobile navigation nested dropdowns
10. ✅ Auto-playing carousel fixes (reduced motion + viewport visibility)
11. ✅ ScrollReveal performance (IntersectionObserver)
12. ✅ Hero image preload
13. ✅ Stats animation fix

**Recommendations (2/6):**
17. ✅ Dark mode CSS variables prep
19. ✅ Micro-interactions utility classes

### Remaining Work

**Deferred:**
- FontAwesome migration (requires npm install + component rewrites)

**Improvements:**
- #14: Vertical spacing standardization
- #15: Contact form error states
- #16: Carousel dots descriptions

**Recommendations:**
- #18: Loading states for page transitions
- #20: Image optimization improvements
- #21: Design token documentation
- #22: Logo positioning refactor

---

*Reviewed by Brett — Designer/UI*
*Last updated: 2026-04-19*
