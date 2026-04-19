# Squad Team

> godatify-landing

## Coordinator

| Name | Role | Notes |
|------|------|-------|
| Squad | Coordinator | Routes work, enforces handoffs and reviewer gates. |

## Members

| Name | Role | Charter | Status |
|------|------|---------|--------|
| Ripley | Lead | [charter](.squad/agents/ripley/charter.md) | 🏗️ Active |
| Dallas | Frontend Dev | [charter](.squad/agents/dallas/charter.md) | ⚛️ Active |
| Parker | Backend Dev | [charter](.squad/agents/parker/charter.md) | 🔧 Active |
| Lambert | Tester | [charter](.squad/agents/lambert/charter.md) | 🧪 Active |
| Kane | Content/SEO | [charter](.squad/agents/kane/charter.md) | 📝 Active |
| Brett | Designer/UI | [charter](.squad/agents/brett/charter.md) | 🎨 Active |
| Ash | Security | [charter](.squad/agents/ash/charter.md) | 🔒 Active |
| Jonesy | DevOps | [charter](.squad/agents/jonesy/charter.md) | ⚙️ Active |
| Scribe | Session Logger | [charter](.squad/agents/scribe/charter.md) | 📋 Active |
| Ralph | Work Monitor | [charter](.squad/agents/ralph/charter.md) | 🔄 Active |

## Coding Agent

<!-- copilot-auto-assign: false -->

| Name | Role | Charter | Status |
|------|------|---------|--------|
| @copilot | Coding Agent | — | 🤖 Coding Agent |

### Capabilities

**🟢 Good fit — auto-route when enabled:**
- Bug fixes with clear reproduction steps
- Test coverage (adding missing tests, fixing flaky tests)
- Lint/format fixes and code style cleanup
- Dependency updates and version bumps
- Small isolated features with clear specs
- Boilerplate/scaffolding generation
- Documentation fixes and README updates

**🟡 Needs review — route to @copilot but flag for squad member PR review:**
- Medium features with clear specs and acceptance criteria
- Refactoring with existing test coverage
- API endpoint additions following established patterns
- Migration scripts with well-defined schemas

**🔴 Not suitable — route to squad member instead:**
- Architecture decisions and system design
- Multi-system integration requiring coordination
- Ambiguous requirements needing clarification
- Security-critical changes (auth, encryption, access control)
- Performance-critical paths requiring benchmarking
- Changes requiring cross-team discussion

## Project Context

- **Project:** godatify-landing
- **Created:** 2026-04-18
- **User:** Aaron
- **Universe:** Alien (7/8 slots used)

### Tech Stack

**Frontend:**
- Next.js 16.0.7
- React 19.2
- TailwindCSS 4
- TypeScript 5

**Backend:**
- Strapi 5.31.3
- GraphQL
- PostgreSQL
- AWS S3

### Structure

```
frontend/     Next.js app (pages, components, data fetching)
backend/      Strapi CMS (content types, APIs, seed data)
```

### Language

Spanish (es-MX) — landing page corporativa
