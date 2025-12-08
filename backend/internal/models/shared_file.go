package models

import "gorm.io/datatypes"

// SharedFile represents a file shared during a session
type SharedFile struct {
	ID           uint            `gorm:"primaryKey" json:"id"`
	SessionID    uint            `json:"session_id"`
	Session      *Session        `gorm:"foreignKey:SessionID;constraint:OnDelete:CASCADE" json:"session,omitempty"`
	UploaderID   uint            `json:"uploader_id"`
	Uploader     *User           `gorm:"foreignKey:UploaderID;constraint:OnDelete:CASCADE" json:"uploader,omitempty"`
	FileName     string          `json:"file_name"`
	FileSize     int64           `json:"file_size"`
	FileType     string          `json:"file_type"`
	FilePath     string          `json:"file_path"`
	FileURL      string          `json:"file_url"`
	Description  string          `json:"description"`
	IsPublic     bool            `gorm:"default:false" json:"is_public"`
	Metadata     datatypes.JSONMap `gorm:"type:jsonb" json:"metadata,omitempty"`
	CreatedAt    int64           `gorm:"autoCreateTime:milli" json:"created_at"`
	UpdatedAt    int64           `gorm:"autoUpdateTime:milli" json:"updated_at"`
}

// TableName specifies the table name
func (SharedFile) TableName() string {
	return "shared_files"
}
