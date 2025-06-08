package middleware

import (
	"context"
	"net/http"
	"strings"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/rs/zerolog/log"
)

type contextKey string

const UserIDKey contextKey = "userID"

type AuthMiddleware struct {
	auth *auth.Client
}

func NewAuthMiddleware(app *firebase.App) (*AuthMiddleware, error) {
	authClient, err := app.Auth(context.Background())
	if err != nil {
		return nil, err
	}
	return &AuthMiddleware{auth: authClient}, nil
}

func (m *AuthMiddleware) Middleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			next.ServeHTTP(w, r)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			next.ServeHTTP(w, r)
			return
		}

		token, err := m.auth.VerifyIDToken(r.Context(), tokenString)
		if err != nil {
			log.Error().Err(err).Msg("Failed to verify ID token")
			next.ServeHTTP(w, r)
			return
		}

		ctx := context.WithValue(r.Context(), UserIDKey, token.UID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GetUserID(ctx context.Context) (string, bool) {
	userID, ok := ctx.Value(UserIDKey).(string)
	return userID, ok
}