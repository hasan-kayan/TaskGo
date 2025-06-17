package utils

import (
	"github.com/go-playground/validator/v10"
	"github.com/hasan-kayan/TaskGo/models"
)

var validate *validator.Validate

func init() {
	validate = validator.New()
}

// ValidateBook performs field-level validation for the Book struct.
// Returns an error if any field fails the defined validation rules.
func ValidateBook(book *models.Book) error {
	return validate.Struct(book)
}
