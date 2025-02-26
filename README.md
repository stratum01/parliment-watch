# Parliament Watch

A modern web application for tracking and visualizing parliamentary activities, votes, and legislation in Canada.

## Overview

Parliament Watch provides a user-friendly interface to explore parliamentary data, including:

- Recent votes with visualizations
- Bill status tracking
- Member profiles and voting records
- Trending topics in parliament

The application uses data from the OpenParliament.ca API to provide up-to-date information on the activities of the Canadian Parliament.

## Features

- **Overview Dashboard**: View recent votes with detailed breakdowns and visualization
- **Bills Tracking**: Monitor bills at different stages of the legislative process
- **Member Profiles**: Explore MP information and voting histories
- **Search & Filter**: Find specific votes, bills, or members
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS, Recharts
- **Backend**: Node.js with Express
- **Data Visualization**: Recharts, custom visualizations
- **Deployment**: Fly.io

## Getting Started

### Prerequisites

- Node.js 16+ (recommended: Node.js 20)
- npm or yarn
- Fly.io account (for deployment)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/parliament-watch.git
   cd parliament-watch
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development servers:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### Deployment

#### Using Fly.io

1. Install the Fly.io CLI:
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. Log in to Fly.io:
   ```bash
   flyctl auth login
   ```

3. Deploy the application:
   ```bash
   flyctl deploy --strategy immediate
   ```

4. Open your deployed application:
   ```bash
   flyctl open
   ```

## Project Structure

```
parliament-watch/
├── Dockerfile                 # Container configuration
├── fly.toml                   # Fly.io deployment configuration
├── package.json               # Root package with workspace setup
├── frontend/
│   ├── package.json           # Frontend dependencies
│   ├── vite.config.js         # Vite configuration
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Utilities and API client
│   │   └── App.jsx            # Main application component
├── backend/
│   ├── package.json           # Backend dependencies
│   ├── src/
│   │   ├── app.js             # Express application setup
│   │   ├── routes/            # API routes
│   │   ├── services/          # External API integration
│   │   ├── models/            # Data models
│   │   └── mockData.js        # Mock data for development
```

## API Endpoints

- `GET /api/votes` - Get recent votes
- `GET /api/bills` - Get bills information
- `GET /api/bills/:id` - Get specific bill details
- `GET /api/members` - Get list of MPs
- `GET /api/members/:id` - Get specific MP profile
- `GET /api/members/:id/votes` - Get voting history for an MP

## Configuration

### Environment Variables

- `PORT` - Port for the backend server (default: 3000)
- `NODE_ENV` - Environment mode (development/production)
- `OPENPARLIAMENT_API_KEY` - API key for OpenParliament.ca (optional)

## Development Workflow

1. Create feature branches from `main`
2. Submit pull requests for review
3. Merge approved PR's to `main`
4. Automatic deployment via Fly.io

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Data provided by [OpenParliament.ca](https://openparliament.ca/)
- UI components inspired by [shadcn/ui](https://ui.shadcn.com/)
