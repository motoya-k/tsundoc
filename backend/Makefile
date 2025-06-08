.PHONY: generate run run-simple build test clean dev watch

# Generate GraphQL and database code
generate:
	go run github.com/sqlc-dev/sqlc/cmd/sqlc@latest generate
	go run github.com/99designs/gqlgen generate

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