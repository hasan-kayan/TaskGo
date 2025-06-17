# 📚 **TaskGo Backend** – Book Library & Smart URL Processing API

A production‑ready REST service written in **Go 1.21**, offering full‑fledged CRUD endpoints for managing books **plus** a smart URL‑cleanup/redirection endpoint, wrapped with modern tooling (GORM, Gin, Logrus, Swagger) and delivered as a tiny Docker image.

---

## 🌟  Highlights

| 🔑 Feature            | 💬  Description                                                                                                   |
| --------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Book CRUD**         | Create / Read / Update / Delete books, UUID primary keys, advanced filtering (`title`, `author`, `year`, `type`). |
| **URL Processor**     | One endpoint that canonicalises / redirects URLs (`canonical`, `redirection`, or `all`).                          |
| **Strong validation** | `go-playground/validator` + Gin binding tags on models.                                                           |
| **Middlewares**       | Structured JSON logging (Logrus) & IP‑based rate‑limiter (token bucket, 60 req/min).                              |
| **Swagger UI**        | Auto‑generated docs served at `/swagger/index.html`.                                                              |
| **100 % Dockerised**  | Multi‑stage build – final scratch image ≈ 14 MB.                                                                  |
| **Extensive tests**   | Unit + integration tests for handlers, filters, rate‑limiter & helpers (🎯 80 %+ coverage).                       |

---

## 🗂  Project Structure

```
Backend/
├── books.db                # SQLite database (dev)
├── database/
│   └── db.go               # DB connection & AutoMigrate
├── handlers/               # Gin HTTP handlers
│   ├── book_handler.go
│   ├── url_handler.go
│   └── health_handler.go
├── middleware/             # Custom middlewares
│   ├── logger.go
│   └── rate_limiter.go
├── models/                 # GORM models & custom validators
│   └── book.go
├── routes/
│   └── routes.go           # Route grouping
├── utils/                  # Helpers (responses, validation)
│   ├── response.go
│   └── validation.go
├── docs/                   # Swagger 2.0 generated files
│   ├── docs.go
│   ├── swagger.yaml
│   └── swagger.json
├── tests/                  # Go test‑suites (httptest + temp DB)
│   └── …
├── Dockerfile              # Multi‑stage container build
├── Makefile                # Developer shortcuts
├── main.go                 # Application entry‑point
└── README.md               # ← you are here
```

> **Tip** – SQLite is default; switch to Postgres/MySQL by changing `DB_DSN` and the `gorm.Open` driver.

---

## ⚙️  Setup & Run (Local)

### Prerequisites

* Go **1.21**+
* Git
* (optional) Docker **24.x**

### Quick start

```bash
# clone & enter
$ git clone https://github.com/hasan-kayan/TaskGo.git
$ cd TaskGo/Backend

# install Go deps & swag CLI
$ make deps             # = go mod tidy + swag install

# generate Swagger docs
$ make docs             # = swag init --parseDependency --parseInternal

# run with hot‑reload (requires air)
$ make dev              # = air -c .air.toml (see Makefile)
# └── API on http://localhost:8080
# └── Swagger UI on http://localhost:8080/swagger/index.html
```

---

## 🐳  Run with Docker

```bash
# build image (~14 MB)
$ docker build -t taskgo-backend .

# run & persist DB to named volume
$ docker run -d -p 8080:8080 \
    -e APP_ENV=prod \
    --name taskgo \
    -v taskgo_data:/data taskgo-backend
```

Kubernetes/Helm snippet (values.yaml):

```yaml
image:
  repository: ghcr.io/hasan-kayan/taskgo-backend
  tag: "v1.0.0"
resources:
  limits:
    cpu: 250m
    memory: 128Mi
  requests:
    cpu: 50m
    memory: 64Mi
```

---

## 🔌  API Endpoints

### Book Service

| Method | Path          | Query / Body                | Description         |
| ------ | ------------- | --------------------------- | ------------------- |
| GET    | `/books`      | `title, author, year, type` | List / filter books |
| POST   | `/books`      | Book JSON                   | Create new book     |
| GET    | `/books/{id}` | –                           | Fetch by UUID       |
| PUT    | `/books/{id}` | Book JSON                   | Update              |
| DELETE | `/books/{id}` | –                           | Delete              |

**Sample CREATE request**

```json
POST /books
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008,
  "isbn": "9780132350884",
  "type": "Programming",
  "pages": 464
}
```

### URL Processor

| Method | Path           | Body                                                    | Description             |
| ------ | -------------- | ------------------------------------------------------- | ----------------------- |
| POST   | `/process-url` | `{ "url": "https://BYFOOD.com/…", "operation": "all" }` | Canonicalise / redirect |

Example (operation **all**):

```json
{
  "url": "https://BYFOOD.com/food-EXPeriences?query=abc/",
  "operation": "all"
}
→ 200 OK
{
  "processed_url": "https://www.byfood.com/food-experiences"
}
```

### Health

\| GET | `/health` | – | Liveness probe returns `{ "status": "ok" }` |

Full OpenAPI spec at `/swagger/index.html`.

---

## 🧪  Testing

Tests live under **tests/** and spin up a temp SQLite file.

```bash
# run all with race detector & coverage
$ make test   # = go test ./... -race -coverprofile=coverage.out

# view coverage
$ go tool cover -html=coverage.out
```

Continuous Integration (GitHub Actions) runs `go vet`, static‑analysis and tests on every PR.

---

## 🔧  Configuration (ENV)

| Variable         | Default    | Purpose                                                 |
| ---------------- | ---------- | ------------------------------------------------------- |
| `APP_ENV`        | `dev`      | `dev` shows Swagger & pretty logs                       |
| `HTTP_PORT`      | `8080`     | Port to bind                                            |
| `DB_DSN`         | `books.db` | SQLite DSN; e.g. `file::memory:?cache=shared` for tests |
| `RATE_LIMIT_RPS` | `60`       | Requests per minute per IP                              |

`.env` files are loaded automatically if present (leveraging `joho/godotenv`).

---

## 🛠  Makefile Targets

| Command       | Action                           |
| ------------- | -------------------------------- |
| `make deps`   | Install Go deps + swag + linters |
| `make docs`   | Regenerate Swagger files         |
| `make dev`    | Run with hot‑reload (Air)        |
| `make test`   | Run tests + coverage             |
| `make docker` | Build Docker image               |

