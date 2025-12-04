package service

import (
	"errors"
	"fmt"

	"github.com/timebankingskill/backend/internal/dto"
	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
)

// ReviewService handles review business logic
type ReviewService struct {
	reviewRepo  *repository.ReviewRepository
	sessionRepo *repository.SessionRepository
	userRepo    *repository.UserRepository
}

// NewReviewService creates a new review service
func NewReviewService(
	reviewRepo *repository.ReviewRepository,
	sessionRepo *repository.SessionRepository,
	userRepo *repository.UserRepository,
) *ReviewService {
	return &ReviewService{
		reviewRepo:  reviewRepo,
		sessionRepo: sessionRepo,
		userRepo:    userRepo,
	}
}

// CreateReview creates a new review for a session
func (s *ReviewService) CreateReview(reviewerID uint, req *dto.CreateReviewRequest) (*dto.ReviewResponse, error) {
	// Validate request
	if req.Rating < 1 || req.Rating > 5 {
		return nil, errors.New("rating must be between 1 and 5")
	}

	// Get session
	session, err := s.sessionRepo.GetByID(req.SessionID)
	if err != nil {
		return nil, errors.New("session not found")
	}

	// Verify session is completed
	if session.Status != models.StatusCompleted {
		return nil, errors.New("can only review completed sessions")
	}

	// Determine reviewer role and reviewee
	var reviewType models.ReviewType
	var revieweeID uint

	if session.TeacherID == reviewerID {
		// Teacher reviewing student
		reviewType = models.ReviewTypeStudent
		revieweeID = session.StudentID
	} else if session.StudentID == reviewerID {
		// Student reviewing teacher
		reviewType = models.ReviewTypeTeacher
		revieweeID = session.TeacherID
	} else {
		return nil, errors.New("only session participants can review")
	}

	// Check if review already exists
	existingReview, _ := s.reviewRepo.GetBySessionAndReviewer(req.SessionID, reviewerID)
	if existingReview != nil && existingReview.ID > 0 {
		return nil, errors.New("you have already reviewed this session")
	}

	// Create review
	review := &models.Review{
		SessionID:           req.SessionID,
		ReviewerID:          reviewerID,
		RevieweeID:          revieweeID,
		Type:                reviewType,
		Rating:              req.Rating,
		Comment:             req.Comment,
		Tags:                req.Tags,
		CommunicationRating: req.CommunicationRating,
		PunctualityRating:   req.PunctualityRating,
		KnowledgeRating:     req.KnowledgeRating,
	}

	if err := s.reviewRepo.Create(review); err != nil {
		return nil, fmt.Errorf("failed to create review: %w", err)
	}

	// Reload review with relationships
	review, err = s.reviewRepo.GetByID(review.ID)
	if err != nil {
		return nil, err
	}

	return dto.MapReviewToResponse(review), nil
}

// GetReview gets a specific review by ID
func (s *ReviewService) GetReview(id uint) (*dto.ReviewResponse, error) {
	review, err := s.reviewRepo.GetByID(id)
	if err != nil {
		return nil, fmt.Errorf("failed to get review: %w", err)
	}
	return dto.MapReviewToResponse(review), nil
}

// GetReviewsForUser gets all reviews for a user
func (s *ReviewService) GetReviewsForUser(userID uint, limit, offset int) ([]dto.ReviewResponse, int64, error) {
	// Validate pagination
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	reviews, total, err := s.reviewRepo.GetReviewsForUser(userID, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get reviews: %w", err)
	}

	return dto.MapReviewsToResponse(reviews), total, nil
}

// GetReviewsForUserByType gets reviews for a user filtered by type
func (s *ReviewService) GetReviewsForUserByType(userID uint, reviewType string, limit, offset int) ([]dto.ReviewResponse, int64, error) {
	// Validate pagination
	if limit <= 0 || limit > 100 {
		limit = 10
	}
	if offset < 0 {
		offset = 0
	}

	// Validate review type
	var rType models.ReviewType
	if reviewType == "teacher" {
		rType = models.ReviewTypeTeacher
	} else if reviewType == "student" {
		rType = models.ReviewTypeStudent
	} else {
		return nil, 0, errors.New("invalid review type")
	}

	reviews, total, err := s.reviewRepo.GetReviewsForUserByType(userID, rType, limit, offset)
	if err != nil {
		return nil, 0, fmt.Errorf("failed to get reviews: %w", err)
	}

	return dto.MapReviewsToResponse(reviews), total, nil
}

