#!/bin/sh

# Wait for PostgreSQL to be ready
until pg_isready -h db -p 5432 -U user; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done



# Run the server
exec pnpm run dev
