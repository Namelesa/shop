# Stage 1: Angular build
FROM node:20.12 AS angular
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --force

# Copy the rest of the project files
COPY . .

# Build the Angular project
RUN npm run build

# Stage 2: Serve with Apache
FROM httpd:2.4

# Set working directory
WORKDIR /usr/local/apache2/htdocs

# Copy built Angular files from the first stage
COPY --from=angular /app/dist/shop/browser . 
