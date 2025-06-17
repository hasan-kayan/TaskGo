# ------------------------------------------------------------
# TaskGo – Developer Convenience Makefile
# ------------------------------------------------------------
SHELL := /bin/bash
APP   ?= taskgo-backend
PORT  ?= 8080

.PHONY: help deps docs dev lint test coverage docker run clean

## ----------------------------------------------------------------
## 🆘  help – print all targets
## ----------------------------------------------------------------
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'

## ----------------------------------------------------------------
## ⚙️  deps – tidy modules & install tooling
## ----------------------------------------------------------------
deps: ## Download go modules & CLI tools (swag, air, golangci-lint)
	go mod tidy
	@if ! command -v swag >/dev/null;       then go install github.com/swaggo/swag/cmd/swag@latest; fi
	@if ! command -v air  >/dev/null;       then go install github.com/cosmtrek/air@latest; fi
	@if ! command -v golangci-lint >/dev/null; then \
		curl -sSfL https://raw.githubusercontent.com/golangci/golangci-lint/master/install.sh | sh -s -- -b $$GOPATH/bin v1.55.2; fi

## ----------------------------------------------------------------
## 📑  docs – regenerate Swagger files
## ----------------------------------------------------------------
docs: ## Run swag to (re)generate docs/*
	swag init --parseDependency --parseInternal --dir ./ --output ./docs

## ----------------------------------------------------------------
## 🏃  dev – run with hot-reload using air (falls back to go run)
## ----------------------------------------------------------------
dev: ## Start API with live-reload (needs air)
	@command -v air >/dev/null && air -c .air.toml || go run .

## ----------------------------------------------------------------
## 🔍  lint – static checks (go vet + golangci-lint if available)
## ----------------------------------------------------------------
lint: ## Run go vet & golangci-lint
	go vet ./...
	@command -v golangci-lint >/dev/null && golangci-lint run || echo "golangci-lint not found – skipping"

## ----------------------------------------------------------------
## 🧪  test – run fast tests with race detector & coverage
## ----------------------------------------------------------------
test: ## Run all tests with race detector & coverage profile
	go test -v -race -coverpkg=./... -coverprofile=coverage.out ./...

coverage: test ## Open HTML coverage report (generates if missing)
	go tool cover -func=coverage.out
	@echo "💡 Run 'go tool cover -html=coverage.out' to open the HTML report in your browser."

## ----------------------------------------------------------------
## 🐳  docker – multi-stage build
## ----------------------------------------------------------------
docker: ## Build docker image $(APP):latest
	docker build -t $(APP):latest .

run: docker ## Run docker container on host port $(PORT)
	docker run -it --rm -p $(PORT):8080 --name $(APP) $(APP):latest

## ----------------------------------------------------------------
## 🧹  clean – remove generated files
## ----------------------------------------------------------------
clean: ## Delete coverage & swag artefacts
	rm -f coverage.out
	rm -rf docs/swagger.* docs/docs.go

