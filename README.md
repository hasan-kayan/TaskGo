# 📚 TaskGo - Full-Stack Book Management System

TaskGo is a modern full-stack application that allows users to manage books with full CRUD support. It is built with:

- 🔧 **Backend**: Golang (Gin Framework), SQLite, Swagger, Docker
- 💻 **Frontend**: React + TypeScript, Tailwind CSS, Vite
- 📦 **Architecture**: Clean, modular, and production-ready

---

## 🗂️ Project Structure

```
.
├── Backend/
│   ├── books.db                   # SQLite DB file
│   ├── database/                 # DB initialization
│   ├── docs/                     # Swagger generated docs
│   ├── handlers/                 # Book route handlers
│   ├── models/                   # Book model
│   ├── routes/                   # Route definitions
│   ├── tests/                    # Unit tests
│   ├── utils/                    # Response formatting
│   ├── main.go                   # Main entry point
│   ├── Dockerfile                # Containerization
│   ├── go.mod / go.sum           # Go dependencies
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/           # BookForm, BookList, Modal etc.
│   │   ├── config/               # API config
│   │   ├── context/              # Context API for books
│   │   ├── hooks/                # Custom React hooks
│   │   ├── pages/                # Dashboard page
│   │   ├── services/             # API calls (bookService)
│   │   ├── types/                # TypeScript interfaces
│   │   ├── utils/                # Validation functions
│   ├── package.json              # Node dependencies
│   ├── tsconfig.json             # TypeScript configuration
│   ├── tailwind.config.js        # Tailwind settings
│   ├── vite.config.ts            # Vite configuration
```

---

## 🚀 Backend - Go + Gin

### ✅ Features

- RESTful API with full CRUD operations
- SQLite database (lightweight and file-based)
- Swagger API documentation (`/swagger/index.html`)
- Modular code structure
- Unit tests with isolated DB
- Docker support for containerized deployment

---

### 🔧 Setup

#### 1. Clone and install dependencies

```bash
cd Backend
go mod tidy
```

#### 2. Run the server

```bash
go run main.go
```

- API runs at: `http://localhost:8080`
- Swagger Docs: `http://localhost:8080/swagger/index.html`

---

### 🔬 Generate Swagger Docs

```bash
go install github.com/swaggo/swag/cmd/swag@latest
swag init
```

> ⚠️ Make sure your code has proper `@Summary`, `@Param`, `@Success`, etc. annotations in handlers.

---

### ✅ API Endpoints

| Method | Endpoint        | Description          |
|--------|------------------|----------------------|
| GET    | /books           | Fetch all books      |
| GET    | /books/:id       | Get book by ID       |
| POST   | /books           | Create a new book    |
| PUT    | /books/:id       | Update a book        |
| DELETE | /books/:id       | Delete a book        |

---

### 🧪 Run Tests

```bash
go test ./tests
```

Uses an isolated database to ensure data consistency.

---

### 🐳 Run with Docker

```bash
docker build -t taskgo-backend .
docker run -p 8080:8080 taskgo-backend
```

---

## 💻 Frontend - React + TypeScript + Tailwind + Vite

### ✅ Features

- Add, Edit, Delete, and View books
- Form validation with dynamic error messages
- Clean UI with TailwindCSS
- Modal dialog for book creation/editing
- Context API to manage global book state

---

### 🔧 Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### ⚙️ API Configuration

In `src/config/api.ts`:

```ts
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8080',
  ENDPOINTS: {
    BOOKS: '/books',
    BOOK_BY_ID: (id: string) => `/books/${id}`,
  },
};
```

---

### 📁 Key Components

| File                                  | Description                          |
|---------------------------------------|--------------------------------------|
| `BookForm.tsx`                        | Form to create/edit books            |
| `BookList.tsx`                        | Lists all books with actions         |
| `BookDetail.tsx`                      | Shows single book info               |
| `Modal.tsx`                           | Reusable modal for form              |
| `bookService.ts`                      | API interaction logic                |
| `validation.ts`                       | Input validation logic               |
| `BooksContext.tsx`                    | React Context for books state        |

---

### 🐳 Build for Production

```bash
npm run build
```

To preview locally:

```bash
npm run preview
```

---

## 🧪 Sample Book JSON

```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "year": 2008,
  "isbn": "978-0132350884",
  "description": "A Handbook of Agile Software Craftsmanship",
  "genre": "Self-Help",
  "pages": 464,
  "publisher": "Prentice Hall",
  "coverUrl": "https://example.com/cleancode.jpg"
}
```

---

## 🔐 Common Errors & Fixes

- **CORS 404/OPTIONS error**: Add CORS middleware to your Gin server.
- **400 Bad Request on POST**: Ensure frontend sends `Content-Type: application/json` and form values match backend struct tags.
- **Empty form field submission**: Convert numeric fields like `year` or `pages` from `''` to number before sending (or validate backend to accept zero).

---

## 📄 License

MIT License © 2025 [Hasan Kayan](https://github.com/hasan-kayan)

---
