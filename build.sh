#!/bin/bash

# Force use of Node.js
export ENABLE_BUN=false
export NODE_VERSION=20

echo "=== Build Environment ==="
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

echo "=== Installing Dependencies ==="
rm -rf node_modules package-lock.json
npm install

echo "=== Building Application ==="
./node_modules/.bin/vite build

echo "=== Build Complete ==="