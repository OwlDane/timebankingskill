package dto

import "gorm.io/datatypes"

// DrawingStrokeDTO represents a single drawing stroke
type DrawingStrokeDTO struct {
	ID        string        `json:"id"`
	Type      string        `json:"type"` // "pen", "eraser", "line", "rect", "circle", "text"
	Points    []PointDTO    `json:"points"`
	Color     string        `json:"color"`
	Thickness int           `json:"thickness"`
	Text      string        `json:"text,omitempty"`
	X         float64       `json:"x,omitempty"`
	Y         float64       `json:"y,omitempty"`
	Width     float64       `json:"width,omitempty"`
	Height    float64       `json:"height,omitempty"`
	Timestamp int64         `json:"timestamp"`
}

// PointDTO represents a coordinate point
type PointDTO struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

// SaveWhiteboardRequest represents a request to save whiteboard data
type SaveWhiteboardRequest struct {
	SessionID   uint                `json:"session_id" binding:"required"`
	DrawingData datatypes.JSONMap   `json:"drawing_data" binding:"required"`
}

// WhiteboardResponse represents a whiteboard in API responses
type WhiteboardResponse struct {
	ID          uint                `json:"id"`
	SessionID   uint                `json:"session_id"`
	DrawingData datatypes.JSONMap   `json:"drawing_data"`
	CreatedAt   int64               `json:"created_at"`
	UpdatedAt   int64               `json:"updated_at"`
}

// DrawingEventMessage represents a real-time drawing event via WebSocket
type DrawingEventMessage struct {
	Type   string           `json:"type"` // "draw", "erase", "clear", "undo"
	Stroke DrawingStrokeDTO `json:"stroke,omitempty"`
	UserID uint             `json:"user_id"`
	SessionID uint          `json:"session_id"`
	Timestamp int64         `json:"timestamp"`
}

// ClearWhiteboardRequest represents a request to clear the whiteboard
type ClearWhiteboardRequest struct {
	SessionID uint `json:"session_id" binding:"required"`
}

// ExportWhiteboardRequest represents a request to export whiteboard as image
type ExportWhiteboardRequest struct {
	SessionID uint   `json:"session_id" binding:"required"`
	Format    string `json:"format"` // "png", "svg", "json"
}
