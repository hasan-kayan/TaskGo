package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
	"github.com/hasan-kayan/TaskGo/utils"
)

/* -------------------------------------------------------------------------
   GET /books   (with optional query filters)
---------------------------------------------------------------------------*/

// GetBooks godoc
// @Summary      Retrieve all books (optional filters)
// @Description  Filter by title, author, year, or type (genre)
// @Tags         books
// @Produce      json
// @Param        title   query  string false  "Filter by title substring"
// @Param        author  query  string false  "Filter by author substring"
// @Param        year    query  int    false  "Filter by publication year"
// @Param        type    query  string false  "Filter by genre"
// @Success      200 {array} models.Book
// @Router       /books [get]
func GetBooks(c *gin.Context) {
	var books []models.Book
	db := database.DB

	// Build WHERE clauses dynamically
	if q := c.Query("title"); q != "" {
		db = db.Where("LOWER(title) LIKE ?", "%"+strings.ToLower(q)+"%")
	}
	if q := c.Query("author"); q != "" {
		db = db.Where("LOWER(author) LIKE ?", "%"+strings.ToLower(q)+"%")
	}
	if q := c.Query("year"); q != "" {
		db = db.Where("year = ?", q)
	}
	if q := c.Query("type"); q != "" {
		db = db.Where("type = ?", q)
	}

	db.Find(&books)
	utils.JSONSuccess(c, http.StatusOK, books)
}

/* -------------------------------------------------------------------------
   GET /books/{id}
---------------------------------------------------------------------------*/

// GetBook godoc
// @Summary      Get book by UUID
// @Tags         books
// @Produce      json
// @Param        id path string true "Book UUID"
// @Success      200 {object} models.Book
// @Failure      400 {object} models.ErrorResponse
// @Failure      404 {object} models.ErrorResponse
// @Router       /books/{id} [get]
func GetBook(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	var result models.Book
	if err := database.DB.First(&result, "id = ?", id).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "Book not found")
		return
	}
	utils.JSONSuccess(c, http.StatusOK, result)
}

/* -------------------------------------------------------------------------
   POST /books
---------------------------------------------------------------------------*/

// CreateBook godoc
// @Summary      Create new book
// @Tags         books
// @Accept       json
// @Produce      json
// @Param        book body models.Book true "Book payload"
// @Success      201 {object} models.Book
// @Failure      400 {object} models.ErrorResponse
// @Failure      422 {object} models.ErrorResponse
// @Router       /books [post]
func CreateBook(c *gin.Context) {
	var input models.Book

	if err := c.ShouldBindJSON(&input); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	// 🔑 Generate UUID if empty
	if input.ID == uuid.Nil {
		input.ID = uuid.New()
	}

	if err := utils.ValidateBook(&input); err != nil {
		utils.JSONError(c, http.StatusUnprocessableEntity, err.Error())
		return
	}

	database.DB.Create(&input)
	utils.JSONSuccess(c, http.StatusCreated, input)
}

/* -------------------------------------------------------------------------
   PUT /books/{id}
---------------------------------------------------------------------------*/

// UpdateBook godoc
// @Summary      Update book by UUID
// @Tags         books
// @Accept       json
// @Produce      json
// @Param        id   path string      true "Book UUID"
// @Param        book body models.Book true "Updated payload"
// @Success      200 {object} models.Book
// @Failure      400 {object} models.ErrorResponse
// @Failure      404 {object} models.ErrorResponse
// @Failure      422 {object} models.ErrorResponse
// @Router       /books/{id} [put]
func UpdateBook(c *gin.Context) {
	uid, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	// current DB record
	var current models.Book
	if err := database.DB.First(&current, "id = ?", uid).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "Book not found")
		return
	}

	// incoming JSON
	var in models.Book
	if err := c.ShouldBindJSON(&in); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.ValidateBook(&in); err != nil {
		utils.JSONError(c, http.StatusUnprocessableEntity, err.Error())
		return
	}

	// Only non-zero fields will overwrite
	database.DB.Model(&current).Updates(in)
	database.DB.First(&current, "id = ?", uid)

	utils.JSONSuccess(c, http.StatusOK, current)
}

/* -------------------------------------------------------------------------
   DELETE /books/{id}
---------------------------------------------------------------------------*/

// DeleteBook godoc
// @Summary      Delete book by UUID
// @Tags         books
// @Produce      json
// @Param        id path string true "Book UUID"
// @Success      200 {object} models.MessageResponse
// @Failure      400 {object} models.ErrorResponse
// @Failure      404 {object} models.ErrorResponse
// @Router       /books/{id} [delete]
func DeleteBook(c *gin.Context) {
	uid, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	var b models.Book
	if err := database.DB.First(&b, "id = ?", uid).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "Book not found")
		return
	}

	database.DB.Delete(&b)
	utils.JSONSuccess(c, http.StatusOK, models.MessageResponse{Message: "Book deleted"})
}
