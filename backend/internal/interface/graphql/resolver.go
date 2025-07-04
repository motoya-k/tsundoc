package graphql

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

import (
	bookUseCase "github.com/motoya-k/tsundoc/internal/usecase/book"
)

type Resolver struct{
	BookUseCase *bookUseCase.UseCase
}