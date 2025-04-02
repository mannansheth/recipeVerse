# Use the official Python image as the base image
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y curl

# Install Ollama
RUN echo "Starting build process..."
RUN curl -fsSL https://ollama.com/install.sh | bash
RUN echo "Ollama installed successfully"
RUN /usr/local/bin/ollama serve &
RUN /usr/local/bin/ollama --version

# Ensure Ollama is available in PATH

# Set the working directory inside the container
WORKDIR /app
ENV PATH="/usr/local/bin:${PATH}"

# Copy the requirements.txt file and install Python dependencies
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your application files into the container
COPY . /app

# Expose necessary ports (Flask: 8080, Ollama: 11434)
EXPOSE 8080 11434

# Environment variables
ENV FLASK_ENV=development
RUN chmod +x /usr/local/bin/ollama


# Start Ollama, pull Mistral model, then start Flask app
CMD python3 main.py

