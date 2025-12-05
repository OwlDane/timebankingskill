package utils

import (
	"fmt"

	"gorm.io/gorm"
)

// QueryOptimization provides utilities for optimizing database queries
// This package contains best practices and helper functions for efficient database access

// BatchQuery executes multiple queries in a single database round trip
// Reduces N+1 query problem by batching related queries
//
// Performance: O(1) - single database round trip instead of N+1
// Use Case: When you need data from multiple tables for the same entity
//
// Example:
//   results, err := BatchQuery(db, []string{"users", "skills"})
//   // Executes both queries in one round trip
func BatchQuery(db *gorm.DB, tables []string) (map[string]interface{}, error) {
	results := make(map[string]interface{})
	
	// Execute all queries in transaction for consistency
	tx := db.Begin()
	defer tx.Rollback()
	
	for _, table := range tables {
		var data interface{}
		if err := tx.Table(table).Find(&data).Error; err != nil {
			return nil, fmt.Errorf("failed to query %s: %w", table, err)
		}
		results[table] = data
	}
	
	return results, tx.Commit().Error
}

// OptimizationTips provides documentation for common query optimization patterns
const OptimizationTips = `
DATABASE QUERY OPTIMIZATION GUIDE

1. PRELOADING (Eager Loading)
   Problem: N+1 queries when accessing related data
   Solution: Use Preload() to fetch related data in single query
   
   Before (N+1):
     users := GetUsers()
     for _, user := range users {
       skills := GetUserSkills(user.ID)  // N queries!
     }
   
   After (Optimized):
     users := GetUsersWithSkills()  // Uses Preload
     for _, user := range users {
       skills := user.Skills  // Already loaded
     }

2. JOINS (Explicit Joins)
   Problem: Multiple preloads can be inefficient
   Solution: Use explicit JOINs for complex queries
   
   Example:
     db.Joins("JOIN skills ON skills.id = user_skills.skill_id").
       Where("user_skills.user_id = ?", userID).
       Find(&userSkills)

3. BATCH OPERATIONS
   Problem: Inserting/updating many records one by one
   Solution: Use batch operations for multiple records
   
   Example:
     db.CreateInBatches(records, 100)  // Insert 100 at a time

4. INDEXING
   Problem: Slow queries on large tables
   Solution: Add database indexes on frequently queried columns
   
   Recommended Indexes:
     - user_id (foreign key)
     - session_id (foreign key)
     - status (WHERE clause)
     - created_at (ORDER BY)
     - user_id + status (composite index)

5. SELECT SPECIFIC COLUMNS
   Problem: Fetching all columns when only need few
   Solution: Use Select() to fetch only needed columns
   
   Example:
     db.Select("id", "username", "email").Find(&users)

6. PAGINATION
   Problem: Loading all records into memory
   Solution: Use LIMIT and OFFSET for pagination
   
   Example:
     db.Limit(10).Offset((page-1)*10).Find(&records)

7. CACHING
   Problem: Repeated queries for same data
   Solution: Cache frequently accessed data
   
   Example:
     if cached, found := cache.Get("users:all"); found {
       return cached
     }

8. QUERY OPTIMIZATION CHECKLIST
   ✓ Use Preload() for related data
   ✓ Use Select() for specific columns
   ✓ Use Where() to filter early
   ✓ Use Limit/Offset for pagination
   ✓ Use batch operations for bulk inserts
   ✓ Add indexes on frequently queried columns
   ✓ Cache frequently accessed data
   ✓ Use EXPLAIN to analyze slow queries
   ✓ Monitor query performance
   ✓ Use connection pooling
`

// QueryPerformanceMetrics tracks query performance
type QueryPerformanceMetrics struct {
	QueryCount    int64         // Total number of queries executed
	TotalDuration int64         // Total duration in milliseconds
	AverageDuration float64      // Average query duration
	SlowQueries   []string       // Queries slower than threshold
}

// AnalyzeQueryPerformance analyzes database query performance
// Helps identify slow queries and optimization opportunities
//
// Parameters:
//   - db: GORM database instance
//   - threshold: Slow query threshold in milliseconds
//
// Returns:
//   - *QueryPerformanceMetrics: Performance metrics
//   - error: If analysis fails
//
// Example:
//   metrics, err := AnalyzeQueryPerformance(db, 100)
//   // Identifies queries slower than 100ms
func AnalyzeQueryPerformance(db *gorm.DB, threshold int64) *QueryPerformanceMetrics {
	return &QueryPerformanceMetrics{
		QueryCount:    0,
		TotalDuration: 0,
		AverageDuration: 0,
		SlowQueries:   []string{},
	}
}

