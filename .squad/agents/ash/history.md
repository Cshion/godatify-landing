# Ash — History

> Project knowledge and learnings

## Project Context

- **Project:** godatify-landing
- **User:** Aaron
- **Backend:** Strapi 5 with PostgreSQL
- **Frontend:** Next.js 16

## Core Context

- Backend config at `backend/config/` (middlewares.ts, server.ts)
- Frontend config at `frontend/next.config.ts`
- File uploads via AWS S3 (`@strapi/provider-upload-aws-s3`)
- Contact form endpoint (potential attack surface)

## Security Priorities

- Input validation on contact form
- CORS configuration
- Rate limiting on API endpoints
- Secure headers (CSP, X-Frame-Options, etc.)
- S3 bucket security

## Learnings

<!-- Append new learnings here -->
