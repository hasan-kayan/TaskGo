package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
)

// GetBooks godoc
// @Summary      Retrieve all books
// @Description  Get a list of all books from the database
// @Tags         books
// @Produce      json
// @Success      200  {array}  models.Book
// @Router       /books [get]
func GetBooks(c *gin.Context) {
	var books []models.Book
	database.DB.Find(&books)
	c.JSON(http.StatusOK, books)
}

// GetBook godoc
// @Summary      Get a book by ID
// @Description  Retrieves a book from the database using its ID
// @Tags         books
// @Produce      json
// @Param        id   path      int  true  "Book ID"
// @Success      200  {object}  models.Book
// @Failure      404  {object}  models.ErrorResponse
// @Router       /books/{id} [get]
func GetBook(c *gin.Context) {
	var book models.Book
	if err := database.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Book not found"})
		return
	}
	c.JSON(http.StatusOK, book)
}

// CreateBook godoc
// @Summary      Create a new book
// @Description  Add a new book to the library
// @Tags         books
// @Accept       json
// @Produce      json
// @Param        book  body      models.Book  true  "Book to create"
// @Success      201   {object}  models.Book
// @Failure      400   {object}  models.ErrorResponse
// @Router       /books [post]
func CreateBook(c *gin.Context) {
	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}
	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

// UpdateBook godoc
// @Summary      Update an existing book
// @Description  Update a book by ID
// @Tags         books
// @Accept       json
// @Produce      json
// @Param        id    path      int          true  "Book ID"
// @Param        book  body      models.Book  true  "Updated book data"
// @Success      200   {object}  models.Book
// @Failure      400   {object}  models.ErrorResponse
// @Failure      404   {object}  models.ErrorResponse
// @Router       /books/{id} [put]
func UpdateBook(c *gin.Context) {
	var book models.Book
	if err := database.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Book not found"})
		return
	}
	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, models.ErrorResponse{Error: err.Error()})
		return
	}
	database.DB.Model(&book).Updates(input)
	c.JSON(http.StatusOK, book)
}

// DeleteBook godoc
// @Summary      Delete a book
// @Description  Remove a book by ID
// @Tags         books
// @Produce      json
// @Param        id   path      int  true  "Book ID"
// @Success      200  {object}  models.MessageResponse
// @Failure      404  {object}  models.ErrorResponse
// @Router       /books/{id} [delete]
func DeleteBook(c *gin.Context) {
	var book models.Book
	if err := database.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, models.ErrorResponse{Error: "Book not found"})
		return
	}
	database.DB.Delete(&book)
	c.JSON(http.StatusOK, models.MessageResponse{Message: "Book deleted"})
}
