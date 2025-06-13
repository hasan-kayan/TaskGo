package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

func (b *Book) BeforeCreate(tx *gorm.DB) (err error) {
	if b.ID == uuid.Nil {
		b.ID = uuid.New()
	}
	return
}

// Book represents the structure for a book entity.
// It includes metadata such as title, author, and publication year.
//
// swagger:model Book
type Book struct {
	ID        uuid.UUID  `json:"id" gorm:"type:uuid;primaryKey"`
	CreatedAt time.Time  `json:"created_at"`
	UpdatedAt time.Time  `json:"updated_at"`
	DeletedAt *time.Time `json:"deleted_at,omitempty" gorm:"index"`

	Title         string `json:"title" binding:"required" validate:"required"`
	Author        string `json:"author" binding:"required" validate:"required"`
	Year          int    `json:"year" validate:"gte=0"`
	ISBN          string `json:"isbn,omitempty" validate:"omitempty,len=10|len=13"`
	Description   string `json:"description,omitempty"`
	CoverImageURL string `json:"cover_image_url,omitempty" validate:"omitempty,url"`
	Publisher     string `json:"publisher,omitempty"`
	Type          string `json:"type,omitempty"`
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
