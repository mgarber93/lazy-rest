#!/usr/bin/env bash

# Step 1: Make the Electron app
npm run make

mkdir -p out/make/unzipped
# Step 2: Unzip the resulting package (assuming a .zip in out/make)
unzip -o out/make/zip/darwin/arm64/*.zip -d out/make/unzipped || { echo "Unzipping failed. Exiting."; exit 1; }

# Step 3: Enter the unzipped folder
cd out/make/unzipped/*

# Step 4: Start the app (if a package.json exists here)
npm run start
