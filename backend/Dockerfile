FROM python:3.12-slim

WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:latest /uv /usr/local/bin/uv

COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --extra prod

COPY src/ ./src/

EXPOSE 8080

CMD ["uv", "run", "gunicorn", "src.server:app", "--bind", "0.0.0.0:8080", "--workers", "2","--timeout", "300",]