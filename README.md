# Parliament Watch 🏛️

A web application that visualizes Canadian parliamentary data from OpenParliament.ca, featuring bills, votes, and member information.

## Features

- **Bill Tracking**: Browse and search bills by session, number, or content
- **Vote Visualization**: View voting results and patterns
- **Member Profiles**: Explore MP information and voting history
- **Data Caching**: Smart caching to reduce API load and improve performance

## Technology Stack

- **Frontend**: React, TailwindCSS, Vite
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Deployment**: Docker, Fly.io

## Architecture

The application follows a three-tier architecture:

1. **React Frontend** - User interface built with React and TailwindCSS
2. **Express Backend** - RESTful API that proxies and caches data from OpenParliament.ca
3. **MongoDB Database** - Stores cached data with TTL indexes for automatic expiration

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- Docker and Docker Compose (optional)

### Environment Setup

Create `.env` files for both frontend and backend:

**Frontend (.env in frontend folder)**
```
VITE_API_URL=http://localhost:5000/api
```

**Backend (.env in backend folder)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/parliament-watch
NODE_ENV=development
```

### Running with Docker Compose

The easiest way to run the entire stack:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Running Locally

**Backend**
```bash
cd backend
npm install
npm run dev
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
```

## API Documentation

### Bills API

- `GET /api/bills` - List bills with optional filtering
- `GET /api/bills/:session/:billNumber` - Get details for a specific bill

### Votes API

- `GET /api/votes` - List votes with optional filtering
- `GET /api/votes/:session/:voteNumber` - Get details for a specific vote

### Members API

- `GET /api/members` - List MPs with optional filtering
- `GET /api/members/:memberName` - Get details for a specific MP
- `GET /api/members/:memberName/votes` - Get voting history for a specific MP

## Deployment

This application is configured for deployment on Fly.io:

```bash
# Deploy backend
cd backend
fly deploy

# Deploy frontend
cd frontend
fly deploy
```

Alternatively, you can deploy using the Docker setup on any cloud provider that supports Docker containers.

## Acknowledgements

This project uses data from [OpenParliament.ca](https://openparliament.ca/), a service that makes parliamentary information more accessible to Canadians.

## License

MIT