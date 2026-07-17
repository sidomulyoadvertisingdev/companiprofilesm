#!/bin/bash
set -e

echo "Resetting local changes..."
git checkout -- astro.config.mjs

echo "Pulling latest changes..."
git pull origin main

echo "Installing dependencies..."
sudo npm install

echo "Building..."
sudo rm -rf dist .astro
sudo npm run build

echo "Restarting app..."
sudo pm2 restart sidomulyo

echo "Done! Site: https://sidomulyoproject.com"
