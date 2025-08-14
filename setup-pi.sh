#!/bin/bash

# ShopBuddy Raspberry Pi Setup Script
# This script sets up ShopBuddy on your Raspberry Pi

set -e

echo "🍓 ShopBuddy Raspberry Pi Setup"
echo "================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}$1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    
    print_warning "Docker has been installed. Please log out and log back in for group changes to take effect."
    print_warning "Then run this script again."
    exit 1
fi

# Check if user is in docker group
if ! groups $USER | grep -q docker; then
    print_error "User $USER is not in the docker group."
    sudo usermod -aG docker $USER
    print_warning "Added user to docker group. Please log out and log back in, then run this script again."
    exit 1
fi

print_status "Docker is available and user has permissions."

# Get Pi's IP address
PI_IP=$(hostname -I | awk '{print $1}')
print_status "Raspberry Pi IP: $PI_IP"

# Check if ShopBuddy is already running
if docker ps | grep -q shopbuddy; then
    print_warning "ShopBuddy is already running. Stopping existing container..."
    docker stop shopbuddy
    docker rm shopbuddy
fi

# Pull the latest image
print_status "Pulling latest ShopBuddy image..."
docker pull ghcr.io/sebmueller91/shopbuddy:latest

# Run the container
print_status "Starting ShopBuddy container..."
docker run -d \
    --name shopbuddy \
    --restart unless-stopped \
    -p 8080:8080 \
    -v shopbuddy-data:/app/data \
    ghcr.io/sebmueller91/shopbuddy:latest

# Wait a moment for container to start
sleep 5

# Check if container is running
if docker ps | grep -q shopbuddy; then
    print_header "🎉 ShopBuddy is now running!"
    echo ""
    print_status "Access your shopping list at:"
    echo -e "   ${GREEN}http://$PI_IP:8080${NC}"
    echo ""
    print_status "From other devices on your network:"
    echo -e "   ${GREEN}http://$PI_IP:8080${NC}"
    echo ""
    
    print_header "📝 Management Commands:"
    echo "   View logs:     docker logs shopbuddy"
    echo "   Stop service:  docker stop shopbuddy"
    echo "   Start service: docker start shopbuddy"
    echo "   Update image:  docker pull ghcr.io/sebmueller91/shopbuddy:latest && docker stop shopbuddy && docker rm shopbuddy && docker run -d --name shopbuddy --restart unless-stopped -p 8080:8080 -v shopbuddy-data:/app/data ghcr.io/sebmueller91/shopbuddy:latest"
    echo ""
    
    print_header "🔧 Troubleshooting:"
    echo "   If you can't access from other devices, check your Pi's firewall:"
    echo "   sudo ufw allow 8080"
    echo ""
    
    print_status "Setup complete! Enjoy your ShopBuddy! 🛒"
else
    print_error "Failed to start ShopBuddy container. Check logs with: docker logs shopbuddy"
    exit 1
fi
