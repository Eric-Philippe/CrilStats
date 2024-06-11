# Start with the Postgres image
FROM postgres:latest

# Environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=crilstats

# Copy the schema.sql file into the image
COPY ./schema.sql /docker-entrypoint-initdb.d/schema.sql
