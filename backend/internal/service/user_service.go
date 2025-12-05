package service

import (
	"errors"
	"time"

	"github.com/timebankingskill/backend/internal/models"
	"github.com/timebankingskill/backend/internal/repository"
	"github.com/timebankingskill/backend/internal/utils"
	"gorm.io/gorm"
)

type UserService struct {
	userRepo    repository.UserRepositoryInterface
	sessionRepo *repository.SessionRepository
}

func NewUserService(userRepo repository.UserRepositoryInterface) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

// NewUserServiceWithSession creates a new user service with session repository
// Used for calculating teaching/learning hours from completed sessions
func NewUserServiceWithSession(userRepo repository.UserRepositoryInterface, sessionRepo *repository.SessionRepository) *UserService {
	return &UserService{
		userRepo:    userRepo,
		sessionRepo: sessionRepo,
	}
}

// GetUserProfile retrieves user profile by ID
func (s *UserService) GetUserProfile(userID uint) (*models.User, error) {
	return s.userRepo.GetByID(userID)
}

// UpdateUserProfile updates user profile information
func (s *UserService) UpdateUserProfile(userID uint, updates *models.User) error {
	// Get existing user
	existingUser, err := s.userRepo.GetByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return err
	}

	// Update allowed fields
	if updates.FullName != "" {
		existingUser.FullName = updates.FullName
	}
	if updates.Username != "" {
		// Check if username is already taken by another user
		existingByUsername, _ := s.userRepo.GetByUsername(updates.Username)
		if existingByUsername != nil && existingByUsername.ID != userID {
			return errors.New("username already taken")
		}
		existingUser.Username = updates.Username
	}
	if updates.School != "" {
		existingUser.School = updates.School
	}
	if updates.Grade != "" {
		existingUser.Grade = updates.Grade
	}
	if updates.Major != "" {
		existingUser.Major = updates.Major
	}
	if updates.Bio != "" {
		existingUser.Bio = updates.Bio
	}
	if updates.Avatar != "" {
		existingUser.Avatar = updates.Avatar
	}
	if updates.PhoneNumber != "" {
		existingUser.PhoneNumber = updates.PhoneNumber
	}
	if updates.Location != "" {
		existingUser.Location = updates.Location
	}

	return s.userRepo.Update(existingUser)
}

// ChangePassword changes user password
func (s *UserService) ChangePassword(userID uint, oldPassword, newPassword string) error {
	// Get user
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return err
	}

	// Verify old password
	if !utils.CheckPasswordHash(oldPassword, user.Password) {
		return errors.New("invalid current password")
	}

	// Validate new password
	if len(newPassword) < 6 {
		return errors.New("new password must be at least 6 characters")
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(newPassword)
	if err != nil {
		return errors.New("failed to hash new password")
	}

	// Update password
	user.Password = hashedPassword
	return s.userRepo.Update(user)
}

// GetUserStats retrieves user statistics including calculated teaching/learning hours
func (s *UserService) GetUserStats(userID uint) (*UserStats, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	// Calculate teaching and learning hours from completed sessions
	teachingHours := s.calculateTeachingHours(userID)
	learningHours := s.calculateLearningHours(userID)

	// Build stats response
	stats := &UserStats{
		CreditBalance:          int(user.CreditBalance),
		TotalCreditsEarned:     int(user.TotalEarned),
		TotalCreditsSpent:      int(user.TotalSpent),
		TotalSessionsAsTeacher: user.TotalSessionsAsTeacher,
		TotalSessionsAsStudent: user.TotalSessionsAsStudent,
		AverageRatingAsTeacher: user.AverageRatingAsTeacher,
		AverageRatingAsStudent: user.AverageRatingAsStudent,
		TotalTeachingHours:     teachingHours,
		TotalLearningHours:     learningHours,
	}

	return stats, nil
}

