FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
WORKDIR /app/frontend
RUN npm install
RUN npm install react-router-dom

# Set environment variable for API URL
ENV VITE_API_URL=https://parliament-watch-api.fly.dev/api

# Copy source files
WORKDIR /app
COPY . .

# Add PostCSS config if it doesn't exist
RUN [ -f "./frontend/postcss.config.js" ] || echo 'export default { plugins: { tailwindcss: {}, autoprefixer: {}, }, }' > ./frontend/postcss.config.js

# Build the app with Tailwind fully processed
WORKDIR /app/frontend
RUN npm run build

# Use Nginx for production
FROM nginx:alpine

# Copy the built app from the builder stage
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Ensure health check page exists
RUN echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body><p>OK</p></body></html>' > /usr/share/nginx/html/health.html

# Copy custom nginx config with SPA routing support
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O- http://localhost/health.html || exit 1