# Stage 1: build
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# generate prisma client here inside container
RUN npx prisma generate

RUN npm run build

# Stage 2: production
FROM node:20-alpine AS prod

WORKDIR /app

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

CMD ["node", "dist/main.js"]
