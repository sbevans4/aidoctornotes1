
#!/bin/bash
# Make deployment scripts executable with error handling

# Exit immediately if a command exits with a non-zero status
set -e

echo "Making deployment scripts executable..."

# Function to make a file executable with error handling
make_executable() {
  local file=$1
  if [ -f "$file" ]; then
    chmod +x "$file" || { echo "❌ Error: Failed to make $file executable"; exit 1; }
    echo "✅ $file is now executable"
  else
    echo "⚠️ Warning: $file not found"
  fi
}

# Make deployment scripts executable
make_executable "deploy.sh"
make_executable "deploy-ftp.sh"
make_executable "server-setup.sh"

# Make sure scripts have correct line endings for Unix systems
find . -name "*.sh" -type f -exec sed -i 's/\r$//' {} \;

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
