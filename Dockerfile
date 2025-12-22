# ----------------------------
# Stage 1: Build the Angular App
# ----------------------------
FROM node:20-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy package files first to leverage Docker cache for dependencies
COPY package*.json ./

# Install dependencies using 'npm ci' for a clean, reproducible install
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the Angular application in production mode
RUN npm run build -- --configuration=production

# ----------------------------
# Stage 2: Serve with Nginx
# ----------------------------
FROM nginx:alpine

# Copy the custom Nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove the default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular files from the 'build' stage to the Nginx html directory
COPY --from=build /app/dist/frontend2Do/browser /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
