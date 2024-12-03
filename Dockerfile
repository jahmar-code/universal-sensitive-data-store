FROM node:23-alpine3.19

WORKDIR /app

COPY package.json pnpm-lock.yaml* ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "dev"]