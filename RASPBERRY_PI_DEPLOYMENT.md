# 🍓 Raspberry Pi Deployment Guide

This guide helps you deploy ShopBuddy on your Raspberry Pi using the automatically built Docker images.

## Prerequisites

1. **Raspberry Pi with Docker installed**
   ```bash
   # Install Docker if not already installed
   curl -fsSL https://get.docker.com -o get-docker.sh
   sudo sh get-docker.sh
   sudo usermod -aG docker $USER
   # Log out and log back in for group changes to take effect
   ```

2. **GitHub Container Registry Access**
   The images are publicly available, no authentication required for pulling.

## 🚀 Automated Setup (Recommended)

The easiest way to get ShopBuddy running on your Pi:

```bash
# Download and run the setup script
curl -fsSL https://raw.githubusercontent.com/sebmueller91/ShopBuddy/main/setup-pi.sh -o setup-pi.sh
chmod +x setup-pi.sh
./setup-pi.sh
```

This script will:
- ✅ Check if Docker is installed (and install it if needed)
- ✅ Pull the latest ShopBuddy image
- ✅ Start the container with proper configuration
- ✅ Show you the access URL and management commands

## Manual Deployment

### Step 1: Pull the Latest Image
```bash
docker pull ghcr.io/sebmueller91/shopbuddy:latest
```

### Step 2: Run the Container
```bash
docker run -d \
  --name shopbuddy \
  --restart unless-stopped \
  -p 8080:8080 \
  -v shopbuddy-data:/app/data \
  ghcr.io/sebmueller91/shopbuddy:latest
```

### Step 3: Access Your App
- Open your browser and navigate to: `http://YOUR_RASPBERRY_PI_IP:8080`
- Replace `YOUR_RASPBERRY_PI_IP` with your Pi's IP address (find it with `hostname -I`)

## Configuration Options

### Custom Port
To run on a different port (e.g., 3000):
```bash
docker run -d \
  --name shopbuddy \
  --restart unless-stopped \
  -p 3000:8080 \
  -v shopbuddy-data:/app/data \
  ghcr.io/sebmueller91/shopbuddy:latest
```

### With SSL/HTTPS (Using Reverse Proxy)
For production use with SSL, consider using nginx or Traefik as a reverse proxy:
```bash
# Example with nginx-proxy and letsencrypt
docker run -d \
  --name shopbuddy \
  --restart unless-stopped \
  -e VIRTUAL_HOST=shopbuddy.yourdomain.com \
  -e LETSENCRYPT_HOST=shopbuddy.yourdomain.com \
  -e LETSENCRYPT_EMAIL=your@email.com \
  -v shopbuddy-data:/app/data \
  ghcr.io/sebmueller91/shopbuddy:latest
```

## Management Commands

### View Logs
```bash
docker logs shopbuddy
```

### Update to Latest Version
```bash
# Stop and remove old container
docker stop shopbuddy
docker rm shopbuddy

# Pull latest image
docker pull ghcr.io/sebmueller91/shopbuddy:latest

# Run new container (data persists in the volume)
docker run -d \
  --name shopbuddy \
  --restart unless-stopped \
  -p 8080:8080 \
  -v shopbuddy-data:/app/data \
  ghcr.io/sebmueller91/shopbuddy:latest
```

### Backup Data
```bash
# Create backup of your shopping list data
docker run --rm \
  -v shopbuddy-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/shopbuddy-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

### Restore Data
```bash
# Restore from backup
docker run --rm \
  -v shopbuddy-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/shopbuddy-backup-YYYYMMDD-HHMMSS.tar.gz -C /data
```

## Troubleshooting

### Container Won't Start
```bash
# Check container status
docker ps -a

# View detailed logs
docker logs shopbuddy

# Check if port is already in use
sudo netstat -tlnp | grep :8080
```

### Can't Access from Other Devices
1. Check if the Pi's firewall allows the port:
   ```bash
   sudo ufw allow 8080
   ```

2. Ensure the container is bound to all interfaces (0.0.0.0):
   ```bash
   docker port shopbuddy
   ```

### Performance Issues
For older Raspberry Pi models, you might want to limit memory usage:
```bash
docker run -d \
  --name shopbuddy \
  --restart unless-stopped \
  -p 8080:8080 \
  -v shopbuddy-data:/app/data \
  --memory=256m \
  --cpus="1.0" \
  ghcr.io/sebmueller91/shopbuddy:latest
```

## Automatic Updates with Watchtower

To automatically update your container when new versions are published:

```bash
# Install Watchtower
docker run -d \
  --name watchtower \
  --restart unless-stopped \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --schedule "0 2 * * *" \
  --cleanup \
  shopbuddy
```

This will check for updates daily at 2 AM and automatically update your ShopBuddy container.

## Getting Your Pi's IP Address

```bash
# Method 1: hostname command
hostname -I

# Method 2: ip command
ip route get 1.1.1.1 | awk '{print $7}'

# Method 3: ifconfig (if available)
ifconfig | grep -A1 wlan0 | grep inet | awk '{print $2}'
```

## Support

If you encounter issues:
1. Check the [GitHub Issues](https://github.com/sebmueller91/ShopBuddy/issues)
2. View container logs: `docker logs shopbuddy`
3. Verify the image architecture: `docker image inspect ghcr.io/sebmueller91/shopbuddy:latest | grep Architecture`
