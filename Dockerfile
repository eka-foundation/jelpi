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

# Install production packages
FROM node:13-alpine as installer
# Set directory for all files
WORKDIR /home/node
# Copy over package.json files
COPY package*.json ./
# Install only prod packages
RUN npm ci --only=production

# Build final runtime container
FROM node:13-alpine
# Set environment variables
ENV NODE_ENV=production
# Disable .env file loading
ENV ENV_SILENT=true
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
# Copy over node_modules
COPY --from=installer /home/node/node_modules ./node_modules
# Copy over source code files
COPY . .
# Expose port 3333 to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "./server.js" ]
