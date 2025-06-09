# Build stage
FROM golang:1.23-alpine AS builder

# Install make and git
RUN apk add --no-cache make git

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Skip code generation in Docker build since it's already generated locally
# The generated files are part of the source code copy

# Build the application
RUN make build

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/bin/server .

# Expose port
EXPOSE 8080

# Run the binary
CMD ["./server"]