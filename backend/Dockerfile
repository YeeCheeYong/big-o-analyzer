# Use an official Python runtime as a parent image
FROM python:3.9-slim-buster as builder

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

# Set work directory
WORKDIR /backend

# Install system dependencies and Python dependencies
COPY requirements.txt /backend/
RUN pip wheel --no-cache-dir --no-deps --wheel-dir /backend/wheels -r requirements.txt

FROM python:3.9-slim-buster as runner

WORKDIR /backend

# Install system dependencies and Python dependencies
COPY --from=builder /backend/wheels /backend/wheels
COPY --from=builder /backend/requirements.txt .
RUN pip install --no-cache-dir /backend/wheels/* \
    && pip install --no-cache-dir uvicorn

# Copy project
COPY . /backend/

# Expose the port the app runs in
EXPOSE 8000
#ENV PYTHONPATH "/backend"
# Define the command to start the container
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
