# Use the official Node.js 18 image
FROM node:18.16.0


# Set the time zone
ENV TZ=Europe/Paris

# Set locale to control date format
RUN apt-get update && \
    apt-get install -y locales && \
    locale-gen en_GB.UTF-8

ENV LC_TIME=en_GB.UTF-8


# Set the working directory inside the container
WORKDIR /usr/src/app


# Check if yarn is already installed
RUN command -v yarn --version >/dev/null 2>&1 || {     echo >&2 "Yarn is not installed. Installing...";     npm install -g yarn@1.22.22; }


# Copy package.json and yarn.lock to the working directory
COPY package.json yarn.lock ./

# Install app dependencies
RUN yarn install

# Copy the rest of the application code
COPY . .

# Expose the port on which the React app will run (if needed)
EXPOSE 3006


# Define the command to start the React app
CMD ["yarn", "start"]

