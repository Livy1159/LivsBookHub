# LivsBookHub
Cozy home for current reads, past reads, and fated reads

## Project Structure

This is a full-stack application with:
- **Frontend**: Next.js application (in `/app`)
- **Backend**: Nest.js API with SQL database support (in `/backend`)

## Getting Started

### Frontend (Next.js)
```bash
npm install
npm run dev
```
Frontend runs on `http://localhost:3000`

### Backend (Nest.js)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run start:dev
```
Backend runs on `http://localhost:3001`

See [backend/README.md](./backend/README.md) for detailed backend setup instructions.
