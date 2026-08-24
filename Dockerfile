# =========================
# Stage 1: Build
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for Docker layer caching
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TanStack Start application
RUN npm run build


# =========================
# Stage 2: Production
# =========================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy the built application
COPY --from=builder /app/.output ./.output

# TanStack Start / Nitro production server
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
