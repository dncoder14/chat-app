# Deployment Guide

## Production Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=your_production_mongodb_uri
   JWT_SECRET=your_production_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   CLIENT_URL=https://your-frontend-domain.com
   ```

2. **Build Commands**
   ```bash
   npm install
   npm start
   ```

### Frontend Deployment (Vercel/Netlify)

1. **Environment Variables**
   ```env
   VITE_API_BASE_URL=https://your-backend-domain.com/api
   VITE_SOCKET_URL=https://your-backend-domain.com
   ```

2. **Build Commands**
   ```bash
   npm install
   npm run build
   ```

3. **Build Output Directory**: `dist`

### Database Setup (MongoDB Atlas)

1. Create production cluster
2. Configure network access (0.0.0.0/0 for cloud deployment)
3. Create database user with read/write permissions
4. Get connection string and update MONGODB_URI

### Security Checklist

- [ ] Use strong JWT secrets
- [ ] Enable CORS for specific domains only
- [ ] Set up rate limiting
- [ ] Use HTTPS in production
- [ ] Secure MongoDB with authentication
- [ ] Restrict Cloudinary access
- [ ] Set up monitoring and logging

### Performance Optimizations

- [ ] Enable gzip compression
- [ ] Use CDN for static assets
- [ ] Implement Redis for session storage
- [ ] Set up database indexing
- [ ] Enable image optimization in Cloudinary
- [ ] Use connection pooling for MongoDB

## Docker Deployment

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5001:5001"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/chatapp
    depends_on:
      - mongo
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
  
  mongo:
    image: mongo:latest
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```