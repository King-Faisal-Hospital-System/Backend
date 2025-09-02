# Base image with Node.js
FROM node:22-slim

# Set working directory
WORKDIR /app

# Install system dependencies for Playwright
RUN apt-get update && apt-get install -y \
    libgtk-4-1 \
    libgraphene-1.0-0 \
    libgstgl-1.0-0 \
    libgstcodecparsers-1.0-0 \
    libenchant-2-2 \
    libsecret-1-0 \
    libmanette-0.2-0 \
    libgles2-mesa \
    fonts-liberation \
    wget \
    curl \
    ca-certificates \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install npm dependencies
RUN npm install

# Install Playwright browsers
RUN npx playwright install chromium

# Copy rest of the project
COPY . .

# Expose port (match your Node.js server)
EXPOSE 10000

# Start the server
CMD ["node", "server.js"]
