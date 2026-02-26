# Admin Panel

A full-stack web application for browsing, filtering, sorting, and editing PostgreSQL database tables.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Zustand
- **Backend:** Express, TypeScript, PostgreSQL
- **Testing:** Vitest, React Testing Library
- **Deployment:** Docker & Docker Compose

## Features

- Works with any PostgreSQL database (discovers tables in the `public` schema, supports basic column types)
- Type-aware inputs (text, number, boolean, date) based on column type
- Multiple column filtering (case-insensitive search)
- Sortable columns (ascending/descending)
- Pagination
- Inline row editing via modal (respects column constraints)
- Read-only primary/foreign key columns
- Toast notifications for save feedback

## Getting Started

### Option 1: Docker (recommended)

Runs everything (database, server, client) with no additional setup:

```sh
docker compose up -d
```

The client runs at `http://localhost:5173` and proxies API requests to the server at `http://localhost:3000`.

### Option 2: Manual

#### Prerequisites

- Node.js
- Docker & Docker Compose (for the database)

#### Setup

1. Start the database:

```sh
docker compose up -d postgres
```

2. Install dependencies:

```sh
npm install --prefix client
npm install --prefix server
```

3. Create a `server/.env` file pointing at your PostgreSQL database:

```
DB_HOST=localhost
DB_PORT=5433
DB_USER=admin
DB_PASSWORD=password
DB_NAME=admin_panel_dev
```

The values above connect to the bundled Docker database. Replace them to use your own PostgreSQL instance.

4. Start the development servers:

```sh
# Terminal 1 - Backend
npm run dev --prefix server

# Terminal 2 - Frontend
npm run dev --prefix client
```

The client runs at `http://localhost:5173` and proxies API requests to the server at `http://localhost:3000`.

## Scripts

| Command               | Description                     |
| --------------------- | ------------------------------- |
| `npm run test`        | Run all tests (client + server) |
| `npm run test:client` | Run client tests                |
| `npm run test:server` | Run server tests                |
| `npm run lint`        | Lint client and server          |

## Project Structure

```
├── client/                 # React frontend
│   └── src/
│       ├── api/            # API client functions
│       ├── components/     # React components
│       ├── store/          # Zustand state stores
│       ├── types/          # TypeScript types
│       └── utils/          # Formatting utilities
├── server/                 # Express backend
│   └── src/
│       ├── routes/         # API endpoints
│       ├── queries/        # Database queries
│       ├── db.ts           # PostgreSQL connection
│       ├── types/          # TypeScript types
│       └── utils/          # Error handling
└── docker/                 # Docker & DB init scripts
```

## API

| Method | Endpoint                  | Description                                                |
| ------ | ------------------------- | ---------------------------------------------------------- |
| GET    | `/api/tables`             | List all database tables                                   |
| GET    | `/api/tables/:name`       | Fetch table data (supports filtering, sorting, pagination) |
| PUT    | `/api/tables/:name/rows/` | Update a row                                               |

## Roadmap

- Row creation and deletion
- Support for complex column types (JSON, arrays, enums)
- Multi-schema support (beyond `public`)
- Authentication and access control
- Optimistic locking for concurrent edits
- Error boundaries and loading states
