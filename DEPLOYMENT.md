# Deployment Guide

## Production Deployment

### Backend Deployment (Railway/Heroku/DigitalOcean)

1. **Environment Variables**
   ```env
   NODE_ENV=production
   PORT=5001
   DATABASE_URL=your_production_mysql_uri
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

### Database Setup (MySQL)

1. **PlanetScale** (Recommended):
   - Create free database
   - Get connection string
   - Update DATABASE_URL

2. **Railway MySQL**:
   - Add MySQL service
   - Copy connection string
   - Update DATABASE_URL

3. **Local MySQL**:
   - Install MySQL locally
   - Create database: `CREATE DATABASE chatapp;`
   - Update DATABASE_URL

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

## Alternative Deployment Options

### Railway/Heroku
- Connect GitHub repository
- Set environment variables
- Deploy automatically

### DigitalOcean App Platform
- Import from GitHub
- Configure build settings
- Set environment variables