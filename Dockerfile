# === FRONTEND (React or similar) ===
FROM node:18 as frontend
WORKDIR /app
COPY frontend/ .
RUN npm install && npm run build

# === BACKEND (Flask) ===
FROM python:3.11-slim as backend

# Install OS-level deps
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY backend/ /app

# Install Python deps
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Copy frontend build to Flask static folder
COPY --from=frontend /app/build ./static

# Expose Flask port
EXPOSE 8000

# Run app
CMD ["python", "app.py"]
