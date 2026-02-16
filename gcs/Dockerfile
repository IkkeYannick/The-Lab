# Use a lightweight Node.js image
FROM node:18-alpine

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your code
COPY . .

# Set non-sensitive environment variables
ENV GCS_PROJECT_ID=techsync-connect
ENV GCS_CLIENT_EMAIL=josse-dresselaers@techsync-connect.iam.gserviceaccount.com
ENV GCS_BUCKET_NAME=techsync-connect-storage

# Expose port 8080 (or whatever your app listens on)
EXPOSE 8080

# Run the app
CMD ["node", "server.js"]