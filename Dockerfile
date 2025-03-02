# Multi-stage build for combined frontend and backend
FROM node:18-slim AS frontend-builder

WORKDIR /app

# Copy frontend package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
WORKDIR /app/frontend
RUN npm install
RUN npm install react-router-dom

# Copy frontend source
WORKDIR /app
COPY . .

# Add PostCSS config if it doesn't exist
RUN [ -f "./frontend/postcss.config.js" ] || echo 'export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }' > ./frontend/postcss.config.js

# Build the frontend
WORKDIR /app/frontend
RUN npm run build

# Backend stage
FROM node:18-slim

WORKDIR /app

# Copy backend package files and install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose the port
EXPOSE 8080

# Set port environment variable
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# Start the application
CMD ["node", "src/server.js"]