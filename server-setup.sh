
#!/bin/bash
# Initial server setup script for Hostinger VPS
# Run this script once when setting up a new server

# Replace with your Hostinger VPS details
SERVER_IP="your_server_ip"
SERVER_USER="root"

echo "Setting up server at $SERVER_IP..."

# Connect to server and run setup commands
ssh $SERVER_USER@$SERVER_IP << 'EOF'
  # Update system packages
  echo "Updating system packages..."
  sudo apt update
  sudo apt upgrade -y

  # Install Nginx if not already installed
  echo "Installing Nginx..."
  sudo apt install -y nginx

  # Install Node.js if needed for any server-side processing
  echo "Installing Node.js and npm..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs

  # Create web directory if it doesn't exist
  echo "Setting up web directory..."
  sudo mkdir -p /var/www/html
  sudo chown -R $USER:$USER /var/www/html

  # Enable Nginx and start it
  echo "Starting Nginx..."
  sudo systemctl enable nginx
  sudo systemctl start nginx

  echo "Server setup completed!"
EOF

echo "Server setup script finished."
