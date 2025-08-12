# Viewer Backend

This is the backend service for the Viewer application. It is built with Node.js and TypeScript, providing API endpoints and data processing for the frontend viewer.

## Features
- RESTful API server
- SQLite database integration
- Modular processing pipeline
- TypeScript for type safety
- Easily extensible architecture

## Project Structure
```
backend/
├── build/              # Compiled JavaScript output
│   ├── app.js
│   ├── db.js
│   ├── server.js
│   ├── types.js
│   └── process/
│       ├── file.js
│       ├── filter.js
│       ├── index.js
│       └── morph.js
├── data/               # Application data (ignored by git)
│   ├── app.db
│   └── tree.json
├── src/                # TypeScript source code
│   ├── app.ts
│   ├── db.ts
│   ├── server.ts
│   ├── types.ts
│   └── process/
│       ├── file.ts
│       ├── filter.ts
│       ├── index.ts
│       └── morph.ts
│   └── schema/
│       └── schema.sql
├── package.json        # Project metadata and dependencies
├── tsconfig.json       # TypeScript configuration
└── .gitignore          # Git ignore rules
```

## Getting Started

### Prerequisites
- Node.js (v16 or later recommended)
- npm (comes with Node.js)

### Installation
1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

### Development
- Source code is in the `src/` directory.
- To build the project:
  ```sh
  npm run build
  ```
- To start the server (after building):
  ```sh
  npm start
  ```
- For development with auto-reload:
  ```sh
  npm run dev
  ```

### Database
- The backend uses SQLite for data storage.
- The database file is located at `data/app.db`.
- The schema is defined in `src/schema/schema.sql`.

### Scripts
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Start the compiled server
- `npm run dev` — Start the server with auto-reload (requires `nodemon`)
