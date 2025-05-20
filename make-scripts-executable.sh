
#!/bin/bash
# Make deployment scripts executable with error handling

# Set up error handling
set -e

echo "Making deployment scripts executable..."

# Check if files exist before making them executable
if [ -f "deploy.sh" ]; then
  chmod +x deploy.sh
  echo "✅ deploy.sh is now executable"
else
  echo "⚠️ Warning: deploy.sh not found"
fi

if [ -f "deploy-ftp.sh" ]; then
  chmod +x deploy-ftp.sh
  echo "✅ deploy-ftp.sh is now executable"
else
  echo "⚠️ Warning: deploy-ftp.sh not found"
fi

# Make the server setup script executable
if [ -f "server-setup.sh" ]; then
  chmod +x server-setup.sh
  echo "✅ server-setup.sh is now executable"
else
  echo "⚠️ Warning: server-setup.sh not found"
fi

echo "Script execution completed"

# Validate the scripts are executable
echo "Validating scripts are executable..."
for script in deploy.sh deploy-ftp.sh server-setup.sh; do
  if [ -f "$script" ] && [ -x "$script" ]; then
    echo "✅ $script is properly executable"
  elif [ -f "$script" ]; then
    echo "❌ Error: Failed to make $script executable"
    exit 1
  fi
done

echo "All found deployment scripts are now executable"

