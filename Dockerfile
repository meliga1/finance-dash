FROM node:24-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY tsconfig*.json vite.config.ts index.html postcss.config.js tailwind.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

FROM node:24-alpine AS backend
WORKDIR /app/server
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

FROM node:24-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=backend /app/server/dist ./dist
COPY --from=frontend /app/dist ./dist/public

EXPOSE 3333
CMD ["node", "dist/index.js"]
