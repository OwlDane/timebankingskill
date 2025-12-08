package repository

import (
	"errors"

	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/datatypes"
	"gorm.io/gorm"
)

// WhiteboardRepository handles data access for whiteboards
type WhiteboardRepository struct {
	db *gorm.DB
}

// NewWhiteboardRepository creates a new whiteboard repository
func NewWhiteboardRepository(db *gorm.DB) *WhiteboardRepository {
	return &WhiteboardRepository{db: db}
}

// Create creates a new whiteboard
func (r *WhiteboardRepository) Create(whiteboard *models.Whiteboard) error {
	if err := r.db.Create(whiteboard).Error; err != nil {
		return err
	}
	return nil
}

// GetBySessionID gets whiteboard by session ID
func (r *WhiteboardRepository) GetBySessionID(sessionID uint) (*models.Whiteboard, error) {
	var whiteboard models.Whiteboard
	if err := r.db.
		Where("session_id = ?", sessionID).
		First(&whiteboard).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("whiteboard not found")
		}
		return nil, err
	}
	return &whiteboard, nil
}

// Update updates whiteboard drawing data
func (r *WhiteboardRepository) Update(sessionID uint, drawingData datatypes.JSONMap) error {
	if err := r.db.
		Model(&models.Whiteboard{}).
		Where("session_id = ?", sessionID).
		Update("drawing_data", drawingData).Error; err != nil {
		return err
	}
	return nil
}

// Delete deletes a whiteboard
func (r *WhiteboardRepository) Delete(sessionID uint) error {
	if err := r.db.Where("session_id = ?", sessionID).Delete(&models.Whiteboard{}).Error; err != nil {
		return err
	}
	return nil
}

// Clear clears drawing data for a whiteboard
func (r *WhiteboardRepository) Clear(sessionID uint) error {
	emptyData := datatypes.JSONMap{}
	if err := r.db.
		Model(&models.Whiteboard{}).
		Where("session_id = ?", sessionID).
		Update("drawing_data", emptyData).Error; err != nil {
		return err
	}
	return nil
}

// GetOrCreate gets existing whiteboard or creates new one
func (r *WhiteboardRepository) GetOrCreate(sessionID uint) (*models.Whiteboard, error) {
	whiteboard, err := r.GetBySessionID(sessionID)
	if err == nil {
		return whiteboard, nil
	}

	// Create new whiteboard if not found
	newWhiteboard := &models.Whiteboard{
		SessionID:   sessionID,
		DrawingData: datatypes.JSONMap{},
	}

	if err := r.Create(newWhiteboard); err != nil {
		return nil, err
	}

	return newWhiteboard, nil
}
