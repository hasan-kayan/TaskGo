# 🚀 **TaskGo** – Full‑Stack Book Library & Smart URL Platform

A production‑ready **monorepo** that combines a React/Next.js frontend with a Go backend.  Spin it up locally in seconds (Docker Compose) or push to any cloud of your choice.  All services are fully containerised, covered by tests, linted & documented with Swagger / Storybook.

> **Frontend directory →** `Frontend/`
> **Backend  directory →** `Backend/`

---

## ✨  Why TaskGo?

* **Rich UI / UX** – Material‑tailwind dashboard, modal forms, instant feedback ✅
* **Fast API** – Gin + GORM + SQLite (switchable) with rate‑limit & structured logs ⚡
* **Clean Architecture** & **Type‑safety** throughout (TypeScript / Go 1.21).
* **One‑command dev‑env** via Docker Compose & Makefiles.

---

## 🗄️  Repository Layout

```
TaskGo/
├── Backend/          # Go API (Gin, Swagger, tests, Dockerfile, Makefile)
├── Frontend/         # Next.js 14 (App Router) + Tailwind + Vitest + Dockerfile
├── docker-compose.yml# Zero‑config local stack (frontend ↔ backend)
└── README.md         # ← this file
```

### Backend tree (abridged)

```
Backend/
├── handlers/      book_handler.go, url_handler.go, health_handler.go
├── middleware/    logger.go, rate_limiter.go
├── tests/         … (80 %+ coverage)
├── docs/          swagger.yaml/json & generated code
├── Dockerfile     multi‑stage (14 MB image)
└── Makefile       developer shortcuts
```

### Frontend tree (abridged)

```
Frontend/
├── app/           # Next.js routes (App Router)
├── components/    # Re‑usable UI (BookCard, BookForm …)
├── context/       # BooksContext (React Context API)
├── test/          # Vitest + Testing‑Library suites
├── public/        # static assets / favicons
├── Dockerfile     # node‑alpine build → nginx runtime
└── Makefile       # yarn wrappers & lint/test
```

---

## ⚙️  Configuration (.env files)

Both services read a local **`.env`** (loaded via `dotenv`).  *Copy the sample → edit as needed.*

### Backend  (`Backend/.env`)

| Key              | Default    | Description                               |
| ---------------- | ---------- | ----------------------------------------- |
| `HTTP_PORT`      | `8080`     | API port                                  |
| `APP_ENV`        | `dev`      | `dev` \| `prod` (controls Swagger & logs) |
| `DB_DSN`         | `books.db` | SQLite DSN / replace with Postgres URI    |
| `RATE_LIMIT_RPS` | `60`       | Requests per minute per IP                |

### Frontend (`Frontend/.env`)

| Key                    | Default                 | Description                     |
| ---------------------- | ----------------------- | ------------------------------- |
| `NEXT_PUBLIC_API_URL`  | `http://localhost:8080` | Back‑end base URL (books, URLs) |
| `NEXT_PUBLIC_APP_PORT` | `3000`                  | Local dev port                  |

> **Tip** – change the ports in both `.env` files and docker‑compose will pick them up automatically.

---

## 🧑‍💻  Local Development

### Prerequisites

* **Docker 24.x** & Compose v2
* **Make** / GNU Make

### 1. Clone & boot everything

```bash
$ git clone https://github.com/hasan-kayan/TaskGo.git && cd TaskGo
$ make up           # shortcut → docker compose up --build -d
```

| Service  | URL                                                              |
| -------- | ---------------------------------------------------------------- |
| Frontend | [http://localhost:3000](http://localhost:3000)                   |
| Backend  | [http://localhost:8080](http://localhost:8080)                   |
| Swagger  | [http://localhost:8080/swagger/](http://localhost:8080/swagger/) |

*Shut down with `make down`.*

### 2. Hot‑reload (optional)

```bash
# Backend hot‑reload (Air)
$ cd Backend && make dev

# Frontend hot‑reload (Next.js dev server)
$ cd Frontend && make dev
```

---

## 🛠  Useful Make targets (top‑level)

| Target      | What it does                        |
| ----------- | ----------------------------------- |
| `make up`   | `docker compose up --build -d`      |
| `make down` | Stop & purge containers/volumes     |
| `make lint` | Run Go + TS/ES linters in both apps |
| `make test` | Run Go + Vitest suites              |
| `make e2e`  | Cypress end‑to‑end (headless)       |

---

## 📦  Production Build

```bash
# Build backend image
$ cd Backend && make docker   # => taskgo-backend:latest

# Build frontend image
$ cd ../Frontend && make docker # => taskgo-frontend:latest
```

Or deploy together:

```bash
$ docker compose -f docker-compose.prod.yml up -d   # nginx + backend
```

Kubernetes chart, Helm values & GH Actions workflow examples live in `/deploy/`.

---

## 🧪  Testing

* **Backend** – `cd Backend && make test` → `go test -race -cover`
* **Frontend** – `cd Frontend && make test` → `vitest run`
* **API contract** – Postman collection under `/docs/postman/`.

Continuous Integration executes all of the above on every PR.
