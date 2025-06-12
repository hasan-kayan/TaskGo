package models

import (
	"time"
)

// Book represents the structure for a book entity.
// It includes metadata such as title, author, and publication year.
//
// swagger:model Book
type Book struct {
	// ID is the unique identifier for the book.
	//
	// required: true
	// example: 1
	ID uint `json:"id"`

	// CreatedAt is the timestamp when the book was added.
	//
	// example: 2025-06-12T10:30:00Z
	CreatedAt time.Time `json:"created_at"`

	// UpdatedAt is the timestamp when the book was last updated.
	//
	// example: 2025-06-12T10:30:00Z
	UpdatedAt time.Time `json:"updated_at"`

	// DeletedAt is the timestamp when the book was deleted (if soft-deleted).
	//
	// example: null
	DeletedAt *time.Time `json:"deleted_at,omitempty"`

	// Title of the book.
	//
	// required: true
	// example: The Hobbit
	Title string `json:"title" binding:"required"`

	// Author of the book.
	//
	// required: true
	// example: J.R.R. Tolkien
	Author string `json:"author" binding:"required"`

	// Year of publication.
	//
	// example: 1937
	Year int `json:"year"`
}

// ErrorResponse is used for API error responses.
// swagger:model ErrorResponse
type ErrorResponse struct {
	// Error message
	// example: Book not found
	Error string `json:"error"`
}

// MessageResponse is used for success messages (e.g., deletion).
// swagger:model MessageResponse
type MessageResponse struct {
	// Message text
	// example: Book deleted
	Message string `json:"message"`
}
