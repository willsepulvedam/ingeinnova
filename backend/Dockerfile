FROM python:3.12-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY pyproject.toml uv.lock ./

RUN uv export --format requirements-txt -o requirements.txt && \
    uv pip install --system -r requirements.txt


COPY . ./backend

EXPOSE 8000

CMD [ "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]