// calculateTeachingHours calculates total hours user has taught
// Sums duration of all completed sessions where user is the teacher
// Returns 0.0 if sessionRepo is not initialized (for backward compatibility)
func (s *UserService) calculateTeachingHours(userID uint) float64 {
	// Check if session repository is available
	if s.sessionRepo == nil {
		return 0.0 // Return 0.0 if not initialized
	}

	// Query database for total teaching hours
	totalHours, err := s.sessionRepo.GetTotalTeachingHours(userID)
	if err != nil {
		// Log error but don't fail - return 0.0 as fallback
		return 0.0
	}

	// Return float64 to preserve precision (e.g., 1.5 hours)
	return totalHours
}

// calculateLearningHours calculates total hours user has learned
// Sums duration of all completed sessions where user is the student
// Returns 0.0 if sessionRepo is not initialized (for backward compatibility)
func (s *UserService) calculateLearningHours(userID uint) float64 {
	// Check if session repository is available
	if s.sessionRepo == nil {
		return 0.0 // Return 0.0 if not initialized
	}

	// Query database for total learning hours
	totalHours, err := s.sessionRepo.GetTotalLearningHours(userID)
	if err != nil {
		// Log error but don't fail - return 0.0 as fallback
		return 0.0
	}

	// Return float64 to preserve precision (e.g., 1.5 hours)
	return totalHours
}

// UpdateAvatar updates user avatar
func (s *UserService) UpdateAvatar(userID uint, avatarURL string) error {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("user not found")
		}
		return err
	}

	user.Avatar = avatarURL
	return s.userRepo.Update(user)
}

// GetUserByUsername retrieves user by username (for public profile)
func (s *UserService) GetUserByUsername(username string) (*models.User, error) {
	return s.userRepo.GetByUsername(username)
}

// GetPublicProfile retrieves public user profile (limited fields)
// Shows only non-sensitive information that can be displayed publicly
func (s *UserService) GetPublicProfile(userID uint) (*PublicProfile, error) {
	user, err := s.userRepo.GetByID(userID)
	if err != nil {
		return nil, err
	}

	// Calculate teaching hours from completed sessions
	teachingHours := s.calculateTeachingHours(userID)

	profile := &PublicProfile{
		ID:                     user.ID,
		FullName:              user.FullName,
		Username:              user.Username,
		School:                user.School,
		Grade:                 user.Grade,
		Major:                 user.Major,
		Bio:                   user.Bio,
		Avatar:                user.Avatar,
		Location:              user.Location,
		TotalSessionsAsTeacher: user.TotalSessionsAsTeacher,
		AverageRatingAsTeacher: user.AverageRatingAsTeacher,
		TotalTeachingHours:    teachingHours,
		CreatedAt:             user.CreatedAt,
	}

	return profile, nil
}

// Helper structs for user service responses

type UserStats struct {
	CreditBalance         int     `json:"credit_balance"`
	TotalCreditsEarned   int     `json:"total_credits_earned"`
	TotalCreditsSpent    int     `json:"total_credits_spent"`
	TotalSessionsAsTeacher int     `json:"total_sessions_as_teacher"`
	TotalSessionsAsStudent int     `json:"total_sessions_as_student"`
	AverageRatingAsTeacher float64 `json:"average_rating_as_teacher"`
	AverageRatingAsStudent float64 `json:"average_rating_as_student"`
	TotalTeachingHours   float64 `json:"total_teaching_hours"`
	TotalLearningHours   float64 `json:"total_learning_hours"`
}

type PublicProfile struct {
	ID                    uint    `json:"id"`
	FullName             string  `json:"full_name"`
	Username             string  `json:"username"`
	School               string  `json:"school"`
	Grade                string  `json:"grade"`
	Major                string  `json:"major"`
	Bio                  string  `json:"bio"`
	Avatar               string  `json:"avatar"`
	Location             string  `json:"location"`
	TotalSessionsAsTeacher int     `json:"total_sessions_as_teacher"`
	AverageRatingAsTeacher float64 `json:"average_rating_as_teacher"`
	TotalTeachingHours   float64 `json:"total_teaching_hours"`
	CreatedAt            time.Time `json:"created_at"`
}
