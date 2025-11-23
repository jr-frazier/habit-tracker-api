# Simple Dockerfile to run the Habit Tracker API locally
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy project files needed for build/runtime
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY env.ts ./
COPY src ./src
COPY migrations ./migrations

# Build TypeScript
RUN npm run build

# Expose the API port
EXPOSE 3000

# Default envs (can be overridden by docker-compose)
ENV NODE_ENV=development \
    APP_STAGE=dev

# Run DB migrations on container start, then start the server via ts-node (ESM)
CMD ["sh", "-c", "npm run db:migrate && node --loader ts-node/esm src/index.ts"]
