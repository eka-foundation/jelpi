# Build AdonisJS
FROM node:13-alpine as builder
# Set directory for all files
WORKDIR /home/node
# Copy over package.json files
COPY package*.json ./
# Install all packages
RUN npm install
# Copy over source code
COPY . .
# Build frontend assets
RUN npm run build:prod

# Build final runtime container
FROM node:13-alpine
# Set environment variables
ENV NODE_ENV=production
# Disable .env file loading
ENV ENV_SILENT=true
# Make it listen to all traffic (in container)
ENV HOST=0.0.0.0
# Set exposed port to 3333
ENV PORT=3333
# Set app key at start time
ENV APP_KEY=
# Use non-root user
USER node
# Make directory for app to live in
# It's important to set user first or owner will be root
RUN mkdir -p /home/node/app/
# Set working directory
WORKDIR /home/node/app
# Copy over required files from previous steps
# Copy over built files
COPY --from=builder /home/node/public ./public
# Copy over package.json files
COPY package*.json ./
# Install only prod packages
RUN npm ci --only=production
# Copy over source code files
COPY . .
# Expose port 3333 to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "./server.js" ]
