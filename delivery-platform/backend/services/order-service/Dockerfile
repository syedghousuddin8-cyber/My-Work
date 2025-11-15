FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build 2>/dev/null || echo "Build step skipped"
EXPOSE 3002
CMD ["npm", "run", "dev"]
