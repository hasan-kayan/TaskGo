# 📚 **TaskGo Backend** – Book Management & Smart URL Processing in Go

> A production‑ready, docker‑packaged REST API that demonstrates idiomatic Go, Clean Architecture, and DevOps best‑practices.

---

## ✨ Why TaskGo?

* **Clean, modular design.** Layers are split into *handlers → services → repositories* with dependency inversion so you can swap out infrastructure pain‑free.
* **Built for scale.** Async logging (Logrus), structured errors, middleware‑driven observability, and a pluggable rate‑limiter let you move to cloud or K8s with zero refactor.
* **First‑class DX.** One‑command 🖱️ *make dev* spins up the API, hot‑reloads on file changes, opens the Swagger UI, and tails logs.
* **Complete CI / CD story.** GitHub Actions (unit test + `go vet` + staticcheck) → Docker build → (optional) 🚀 push to GHCR / Docker Hub.
* **Great docs.** You are reading them. 😉

---

## 🗺️ Table of Contents

1. [Features](#-features)
2. [Architecture](#-architecture--folder-layout)
3. [Local Setup](#-local-setup)
4. [Running Tests](#-running-tests)
5. [CLI Cheat‑sheet](#-dev-cli-cheat-sheet)
6. [API Reference](#-api-reference)
7. [Docker & Deployment](#-docker--deployment)
8. [Configuration](#-configuration--env)
9. [Contributing](#-contributing)
10. [Roadmap](#-roadmap)
11. [License](#-license)

---

## 🚀 Features

### 📘 Book Management

* **Full CRUD** with UUID primary keys
* **Rich filtering** (`title`, `author`, `year`, `type`), ready for pagination
* **Validation & Sanitization** using `go-playground/validator`
* **Soft‑delete** optional via GORM hooks (disabled by default)

### 🔗 Smart URL Processor

* **Canonicalisation** – strips queries, fragments, trailing slashes
* **SEO‑friendly redirects** – force `www.byfood.com` & lower‑case paths
* **All‑in‑one** – chain canonical + redirect via `operation=all`

### 🛡️ Cross‑cutting

* **Structured JSON logging** (Logrus) with request tracing (`X‑Request‑ID`)
* **Rate limiting** middleware (token bucket per IP, env‑configurable)
* **Graceful shutdown** on `SIGINT/SIGTERM`
* **Auto Swagger** (`swag init`) served under `/swagger/*`
* **100 % Dockerized** with multi‑stage build (scratch final image ≈ 14 MB)

---

## 🏗️ Architecture & Folder Layout

```
Backend/
├─ cmd/                 # Binary entrypoints (main.go lives here)
│  └─ taskgo/
│     └─ main.go
├─ internal/            # Private application code
│  ├─ config/           # ENV & flags → Config struct
│  ├─ adapters/         # Driving adapters (HTTP)
│  │  └─ http/
│  │     ├─ handler/
│  │     ├─ middleware/
│  │     └─ router.go
│  ├─ domain/           # Enterprise models + business rules
│  │  └─ book.go
│  ├─ service/          # Use‑cases (business logic)
│  │  └─ book_service.go
│  ├─ repository/       # Ports + GORM implementation
│  │  └─ book_repo_gorm.go
│  ├─ util/             # Helpers (response, validation, url)
│  └─ docs/             # Swagger (auto‑generated)
├─ migrations/          # Future DB migrations (atlas / goose)
├─ tests/               # Unit & integration tests (httptest, sqlite in‑mem)
├─ Dockerfile
├─ docker-compose.yml   # Local dev stack (API + SQLite volume)
└─ Makefile             # One‑liner dev commands
```

> **Note** – The `internal/` convention prevents accidental import by other modules, keeping the API surface tight.

---

## ⚙️ Local Setup

\### Prerequisites

| Tool   | Version         |
| ------ | --------------- |
| Go     |  ≥ 1.21         |
| Git    | latest          |
| Docker | 24.x (optional) |

\### Clone & Run

```bash
# 1. Clone
$ git clone https://github.com/hasan-kayan/TaskGo.git
$ cd TaskGo/Backend

# 2. Bootstrap deps
$ make deps            # = go mod tidy + install swag & golangci‑lint

# 3. Generate Swagger docs
$ make docs            # = swag init --parseDependency --parseInternal

# 4. Run the API (live reload)
$ make dev             # = air ./cmd/taskgo
# └─ listens on http://localhost:8080
```

\### Using Docker

```bash
# build multi‑stage image (~14 MB, Go 1.21–alpine)
$ docker build -t taskgo-backend .
# run in detached mode, persisting db to named volume
$ docker run -d -p 8080:8080 --name taskgo -v taskgo_data:/data taskgo-backend
```

---

## 🧪 Running Tests

```bash
# Unit + integration tests + race detector + coverage
$ make test      # = go test ./... -race -coverprofile=coverage.out

# Benchmark (excerpt)
$ make bench
```

> *SQLite is spun up in temporary file mode; tests are parallel‑safe.*

### Coverage report

```bash
$ go tool cover -func=coverage.out  # text summary
$ go tool cover -html=coverage.out  # open fancy view in browser
```

---

## 🧰 Dev CLI Cheat‑Sheet

| Command       | Action                                   |
| ------------- | ---------------------------------------- |
| `make dev`    | Hot‑reloaded server (`air`)              |
| `make lint`   | `golangci-lint run ./...`                |
| `make fmt`    | `goimports` + `gofumpt`                  |
| `make docs`   | Generate Swagger under **internal/docs** |
| `make docker` | Build & tag Docker image                 |

---

## 🔌 API Reference

Swagger UI → **`/swagger/index.html`** (served only if `ENV=dev`)

\### Book Endpoints

| Method | Path          | Query Params                             | Description         |
| ------ | ------------- | ---------------------------------------- | ------------------- |
| GET    | `/books`      | `title, author, year, type, limit, page` | List / filter books |
| POST   | `/books`      | –                                        | Create new book     |
| GET    | `/books/{id}` | –                                        | Retrieve by UUID    |
| PUT    | `/books/{id}` | –                                        | Update              |
| DELETE | `/books/{id}` | –                                        | Delete              |

\### URL Processor

| Method | Path           | Body                                    | Description |         |               |
| ------ | -------------- | --------------------------------------- | ----------- | ------- | ------------- |
| POST   | `/process-url` | \`{ "url": "…", "operation": "canonical | redirection | all"}\` | Transform URL |

Full example payloads & responses are documented in Swagger.

---

## 🐳 Docker & Deployment

A multi‑stage Dockerfile is included.

```dockerfile
# 1. builder
FROM golang:1.21-alpine AS builder
WORKDIR /src
COPY . .
RUN --mount=type=cache,target=/go/pkg/mod \
    go build -o /taskgo ./cmd/taskgo

# 2. tiny image
FROM scratch
COPY --from=builder /taskgo /taskgo
COPY --from=builder /src/config.yaml /config.yaml # if you use yaml config
EXPOSE 8080
ENTRYPOINT ["/taskgo"]
```

### Kubernetes (Helm snippet)

```yaml
image:
  repository: ghcr.io/hasan-kayan/taskgo-backend
  tag: "v{{ .Chart.AppVersion }}"
resources:
  limits:
    cpu: 200m
    memory: 128Mi
  requests:
    cpu: 50m
    memory: 64Mi
```

---

## 🔧 Configuration / ENV

| Variable         | Default    | Description                                      |
| ---------------- | ---------- | ------------------------------------------------ |
| `APP_ENV`        | `dev`      | `dev` \| `prod` (enables Swagger only in dev)    |
| `HTTP_PORT`      | `8080`     | Port to bind                                     |
| `RATE_LIMIT_RPS` | `10`       | Requests / sec per IP                            |
| `DB_DSN`         | `books.db` | SQLite dsn (can be `file::memory:?cache=shared`) |

All env vars can also be supplied via `.env` – parsed by `github.com/joho/godotenv` when present.

---

## 🤝 Contributing

1. **Fork** & clone the repo
2. `make deps && make dev`
3. Create feature branch `git checkout -b feat/awesome`
4. Commit following the **Conventional Commits** spec
5. Push & open a PR – CI will run tests + linter automatically
6. Once merged, GH Actions pushes the new Docker image 👉 GHCR

> *Tip:* Install **pre‑commit** hooks (`make hooks`) to run `go vet`, `golangci‑lint`, and `go test -run=.^$` before every commit.

---

## 🗺️ Roadmap

* [ ] Add JWT auth + RBAC roles
* [ ] Switch to **PostgreSQL** with sqlc codegen
* [ ] gRPC gateway & GraphQL layer
* [ ] Prometheus metrics & OpenTelemetry tracing

---