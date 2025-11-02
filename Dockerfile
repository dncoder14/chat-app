# Multi-stage build for production
FROM node:18-alpine AS backend-build
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production
COPY backend/ ./

FROM node:18-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app

# Copy backend
COPY --from=backend-build /app/backend ./backend

# Copy frontend build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

# Install serve for frontend
RUN npm install -g serve

EXPOSE 5001 3000

# Start both services
CMD ["sh", "-c", "cd backend && npm start & serve -s frontend/dist -l 3000"]