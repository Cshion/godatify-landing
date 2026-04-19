# UI/UX Review — Datify Landing

> **Reviewer:** Brett (Designer/UI)  
> **Date:** 2026-04-18  
> **Scope:** Full site review — accessibility, responsiveness, performance, UX

---

## Critical Issues (Must Fix)

### 1. Skip-to-Content Link Missing

**What:** No skip-to-main-content link for keyboard/screen reader users.

**Where:** [layout.tsx](frontend/src/app/layout.tsx)

**Why:** WCAG 2.4.1 requires bypass blocks. Users relying on keyboard navigation must tab through the entire header on every page.

**Fix:**
```tsx
// In layout.tsx, add before <Header>
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:rounded">
  Ir al contenido principal
</a>

// In page.tsx, add id to main
<main id="main-content">
```

---

### 2. FontAwesome Icons Lack Accessible Labels

**What:** Icons using `<i className="fab/fas fa-*">` have no accessible text for screen readers.

**Where:** 
- [Footer.tsx](frontend/src/components/layout/Footer.tsx#L44-L52)
- [Hero.tsx](frontend/src/components/sections/Hero.tsx#L40)
- [Testimonials.tsx](frontend/src/components/sections/Testimonials.tsx#L85)
- Multiple other components

**Why:** Screen readers announce nothing for decorative icons, but these icons convey meaning (social links, navigation arrows).

**Fix:**
```tsx
// For decorative icons (arrows, etc.)
<i className="fas fa-arrow-right" aria-hidden="true"></i>

// For meaningful icons (social links)
<a href={social.url} aria-label={`Síguenos en ${social.label}`}>
  <i className={`fab fa-${social.icon}`} aria-hidden="true"></i>
  <span className="sr-only">{social.label}</span>
</a>
```

---

### 3. Mobile Menu Lacks ARIA Attributes

**What:** Mobile menu toggle and panel missing proper ARIA states.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L131-L148)

**Why:** Screen readers cannot determine if menu is expanded/collapsed.

**Fix:**
```tsx
<button
  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
  className={styles.menuToggle}
  aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
  aria-expanded={isMobileMenuOpen}
  aria-controls="mobile-navigation"
>

{isMobileMenuOpen && (
  <nav id="mobile-navigation" className={styles.mobileMenu} aria-label="Navegación móvil">
```

---

### 4. Dropdown Menus Not Keyboard Accessible

**What:** Services and Industries dropdowns only work on hover, not keyboard.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L82-L120)

**Why:** Keyboard users cannot access nested navigation.

**Fix:** Add focus-within support or convert to button-triggered dropdowns:
```css
/* In Header.module.css */
.dropdown:focus-within .dropdownMenu,
.dropdown:hover .dropdownMenu {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdownToggle:focus + .dropdownMenu,
.dropdownMenu:focus-within {
  opacity: 1;
  visibility: visible;
}
```

---

### 5. Carousel Missing Keyboard Navigation

**What:** Carousels (Services, Cases) cannot be navigated via keyboard.

**Where:** [Carousel.tsx](frontend/src/components/ui/Carousel.tsx)

**Why:** Users who can't use a mouse or touchscreen are excluded.

**Fix:**
```tsx
// Add keyboard handlers to carousel container
<div
  className={styles.carouselContainer}
  tabIndex={0}
  role="region"
  aria-label="Carrusel de contenido"
  aria-roledescription="carousel"
  onKeyDown={(e) => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
  }}
>
```

---

### 6. Insufficient Color Contrast in Testimonials

**What:** The description text `color: #d1d5db` on green overlay background.

**Where:** [Testimonials.module.css](frontend/src/components/sections/Testimonials.module.css#L37-L42)

**Why:** Fails WCAG AA contrast ratio (needs 4.5:1 for normal text).

**Fix:**
```css
.description {
  color: #ffffff; /* or rgba(255, 255, 255, 0.95) */
  /* Instead of #d1d5db which has ~2.8:1 contrast */
}
```

---

### 7. Focus States Not Visible on Many Elements

**What:** Custom buttons/links often override or lack visible focus indicators.

**Where:** 
- [Header.module.css](frontend/src/components/layout/Header.module.css) — `.navLink`, `.contactCta`
- [Services.module.css](frontend/src/components/sections/Services.module.css) — `.btnOutline`
- [Carousel.module.css](frontend/src/components/ui/Carousel.module.css) — `.controlBtn`, `.dot`

**Why:** Keyboard users cannot track their current position.

**Fix:** Add explicit focus-visible styles:
```css
.navLink:focus-visible,
.contactCta:focus-visible,
.btnOutline:focus-visible,
.controlBtn:focus-visible {
  outline: 2px solid #26a86f;
  outline-offset: 2px;
}
```

---

### 8. FontAwesome Loaded from External CDN

**What:** Loading full FA CSS from `cdnjs.cloudflare.com`.

**Where:** [layout.tsx](frontend/src/app/layout.tsx#L31-L34)

**Why:** 
- Render-blocking external resource
- Downloads entire icon library (~60KB CSS)
- Privacy concern (third-party tracking)
- No control over availability

**Fix:** Use `@fortawesome/react-fontawesome` with tree-shaking:
```bash
npm install @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/free-brands-svg-icons @fortawesome/react-fontawesome
```
```tsx
// Create a centralized icon library
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faLinkedin, faFacebook } from '@fortawesome/free-brands-svg-icons';
library.add(faArrowRight, faChevronLeft, faLinkedin, faFacebook);
```

---

## Improvements (Should Fix)

### 9. Mobile Navigation Missing Nested Dropdowns

**What:** Mobile menu shows flat links but desktop has Services/Industries submenus.

**Where:** [Header.tsx](frontend/src/components/layout/Header.tsx#L144-L150)

**Why:** Mobile users cannot access service or industry subpages directly.

**Fix:** Add accordion-style nested navigation:
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

### 10. Multiple Auto-Playing Carousels

**What:** Services and Cases carousels both auto-play simultaneously on home page.

**Where:** 
- [Services.tsx](frontend/src/components/sections/Services.tsx#L22-L26)
- [Cases.tsx](frontend/src/components/sections/Cases.tsx#L23-L27)

**Why:** 
- Competing motion can be disorienting
- Battery drain on mobile
- Users with vestibular disorders may be affected

**Fix:** 
- Only auto-play when visible in viewport
- Add `prefers-reduced-motion` media query
- Consider disabling auto-play except Testimonials
```css
@media (prefers-reduced-motion: reduce) {
  .carouselTrack {
    transition: none;
  }
}
```

---

### 11. ScrollReveal Performance

**What:** Uses `getBoundingClientRect()` in scroll handler without throttling.

**Where:** [ScrollReveal.tsx](frontend/src/components/ui/ScrollReveal.tsx#L6-L20)

**Why:** Triggers layout thrashing on every scroll event.

**Fix:** Use IntersectionObserver instead:
```tsx
useEffect(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Stop watching once visible
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

### 12. Hero Section Missing `loading="eager"` Hint

**What:** Hero background image loaded via CSS, no preload hint.

**Where:** [Hero.tsx](frontend/src/components/sections/Hero.tsx#L14-L19)

**Why:** LCP (Largest Contentful Paint) suffers; browser discovers image late.

**Fix:** Add preload in layout or hero:
```tsx
// In layout.tsx <head>
<link 
  rel="preload" 
  href={heroContent.backgroundImage} 
  as="image" 
  fetchPriority="high" 
/>
```

---

### 13. Stats Animation Runs Multiple Times

**What:** Counter animation logic doesn't properly handle component updates.

**Where:** [Nosotros.tsx](frontend/src/components/sections/Nosotros.tsx#L19-L54)

**Why:** If `initialStats` changes (HMR, navigation), counters reset and re-animate.

**Fix:** Add stable keys or animation lock:
```tsx
const animationId = useRef<number>(0);

const animateCounters = useCallback(() => {
  const id = ++animationId.current;
  // ...in interval callback:
  if (animationId.current !== id) {
    clearInterval(timer);
    return;
  }
}, []);
```

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

### 17. Add Dark Mode Support

**What:** Site only has light theme; no dark mode toggle or system preference detection.

**Why:** User preference, eye strain reduction, modern expectation.

**Approach:**
```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #0f172a;
    --color-text: #f1f5f9;
    /* ... */
  }
}
```

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

### 19. Micro-Interactions Enhancement

**What:** Current interactions are functional but basic.

**Recommendations:**
- **CTA buttons:** Subtle scale + shadow on press (not just hover)
- **Cards:** Slight tilt/parallax on hover (subtle, 2-3deg max)
- **Logo:** Subtle heartbeat or glow animation
- **Scroll indicator:** Fade out after first section passes

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

| Category | Count | Priority |
|----------|-------|----------|
| Critical | 8 | 🔴 Must fix before launch |
| Improvements | 8 | 🟡 Should fix soon |
| Recommendations | 6 | 🟢 Nice to have |

### Top 3 Priorities

1. **Accessibility fundamentals** — Skip link, ARIA attributes, keyboard nav
2. **Focus states** — Visible focus indicators across all interactive elements  
3. **FontAwesome migration** — Remove external dependency, improve performance

---

*Reviewed by Brett — Designer/UI*
