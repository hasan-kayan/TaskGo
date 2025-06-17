# ------------------------------------------------------------
# TaskGo – Developer Convenience Makefile  🛠️🚀
# ------------------------------------------------------------
SHELL := /usr/bin/env bash
APP   ?= taskgo-backend
PORT  ?= 8080

# Colours (ANSI)
CYAN  := \033[36m
GREEN := \033[32m
YELL  := \033[33m
RESET := \033[0m

.PHONY: help deps docs dev lint test coverage docker run clean

# -----------------------------------------------------------------
# 🆘  help – pretty-prints available targets
# -----------------------------------------------------------------
help:              ## Show this help 🌈
	@echo -e "$(YELL)Available targets$(RESET)\n"
	@grep -E '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS=":.*?## "}; {printf "$(CYAN)%-12s$(RESET) %s\n", $$1, $$2}'

# -----------------------------------------------------------------
# ⚙️  deps – module tidy + install CLI tooling
# -----------------------------------------------------------------
deps:              ## Install Go deps & CLI tools (swag, air, golangci-lint) 🛒
	@echo -e "$(GREEN)• Tidying go.mod$(RESET)"
	go mod tidy

	@echo -e "$(GREEN)• Ensuring swag is installed$(RESET)"
	@if ! command -v swag >/dev/null; then \
		echo "  ↳ fetching swag…"; \
		go install github.com/swaggo/swag/cmd/swag@latest; \
	else echo "  ↳ swag already present ✔️"; fi

	@echo -e "$(GREEN)• Ensuring air is installed$(RESET)"
	@if ! command -v air >/dev/null; then \
		echo "  ↳ fetching air…"; \
		go install github.com/air-verse/air@latest; \
	else echo "  ↳ air already present ✔️"; fi

	@echo -e "$(GREEN)• Ensuring golangci-lint is installed$(RESET)"
	@if ! command -v golangci-lint >/dev/null; then \
		echo "  ↳ fetching golangci-lint… (this may take a sec)"; \
		curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh \
			| sh -s -- -b $$(go env GOPATH)/bin v1.55.2; \
	else echo "  ↳ golangci-lint already present ✔️"; fi

	@echo -e "$(GREEN)🎉  All tools ready!$(RESET)"

# -----------------------------------------------------------------
# 📑  docs – regenerate Swagger files
# -----------------------------------------------------------------
docs:             ## Re-generate Swagger (docs/*) 🖋️
	@echo -e "$(GREEN)• Re-building Swagger docs$(RESET)"
	swag init --parseDependency --parseInternal --dir ./ --output ./docs
	@echo -e "$(GREEN)✓ Swagger docs updated!$(RESET)"

# -----------------------------------------------------------------
# 🏃  dev – live-reload API with air
# -----------------------------------------------------------------
dev:              ## Start API w/ hot reload (falls back to go run) 🔥
	@echo -e "$(GREEN)• Launching development server$(RESET)"
	@command -v air >/dev/null && air -c .air.toml || go run .

# -----------------------------------------------------------------
# 🔍  lint – vet + golangci-lint
# -----------------------------------------------------------------
lint:             ## Static analysis & linters 🔎
	@echo -e "$(GREEN)• Running go vet$(RESET)"
	go vet ./...
	@echo -e "$(GREEN)• Running golangci-lint$(RESET)"
	@command -v golangci-lint >/dev/null && golangci-lint run || \
		echo -e "$(YELL)⚠️  golangci-lint not installed – run 'make deps'$(RESET)"

# -----------------------------------------------------------------
# 🧪  test – race detector & coverage
# -----------------------------------------------------------------
test:             ## Run all unit/integration tests 🧪
	@echo -e "$(GREEN)• Running tests (race-detector + coverage)$(RESET)"
	go test -v -race -coverpkg=./... -coverprofile=coverage.out ./...

coverage: test    ## Show coverage summary 📈
	@echo -e "$(GREEN)• Coverage report$(RESET)"
	go tool cover -func=coverage.out
	@echo -e "$(CYAN)💡 Tip: 'go tool cover -html=coverage.out' for HTML view$(RESET)"

# -----------------------------------------------------------------
# 🐳  docker – multi-stage build & run
# -----------------------------------------------------------------
docker:           ## Build docker image 🐳
	@echo -e "$(GREEN)• Building Docker image '$(APP):latest'$(RESET)"
	docker build -t $(APP):latest .

run: docker       ## Run container on host:$(PORT) 🚢
	@echo -e "$(GREEN)• Starting container$(RESET)"
	docker run -it --rm -p $(PORT):8080 --name $(APP) $(APP):latest

# -----------------------------------------------------------------
# 🧹  clean – remove generated artefacts
# -----------------------------------------------------------------
clean:            ## Delete coverage & Swagger artefacts 🧹
	@echo -e "$(GREEN)• Cleaning build artefacts$(RESET)"
	rm -f coverage.out
	rm -rf docs/swagger.* docs/docs.go
	@echo -e "$(GREEN)✓ Cleaned$(RESET)"
