# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy only package files to install dependencies
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy app source code
COPY . .

# Expose the port your app runs on (default: 3000)
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]
