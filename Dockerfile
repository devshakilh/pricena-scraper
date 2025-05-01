# Use official Node.js 20 slim image for smaller size
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm@9

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Copy the rest of the project
COPY . .

# Expose port (optional, for local testing)
EXPOSE 5000

# Default command (can be overridden in GitHub Actions)
CMD ["pnpm", "dev"]