// GetUserRatingSummary gets rating summary for a user
func (s *ReviewService) GetUserRatingSummary(userID uint) (map[string]interface{}, error) {
	// Get average rating
	avgRating, err := s.reviewRepo.GetAverageRatingForUser(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get average rating: %w", err)
	}

	// Get rating count
	count, err := s.reviewRepo.GetRatingCountForUser(userID)
	if err != nil {
		return nil, fmt.Errorf("failed to get rating count: %w", err)
	}

	// Get reviews by type
	teacherReviews, _, err := s.reviewRepo.GetReviewsForUserByType(userID, models.ReviewTypeTeacher, 1000, 0)
	if err != nil {
		return nil, err
	}

	studentReviews, _, err := s.reviewRepo.GetReviewsForUserByType(userID, models.ReviewTypeStudent, 1000, 0)
	if err != nil {
		return nil, err
	}

	// Calculate average for each type
	avgTeacherRating := calculateAverageRating(teacherReviews)
	avgStudentRating := calculateAverageRating(studentReviews)

	return map[string]interface{}{
		"average_rating":          avgRating,
		"total_reviews":           count,
		"average_teacher_rating":  avgTeacherRating,
		"teacher_review_count":    len(teacherReviews),
		"average_student_rating":  avgStudentRating,
		"student_review_count":    len(studentReviews),
	}, nil
}

// UpdateReview updates a review (only by reviewer or admin)
func (s *ReviewService) UpdateReview(reviewID, userID uint, req *dto.UpdateReviewRequest) (*dto.ReviewResponse, error) {
	// Get review
	review, err := s.reviewRepo.GetByID(reviewID)
	if err != nil {
		return nil, errors.New("review not found")
	}

	// Verify ownership
	if review.ReviewerID != userID {
		return nil, errors.New("you can only edit your own reviews")
	}

	// Update fields
	if req.Rating > 0 {
		if req.Rating < 1 || req.Rating > 5 {
			return nil, errors.New("rating must be between 1 and 5")
		}
		review.Rating = req.Rating
	}

	if req.Comment != "" {
		review.Comment = req.Comment
	}

	if req.Tags != "" {
		review.Tags = req.Tags
	}

	if req.CommunicationRating != nil {
		review.CommunicationRating = req.CommunicationRating
	}

	if req.PunctualityRating != nil {
		review.PunctualityRating = req.PunctualityRating
	}

	if req.KnowledgeRating != nil {
		review.KnowledgeRating = req.KnowledgeRating
	}

	// Save
	if err := s.reviewRepo.Update(review); err != nil {
		return nil, fmt.Errorf("failed to update review: %w", err)
	}

	// Reload
	review, err = s.reviewRepo.GetByID(reviewID)
	if err != nil {
		return nil, err
	}

	return dto.MapReviewToResponse(review), nil
}

// DeleteReview deletes a review (soft delete)
func (s *ReviewService) DeleteReview(reviewID, userID uint) error {
	// Get review
	review, err := s.reviewRepo.GetByID(reviewID)
	if err != nil {
		return errors.New("review not found")
	}

	// Verify ownership
	if review.ReviewerID != userID {
		return errors.New("you can only delete your own reviews")
	}

	// Delete
	return s.reviewRepo.Delete(reviewID)
}

// Helper function to calculate average rating from reviews
func calculateAverageRating(reviews []models.Review) float64 {
	if len(reviews) == 0 {
		return 0
	}

	sum := 0
	for _, review := range reviews {
		sum += review.Rating
	}

	return float64(sum) / float64(len(reviews))
}
