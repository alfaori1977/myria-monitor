# Use the official Python image
FROM python:3.8.10

# Set the time zone
ENV TZ=Europe/Paris

# Set locale to control date format
RUN apt-get update &&     apt-get install -y locales &&     locale-gen en_GB.UTF-8

ENV LC_TIME=en_GB.UTF-8


# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy requirements.txt to the working directory
COPY requirements.txt ./

# Install app dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Define the command to start the Flask app
CMD ["python", "app.py"]
