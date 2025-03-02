# backend/Dockerfile
FROM node:18-slim

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy app source
COPY . .

# Expose the correct port (must match fly.toml)
EXPOSE 8080

# Set the environment variable for the port
ENV PORT=8080

# Define health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

# Start the application
CMD ["node", "src/server.js"]
