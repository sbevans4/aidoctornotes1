
#!/bin/bash
# Deployment script for Hostinger VPS

# Configure your deployment settings
SERVER_IP="your_server_ip"
SERVER_USER="root"
SERVER_DEPLOY_PATH="/var/www/html"
LOCAL_BUILD_PATH="./dist"  # Path to your local build directory

# System updates (only use on first deployment or when system updates are needed)
# Uncomment these lines when you need to update the server
# echo "Updating system packages..."
# ssh $SERVER_USER@$SERVER_IP "sudo apt update && sudo apt upgrade -y"

# Build the project
echo "Building the project..."
npm run build

# Deploy to server
echo "Deploying to Hostinger VPS..."
echo "Uploading from $LOCAL_BUILD_PATH to $SERVER_USER@$SERVER_IP:$SERVER_DEPLOY_PATH"
scp -r $LOCAL_BUILD_PATH/* $SERVER_USER@$SERVER_IP:$SERVER_DEPLOY_PATH

# Restart Nginx after deployment
echo "Restarting Nginx..."
ssh $SERVER_USER@$SERVER_IP "sudo systemctl restart nginx"

echo "Deployment completed!"
