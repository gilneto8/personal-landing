#!/bin/bash

set -e

echo "🚀 Deploying personal landing page..."

echo "📦 Installing dependencies..."
npm install

echo "🔨 Building project..."
npm run build

echo "🗑️  Clearing old deployment..."
sudo rm -rf /var/www/landing/*

echo "📁 Copying new build..."
sudo cp -r dist/* /var/www/landing/

echo "✅ Deployment complete!"
