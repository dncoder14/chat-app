#!/bin/bash

echo "🚀 Setting up Chat App..."

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "⚙️ Setting up environment variables..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "✅ Created .env file from example"
    echo "⚠️  Please update the .env file with your actual values:"
    echo "   - MongoDB URI"
    echo "   - JWT Secret"
    echo "   - Cloudinary credentials"
else
    echo "✅ .env file already exists"
fi

# Frontend setup
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update backend/.env with your actual values"
echo "2. Start MongoDB (if using local instance)"
echo "3. Run 'npm run dev' in backend directory"
echo "4. Run 'npm run dev' in frontend directory"
echo ""
echo "🌐 The app will be available at:"
echo "   Frontend: http://localhost:5173"
echo "   Backend:  http://localhost:5001"