# ============================================================================
# Backend Makefile — Strapi 5 Development Commands
# ============================================================================
# Usage: make <target>
# Run `make help` to see all available commands.
# ============================================================================

.PHONY: install dev build start clean db-reset db-seed db-fresh console upgrade help

# Default target
.DEFAULT_GOAL := help

# ----------------------------------------------------------------------------
# Core Commands
# ----------------------------------------------------------------------------

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
# Database Commands
# ----------------------------------------------------------------------------

## db-reset: Reset the database (removes all data and tables)
db-reset:
	@echo "🗑️  Resetting database..."
	@echo "⚠️  This will DELETE ALL DATA!"
	@rm -rf .tmp
	@rm -f data.db .tmp/data.db
	@echo "✅ Database reset complete. Run 'make dev' to re-initialize."

## db-seed: Run seed data (starts server, which triggers bootstrap seeding)
db-seed:
	@echo "🌱 Running seed data..."
	@echo "ℹ️  Seed runs automatically during Strapi bootstrap."
	@echo "ℹ️  Seed ONLY runs in development (NODE_ENV !== 'production')"
	NODE_ENV=development npm run dev

## db-fresh: Reset database and re-seed (fresh start)
db-fresh: db-reset
	@echo "🔄 Fresh start — resetting and seeding..."
	NODE_ENV=development npm run dev

# ----------------------------------------------------------------------------
# Utility Commands
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

## console: Open Strapi interactive console (REPL)
console:
	@echo "💻 Opening Strapi console..."
	npm run console

## upgrade: Upgrade Strapi to latest version
upgrade:
	@echo "⬆️  Upgrading Strapi..."
	@echo "ℹ️  Run 'npx @strapi/upgrade latest --dry' first to preview changes."
	npx @strapi/upgrade latest

# ----------------------------------------------------------------------------
# Help
# ----------------------------------------------------------------------------

## help: Show available commands
help:
	@echo ""
	@echo "╔════════════════════════════════════════════════════════════════╗"
	@echo "║           Datify Backend — Available Commands                  ║"
	@echo "╠════════════════════════════════════════════════════════════════╣"
	@echo "║  Core                                                          ║"
	@echo "║    make install      Install dependencies                      ║"
	@echo "║    make dev          Start development server                  ║"
	@echo "║    make build        Build for production                      ║"
	@echo "║    make start        Start production server                   ║"
	@echo "║                                                                ║"
	@echo "║  Database                                                      ║"
	@echo "║    make db-reset     Reset database (⚠️  deletes all data)      ║"
	@echo "║    make db-seed      Run seed data (dev only)                  ║"
	@echo "║    make db-fresh     Reset + seed (fresh start)                ║"
	@echo "║                                                                ║"
	@echo "║  Utilities                                                     ║"
	@echo "║    make clean        Remove node_modules, .tmp, dist           ║"
	@echo "║    make console      Open Strapi interactive console           ║"
	@echo "║    make upgrade      Upgrade Strapi to latest                  ║"
	@echo "║    make help         Show this help message                    ║"
	@echo "╚════════════════════════════════════════════════════════════════╝"
	@echo ""
