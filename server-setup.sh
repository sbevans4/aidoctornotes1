
#!/bin/bash
# Initial server setup script for production deployment
# Run this script once when setting up a new server
set -e

# Use environment variables or prompt for credentials
if [ -z "$SERVER_IP" ]; then
    read -p "Enter server IP: " SERVER_IP
fi

if [ -z "$SERVER_USER" ]; then
    read -p "Enter server username: " SERVER_USER
fi

echo "Setting up server at $SERVER_IP..."

# Connect to server and run setup commands
ssh $SERVER_USER@$SERVER_IP << 'EOF'
  # Update system packages
  echo "Updating system packages..."
  sudo apt update && sudo apt upgrade -y || { echo "Failed to update packages"; exit 1; }

  # Remove Apache2 if installed
  echo "Removing Apache2 if installed..."
  sudo apt-get purge apache2* -y || echo "No Apache2 installed or couldn't remove it"

  # Install Node.js
  echo "Installing Node.js..."
  if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x -o nodesource_setup.sh || { echo "Failed to download Node.js setup script"; exit 1; }
    sudo bash nodesource_setup.sh
    sudo apt install -y nodejs || { echo "Failed to install Node.js"; exit 1; }
  else
    echo "Node.js is already installed"
  fi
  
  # Verify Node.js and npm installation
  echo "Node.js version:"
  node -v
  echo "npm version:"
  npm -v

  # Install Nginx if not already installed
  echo "Installing Nginx..."
  if ! command -v nginx &> /dev/null; then
    sudo apt install -y nginx || { echo "Failed to install Nginx"; exit 1; }
  else
    echo "Nginx is already installed"
  fi

  # Create web directory if it doesn't exist
  echo "Setting up web directory..."
  sudo mkdir -p /var/www/html
  sudo chown -R $USER:$USER /var/www/html

  # Configure Nginx
  echo "Configuring Nginx..."
  if [ -z "$DOMAIN_NAME" ]; then
    read -p "Enter your domain name (e.g., example.com): " DOMAIN_NAME
  fi
  
  sudo cat > /etc/nginx/sites-available/aidoctornotes << EOL
server {
    listen 80;
    server_name ${DOMAIN_NAME} www.${DOMAIN_NAME};
    root /var/www/html;

    location / {
        try_files \$uri \$uri/ /index.html;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js)\$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000";
    }

    # Security headers
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.gpteng.co https://apis.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; connect-src 'self' https://*.supabase.co; frame-src 'self';" always;
}
EOL

  # Enable the site configuration
  sudo ln -sf /etc/nginx/sites-available/aidoctornotes /etc/nginx/sites-enabled/
  
  # Remove default site if exists
  sudo rm -f /etc/nginx/sites-enabled/default
  
  # Test Nginx configuration
  sudo nginx -t || { echo "Nginx configuration test failed"; exit 1; }

  # Enable Nginx and start it
  echo "Starting Nginx..."
  sudo systemctl enable nginx
  sudo systemctl restart nginx || { echo "Failed to start Nginx"; exit 1; }

  # Install Certbot for HTTPS
  echo "Installing Certbot for HTTPS..."
  sudo apt install -y certbot python3-certbot-nginx || { echo "Failed to install Certbot"; exit 1; }
  
  # Prompt for SSL setup
  read -p "Would you like to set up SSL now? (y/n): " SETUP_SSL
  if [ "$SETUP_SSL" = "y" ]; then
    sudo certbot --nginx -d ${DOMAIN_NAME} -d www.${DOMAIN_NAME} || { echo "Failed to set up SSL certificates"; exit 1; }
    sudo systemctl reload nginx
  fi

  # Set up automatic renewal for SSL certificates
  echo "Setting up automatic SSL certificate renewal..."
  (crontab -l 2>/dev/null; echo "0 3 * * * /usr/bin/certbot renew --quiet") | crontab -

  echo "Server setup completed!"
EOF

echo "Server setup script finished."
