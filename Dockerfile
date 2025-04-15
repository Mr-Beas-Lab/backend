# Build stage
FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage 
FROM node:20-alpine AS production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
RUN apk add --no-cache curl

# Verify file structure
RUN ls -la /usr/src/app/dist/src/

# Use the correct path
CMD ["node", "dist/src/main.js"]