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
