
#!/bin/bash
# Initial server setup script for Hostinger VPS
# Run this script once when setting up a new server

# Replace with your Hostinger VPS details
SERVER_IP="217.15.175.191"
SERVER_USER="root"

echo "Setting up server at $SERVER_IP..."

# Connect to server and run setup commands
ssh $SERVER_USER@$SERVER_IP << 'EOF'
  # Update system packages
  echo "Updating system packages..."
  sudo apt update
  sudo apt upgrade -y

  # Remove Apache2 if installed
  echo "Removing Apache2 if installed..."
  sudo apt-get purge apache2* -y

  # Install Node.js
  echo "Installing Node.js..."
  curl -sL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh
  sudo bash nodesource_setup.sh
  sudo apt install -y nodejs
  
  # Verify Node.js and npm installation
  echo "Node.js version:"
  node -v
  echo "npm version:"
  npm -v

  # Install Nginx if not already installed
  echo "Installing Nginx..."
  sudo apt install -y nginx

  # Create web directory if it doesn't exist
  echo "Setting up web directory..."
  sudo mkdir -p /var/www/html
  sudo chown -R $USER:$USER /var/www/html

  # Configure Nginx
  echo "Configuring Nginx..."
  sudo cat > /etc/nginx/sites-available/convonotes << 'EOL'
server {
    listen 80;
    server_name 217.15.175.191;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
EOL

  # Enable the site configuration
  sudo ln -sf /etc/nginx/sites-available/convonotes /etc/nginx/sites-enabled/
  
  # Remove default site if exists
  sudo rm -f /etc/nginx/sites-enabled/default
  
  # Test Nginx configuration
  sudo nginx -t

  # Enable Nginx and start it
  echo "Starting Nginx..."
  sudo systemctl enable nginx
  sudo systemctl restart nginx

  echo "Server setup completed!"
EOF

echo "Server setup script finished."
