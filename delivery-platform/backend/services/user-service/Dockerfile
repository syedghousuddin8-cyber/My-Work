FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY ../../shared/package.json ../../shared/

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build shared library
RUN cd ../../shared && npm run build && cd -

# Expose port
EXPOSE 3001

# Start service
CMD ["npm", "run", "dev"]
