# Use an official Node.js runtime as the base image
FROM node:18

# Install Playwright system dependencies
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm1 \
    libasound2 \
    libpangocairo-1.0-0 \
    libpango-1.0-0 \
    libcairo2 \
    libcups2 \
    libdrm2 \
    libx11-xcb1 \
    libxshmfence1 \
    libgtk-3-0 \
    libegl1 \
    && apt-get clean

# Set working directory
WORKDIR /opt/render/project/src

# Copy package.json and package-lock.json
COPY package*.json ./

# Install application dependencies
RUN npm install

# Install Playwright browsers and dependencies
RUN npx playwright install --with-deps

# Copy the rest of the application code
COPY . .

# Expose the port 
ENV PORT=10000
EXPOSE 10000

# Start the application
CMD ["node", "server.js"]