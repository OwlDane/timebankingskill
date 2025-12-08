package service

import (
	"errors"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
	"gorm.io/datatypes"
)

// WhiteboardService handles whiteboard business logic
type WhiteboardService struct {
	whiteboardRepo *repository.WhiteboardRepository
	sessionRepo    *repository.SessionRepository
}

// NewWhiteboardService creates a new whiteboard service
func NewWhiteboardService(
	whiteboardRepo *repository.WhiteboardRepository,
	sessionRepo *repository.SessionRepository,
) *WhiteboardService {
	return &WhiteboardService{
		whiteboardRepo: whiteboardRepo,
		sessionRepo:    sessionRepo,
	}
}

// GetOrCreateWhiteboard gets or creates whiteboard for a session
func (s *WhiteboardService) GetOrCreateWhiteboard(sessionID uint) (*dto.WhiteboardResponse, error) {
	// Validate session exists
	_, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	whiteboard, err := s.whiteboardRepo.GetOrCreate(sessionID)
	if err != nil {
		return nil, err
	}

	return s.mapToWhiteboardResponse(whiteboard), nil
}

// SaveDrawing saves drawing data to whiteboard
func (s *WhiteboardService) SaveDrawing(sessionID uint, drawingData datatypes.JSONMap) (*dto.WhiteboardResponse, error) {
	// Validate session exists
	_, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Get or create whiteboard
	whiteboard, err := s.whiteboardRepo.GetOrCreate(sessionID)
	if err != nil {
		return nil, err
	}

	// Update drawing data
	if err := s.whiteboardRepo.Update(sessionID, drawingData); err != nil {
		return nil, err
	}

	whiteboard.DrawingData = drawingData
	return s.mapToWhiteboardResponse(whiteboard), nil
}

// ClearWhiteboard clears all drawing data
func (s *WhiteboardService) ClearWhiteboard(sessionID uint) error {
	// Validate session exists
	_, err := s.sessionRepo.GetByID(sessionID)
	if err != nil {
		return errors.New("session not found")
	}

	return s.whiteboardRepo.Clear(sessionID)
}

// DeleteWhiteboard deletes a whiteboard
func (s *WhiteboardService) DeleteWhiteboard(sessionID uint) error {
	return s.whiteboardRepo.Delete(sessionID)
}

// GetWhiteboard gets whiteboard for a session
func (s *WhiteboardService) GetWhiteboard(sessionID uint) (*dto.WhiteboardResponse, error) {
	whiteboard, err := s.whiteboardRepo.GetBySessionID(sessionID)
	if err != nil {
		return nil, err
	}

	return s.mapToWhiteboardResponse(whiteboard), nil
}

// mapToWhiteboardResponse maps a Whiteboard model to response DTO
func (s *WhiteboardService) mapToWhiteboardResponse(whiteboard *models.Whiteboard) *dto.WhiteboardResponse {
	return &dto.WhiteboardResponse{
		ID:          whiteboard.ID,
		SessionID:   whiteboard.SessionID,
		DrawingData: whiteboard.DrawingData,
		CreatedAt:   whiteboard.CreatedAt,
		UpdatedAt:   whiteboard.UpdatedAt,
	}
}
