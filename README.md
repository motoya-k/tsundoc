# Tsundoc - Your AI-Powered Second Brain

Tsundoc is a knowledge management system that helps you save, organize, and discover AI-generated content and web clippings. Think of it as your personal digital library where information is structured, searchable, and intelligently merged.

## 🚀 Features

- **Instant Save**: Save any text content in under 3 seconds
- **Smart Organization**: Automatic title generation and AI-powered tag recommendations
- **Powerful Search**: Full-text and similarity search across your entire library
- **Book Merging**: Combine related content to reduce duplication
- **Reminder System**: Set reminders by tags or individual books for spaced repetition

## 🏗 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Go, GraphQL (gqlgen), PostgreSQL
- **Authentication**: Firebase Auth
- **AI/ML**: OpenAI Embeddings API
- **Infrastructure**: Docker, pnpm workspace

## 📋 Prerequisites

- Node.js 18+
- Go 1.21+
- pnpm 8+
- PostgreSQL 15+
- Firebase project with Authentication enabled

## 🛠 Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/motoya-k/tsundoc.git
   cd tsundoc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment setup**
   
   Frontend (.env in frontend):
   ```bash
   cp frontend/.env.example frontend/.env
   # Edit with your Firebase and API configuration
   ```
   
   Backend (.env in backend):
   ```bash
   cp backend/.env.example backend/.env
   # Edit with your database and service configuration
   ```

4. **Start development servers**
   ```bash
   # Start both frontend and backend
   pnpm dev
   
   # Or start individually:
   # Frontend (http://localhost:3000)
   cd frontend && pnpm dev
   
   # Backend (http://localhost:8080)
   cd backend && make dev
   ```

## 📂 Project Structure

```
tsundoc/
├── frontend/                # Next.js frontend
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities and GraphQL
│   │   └── styles/         # Global styles
│   └── codegen.ts          # GraphQL code generation config
├── backend/                 # Go backend
│   ├── cmd/server/         # Server entry point
│   ├── internal/           # Internal packages (DDD)
│   │   ├── domain/         # Domain entities
│   │   ├── usecase/        # Business logic
│   │   ├── infra/          # External services
│   │   └── interface/      # GraphQL resolvers
│   └── graphql/schema/     # GraphQL schema files
├── pnpm-workspace.yaml     # Monorepo configuration
└── package.json            # Root package.json
```

## 🔧 Development

### GraphQL Code Generation

Generate TypeScript types from GraphQL schema:
```bash
cd frontend
pnpm codegen
```

Generate Go types and resolvers:
```bash
cd backend
make generate
```

### Running Tests
```bash
pnpm test
```

### Linting
```bash
pnpm lint
```

## 🚢 Deployment

(Coming soon)

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
