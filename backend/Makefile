.PHONY: generate run build test clean

generate:
	go run github.com/99designs/gqlgen generate

run:
	go run cmd/server/main.go

build:
	go build -o bin/server cmd/server/main.go

test:
	go test ./...

clean:
	rm -rf bin/

dev: generate run