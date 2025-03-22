#!/bin/bash
# This script deploys our application to a VPS running Ubuntu

# Stop on errors
set -e

# Update system packages
echo "Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker and Docker Compose if not already installed
if ! [ -x "$(command -v docker)" ]; then
  echo "Installing Docker..."
  sudo apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
  echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
  sudo apt-get update
  sudo apt-get install -y docker-ce docker-ce-cli containerd.io
  sudo usermod -aG docker $USER
fi

if ! [ -x "$(command -v docker-compose)" ]; then
  echo "Installing Docker Compose..."
  sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
  sudo chmod +x /usr/local/bin/docker-compose
fi

# Clone or pull the latest code
if [ -d "calculator-app" ]; then
  echo "Updating existing repository..."
  cd calculator-app
  git pull
else
  echo "Cloning repository..."
  git clone https://github.com/jkendall327/react-rust.git calculator-app
  cd calculator-app
fi

# Build and start the containers with docker-compose
echo "Building and starting containers..."
docker-compose build
docker-compose up -d

echo "Deployment complete! The application should be running at http://your-server-ip:3000"