# Copilot Coding Agent — Squad Instructions

You are working on a project that uses **Squad**, an AI team framework. When picking up issues autonomously, follow these guidelines.

## Team Context

Before starting work on any issue:

1. Read `.squad/team.md` for the team roster, member roles, and your capability profile.
2. Read `.squad/routing.md` for work routing rules.
3. If the issue has a `squad:{member}` label, read that member's charter at `.squad/agents/{member}/charter.md` to understand their domain expertise and coding style — work in their voice.

## Capability Self-Check

Before starting work, check your capability profile in `.squad/team.md` under the **Coding Agent → Capabilities** section.

- **🟢 Good fit** — proceed autonomously.
- **🟡 Needs review** — proceed, but note in the PR description that a squad member should review.
- **🔴 Not suitable** — do NOT start work. Instead, comment on the issue:
  ```
  🤖 This issue doesn't match my capability profile (reason: {why}). Suggesting reassignment to a squad member.
  ```

## Branch Naming

Use the squad branch convention:
```
squad/{issue-number}-{kebab-case-slug}
```
Example: `squad/42-fix-login-validation`

## PR Guidelines

When opening a PR:
- Reference the issue: `Closes #{issue-number}`
- If the issue had a `squad:{member}` label, mention the member: `Working as {member} ({role})`
- If this is a 🟡 needs-review task, add to the PR description: `⚠️ This task was flagged as "needs review" — please have a squad member review before merging.`
- Follow any project conventions in `.squad/decisions.md`

## Decisions

If you make a decision that affects other team members, write it to:
```
.squad/decisions/inbox/copilot-{brief-slug}.md
```
The Scribe will merge it into the shared decisions file.

---

## Design Context

### Users

**Primary audience:** Decision-makers at Latin American enterprises — CTOs, CDOs, data managers, and operations directors in brewing, logistics, agriculture, and fishing industries.

**Context of use:** Evaluating potential partners for data transformation projects. Usually during work hours, on desktop, comparing multiple vendors. They need to quickly understand capabilities, see evidence of results, and feel confident this team handles enterprise complexity.

**Job to be done:** "I need to modernize our data infrastructure and analytics capabilities. Is Datify the right strategic partner? Can they handle our scale and industry-specific challenges?"

### Brand Personality

**Three words:** Estratégico, Premium, Experto

**Voice:** Authoritative but approachable. Speaks as a trusted advisor, not a vendor. Confident expertise without arrogance. Uses clear language that respects the intelligence of business leaders.

**Tone:** Professional gravitas with warmth. Not cold or corporate-speak, but not startup-casual either. Think: experienced consultant who has seen it all and knows exactly how to help.

**Emotional goal:** Visitors should feel **Confianza y Seguridad** — "These are serious professionals who understand enterprise complexity and will deliver results."

### Aesthetic Direction

**Visual tone:** Premium consultancy — refined, purposeful, confident. Every element should feel deliberate and polished, not decorated.

**Reference:** [DataArt](https://www.dataart.com/es) — Clean hierarchy, enterprise credibility through testimonials and case studies, partner showcases, awards. Professional photography. Clear service articulation.

**Anti-references:**
- NOT a "typical tech startup" — no gradients-everywhere, no playful illustrations, no "we're disrupting X" energy
- NOT a "boring consultancy" — no stock photos of handshakes, no walls of text, no generic corporate blue

**Theme:** Light mode. The teal brand color (#135c51) should feel grounded and trustworthy, not trendy.

**Color guidance:** The deep teal (#135c51) conveys calm expertise and stability. Use it for emphasis, not saturation. Let generous whitespace breathe. Neutrals should be warm-tinted toward the brand hue.

### Design Principles

1. **Evidence over claims.** Show results (metrics, case studies, client logos) rather than making abstract promises. Enterprise buyers need proof.

2. **Hierarchy through restraint.** Create visual importance through strategic use of space and typography weights, not through decoration or color saturation.

3. **Industry fluency.** The design should signal deep sector knowledge — brewing, logistics, agriculture, fishing. These buyers need to see their world reflected.

4. **Premium without pretension.** Confidence, not showing off. The work speaks for itself.

5. **Accessible by default.** WCAG AA compliance. Enterprise clients often have accessibility mandates.
