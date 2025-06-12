# 📚 TaskGo – Book Management API

TaskGo is a fullstack developer assignment project built using **Golang** for the backend and designed to be paired with a **React/Next.js TypeScript** frontend. It provides full CRUD operations for managing a small book library, along with a URL cleanup and redirection microservice (Part 2).

---

## 🧩 Features

### ✅ Book Management API
- List all books
- View a book by ID
- Create new books
- Update existing books
- Delete books

### ✅ URL Cleanup and Redirection Service *(Part 2 - pending)*

### ✅ Swagger UI Documentation
- Live interactive documentation at: [`/swagger/index.html`](http://localhost:8080/swagger/index.html)

### ✅ Unit Tests
- End-to-end CRUD test coverage via `httptest`

---

## 📦 Tech Stack

| Layer      | Technology                |
|------------|---------------------------|
| Language   | Go (Golang)               |
| Framework  | Gin Web Framework         |
| ORM        | GORM                      |
| Database   | SQLite (default)          |
| Docs       | Swaggo Swagger Generator  |
| Testing    | Go test + `httptest`      |

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/hasan-kayan/TaskGo.git
cd TaskGo
```

### 2. Install Go Dependencies

```bash
go mod tidy
```

### 3. Generate Swagger Docs

```bash
swag init
```

This will generate the `docs/` folder with `swagger.json`.

---

## ▶️ Run the Server

```bash
go run main.go
```

The API will be available at:

```
http://localhost:8080
```

Swagger UI available at:

```
http://localhost:8080/swagger/index.html
```

---

## 🔁 API Endpoints

| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| GET    | `/books`         | List all books           |
| GET    | `/books/:id`     | Get a book by ID         |
| POST   | `/books`         | Create a new book        |
| PUT    | `/books/:id`     | Update book by ID        |
| DELETE | `/books/:id`     | Delete book by ID        |

### 📘 Sample Book JSON

```json
{
  "title": "The Hobbit",
  "author": "J.R.R. Tolkien",
  "year": 1937
}
```

---

## 🧪 Running Tests

```bash
go test ./tests
```

This runs all unit tests located in the `tests/` directory.

---

## 🧰 Project Structure

```
TaskGo/
├── main.go                 # Entry point
├── go.mod / go.sum         # Go modules
├── database/               # DB connection logic
│   └── db.go
├── models/                 # Book model + Swagger types
│   └── book.go
├── handlers/               # HTTP handlers (controllers)
│   └── book_handler.go
├── routes/                 # Route grouping
│   └── routes.go
├── utils/                  # Reusable response utilities
│   └── response.go
├── tests/                  # Test cases
│   └── book_test.go
├── docs/                   # Auto-generated Swagger docs
├── README.md               # This file
```

---

## ✅ Dependencies Used

```bash
go get github.com/gin-gonic/gin
go get gorm.io/gorm
go get gorm.io/driver/sqlite
go get github.com/swaggo/swag/cmd/swag
go get github.com/swaggo/gin-swagger
go get github.com/swaggo/files
```

---

## 📌 Notes

- Use `GIN_MODE=release` for production.
- SQLite is used for simplicity. You can switch to PostgreSQL or MySQL by changing `gorm.Open(...)` in `db.go`.

---

## 🛠️ TODOs

- [ ] Implement Part 2: URL Cleanup and Redirection Service
- [ ] Add CI workflow
- [ ] Dockerize the service
- [ ] Deploy on a cloud platform (e.g. Railway, Render, GCP)

---

## 🧠 License

This project is part of a fullstack developer assignment. Not licensed for commercial use.

---

## 👤 Author

- Hasan Kayan – [GitHub](https://github.com/hasan-kayan)
