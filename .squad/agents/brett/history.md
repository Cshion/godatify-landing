# Brett — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Styling:** TailwindCSS 4
- **Type:** Corporate landing page

## Core Context

- UI components at `frontend/src/components/ui/`
- Feature components organized by page: blog, casos, common, contact, industrias, layout, nosotros, sections, servicios
- Global styles at `frontend/src/app/globals.css`
- PostCSS config at `frontend/postcss.config.mjs`

## Design Priorities

- Mobile-first responsive design
- Clean, professional corporate aesthetic
- Accessibility (WCAG AA)
- Consistent spacing and typography

## Learnings

### 2026-04-18 — UI/UX Review Patterns

**Accessibility Gaps Identified:**
- FontAwesome icons via CDN lack proper aria labels
- Focus states overridden by custom styles without replacements
- Dropdown navigation hover-only (no keyboard support)
- Mobile menu missing ARIA expanded/controls attributes
- Skip-to-content link absent

**Component Patterns:**
- Carousels use CSS transform for sliding (good for performance)
- ScrollReveal uses getBoundingClientRect (should be IntersectionObserver)
- Contact form has loading/success states but missing error state
- Stats use IntersectionObserver for animation trigger (good pattern)

**Styling Approach:**
- Mix of CSS modules + Tailwind utilities (inconsistent)
- CSS variables defined in globals.css but direct hex used in modules
- Section spacing inconsistent (`py-20` vs `5rem 0` vs `var(--space-20)`)
- Color contrast issue in Testimonials description text

**Mobile Patterns:**
- Mobile menu is flat (no nested dropdowns unlike desktop)

### 2026-04-18 — Critical Accessibility Fixes

**Fixed Issues:**

1. **Skip-to-Content Link** — Added in layout.tsx with proper sr-only + focus styles
2. **FontAwesome Icons** — Added `aria-hidden="true"` to decorative icons, improved aria-labels on social links with screen reader text
3. **Mobile Menu ARIA** — Added `aria-expanded`, `aria-controls`, and `aria-label` states; changed div to nav element
4. **Dropdown Keyboard Access** — Added `:focus-within` CSS rule for keyboard navigation
5. **Carousel Keyboard Navigation** — Added Arrow key handlers, `tabIndex`, `role="region"`, `aria-roledescription`
6. **Testimonials Color Contrast** — Changed description color from #d1d5db to #ffffff for WCAG AA compliance
7. **Focus States** — Added `:focus-visible` outlines to Header, Carousel, Services, Testimonials controls

**Not Fixed (Architecture Change Required):**
- FontAwesome CDN → tree-shaken package (requires npm install + all icon component rewrites)
- Breakpoints: 768px (tablet), 1024px (desktop)
- Stats grid: 3col → 1col (could use 2col on tablet)

**Performance Notes:**
- FontAwesome loaded as full library from CDN (~60KB)
- Multiple auto-playing carousels compete for attention
- Hero background image has no preload hint

### 2026-04-19 — UI/UX Improvements Implementation

**Improvements Fixed (5/8):**

1. **#9 Mobile Navigation Nested Dropdowns**
   - Added accordion-style dropdowns for Services and Industries in mobile menu
   - Services shows all service links with expand/collapse
   - Industries shows sector headers with industry links underneath
   - Proper ARIA attributes (aria-expanded, chevron rotation)
   - Added mobile CTA button at bottom
   - New CSS classes: .mobileDropdown, .mobileDropdownToggle, .mobileSubmenu, .mobileSubmenuHeader, .mobileCta

2. **#10 Auto-Playing Carousels**
   - Added `prefers-reduced-motion` check — disables auto-play entirely when enabled
   - Added IntersectionObserver to only auto-play when carousel is visible (30% threshold)
   - Added CSS reduced motion support in Carousel.module.css
   - Uses useRef for containerRef to track visibility

3. **#11 ScrollReveal Performance**
   - Replaced scroll event listener with IntersectionObserver
   - 15% threshold with -50px rootMargin for early detection
   - Unobserves elements after reveal (one-time animation)
   - Respects prefers-reduced-motion by adding .no-animation class
   - No layout thrashing, much better scroll performance

