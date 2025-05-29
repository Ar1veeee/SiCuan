# ===== BUILD STAGE =====
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci

COPY prisma ./prisma
COPY src ./src

RUN npx prisma generate
RUN npm run build
RUN rm -rf src

# ===== PRODUCTION STAGE =====
FROM node:18-alpine AS runner

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 --ingroup nodejs sicuan

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/build ./build
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

RUN chown -R sicuan:nodejs /app && chmod 755 /app

USER sicuan

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

CMD ["npm", "run", "start"]
