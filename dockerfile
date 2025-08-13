# Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Expose the port the app runs on
EXPOSE 5000
# Set the environment variable for the API key at runtime
ENV GOOGLE_API_KEY=${GOOGLE_API_KEY}
# Run the application using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]