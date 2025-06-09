package config

import (
	"fmt"
	"os"

	"github.com/motoya-k/tsundoc/internal/infra/database"
)

type DatabaseConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

func NewDatabaseConfig() *DatabaseConfig {
	// When running in Docker, use "postgres" as host; otherwise use "localhost"
	defaultHost := "localhost"
	if os.Getenv("DOCKER_ENV") == "true" {
		defaultHost = "postgres"
	}
	
	return &DatabaseConfig{
		Host:     getEnvOrDefault("DB_HOST", defaultHost),
		Port:     getEnvOrDefault("DB_PORT", "5432"),
		User:     getEnvOrDefault("DB_USER", "tsundoc"),
		Password: getEnvOrDefault("DB_PASSWORD", "tsundoc_password"),
		DBName:   getEnvOrDefault("DB_NAME", "tsundoc_db"),
		SSLMode:  getEnvOrDefault("DB_SSLMODE", "disable"),
	}
}

func (dc *DatabaseConfig) DSN() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=%s",
		dc.User, dc.Password, dc.Host, dc.Port, dc.DBName, dc.SSLMode)
}

func NewGORMDB(config *DatabaseConfig) (*database.DB, error) {
	return database.NewConnection(config.DSN())
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}