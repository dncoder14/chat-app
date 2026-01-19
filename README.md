# Real-Time Chat Application

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-%5E18.0.0-blue)](https://reactjs.org/)

A modern real-time chat application built with React, Node.js, Socket.io, and MongoDB featuring stories, contact management, and dark/light themes.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation--setup)
- [Usage](#usage)
- [API Documentation](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

### Core Chat Features
- Real-time messaging using Socket.io
- Typing indicator (show "typing..." when other user types)
- Online status indicator for contacts
- Messages show sender + timestamp
- Smooth UI + animations

### UI / Theme Features
- Light mode & dark mode toggle
- Orange + White theme colors (clean modern chat UI)
- Loading skeleton animation while data loads
- Responsive UI (desktop & mobile)
- Sidebar (contacts + stories)
- Main chat window + message input
- Story viewer component

### User Features
- Add contacts using phone number lookup
- Block/unblock users option
- Story posting (image/text)
- Stories expire in 24 hours
- User authentication (JWT)

### App Pages / Components
- Login / Register
- Home (Chats List + Stories)
- Chat Screen
- Settings Page (Theme toggle, Blocked users list)
- Profile edit
- Story upload page
- Story viewer modal

## Tech Stack

**Frontend:**
- React 18 + Vite
- Tailwind CSS
- Zustand (State Management)
- Socket.io Client
- React Router DOM
- Lucide React (Icons)

**Backend:**
- Node.js + Express
- Socket.io
- MySQL + Prisma ORM
- JWT Authentication
- Cloudinary (Image Upload)
- bcryptjs (Password Hashing)

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MySQL (local or cloud instance)
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in backend directory:
```env
PORT=5001
DATABASE_URL=mysql://username:password@localhost:3306/chatapp
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLIENT_URL=http://localhost:5173
```

4. Setup database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5001

## Usage

1. **Register/Login**: Create an account or login with existing credentials
2. **Add Contacts**: Use the "+" button to add contacts by phone number
3. **Start Chatting**: Select a contact from the sidebar to start messaging
4. **Create Stories**: Click the story "+" button to create text or image stories
5. **View Stories**: Click on story avatars to view stories
6. **Settings**: Access theme toggle and blocked users management
7. **Profile**: Update your profile picture and view account info

## Features in Detail

### Real-time Messaging
- Instant message delivery using Socket.io
- Typing indicators show when someone is typing
- Online/offline status for all contacts
- Image sharing with preview

### Stories Feature
- Create text or image stories
- Stories automatically expire after 24 hours
- View stories from all your contacts
- Story counter shows number of stories per user

### Contact Management
- Add contacts by phone number
- Block/unblock users
- Search through contacts
- Online status indicators

### Theme System
- Light and dark mode support
- Orange accent color theme
- Smooth transitions between themes
- Persistent theme preference

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/check` - Check authentication status
- `PUT /api/auth/update-profile` - Update user profile

### Messages
- `GET /api/messages/users` - Get user contacts
- `GET /api/messages/:id` - Get messages with specific user
- `POST /api/messages/send/:id` - Send message to user

### Contacts
- `POST /api/contacts/add` - Add new contact
- `GET /api/contacts` - Get user contacts
- `POST /api/contacts/block/:userId` - Block user
- `POST /api/contacts/unblock/:userId` - Unblock user
- `GET /api/contacts/blocked` - Get blocked users

### Stories
- `POST /api/stories` - Create new story
- `GET /api/stories` - Get all stories
- `DELETE /api/stories/:storyId` - Delete story

## Socket Events

### Client to Server
- `typing` - User typing status
- `joinRoom` - Join chat room
- `sendMessage` - Send message
- `storyUpdate` - Story update notification

### Server to Client
- `newMessage` - New message received
- `userTyping` - User typing status
- `userOnline` - User came online
- `userOffline` - User went offline
- `newStory` - New story created

## Project Structure

```
chat-app/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── lib/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── store/
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Contributing

We welcome contributions! Here's how you can contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Socket.io for real-time communication
- Cloudinary for image management
- MongoDB for database solutions
- React and Node.js communities

## Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Review existing issues and discussions
