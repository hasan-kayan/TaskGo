package utils

import (
	"github.com/go-playground/validator/v10"
	"github.com/hasan-kayan/TaskGo/models"
)

var v = validator.New()

// ValidateBook runs field-level checks that GORM tags alone can’t enforce.
func ValidateBook(b *models.Book) error {
	return v.Struct(b)
}
