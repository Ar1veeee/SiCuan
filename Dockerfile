# ===== BUILD STAGE =====
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./
RUN bun install

# Copy source code
COPY src ./src
COPY prisma ./prisma
COPY tsconfig.json ./
COPY .env.production ./ 

# Generate Prisma
RUN bunx prisma generate

# Build project
RUN bun run build

# ===== PRODUCTION STAGE =====
FROM oven/bun:1-slim AS runner
WORKDIR /app

RUN apt-get update && apt-get install -y openssl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs sicuan

# Copy package files
COPY package.json bun.lock ./
RUN bun install --production

# Copy yang dibutuhkan untuk production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/.env.production ./.env.production 

RUN chown -R sicuan:nodejs /app && chmod 755 /app
USER sicuan

RUN export NODE_ENV=production

ENV PORT=8080

EXPOSE 8080
CMD ["bun", "run", "start"]