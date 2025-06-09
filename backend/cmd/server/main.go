package main

import (
	"context"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/joho/godotenv"
	"github.com/rs/zerolog"
	"github.com/vektah/gqlparser/v2/gqlerror"

	"github.com/motoya-k/tsundoc/internal/infra/ai"
	"github.com/motoya-k/tsundoc/internal/infra/config"
	"github.com/motoya-k/tsundoc/internal/infra/repository"
	graphqlInterface "github.com/motoya-k/tsundoc/internal/interface/graphql"
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
	dbConfig := config.NewDatabaseConfig()
	db, err := config.NewGORMDB(dbConfig)
	if err != nil {
		logger.Fatal().Err(err).Msg("Failed to connect to database")
	}
	defer db.Close()

	// Test database connection
	if err := db.Ping(); err != nil {
		logger.Fatal().Err(err).Msg("Failed to ping database")
	}
	logger.Info().Msg("Database connection established")

	// Setup AI service
	var aiService ai.Service
	openaiAPIKey := os.Getenv("OPENAI_API_KEY")
	if openaiAPIKey != "" {
		aiService = ai.NewOpenAIService(openaiAPIKey)
		logger.Info().Msg("OpenAI service initialized")
	} else {
		logger.Warn().Msg("OPENAI_API_KEY not set, AI features will be disabled")
	}

	// Setup dependencies
	bookRepo := repository.NewBookRepository(db)
	bookUC := bookUseCase.NewUseCase(bookRepo, aiService)

	// Setup GraphQL resolver
	resolver := &graphqlInterface.Resolver{
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
	
	// Add error presenter to show actual errors during development
	srv.SetErrorPresenter(func(ctx context.Context, e error) *gqlerror.Error {
		logger.Error().Err(e).Msg("GraphQL error")
		return graphql.DefaultErrorPresenter(ctx, e)
	})
	
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