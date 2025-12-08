package handler

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/service"
	"github.com/timebankingskill/backend/internal/utils"
)

// SkillProgressHandler handles skill progress requests
type SkillProgressHandler struct {
	service *service.SkillProgressService
}

// NewSkillProgressHandler creates a new skill progress handler
func NewSkillProgressHandler(service *service.SkillProgressService) *SkillProgressHandler {
	return &SkillProgressHandler{service: service}
}

// GetProgress gets progress for a user's skill
// GET /api/v1/user/skills/:skillId/progress
func (h *SkillProgressHandler) GetProgress(c *gin.Context) {
	userID := c.GetUint("user_id")
	skillID := c.Param("skillId")
	skillIDUint, err := strconv.ParseUint(skillID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	response, err := h.service.GetProgress(userID, uint(skillIDUint))
	if err != nil {
		utils.SendError(c, http.StatusNotFound, "Progress not found", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Progress retrieved successfully", response)
}

// GetUserProgress gets all progress for a user
// GET /api/v1/user/progress/summary
func (h *SkillProgressHandler) GetUserProgress(c *gin.Context) {
	userID := c.GetUint("user_id")

	response, err := h.service.GetUserProgress(userID)
	if err != nil {
		utils.SendError(c, http.StatusInternalServerError, "Failed to get progress summary", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Progress summary retrieved successfully", response)
}

// UpdateProgress updates user's skill progress
// PUT /api/v1/user/skills/:skillId/progress
func (h *SkillProgressHandler) UpdateProgress(c *gin.Context) {
	userID := c.GetUint("user_id")
	skillID := c.Param("skillId")
	skillIDUint, err := strconv.ParseUint(skillID, 10, 32)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid skill ID", err)
		return
	}

	var req dto.UpdateProgressRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendError(c, http.StatusBadRequest, "Invalid request body", err)
		return
	}

	response, err := h.service.UpdateProgress(userID, uint(skillIDUint), &req)
	if err != nil {
		utils.SendError(c, http.StatusBadRequest, "Failed to update progress", err)
		return
	}

	utils.SendSuccess(c, http.StatusOK, "Progress updated successfully", response)
}
