
#!/bin/bash
# Master deployment script with options for different hosting environments

# Function to print usage
print_usage() {
    echo "Usage: $0 [option]"
    echo "Options:"
    echo "  --vps       Deploy to Hostinger VPS (default)"
    echo "  --ftp       Deploy to FTP server"
    echo "  --help      Show this help message"
}

# Parse command line arguments
DEPLOY_MODE="vps"

if [ $# -gt 0 ]; then
    case "$1" in
        --vps)
            DEPLOY_MODE="vps"
            ;;
        --ftp)
            DEPLOY_MODE="ftp"
            ;;
        --help)
            print_usage
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
fi

# Build the project for all deployment modes
echo "Building the project..."
npm run build

# Choose deployment method based on mode
if [ "$DEPLOY_MODE" = "vps" ]; then
    # VPS Deployment
    SERVER_IP="217.15.175.191"
    SERVER_USER="root"
    SERVER_DEPLOY_PATH="/var/www/html"
    LOCAL_BUILD_PATH="./dist"  # Path to your local build directory

    # Deploy to server
    echo "Deploying to Hostinger VPS..."
    echo "Uploading from $LOCAL_BUILD_PATH to $SERVER_USER@$SERVER_IP:$SERVER_DEPLOY_PATH"
    scp -r $LOCAL_BUILD_PATH/* $SERVER_USER@$SERVER_IP:$SERVER_DEPLOY_PATH

    # Restart Nginx after deployment
    echo "Restarting Nginx..."
    ssh $SERVER_USER@$SERVER_IP "sudo systemctl restart nginx"

    echo "VPS Deployment completed!"
elif [ "$DEPLOY_MODE" = "ftp" ]; then
    # FTP Deployment
    echo "Starting FTP deployment..."
    bash ./deploy-ftp.sh
fi
