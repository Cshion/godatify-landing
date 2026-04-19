# ============================================================================
# GoDatify Frontend Makefile
# ============================================================================
#
# A convenient wrapper around npm scripts for faster development workflow.
#
# Usage:
#   make          - Show available commands (default)
#   make dev      - Start development server
#   make build    - Build for production
#   make help     - Show this help message
#
# ============================================================================

# Colors for terminal output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
CYAN   := \033[0;36m
RED    := \033[0;31m
RESET  := \033[0m
BOLD   := \033[1m

# Default target
.DEFAULT_GOAL := help

# Phony targets (not actual files)
.PHONY: install dev build start lint clean help

# ============================================================================
# TARGETS
# ============================================================================

## install: Install project dependencies
install:
	@echo "$(CYAN)📦 Installing dependencies...$(RESET)"
	@npm install
	@echo "$(GREEN)✓ Dependencies installed$(RESET)"

## dev: Start the Next.js development server
dev:
	@echo "$(CYAN)🚀 Starting development server...$(RESET)"
	@npm run dev

## build: Build the application for production
build:
	@echo "$(CYAN)🔨 Building for production...$(RESET)"
	@npm run build
	@echo "$(GREEN)✓ Build complete$(RESET)"

## start: Start the production server (requires build first)
start:
	@echo "$(CYAN)🌐 Starting production server...$(RESET)"
	@npm run start

## lint: Run ESLint to check code quality
lint:
	@echo "$(CYAN)🔍 Running linter...$(RESET)"
	@npm run lint
	@echo "$(GREEN)✓ Lint complete$(RESET)"

## clean: Remove build artifacts and dependencies
clean:
	@echo "$(YELLOW)🧹 Cleaning build artifacts...$(RESET)"
	@rm -rf node_modules .next
	@echo "$(GREEN)✓ Cleaned node_modules and .next$(RESET)"

## help: Show this help message
help:
	@echo ""
	@echo "$(BOLD)$(CYAN)GoDatify Frontend$(RESET)"
	@echo "$(BOLD)═════════════════$(RESET)"
	@echo ""
	@echo "$(BOLD)Available commands:$(RESET)"
	@echo ""
	@echo "  $(GREEN)make install$(RESET)  — Install project dependencies"
	@echo "  $(GREEN)make dev$(RESET)      — Start development server (localhost:3000)"
	@echo "  $(GREEN)make build$(RESET)    — Build for production"
	@echo "  $(GREEN)make start$(RESET)    — Start production server"
	@echo "  $(GREEN)make lint$(RESET)     — Run ESLint code quality checks"
	@echo "  $(GREEN)make clean$(RESET)    — Remove node_modules and .next"
	@echo "  $(GREEN)make help$(RESET)     — Show this help message"
	@echo ""
	@echo "$(BOLD)Quick start:$(RESET)"
	@echo "  $$ make install   # First time setup"
	@echo "  $$ make dev       # Start coding!"
	@echo ""
