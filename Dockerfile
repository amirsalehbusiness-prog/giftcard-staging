
# Simple Dockerfile for Vite React TS app
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps || npm install

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=build /app/dist ./dist
# Use a tiny HTTP server to serve static files
RUN npm i -g serve
EXPOSE 4173
CMD ["serve", "-s", "dist", "-l", "4173"]
