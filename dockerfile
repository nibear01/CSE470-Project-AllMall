# Build the frontend
FROM node:20-alpine as frontend-builder
COPY ./client /app
WORKDIR /app
RUN npm install
RUN npm run build

#build the backend
FROM node:20-alpine
COPY ./server /app
WORKDIR /app
RUN npm install
COPY --from=frontend-builder /app/dist /app/public

# Pass environment variables (set them at runtime with docker run -e)
ENV NODE_ENV=production

# Or if you have a .env file, copy it:
# COPY ./server/.env /app/.env

CMD ["node", "server.js"]
