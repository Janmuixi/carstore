# Use the official Node.js 24 image as the base image
FROM node:24

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Nuxt 3 application
RUN npm run build

# Expose the port the application runs on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "dev"]