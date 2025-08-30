# ExpoGain Chrome Extension - Release Management
.PHONY: help build clean tag push-release create-release patch-release minor-release major-release

# Default target
help:
	@echo "ExpoGain Chrome Extension - Release Management Commands:"
	@echo ""
	@echo "Build Commands:"
	@echo "  make build          - Build the extension for production"
	@echo "  make clean          - Clean build directory"
	@echo ""
	@echo "Release Commands:"
	@echo "  make patch-release  - Create patch version release (1.0.0 -> 1.0.1)"
	@echo "  make minor-release  - Create minor version release (1.0.0 -> 1.1.0)"
	@echo "  make major-release  - Create major version release (1.0.0 -> 2.0.0)"
	@echo ""
	@echo "Git Commands:"
	@echo "  make tag version=X.Y.Z  - Create and push git tag for version X.Y.Z"
	@echo "  make push-release       - Push current branch and tags to origin"
	@echo ""
	@echo "Examples:"
	@echo "  make patch-release"
	@echo "  make tag version=1.2.3"
	@echo "  make create-release version=1.2.3"

# Build the extension
build:
	@echo "🏗️  Building ExpoGain extension..."
	npm run build
	@echo "✅ Build completed successfully!"

# Clean build directory
clean:
	@echo "🧹 Cleaning build directory..."
	npm run clean
	@echo "✅ Build directory cleaned!"

# Create and push git tag
tag:
	@if [ -z "$(version)" ]; then \
		echo "❌ Error: version parameter is required"; \
		echo "Usage: make tag version=X.Y.Z"; \
		exit 1; \
	fi
	@echo "🏷️  Creating git tag v$(version)..."
	git tag -a v$(version) -m "Release version $(version)"
	git push origin v$(version)
	@echo "✅ Tag v$(version) created and pushed successfully!"

# Push current branch and tags
push-release:
	@echo "📤 Pushing branch and tags to origin..."
	git push origin main
	git push origin --tags
	@echo "✅ Branch and tags pushed successfully!"

# Get current version from package.json
CURRENT_VERSION := $(shell node -p "require('./package.json').version")

# Calculate next version numbers
PATCH_VERSION := $(shell node -p "const v='$(CURRENT_VERSION)'.split('.'); v[2]=parseInt(v[2])+1; v.join('.')")
MINOR_VERSION := $(shell node -p "const v='$(CURRENT_VERSION)'.split('.'); v[1]=parseInt(v[1])+1; v[2]='0'; v.join('.')")
MAJOR_VERSION := $(shell node -p "const v='$(CURRENT_VERSION)'.split('.'); v[0]=parseInt(v[0])+1; v[1]='0'; v[2]='0'; v.join('.')")

# Create patch release (1.0.0 -> 1.0.1)
patch-release:
	@echo "📦 Creating patch release..."
	@echo "Current version: $(CURRENT_VERSION)"
	@echo "New version: $(PATCH_VERSION)"
	@read -p "Continue with patch release? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		make build && \
		make tag version=$(PATCH_VERSION) && \
		echo "🎉 Patch release $(PATCH_VERSION) completed!"; \
	else \
		echo "❌ Patch release cancelled."; \
	fi

# Create minor release (1.0.0 -> 1.1.0)
minor-release:
	@echo "📦 Creating minor release..."
	@echo "Current version: $(CURRENT_VERSION)"
	@echo "New version: $(MINOR_VERSION)"
	@read -p "Continue with minor release? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		make build && \
		make tag version=$(MINOR_VERSION) && \
		echo "🎉 Minor release $(MINOR_VERSION) completed!"; \
	else \
		echo "❌ Minor release cancelled."; \
	fi

# Create major release (1.0.0 -> 2.0.0)
major-release:
	@echo "📦 Creating major release..."
	@echo "Current version: $(CURRENT_VERSION)"
	@echo "New version: $(MAJOR_VERSION)"
	@read -p "Continue with major release? (y/N): " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		make build && \
		make tag version=$(MAJOR_VERSION) && \
		echo "🎉 Major release $(MAJOR_VERSION) completed!"; \
	else \
		echo "❌ Major release cancelled."; \
	fi

# Create GitHub release (requires GitHub CLI)
create-release:
	@if [ -z "$(version)" ]; then \
		echo "❌ Error: version parameter is required"; \
		echo "Usage: make create-release version=X.Y.Z"; \
		exit 1; \
	fi
	@echo "🚀 Creating GitHub release v$(version)..."
	@if command -v gh >/dev/null 2>&1; then \
		gh release create v$(version) \
			--title "Release v$(version)" \
			--notes "Release version $(version)" \
			./build/*; \
		echo "✅ GitHub release v$(version) created successfully!"; \
	else \
		echo "⚠️  GitHub CLI not found. Please install it or create release manually."; \
		echo "   Visit: https://github.com/ExpoGain/expogain-chrome-extension/releases/new"; \
		echo "   Tag: v$(version)"; \
		echo "   Title: Release v$(version)"; \
	fi
