# === FRONTEND (React/Vite) ===
FROM node:18 as frontend
WORKDIR /app
ENV NODE_OPTIONS=--max_old_space_size=256
COPY frontend/ .
RUN npm install && npm run build

# === BACKEND (Flask) ===
FROM python:3.11-slim as backend
WORKDIR /app
COPY backend/ /app

# Install Python dependencies
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

# Add frontend build to static
COPY --from=frontend /app/build ./static

EXPOSE 8000
CMD ["python", "app.py"]
