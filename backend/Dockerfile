FROM python:3.7-alpine
MAINTAINER Pawel Fiolek

# Recommended when running Python within Docker containers.
ENV PYTHONUNBUFFERED 1

# Copy req from our system directory into the docker image.
COPY ./requirements.txt /backend/requirements.txt

# Uses a package manager that comes with Alpine.
# Add a package, update registry before we add it, don't store registry index in our docker file
RUN apk add --update --no-cache postgresql-client

# "--virtual" Sets up alais for our dependencies that we can use to easily remove all those dependencies later
# Must have packages to be able to install postgres client
RUN apk add --update --no-cache --virtual .tmp-build-deps gcc libc-dev postgresql-dev

# Install req using pip into the docker image.
RUN pip install -r /backend/requirements.txt

# Delete unnecessary, temporary req
RUN apk del .tmp-build-deps

# Create directory within our Docker image that we can use to store app source code.
RUN mkdir -p app/backend

# Switch direactory to default
WORKDIR /app/backend

# Copy app folder from our local machine folder to the docker image app folder
COPY . /app/backend

# Create user for running app only
RUN adduser -D user

# Switches to usr that we've just created
# Default: we use root acc which is not recommended
USER user