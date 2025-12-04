package repository

import (
	"github.com/timebankingskill/backend/internal/models"
	"gorm.io/gorm"
)

// ReviewRepository handles database operations for reviews
type ReviewRepository struct {
	db *gorm.DB
}

// NewReviewRepository creates a new review repository
func NewReviewRepository(db *gorm.DB) *ReviewRepository {
	return &ReviewRepository{db: db}
}

// Create creates a new review
func (r *ReviewRepository) Create(review *models.Review) error {
	return r.db.Create(review).Error
}

// GetByID gets a review by ID
func (r *ReviewRepository) GetByID(id uint) (*models.Review, error) {
	var review models.Review
	err := r.db.Preload("Session").Preload("Reviewer").Preload("Reviewee").First(&review, id).Error
	return &review, err
}

// GetBySessionAndReviewer gets a review for a specific session and reviewer
func (r *ReviewRepository) GetBySessionAndReviewer(sessionID, reviewerID uint) (*models.Review, error) {
	var review models.Review
	err := r.db.Where("session_id = ? AND reviewer_id = ?", sessionID, reviewerID).First(&review).Error
	return &review, err
}

// GetReviewsForUser gets all reviews for a user (as reviewee)
func (r *ReviewRepository) GetReviewsForUser(userID uint, limit, offset int) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	// Count total reviews
	if err := r.db.Model(&models.Review{}).Where("reviewee_id = ? AND is_hidden = ?", userID, false).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated reviews
	err := r.db.Where("reviewee_id = ? AND is_hidden = ?", userID, false).
		Preload("Reviewer").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

// GetReviewsByReviewer gets all reviews written by a user
func (r *ReviewRepository) GetReviewsByReviewer(reviewerID uint, limit, offset int) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	// Count total reviews
	if err := r.db.Model(&models.Review{}).Where("reviewer_id = ?", reviewerID).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated reviews
	err := r.db.Where("reviewer_id = ?", reviewerID).
		Preload("Reviewee").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}

// GetReviewsForSession gets all reviews for a specific session
func (r *ReviewRepository) GetReviewsForSession(sessionID uint) ([]models.Review, error) {
	var reviews []models.Review
	err := r.db.Where("session_id = ?", sessionID).
		Preload("Reviewer").
		Preload("Reviewee").
		Find(&reviews).Error
	return reviews, err
}

// Update updates a review
func (r *ReviewRepository) Update(review *models.Review) error {
	return r.db.Save(review).Error
}

// Delete deletes a review (soft delete)
func (r *ReviewRepository) Delete(id uint) error {
	return r.db.Delete(&models.Review{}, id).Error
}

// GetAverageRatingForUser calculates average rating for a user
func (r *ReviewRepository) GetAverageRatingForUser(userID uint) (float64, error) {
	var avgRating float64
	err := r.db.Model(&models.Review{}).
		Where("reviewee_id = ? AND is_hidden = ?", userID, false).
		Select("COALESCE(AVG(rating), 0)").
		Scan(&avgRating).Error
	return avgRating, err
}

// GetRatingCountForUser gets the count of reviews for a user
func (r *ReviewRepository) GetRatingCountForUser(userID uint) (int64, error) {
	var count int64
	err := r.db.Model(&models.Review{}).
		Where("reviewee_id = ? AND is_hidden = ?", userID, false).
		Count(&count).Error
	return count, err
}

// GetReviewsForUserByType gets reviews for a user filtered by type (teacher/student)
func (r *ReviewRepository) GetReviewsForUserByType(userID uint, reviewType models.ReviewType, limit, offset int) ([]models.Review, int64, error) {
	var reviews []models.Review
	var total int64

	// Count total reviews
	if err := r.db.Model(&models.Review{}).
		Where("reviewee_id = ? AND type = ? AND is_hidden = ?", userID, reviewType, false).
		Count(&total).Error; err != nil {
		return nil, 0, err
	}

	// Get paginated reviews
	err := r.db.Where("reviewee_id = ? AND type = ? AND is_hidden = ?", userID, reviewType, false).
		Preload("Reviewer").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&reviews).Error

	return reviews, total, err
}
