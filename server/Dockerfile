FROM node:18

# Install PostgreSQL client
RUN apt-get update && apt-get install -y postgresql-client

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

# Expose the port that the server will use
EXPOSE 2700

# Run initialization script and database migrations
COPY ./src/db/init.sql /docker-entrypoint-initdb.d/
RUN pnpm run db:generate
RUN pnpm run db:migrate

# Start the server
CMD ["pnpm", "run", "dev"]
