FROM node:18-alpine

WORKDIR /app

# Install dependencies first to leverage Docker cache
COPY package*.json ./
RUN npm install --production

# Copy the rest of the application
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]
