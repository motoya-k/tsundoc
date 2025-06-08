.PHONY: generate run run-simple build test clean dev watch migrate-up migrate-down migrate-create migrate-force

# Database URL (can be overridden with environment variable)
DATABASE_URL ?= postgres://postgres:postgres@localhost:5432/tsundoc?sslmode=disable

# Generate GraphQL code
generate:
	go run github.com/99designs/gqlgen generate

# Database migration commands
migrate-up:
	@echo "Running migrations up..."
	go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path migrations -database "$(DATABASE_URL)" up

migrate-down:
	@echo "Running migrations down..."
	go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path migrations -database "$(DATABASE_URL)" down

migrate-create:
	@echo "Creating new migration: $(NAME)"
	@test -n "$(NAME)" || (echo "Please specify NAME=your_migration_name" && exit 1)
	go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest create -ext sql -dir migrations -seq $(NAME)

migrate-force:
	@echo "Forcing migration version: $(VERSION)"
	@test -n "$(VERSION)" || (echo "Please specify VERSION=migration_version" && exit 1)
	go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path migrations -database "$(DATABASE_URL)" force $(VERSION)

migrate-version:
	@echo "Current migration version:"
	go run -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest -path migrations -database "$(DATABASE_URL)" version

# Run the main server
run:
	go run cmd/server/main.go

# Run the simple server (without GraphQL)
run-simple:
	go run cmd/server/simple.go

# Build the server binary
build:
	go build -o bin/server cmd/server/main.go

# Build the simple server binary
build-simple:
	go build -o bin/server-simple cmd/server/simple.go

# Run tests
test:
	go test ./...

# Clean build artifacts
clean:
	rm -rf bin/

# Development mode: generate and run
dev: generate run

# Setup development environment (run migrations and generate code)
setup: migrate-up generate

# Watch mode with auto-reload (requires air)
watch:
	@command -v air >/dev/null 2>&1 || { echo "Installing air..."; go install github.com/cosmtrek/air@latest; }
	air

# Install dependencies
deps:
	go mod download
	go mod tidy

# Run with specific port
run-port:
	PORT=$(PORT) go run cmd/server/main.go

# Docker commands
docker-build:
	docker build -t tsundoc-backend .

docker-run:
	docker run -p 8080:8080 --env-file .env tsundoc-backend