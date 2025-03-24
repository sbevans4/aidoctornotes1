
#!/bin/bash
# Deployment script for FTP

# Configuration variables
FTP_HOST="your-ftp-host.com"
FTP_USER="your-username"
FTP_PASSWORD="your-password"
FTP_DIR="/public_html"  # Remote directory where files should be uploaded
LOCAL_BUILD_PATH="./dist"  # Path to your local build directory

# Check if required commands are available
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed"
    exit 1
fi

if ! command -v lftp &> /dev/null; then
    echo "Error: lftp is not installed. Please install it first:"
    echo "For Ubuntu/Debian: sudo apt-get install lftp"
    echo "For macOS: brew install lftp"
    exit 1
fi

# Build the project
echo "Building the project..."
npm run build

# Check if build was successful
if [ $? -ne 0 ]; then
    echo "Build failed. Aborting deployment."
    exit 1
fi

# Create a temporary script file for lftp
SCRIPT_FILE=$(mktemp)

# Write lftp commands to the temporary script file
cat > "$SCRIPT_FILE" << EOF
open -u $FTP_USER,$FTP_PASSWORD $FTP_HOST
lcd $LOCAL_BUILD_PATH
cd $FTP_DIR
mirror -R --delete-first --parallel=10 --verbose
bye
EOF

# Execute the FTP deployment
echo "Deploying to FTP server $FTP_HOST..."
lftp -f "$SCRIPT_FILE"

# Remove the temporary script file
rm "$SCRIPT_FILE"

# Check if lftp command was successful
if [ $? -eq 0 ]; then
    echo "Deployment completed successfully!"
else
    echo "Deployment failed."
    exit 1
fi
