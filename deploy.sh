
#!/bin/bash
# Deployment script for Hostinger VPS

# Build the project
echo "Building the project..."
npm run build

# Replace with your Hostinger VPS details
SERVER_IP="your_server_ip"
SERVER_USER="root"
SERVER_DEPLOY_PATH="/var/www/html"

# Deploy to server
echo "Deploying to Hostinger VPS..."
scp -r dist/* $SERVER_USER@$SERVER_IP:$SERVER_DEPLOY_PATH

echo "Deployment completed!"
