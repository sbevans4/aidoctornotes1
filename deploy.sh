
#!/bin/bash
# Deployment script for Hostinger VPS

# System updates (only use on first deployment or when system updates are needed)
# Uncomment these lines when you need to update the server
# echo "Updating system packages..."
# ssh $SERVER_USER@$SERVER_IP "sudo apt update && sudo apt upgrade -y"

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

# Restart Nginx after deployment
echo "Restarting Nginx..."
ssh $SERVER_USER@$SERVER_IP "sudo systemctl restart nginx"

echo "Deployment completed!"
