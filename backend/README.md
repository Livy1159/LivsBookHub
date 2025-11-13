# LivsBookHub Backend

Nest.js backend API for LivsBookHub application with SQL database support.

## Features

- Nest.js framework
- TypeORM for database management
- Support for PostgreSQL and MySQL
- RESTful API endpoints
- CORS enabled for frontend connection
- Environment-based configuration

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL or MySQL database

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your database credentials:
```env
DB_TYPE=postgres  # or 'mysql'
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_NAME=livsbookhub
```

## Running the Application

### Development
```bash
npm run start:dev
```

The server will start on `http://localhost:3001` (or the port specified in `.env`).

### Production
```bash
npm run build
npm run start:prod
```

## API Endpoints

### Health Check
- `GET /` - Welcome message
- `GET /health` - Health check endpoint

### Books
- `GET /books` - Get all books (optional query: `?status=currently-reading`)
- `GET /books/:id` - Get a specific book
- `POST /books` - Create a new book
- `PUT /books/:id` - Update a book
- `DELETE /books/:id` - Delete a book

## Database Setup

### PostgreSQL
```bash
createdb livsbookhub
```

### MySQL
```sql
CREATE DATABASE livsbookhub;
```

The application will automatically create tables based on the entities when `DB_SYNCHRONIZE=true` (development only).

## Project Structure

```
backend/
├── src/
│   ├── app.module.ts       # Root module
│   ├── app.controller.ts   # Root controller
│   ├── app.service.ts      # Root service
│   ├── main.ts             # Application entry point
│   ├── database/           # Database configuration
│   └── books/              # Books feature module
│       ├── entities/       # TypeORM entities
│       ├── books.controller.ts
│       ├── books.service.ts
│       └── books.module.ts
├── .env.example            # Environment variables template
└── package.json
```

