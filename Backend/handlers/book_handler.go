package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"

	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
	"github.com/hasan-kayan/TaskGo/utils"
)

// -----------------------------------------------------------------------------
// GET /books  (optionally filtered)
// -----------------------------------------------------------------------------

// GetBooks godoc
// @Summary      Retrieve all books (with optional filters)
// @Description  Returns books, optionally filtered by title, author, year, or type
// @Tags         books
// @Produce      json
// @Param        title   query     string false "Filter by title (substring)"
// @Param        author  query     string false "Filter by author (substring)"
// @Param        year    query     int    false "Filter by publication year"
// @Param        type    query     string false "Filter by genre/type"
// @Success      200     {object}  map[string]interface{}
// @Router       /books [get]
func GetBooks(c *gin.Context) {
	var books []models.Book
	db := database.DB

	// Dynamic filtering
	if title := c.Query("title"); title != "" {
		db = db.Where("title ILIKE ?", "%"+title+"%")
	}
	if author := c.Query("author"); author != "" {
		db = db.Where("author ILIKE ?", "%"+author+"%")
	}
	if year := c.Query("year"); year != "" {
		db = db.Where("year = ?", year)
	}
	if bookType := c.Query("type"); bookType != "" {
		db = db.Where("type = ?", bookType)
	}

	db.Find(&books)
	utils.JSONSuccess(c, http.StatusOK, books)
}

// -----------------------------------------------------------------------------
// GET /books/{id}
// -----------------------------------------------------------------------------

// GetBook godoc
// @Summary      Get a book by ID
// @Description  Retrieves a book using its UUID
// @Tags         books
// @Produce      json
// @Param        id   path      string true "Book UUID"
// @Success      200  {object}  models.Book
// @Failure      400  {object}  models.ErrorResponse "Invalid UUID"
// @Failure      404  {object}  models.ErrorResponse "Book not found"
// @Router       /books/{id} [get]
func GetBook(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	var book models.Book
	if err := database.DB.First(&book, "id = ?", id).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "Book not found")
		return
	}

	utils.JSONSuccess(c, http.StatusOK, book)
}

// -----------------------------------------------------------------------------
// POST /books
// -----------------------------------------------------------------------------

// CreateBook godoc
// @Summary      Create a new book
// @Description  Add a new book to the library
// @Tags         books
// @Accept       json
// @Produce      json
// @Param        book  body      models.Book  true  "Book to create"
// @Success      201   {object}  models.Book
// @Failure      400   {object}  models.ErrorResponse "Bind error"
// @Failure      422   {object}  models.ErrorResponse "Validation error"
// @Router       /books [post]
func CreateBook(c *gin.Context) {
	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.ValidateBook(&input); err != nil {
		utils.JSONError(c, http.StatusUnprocessableEntity, err.Error())
		return
	}

	database.DB.Create(&input)
	utils.JSONSuccess(c, http.StatusCreated, input)
}

// -----------------------------------------------------------------------------
// PUT /books/{id}
// -----------------------------------------------------------------------------

// UpdateBook godoc
// @Summary      Update an existing book
// @Description  Update a book by UUID
// @Tags         books
// @Accept       json
// @Produce      json
// @Param        id    path      string      true  "Book UUID"
// @Param        book  body      models.Book true  "Updated book data"
// @Success      200   {object}  models.Book
// @Failure      400   {object}  models.ErrorResponse
// @Failure      404   {object}  models.ErrorResponse
// @Failure      422   {object}  models.ErrorResponse
// @Router       /books/{id} [put]
func UpdateBook(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	var book models.Book
	if err := database.DB.First(&book, "id = ?", id).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "Book not found")
		return
	}

	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}
	if err := utils.ValidateBook(&input); err != nil {
		utils.JSONError(c, http.StatusUnprocessableEntity, err.Error())
		return
	}

	// Apply updates
	database.DB.Model(&book).Updates(input)

	// Reload to ensure we send the fresh values
	database.DB.First(&book, "id = ?", id)

	utils.JSONSuccess(c, http.StatusOK, book)
}

// -----------------------------------------------------------------------------
// DELETE /books/{id}
// -----------------------------------------------------------------------------

// DeleteBook godoc
// @Summary      Delete a book
// @Description  Remove a book by UUID
// @Tags         books
// @Produce      json
// @Param        id   path      string true "Book UUID"
// @Success      200  {object}  models.MessageResponse
// @Failure      400  {object}  models.ErrorResponse "Invalid UUID"
// @Failure      404  {object}  models.ErrorResponse "Book not found"
// @Router       /books/{id} [delete]
func DeleteBook(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "Invalid UUID format")
		return
	}

	var book models.Book
	if err := database.DB.First(&book, "id = ?", id).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "Book not found")
		return
	}

	database.DB.Delete(&book)
	utils.JSONSuccess(c, http.StatusOK, models.MessageResponse{Message: "Book deleted"})
}
