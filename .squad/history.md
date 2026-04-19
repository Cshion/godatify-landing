# Squad History

> Timeline of significant events, decisions, and fixes

---

## 2026-04-19

### 🐛 FontAwesome Icons Not Loading — FIXED

**Reported by:** Aaron  
**Fixed by:** Dallas  
**Verified by:** Lambert

**Issue:**  
FontAwesome icons were not rendering on the website. The site was broken due to client-side library initialization issues in Next.js App Router.

**Root Cause:**  
FontAwesome library was being initialized in a server component context. Next.js App Router requires explicit `'use client'` directive for client-side code.

**Fix Applied:**
1. Added `'use client';` directive to `frontend/src/lib/fontawesome.ts`
2. Updated `frontend/src/components/ui/Icon.tsx` to:
   - Add `'use client';` directive
   - Import `@/lib/fontawesome` before using `FontAwesomeIcon`

**Files Changed:**
- [frontend/src/lib/fontawesome.ts](../frontend/src/lib/fontawesome.ts)
- [frontend/src/components/ui/Icon.tsx](../frontend/src/components/ui/Icon.tsx)

**Verification:**
- ✅ Both files have `'use client'` directive
- ✅ Icon.tsx imports fontawesome.ts for library initialization
- ✅ CSS is imported and `autoAddCss` is disabled

**Testing Checklist Created:**  
See [.squad/testing/web-smoke-test.md](testing/web-smoke-test.md) for pre-deployment verification.

---