4. **#12 Hero Image Preload**
   - Added `<link rel="preload" href="/images/hero-bg.jpg" as="image" fetchPriority="high">` in layout.tsx

### 2026-04-19 — Alternating Section Backgrounds Fix

**Problem:** Landing page sections lost their green/white alternating background pattern.

**Root Cause Analysis:**
- Services section had white gradient background instead of brand green
- Section ORDER in page.tsx didn't match intended visual flow
- Clients was positioned between Nosotros and Services, breaking alternation

**Fixes Applied:**

1. **Services Background** → Changed from white gradient to brand green
   - Updated `Services.module.css`: `background: linear-gradient(135deg, var(--color-brand-green) 0%, var(--color-brand-green-dark) 100%)`
   - Updated `Services.tsx`: Changed heading text color from `text-gray-900` to `text-white`

2. **Section Reordering** → Moved Clients section to end of page
   - Old: Hero → Nosotros → Clients → Services → Cases → Testimonials
   - New: Hero → Nosotros → Services → Cases → Testimonials → Clients

**Final Alternating Pattern:**
| Section | Background |
|---------|-----------|
| Hero | Green ✓ |
| Nosotros | White ✓ |
| Services | Green ✓ |
| Cases | White ✓ |
| Testimonials | Green ✓ |
| Clients | White ✓ |

**Files Modified:**
- `frontend/src/components/sections/Services.module.css`
- `frontend/src/components/sections/Services.tsx`
- `frontend/src/app/page.tsx`

### 2026-04-19 — Landing Page Checklist Created

**Created:** `.squad/reviews/landing-page-checklist.md`

**Contents:**
- 8 essential element categories for B2B consulting landing pages
- Priority ratings (Critical/High/Medium/Low) for each element
- Best practices for each section
- Full audit of current Godatify implementation
- Checklist with ✅ working, ⚠️ needs improvement, ❌ missing
- Priority action items (High/Medium/Low)

**Key Findings:**
- Hero, Services, Cases, Testimonials sections are solid
- Missing: Trust indicators in hero, phone number in header, ROI metrics section
- Missing: Cookie consent banner (compliance requirement)
- Suggested: Add persistent CTA button in header
   - Improves LCP by telling browser to fetch hero image early

5. **#13 Stats Animation Fix**
   - Added animationIdRef to track/invalidate in-flight animations
   - Added timersRef array to track running intervals
   - clearTimers callback properly cleans up all intervals
   - Animation cancels properly when props change (HMR, navigation)
   - Respects prefers-reduced-motion — shows final values immediately

**Recommendations Implemented (2/6):**

1. **#17 Dark Mode CSS Variables Prep**
   - Added `@media (prefers-color-scheme: dark)` block in globals.css
   - Variables: --color-bg-primary/secondary/tertiary, --color-text-primary/secondary/muted
   - Adjusted brand green for dark backgrounds (#26a86f light instead of #1C7C54)
   - Added border and surface color variables
   - Foundation for full dark mode implementation

2. **#19 Micro-Interactions Enhancement**
   - Added `.btn-primary:active` etc. — scale(0.98) on press
   - Added `.card-interactive` — translateY hover + box-shadow enhancement
   - Added `.link-animated` — underline grows from left on hover
   - Utility classes ready to be applied to components

**Global Accessibility:**
- Added global reduced motion support in globals.css
- Disables all animations/transitions when `prefers-reduced-motion: reduce`
- Scroll-behavior reverts to auto
- .reveal elements show immediately without animation

**Files Modified:**
- frontend/src/components/layout/Header.tsx — mobile dropdown state + accordion JSX
- frontend/src/components/layout/Header.module.css — mobile dropdown styles
- frontend/src/components/ui/Carousel.tsx — viewport visibility + reduced motion
- frontend/src/components/ui/Carousel.module.css — reduced motion CSS
- frontend/src/components/ui/ScrollReveal.tsx — IntersectionObserver refactor
- frontend/src/components/sections/Nosotros.tsx — animation lifecycle fix
- frontend/src/app/layout.tsx — hero preload link
- frontend/src/app/globals.css — reduced motion, dark mode vars, micro-interactions
