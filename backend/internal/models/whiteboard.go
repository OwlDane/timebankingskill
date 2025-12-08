package models

import "gorm.io/datatypes"

// Whiteboard represents a digital whiteboard for a session
type Whiteboard struct {
	ID          uint            `gorm:"primaryKey" json:"id"`
	SessionID   uint            `json:"session_id"`
	Session     *Session        `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE" json:"session,omitempty"`
	DrawingData datatypes.JSONMap `gorm:"type:jsonb" json:"drawing_data"`
	CreatedAt   int64           `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt   int64           `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

// TableName specifies the table name
func (Whiteboard) TableName() string {
	return "whiteboards"
}

// DrawingStroke represents a single drawing stroke
type DrawingStroke struct {
	ID        string      `json:"id"`
	Type      string      `json:"type"` // "pen", "eraser", "line", "rect", "circle", "text"
	Points    []Point     `json:"points"`
	Color     string      `json:"color"`
	Thickness int         `json:"thickness"`
	Text      string      `json:"text,omitempty"`
	X         float64     `json:"x,omitempty"`
	Y         float64     `json:"y,omitempty"`
	Width     float64     `json:"width,omitempty"`
	Height    float64     `json:"height,omitempty"`
	Timestamp int64       `json:"timestamp"`
}

// Point represents a coordinate point
type Point struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}
