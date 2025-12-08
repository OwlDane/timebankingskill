package repository

import (
	"errors"

	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// SharedFileRepository handles data access for shared files
type SharedFileRepository struct {
	db *gorm.DB
}

// NewSharedFileRepository creates a new shared file repository
func NewSharedFileRepository(db *gorm.DB) *SharedFileRepository {
	return &SharedFileRepository{db: db}
}

// Create creates a new shared file
func (r *SharedFileRepository) Create(file *models.SharedFile) error {
	if err := r.db.Create(file).Error; err != nil {
		return err
	}
	return nil
}

// GetByID gets a shared file by ID
func (r *SharedFileRepository) GetByID(id uint) (*models.SharedFile, error) {
	var file models.SharedFile
	if err := r.db.
		Preload("Uploader").
		First(&file, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, errors.New("file not found")
		}
		return nil, err
	}
	return &file, nil
}

// GetBySessionID gets all files for a session
func (r *SharedFileRepository) GetBySessionID(sessionID uint) ([]models.SharedFile, error) {
	var files []models.SharedFile
	if err := r.db.
		Where("session_id = ?", sessionID).
		Preload("Uploader").
		Order("created_at DESC").
		Find(&files).Error; err != nil {
		return nil, err
	}
	return files, nil
}

// GetBySessionIDAndUploader gets files uploaded by a specific user in a session
func (r *SharedFileRepository) GetBySessionIDAndUploader(sessionID, uploaderID uint) ([]models.SharedFile, error) {
	var files []models.SharedFile
	if err := r.db.
		Where("session_id = ? AND uploader_id = ?", sessionID, uploaderID).
		Preload("Uploader").
		Order("created_at DESC").
		Find(&files).Error; err != nil {
		return nil, err
	}
	return files, nil
}

// Delete deletes a shared file
func (r *SharedFileRepository) Delete(id uint) error {
	if err := r.db.Delete(&models.SharedFile{}, id).Error; err != nil {
		return err
	}
	return nil
}

// DeleteBySessionID deletes all files for a session
func (r *SharedFileRepository) DeleteBySessionID(sessionID uint) error {
	if err := r.db.Where("session_id = ?", sessionID).Delete(&models.SharedFile{}).Error; err != nil {
		return err
	}
	return nil
}

// GetSessionFileCount gets the count of files in a session
func (r *SharedFileRepository) GetSessionFileCount(sessionID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&models.SharedFile{}).Where("session_id = ?", sessionID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

// GetUserFileCount gets the count of files uploaded by a user
func (r *SharedFileRepository) GetUserFileCount(uploaderID uint) (int64, error) {
	var count int64
	if err := r.db.Model(&models.SharedFile{}).Where("uploader_id = ?", uploaderID).Count(&count).Error; err != nil {
		return 0, err
	}
	return count, nil
}

// GetTotalFileSize gets total file size for a session
func (r *SharedFileRepository) GetTotalFileSize(sessionID uint) (int64, error) {
	var totalSize int64
	if err := r.db.Model(&models.SharedFile{}).
		Where("session_id = ?", sessionID).
		Select("COALESCE(SUM(file_size), 0)").
		Row().
		Scan(&totalSize); err != nil {
		return 0, err
	}
	return totalSize, nil
}
