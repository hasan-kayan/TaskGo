package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/hasan-kayan/TaskGo/database"
	"github.com/hasan-kayan/TaskGo/models"
)

func GetBooks(c *gin.Context) {
	var books []models.Book
	database.DB.Find(&books)
	c.JSON(http.StatusOK, books)
}

func GetBook(c *gin.Context) {
	var book models.Book
	if err := database.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	c.JSON(http.StatusOK, book)
}

func CreateBook(c *gin.Context) {
	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Create(&input)
	c.JSON(http.StatusCreated, input)
}

func UpdateBook(c *gin.Context) {
	var book models.Book
	if err := database.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	var input models.Book
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	database.DB.Model(&book).Updates(input)
	c.JSON(http.StatusOK, book)
}

func DeleteBook(c *gin.Context) {
	var book models.Book
	if err := database.DB.First(&book, c.Param("id")).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Book not found"})
		return
	}
	database.DB.Delete(&book)
	c.JSON(http.StatusOK, gin.H{"message": "Book deleted"})
}
