package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// WhiteboardHandler handles whiteboard requests
type WhiteboardHandler struct {
	service *service.WhiteboardService
}

// NewWhiteboardHandler creates a new whiteboard handler
func NewWhiteboardHandler(service *service.WhiteboardService) *WhiteboardHandler {
	return &WhiteboardHandler{service: service}
}

// GetOrCreateWhiteboard gets or creates whiteboard for a session
// GET /api/v1/sessions/:id/whiteboard
func (h *WhiteboardHandler) GetOrCreateWhiteboard(c *gin.Context) {
	sessionID := c.Param("id")
	sessionIDUint, err := strconv.ParseUint(sessionID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	response, err := h.service.GetOrCreateWhiteboard(uint(sessionIDUint))
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Failed to get whiteboard", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Whiteboard retrieved successfully", response)
}

// SaveDrawing saves drawing data to whiteboard
// POST /api/v1/sessions/:id/whiteboard/save
func (h *WhiteboardHandler) SaveDrawing(c *gin.Context) {
	sessionID := c.Param("id")
	sessionIDUint, err := strconv.ParseUint(sessionID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	var req map[string]interface{}
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	// Convert request to JSONMap
	drawingData := make(map[string]interface{})
	for k, v := range req {
		drawingData[k] = v
	}

	response, err := h.service.SaveDrawing(uint(sessionIDUint), drawingData)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Failed to save drawing", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Drawing saved successfully", response)
}

// ClearWhiteboard clears all drawing data
// POST /api/v1/sessions/:id/whiteboard/clear
func (h *WhiteboardHandler) ClearWhiteboard(c *gin.Context) {
	sessionID := c.Param("id")
	sessionIDUint, err := strconv.ParseUint(sessionID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	if err := h.service.ClearWhiteboard(uint(sessionIDUint)); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Failed to clear whiteboard", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Whiteboard cleared successfully", nil)
}

// DeleteWhiteboard deletes a whiteboard
// DELETE /api/v1/sessions/:id/whiteboard
func (h *WhiteboardHandler) DeleteWhiteboard(c *gin.Context) {
	sessionID := c.Param("id")
	sessionIDUint, err := strconv.ParseUint(sessionID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	if err := h.service.DeleteWhiteboard(uint(sessionIDUint)); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Failed to delete whiteboard", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Whiteboard deleted successfully", nil)
}

// GetWhiteboard gets whiteboard for a session
// GET /api/v1/sessions/:id/whiteboard/data
func (h *WhiteboardHandler) GetWhiteboard(c *gin.Context) {
	sessionID := c.Param("id")
	sessionIDUint, err := strconv.ParseUint(sessionID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid session ID", err)
		return
	}

	response, err := h.service.GetWhiteboard(uint(sessionIDUint))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Whiteboard not found", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Whiteboard retrieved successfully", response)
}
