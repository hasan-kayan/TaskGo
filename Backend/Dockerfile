#Official Go Image
FROM golang:1.24 AS builder

# Set working directory inside container
WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod tidy

# Copy the rest of the application
COPY . .

# Build the application binary
RUN go build -o taskgo main.go

# Final stage: create a minimal image with the binary
FROM debian:bullseye-slim

# Install SSL certificates (required by many Go apps)
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/taskgo .

# Copy the SQLite database and Swagger docs
COPY --from=builder /app/books.db ./books.db
COPY --from=builder /app/docs ./docs

# Expose port
EXPOSE 8080

# Command to run the app
CMD ["./taskgo"]
