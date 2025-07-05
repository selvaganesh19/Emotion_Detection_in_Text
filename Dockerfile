FROM node:18 as frontend
WORKDIR /app
ENV NODE_OPTIONS=--max_old_space_size=256
COPY frontend/ .
RUN npm install && npm run build

FROM python:3.11-slim as backend
RUN apt-get update && apt-get install -y build-essential && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY backend/ /app
RUN pip install --upgrade pip \
 && pip install --no-cache-dir --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

COPY --from=frontend /app/build ./static

EXPOSE 8000
CMD ["python", "app.py"]
