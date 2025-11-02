# Environment Setup Guide

## Backend Environment Variables

Create a `.env` file in the `backend` directory with the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/chatapp
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/chatapp

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# CORS Configuration
CLIENT_URL=http://localhost:5173
```

## Frontend Environment Variables

Create a `.env` file in the `frontend` directory with the following variables:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:5001/api

# Socket.io Server URL
VITE_SOCKET_URL=http://localhost:5001
```

## Getting Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to your Dashboard
3. Copy the Cloud Name, API Key, and API Secret
4. Add them to your backend `.env` file

## MongoDB Setup

### Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Use `mongodb://localhost:27017/chatapp` as your URI

### MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string and replace username/password
4. Add your IP to whitelist

## Security Notes

- Never commit `.env` files to version control
- Use strong, random JWT secrets in production
- Restrict Cloudinary API access in production
- Use environment-specific MongoDB databases