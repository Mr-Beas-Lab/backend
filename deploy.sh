#!/bin/bash
SERVER="million@206.189.230.7"
APP_DIR="/home/million/remi_backend"

# Build Docker image locally
docker-compose build --no-cache

# Save image to archive
docker save remi_server:latest -o remi_server.tar

# Transfer files
scp remi_server.tar docker-compose.yml .env $SERVER:$APP_DIR/

# Clean up
rm remi_server.tar

# SSH and deploy
ssh $SERVER << EOF
  cd $APP_DIR
  docker load -i remi_server.tar
  docker-compose down
  docker-compose up -d
  docker system prune -f
EOF