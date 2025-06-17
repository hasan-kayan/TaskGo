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

/* ────────────────────────────────────────────────────────── *
   GET /books  ─ list with optional filters
 * ────────────────────────────────────────────────────────── */

func GetBooks(c *gin.Context) {
	var books []models.Book
	db := database.DB

	// optional query filters
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

/* ────────────────────────────────────────────────────────── *
   GET /books/:id  ─ fetch by UUID
 * ────────────────────────────────────────────────────────── */

func GetBook(c *gin.Context) {
	id, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "invalid UUID")
		return
	}

	var book models.Book
	if err := database.DB.First(&book, "id = ?", id).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "book not found")
		return
	}

	utils.JSONSuccess(c, http.StatusOK, book)
}

/* ────────────────────────────────────────────────────────── *
   POST /books  ─ create
 * ────────────────────────────────────────────────────────── */

func CreateBook(c *gin.Context) {
	var payload models.Book
	if err := c.ShouldBindJSON(&payload); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	if payload.ID == uuid.Nil {
		payload.ID = uuid.New()
	}

	if err := utils.ValidateBook(&payload); err != nil {
		utils.JSONError(c, http.StatusUnprocessableEntity, err.Error())
		return
	}

	database.DB.Create(&payload)
	utils.JSONSuccess(c, http.StatusCreated, payload)
}

/* ────────────────────────────────────────────────────────── *
   PUT /books/:id  ─ partial update
 * ────────────────────────────────────────────────────────── */

func UpdateBook(c *gin.Context) {
	bookID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "invalid UUID")
		return
	}

	// load current record
	var current models.Book
	if err := database.DB.First(&current, "id = ?", bookID).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "book not found")
		return
	}

	// decode patch payload (all fields optional)
	var patch models.Book
	if err := c.ShouldBindJSON(&patch); err != nil {
		utils.JSONError(c, http.StatusBadRequest, err.Error())
		return
	}

	// apply non-zero fields to the current struct
	database.DB.Model(&current).Updates(patch)

	// validation after merge – required fields must still be set
	if err := utils.ValidateBook(&current); err != nil {
		utils.JSONError(c, http.StatusUnprocessableEntity, err.Error())
		return
	}

	utils.JSONSuccess(c, http.StatusOK, current)
}

/* ────────────────────────────────────────────────────────── *
   DELETE /books/:id
 * ────────────────────────────────────────────────────────── */

func DeleteBook(c *gin.Context) {
	bookID, err := uuid.Parse(c.Param("id"))
	if err != nil {
		utils.JSONError(c, http.StatusBadRequest, "invalid UUID")
		return
	}

	var book models.Book
	if err := database.DB.First(&book, "id = ?", bookID).Error; err != nil {
		utils.JSONError(c, http.StatusNotFound, "book not found")
		return
	}

	database.DB.Delete(&book)
	utils.JSONSuccess(c, http.StatusOK, models.MessageResponse{Message: "book deleted"})
}
