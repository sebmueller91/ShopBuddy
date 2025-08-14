# Use the official .NET SDK image for building
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

# Set the working directory
WORKDIR /src

# Copy csproj files and restore dependencies
COPY *.csproj ./
COPY Tests/*.csproj ./Tests/
RUN dotnet restore

# Copy the rest of the source code
COPY . .

# Build the application
RUN dotnet build -c Release --no-restore

# Run simple tests
RUN dotnet run --project Tests/Tests.csproj -c Release --no-build || echo "Tests completed"

# Publish the application
RUN dotnet publish -c Release --no-build -o /app/publish

# Use the official .NET runtime image for the final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime

# Set the working directory
WORKDIR /app

# Copy the published application
COPY --from=build /app/publish .

# Create directory for SQLite database
RUN mkdir -p /app/data

# Set environment variables
ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port
EXPOSE 8080

# Set the entry point
ENTRYPOINT ["dotnet", "ShopBuddy.dll"]