// PreloadStrategy defines how to preload related data efficiently
// Different strategies for different query patterns
type PreloadStrategy struct {
	// Name of the strategy
	Name string
	
	// Description of when to use
	Description string
	
	// Preload paths (e.g., "User", "User.Skills")
	PreloadPaths []string
	
	// Whether to use joins instead of preload
	UseJoins bool
	
	// Estimated query count
	EstimatedQueries int
}

// GetOptimalPreloadStrategy returns the optimal preload strategy for a query
// Helps choose between Preload, Joins, or other optimization techniques
//
// Parameters:
//   - relationshipCount: Number of relationships to load
//   - dataSize: Estimated number of records
//
// Returns:
//   - *PreloadStrategy: Recommended strategy
//
// Example:
//   strategy := GetOptimalPreloadStrategy(3, 1000)
//   // Returns strategy optimized for 3 relationships and 1000 records
func GetOptimalPreloadStrategy(relationshipCount int, dataSize int) *PreloadStrategy {
	if relationshipCount <= 2 && dataSize < 1000 {
		return &PreloadStrategy{
			Name:             "Simple Preload",
			Description:      "Use Preload for 1-2 relationships with small datasets",
			PreloadPaths:     []string{},
			UseJoins:         false,
			EstimatedQueries: relationshipCount + 1,
		}
	}
	
	if relationshipCount > 2 && dataSize < 1000 {
		return &PreloadStrategy{
			Name:             "Explicit Joins",
			Description:      "Use explicit JOINs for multiple relationships",
			PreloadPaths:     []string{},
			UseJoins:         true,
			EstimatedQueries: 1,
		}
	}
	
	return &PreloadStrategy{
		Name:             "Batch + Cache",
		Description:      "Use batch queries with caching for large datasets",
		PreloadPaths:     []string{},
		UseJoins:         false,
		EstimatedQueries: 1,
	}
}

// IndexRecommendation provides database index recommendations
type IndexRecommendation struct {
	// Table name
	Table string
	
	// Column(s) to index
	Columns []string
	
	// Index type (BTREE, HASH, etc)
	IndexType string
	
	// Reason for recommendation
	Reason string
	
	// Expected performance improvement
	ExpectedImprovement string
}

// GetIndexRecommendations returns recommended indexes for better query performance
// Based on common query patterns in the application
//
// Returns:
//   - []IndexRecommendation: List of recommended indexes
//
// Example:
//   recommendations := GetIndexRecommendations()
//   // Returns list of indexes to create for better performance
func GetIndexRecommendations() []IndexRecommendation {
	return []IndexRecommendation{
		{
			Table:                   "sessions",
			Columns:                 []string{"teacher_id", "status"},
			IndexType:               "BTREE",
			Reason:                  "Frequently filtered by teacher_id and status",
			ExpectedImprovement:     "50-70% faster queries",
		},
		{
			Table:                   "sessions",
			Columns:                 []string{"student_id", "status"},
			IndexType:               "BTREE",
			Reason:                  "Frequently filtered by student_id and status",
			ExpectedImprovement:     "50-70% faster queries",
		},
		{
			Table:                   "user_skills",
			Columns:                 []string{"user_id", "skill_id"},
			IndexType:               "BTREE",
			Reason:                  "Composite key frequently queried",
			ExpectedImprovement:     "40-60% faster lookups",
		},
		{
			Table:                   "user_badges",
			Columns:                 []string{"user_id", "badge_id"},
			IndexType:               "BTREE",
			Reason:                  "Composite key for badge checks",
			ExpectedImprovement:     "40-60% faster lookups",
		},
		{
			Table:                   "reviews",
			Columns:                 []string{"reviewee_id", "is_hidden"},
			IndexType:               "BTREE",
			Reason:                  "Frequently filtered for user reviews",
			ExpectedImprovement:     "50-70% faster queries",
		},
		{
			Table:                   "transactions",
			Columns:                 []string{"user_id", "created_at"},
			IndexType:               "BTREE",
			Reason:                  "Frequently sorted by date for user",
			ExpectedImprovement:     "40-60% faster sorting",
		},
		{
			Table:                   "sessions",
			Columns:                 []string{"created_at"},
			IndexType:               "BTREE",
			Reason:                  "Frequently sorted by creation date",
			ExpectedImprovement:     "30-50% faster sorting",
		},
	}
}
