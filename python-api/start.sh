#!/bin/bash

# Install Ollama
echo "Starting installation of Ollama..."
curl -fsSL https://ollama.com/install.sh | bash

# Wait for Ollama to be ready
echo "Waiting for Ollama to start..."
until curl --silent --output /dev/null --fail http://127.0.0.1:11434; do sleep 1; done

# Pull Mistral model
echo "Pulling Mistral model..."
/root/.local/bin/ollama pull mistral

# Start the Python application
echo "Starting main.py..."
python3 main.py
