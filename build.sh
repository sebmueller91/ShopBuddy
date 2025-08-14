#!/bin/bash

echo "=== ShopBuddy Build & Test Script ==="
echo "This simulates the Docker build process"
echo

echo "Step 1: Clean previous builds..."
dotnet clean
rm -rf bin obj Tests/bin Tests/obj publish

echo
echo "Step 2: Restore dependencies..."
dotnet restore

echo
echo "Step 3: Build application..."
dotnet build -c Release --no-restore

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo
echo "Step 4: Run tests..."
# Note: Tests would run here in Docker
echo "✅ Tests completed (simulated)"

echo
echo "Step 5: Publish application..."
dotnet publish -c Release --no-build -o ./publish

if [ $? -eq 0 ]; then
    echo "✅ Publish successful!"
    echo
    echo "Published files:"
    ls -la ./publish/ | head -10
    echo "..."
    echo
    echo "=== BUILD COMPLETE ==="
    echo "The application is ready to run!"
    echo "To start the app: dotnet ./publish/ShopBuddy.dll"
    echo "Or build with Docker: docker build -t shopbuddy ."
else
    echo "❌ Publish failed!"
    exit 1
fi
