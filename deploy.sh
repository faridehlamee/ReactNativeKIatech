#!/bin/bash

# Kiatech Software Platform - Quick Deployment Script
# Run this script from the project root directory

echo "🚀 Starting Kiatech Software Platform Deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📋 Deployment Options:"
echo "1. Website (Next.js) - Vercel"
echo "2. Backend (Node.js) - Railway"
echo "3. Mobile App - Expo EAS Build"
echo "4. All components"
echo ""
read -p "Choose deployment option (1-4): " choice

case $choice in
    1)
        echo "🌐 Deploying Website to Vercel..."
        cd website
        if ! command -v vercel &> /dev/null; then
            echo "📦 Installing Vercel CLI..."
            npm install -g vercel
        fi
        vercel --prod
        ;;
    2)
        echo "🚀 Deploying Backend to Railway..."
        echo "📝 Please follow these steps:"
        echo "1. Go to https://railway.app"
        echo "2. Connect your GitHub repository"
        echo "3. Select the 'backend' folder"
        echo "4. Add environment variables in Railway dashboard"
        echo "5. Deploy!"
        ;;
    3)
        echo "📱 Building Mobile App..."
        cd mobile/KiatechApp
        if ! command -v eas &> /dev/null; then
            echo "📦 Installing EAS CLI..."
            npm install -g @expo/eas-cli
        fi
        echo "🔨 Building for Android..."
        eas build --platform android
        echo "🔨 Building for iOS..."
        eas build --platform ios
        ;;
    4)
        echo "🚀 Deploying All Components..."
        echo "🌐 Website..."
        cd website
        if ! command -v vercel &> /dev/null; then
            npm install -g vercel
        fi
        vercel --prod
        cd ..
        
        echo "🚀 Backend..."
        echo "Please deploy backend manually to Railway/Heroku"
        
        echo "📱 Mobile App..."
        cd mobile/KiatechApp
        if ! command -v eas &> /dev/null; then
            npm install -g @expo/eas-cli
        fi
        eas build --platform all
        ;;
    *)
        echo "❌ Invalid option. Please run the script again."
        exit 1
        ;;
esac

echo "✅ Deployment process completed!"
echo "📋 Next steps:"
echo "1. Set up your domain and SSL certificates"
echo "2. Configure environment variables"
echo "3. Test all components"
echo "4. Set up monitoring and analytics"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_CHECKLIST.md"
