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
RUN npm install --production

# Simply copy the entire backend directory - simpler approach
COPY backend/ ./

# Copy built frontend from previous stage
COPY --from=frontend-builder /app/frontend/dist ./public

# Expose the port
EXPOSE 8080

# Set port environment variable
ENV PORT=8080

# Create a temporary scheduler.js to avoid import errors
RUN mkdir -p src/services
RUN echo 'module.exports = { initScheduledJobs: () => { console.log("Scheduler disabled in production deployment"); } };' > src/services/scheduler.js

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# Start the application
CMD ["node", "src/server.js"]