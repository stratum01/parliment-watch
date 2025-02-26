FROM node:20-slim AS builder

WORKDIR /app

# Copy package files for frontend
COPY frontend/package*.json ./
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Ensure health.html exists
RUN mkdir -p public
RUN echo '<!DOCTYPE html><html><head><title>Health Check</title></head><body><p>OK</p></body></html>' > ./public/health.html

# Add index.html if it doesn't exist
RUN [ -f "./index.html" ] || echo '<!DOCTYPE html><html><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><title>Parliament Watch</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>' > ./index.html

# Create a simple test page
RUN echo '<!DOCTYPE html><html><head><title>Parliament Watch</title></head><body><h1>Parliament Watch</h1><p>Server is running correctly</p></body></html>' > ./public/test.html

# Use Nginx for production
FROM nginx:alpine

# Copy the built app
COPY --from=builder /app/public /usr/share/nginx/html

# Add a default index.html if it doesn't exist
RUN echo '<!DOCTYPE html><html><head><title>Parliament Watch</title></head><body><h1>Parliament Watch</h1><p>Welcome to Parliament Watch</p></body></html>' > /usr/share/nginx/html/index.html

# Copy custom nginx config
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
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O- http://localhost/health.html || exit 1