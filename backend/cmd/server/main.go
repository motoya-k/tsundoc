package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"

	"github.com/motoya-k/tsundoc/internal/infra/config"
	"github.com/motoya-k/tsundoc/internal/infra/repository"
	"github.com/motoya-k/tsundoc/internal/interface/graphql"
	"github.com/motoya-k/tsundoc/internal/interface/graphql/generated"
	bookUseCase "github.com/motoya-k/tsundoc/internal/usecase/book"
)

func main() {
	// Load environment variables
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Setup logger
	zerolog.TimeFieldFormat = zerolog.TimeFormatUnix
	logger := zerolog.New(os.Stdout).With().Timestamp().Logger()

	// Setup database connection
	ctx := context.Background()
	dbConfig := config.NewDatabaseConfig()
	pool, err := config.NewPGXPool(ctx, dbConfig)
	if err != nil {
		logger.Fatal().Err(err).Msg("Failed to connect to database")
	}
	defer pool.Close()

	// Setup dependencies
	bookRepo := repository.NewBookRepository(pool)
	bookUC := bookUseCase.NewUseCase(bookRepo)

	// Setup GraphQL resolver
	resolver := &graphql.Resolver{
		BookUseCase: bookUC,
	}

	// Setup router
	r := chi.NewRouter()
	
	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "https://tsundoc.app"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Firebase Auth middleware (commented out for now)
	// r.Use(authMiddleware.FirebaseAuth)

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("OK"))
	})

	// GraphQL endpoint
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))
	
	r.Handle("/graphql", srv)
	r.Handle("/", playground.Handler("GraphQL playground", "/graphql"))

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	logger.Info().Str("port", port).Msg("Starting server")
	if err := http.ListenAndServe(":"+port, r); err != nil {
		logger.Fatal().Err(err).Msg("Server failed to start")
	}
}