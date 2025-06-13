# 📚 TaskGo API – Book Library & URL Processor (Golang)

TaskGo is a full-featured backend application built with **Go**, **Gin**, and **GORM** that provides:

- 📚 A RESTful CRUD API for managing books using **UUIDs**.
- 🔗 A smart URL processing service that handles redirection and canonicalization.
- 🧪 Complete test suite with high coverage.
- 📖 Swagger-based API documentation.
- 🔒 Built-in security features like **rate limiting**, validation, and structured logging.

---

## 🚀 Features

### 📘 Book Library API
- Create, read, update, delete books
- Filter books by `title`, `author`, `year`, and `type`
- Each book has a UUID primary key
- Swagger documentation with models
- Search-ready endpoints

### 🔗 URL Processor
- Canonical: removes query parameters and trailing slashes
- Redirection: converts domain to `www.byfood.com`, lowercases the path
- Combined operation: applies both

### ⚙️ Tech Stack
- **Gin** – HTTP web framework
- **GORM** – ORM for SQLite with UUID support
- **Swagger** – for interactive API documentation
- **SQLite** – Local lightweight database
- **Logrus** – Structured JSON logging
- **Rate limiting** – Per-IP limit middleware
- **Validator** – Backend field-level validation

---

## 📂 Project Structure

```bash
.
[hasankayan@AsisguardBluetooth Backend]$ tree
.
├── books.db
├── database
│   └── db.go
├── Dockerfile
├── docs
│   ├── docs.go
│   ├── swagger.json
│   └── swagger.yaml
├── go.mod
├── go.sum
├── handlers
│   ├── book_handler.go
│   ├── health_handler.go
│   └── url_handler.go
├── main.go
├── middleware
│   ├── logger.go
│   └── rate_limiter.go
├── models
│   └── book.go
├── README.md
├── routes
│   └── routes.go
├── tests
│   ├── books.db
│   ├── book_test.go
│   └── url_test.go
└── utils
    ├── response.go
    └── validation.go


''' 
## 🛠️ Setup Instructions

### 🧱 Prerequisites

- Go ≥ 1.20
- Git 
- Docker (Optional)


### ⚙️ Run Locally


```bash
git clone https://github.com/hasan-kayan/TaskGo.git
cd TaskGo/Backend

# Install dependencies
go mod tidy

# Generate Swagger docs
swag init --parseDependency --parseInternal

# Run the server
go run main.go

```
Server runs on: http://localhost:8080

Than if you want to run unit tests

```bash

go test ./... -cover

```


## 🧾 API Endpoints 

| Method | Endpoint      | Description               |
| ------ | ------------- | ------------------------- |
| GET    | `/books`      | List books (with filters) |
| POST   | `/books`      | Create new book           |
| GET    | `/books/{id}` | Get book by UUID          |
| PUT    | `/books/{id}` | Update book by UUID       |
| DELETE | `/books/{id}` | Delete book by UUID       |


### Filters for /books:

```bash
/books?title=harry&author=rowling&year=2001&type=fantasy


# For Curl Command 


```

### URL Processor

| Method | Endpoint       | Description                    |
| ------ | -------------- | ------------------------------ |
| POST   | `/process-url` | Processes a URL with operation |

```bash
{
    # Payload 
  "url": "https://BYFOOD.com/page?ref=abc/",
  "operation": "all"
}

```

Operations:

    "canonical" → remove query params, trailing slash

    "redirection" → lowercase path, change domain to www.byfood.com

    "all" → apply both



