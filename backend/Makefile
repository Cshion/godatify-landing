# ============================================================================
# Backend Makefile — Essential Commands Only
# ============================================================================
# Usage: make <target>
# Run `make help` to see available commands.
# ============================================================================

.PHONY: help install dev build start seed seed-mock clean

.DEFAULT_GOAL := help

# ----------------------------------------------------------------------------
# Core Commands
# ----------------------------------------------------------------------------

## help: Show available commands
help:
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║              Backend Make Commands                             ║"
	@echo "╠════════════════════════════════════════════════════════════════╣"
	@echo "║  make install    → Install dependencies                        ║"
	@echo "║  make dev        → Start development server                    ║"
	@echo "║  make build      → Build for production                        ║"
	@echo "║  make start      → Start production server                     ║"
	@echo "╠════════════════════════════════════════════════════════════════╣"
	@echo "║  make seed       → Seed master data (safe for production)      ║"
	@echo "║  make seed-mock  → Seed mock data (dev only)                   ║"
	@echo "╠════════════════════════════════════════════════════════════════╣"
	@echo "║  make clean      → Remove build artifacts                      ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""

## install: Install all dependencies
install:
	@echo "📦 Installing dependencies..."
	npm install

## dev: Start development server with hot-reload
dev:
	@echo "🚀 Starting development server..."
	npm run dev

## build: Build for production (compiles admin panel)
build:
	@echo "🔨 Building for production..."
	npm run build

## start: Start production server (requires build first)
start:
	@echo "⚡ Starting production server..."
	npm run start

# ----------------------------------------------------------------------------
# Seed Commands
# ----------------------------------------------------------------------------
# Seeding is ONLY done via these commands. Bootstrap does NOT seed.
# ----------------------------------------------------------------------------

## seed: Seed master data (pages, company info, social links, services, sectors, industries)
## Safe to run in production - creates structural content only
seed:
	@echo "🌱 Seeding master data..."
	@echo "ℹ️  This seeds: services, social-links, company-info, sectors, industries, pages"
	@echo "ℹ️  Safe for production - no mock/sample data included"
	npx ts-node scripts/seed.ts

## seed-mock: Seed mock data (clients, authors, testimonials, blog posts, case studies)
## Development ONLY - creates sample/demo content
seed-mock:
	@echo "🌱 Seeding mock data (dev only)..."
	@echo "⚠️  This seeds: clients, authors, testimonials, blog-posts, case-studies"
	@echo "⚠️  Do NOT run in production - this is sample/demo data"
	npx ts-node scripts/seed.ts --mock-only

# ----------------------------------------------------------------------------
# Cleanup
# ----------------------------------------------------------------------------

## clean: Remove build artifacts and dependencies
clean:
	@echo "🧹 Cleaning project..."
	rm -rf node_modules
	rm -rf .tmp
	rm -rf dist
	rm -rf .cache
	rm -f data.db
	@echo "✅ Clean complete."
