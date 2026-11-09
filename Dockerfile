# Multi-stage production build for TravelCo
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency specifications
COPY package.json package-lock.json* ./

# Install all dependencies
RUN npm install

# Copy source code and static assets
COPY . .

# Build production bundle
RUN npm run build

# Production Runner Image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install tsx globally or production dependencies
COPY package.json ./
RUN npm install --omit=dev && npm install tsx

# Copy built frontend assets and server file
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/assets ./src/assets
COPY --from=builder /app/server.ts ./server.ts

EXPOSE 3000

USER node

CMD ["npx", "tsx", "server.ts"]
