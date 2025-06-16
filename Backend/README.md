# 📚 TaskGo – Backend Service for Book Management & URL Processing (Golang)

TaskGo is a robust and extensible backend API built in **Go**, designed to manage a library of books and process URLs intelligently. It uses modern tools and clean architecture principles to provide high-performance RESTful services with built-in validations, logging, rate limiting, and Swagger documentation.

---

## 🚀 Features

### 📘 Book Management API
- Full CRUD (Create, Read, Update, Delete) support for books
- UUID as primary key for all books
- Advanced filtering by `title`, `author`, `year`, and `type`
- Field validations and error handling
- Interactive Swagger UI for testing
- Structured JSON responses
- Pagination-ready architecture

### 🔗 Smart URL Processor API
- Canonicalization of URLs: removes query parameters and trailing slashes
- Redirection formatting: converts domain to `www.byfood.com`, lowercases the path
- Combined operation: applies both transformations
- Flexible operation control via request body

---

## ⚙️ Tech Stack

| Tool         | Purpose                                |
|--------------|----------------------------------------|
| **Go (Golang)**  | Main programming language               |
| **Gin**       | High-performance HTTP router            |
| **GORM**      | ORM for SQLite with UUID support        |
| **SQLite**    | Lightweight embedded database           |
| **Logrus**    | Structured JSON logging system          |
| **Swag**      | Swagger/OpenAPI 2.0 generation          |
| **Validator** | Input validation using struct tags      |
| **RateLimiter**| Custom middleware to throttle clients  |
| **Docker**    | Containerized development & deployment  |

---

## 📁 Project Structure

Backend/
├── books.db # SQLite database file
├── main.go # App entry point
├── go.mod / go.sum # Dependencies
├── Dockerfile # Docker container config
├── database/ # DB initialization
│ └── db.go
├── handlers/ # Route handlers
│ ├── book_handler.go
│ ├── url_handler.go
│ └── health_handler.go
├── middleware/ # Custom middlewares
│ ├── logger.go
│ └── rate_limiter.go
├── models/ # GORM models
│ └── book.go
├── routes/ # Route definitions
│ └── routes.go
├── utils/ # Reusable helper logic
│ ├── response.go
│ └── validation.go
├── docs/ # Swagger documentation
│ ├── docs.go
│ ├── swagger.yaml
│ └── swagger.json
├── tests/ # Unit tests
│ ├── book_test.go
│ ├── url_test.go
│ └── books.db
└── README.md



---

## 🛠️ Getting Started

### ✅ Prerequisites

- Go 1.20 or higher
- Git
- (Optional) Docker
- [Swag CLI](https://github.com/swaggo/swag) for Swagger generation:
```bash
go install github.com/swaggo/swag/cmd/swag@latest


```

### 🚀 Run the Project
```bash 

# Clone Repostory
 git clone https://github.com/hasan-kayan/TaskGo.git
 cd TaskGo/Backend
 # Install Dependencies
 go mod tidy
 # Generate Swagger Docs
 swag init --parseDependency --parseInternal
 
 #Start the Server 
 go run main.go
```

🟢 Server runs at: http://localhost:8080
📘 Swagger UI: http://localhost:8080/swagger/index.html


### 🧪 Run Tests

For tests and some other subprocesses I have created a general purpose Makefile.

```bash
make test
```


Test coverage includes:

- Book CRUD operations  
- URL processing logic  
- Input validations and edge cases

## 🧾 API Endpoints Overview

### 📗 Book Endpoints

| Method | Endpoint     | Description                 |
|--------|--------------|-----------------------------|
| GET    | `/books`     | List all books with filters |
| POST   | `/books`     | Create a new book           |
| GET    | `/books/:id` | Get book by UUID            |
| PUT    | `/books/:id` | Update book by UUID         |
| DELETE | `/books/:id` | Delete book by UUID         |

🔍 **Query Filters Example**

```bash
GET /books?title=clean&author=martin&year=2008&type=programming

```

📘 Example Book Payload

{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008,
  "isbn": "9780132350884",
  "description": "A Handbook of Agile Software Craftsmanship",
  "type": "Programming",
  "pages": 464,
  "publisher": "Prentice Hall",
  "coverImageURL": "https://example.com/image.jpg"
}





### 🔗 URL Processor Endpoint

| Method | Endpoint       | Description               |
| ------ | -------------- | ------------------------- |
| POST   | `/process-url` | Process and transform URL |


📤 Request Payload

```bash
{
  "url": "https://BYFOOD.com/page?ref=abc/",
  "operation": "all"  // canonical | redirection | all
}

```

✅ Output

```bash 
{
  "original": "https://BYFOOD.com/page?ref=abc/",
  "processed": "https://www.byfood.com/page"
}

```


🧠 Operations

| Name          | Behavior                                                 |
| ------------- | -------------------------------------------------------- |
| `canonical`   | Removes query parameters, trailing slashes               |
| `redirection` | Lowercases path, standardizes domain to `www.byfood.com` |
| `all`         | Applies both canonical and redirection transformations   |


## 🐳 Docker Support

You can containerize and run the app using Docker:

```bash 

docker build -t taskgo-backend .
docker run -p 8080:8080 taskgo-backend

```
## 📖 Swagger API Docs
Auto-generated OpenAPI 2.0 documentation available at:

```bash
http://localhost:8080/swagger/index.html
```
You can also export the Swagger JSON/YAML from the docs/ directory and use it in tools like:

    Swagger Editor

    Postman

    PDF Generator tools


