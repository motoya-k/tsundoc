package database

import (
	"time"

	"gorm.io/gorm"
)

type Book struct {
	ID        string         `gorm:"primaryKey;type:uuid;default:gen_random_uuid()" json:"id"`
	Title     string         `gorm:"not null" json:"title"`
	Content   string         `gorm:"type:text" json:"content"`
	Tags      []string       `gorm:"type:text[]" json:"tags"`
	UserID    string         `gorm:"not null;index" json:"user_id"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"deleted_at,omitempty"`
}

func (Book) TableName() string {
	return "books"
}