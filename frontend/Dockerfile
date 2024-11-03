# Step 1: Build the React app using Node 20 and npm
FROM node:20 AS build
WORKDIR /app

# Copy package.json and install dependencies with npm
COPY package.json package-lock.json ./
RUN npm install

# Copy all project files and build the app
COPY . .
RUN npm run build

# Step 2: Serve the built files using Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Delete the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

# Copy the custom Nginx configuration file
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for serving the app
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
