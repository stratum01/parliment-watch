FROM node:20-slim AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies and React Router
RUN npm install
WORKDIR /app/frontend
RUN npm install
RUN npm install react-router-dom

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

# Copy custom nginx config with spa routing support and CORS headers
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api/openparliament/ { \
        proxy_pass https://api.openparliament.ca/; \
        proxy_set_header Host api.openparliament.ca; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
        proxy_set_header User-Agent "Parliament-Watch/1.0 (jrfchambers@gmail.com)"; \
        proxy_set_header API-Version v1; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost/health.html || exit 1