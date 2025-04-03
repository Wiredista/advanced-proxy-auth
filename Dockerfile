FROM oven/bun:latest

# Set the working directory
WORKDIR /app

COPY package.json ./
RUN bun install

COPY . .

ENV NODE_ENV production
RUN bun run --bun build

EXPOSE 3000
CMD ["bun", "run", "."]