
FROM ghcr.io/astral-sh/uv:python3.13-trixie

# Create integration user for runtime
RUN groupadd --gid 1000 integration \
 && useradd --uid 1000 --gid integration --shell /bin/bash --create-home integration

RUN apt-get update \
 && apt-get install -y \
   postgresql-client \
   wget \
   zip \
   p7zip \
   gdal-bin \
&& rm -rf /var/cache/apt/*

RUN mkdir -p /opt/postgis-integration
WORKDIR /opt/postgis-integration

COPY pyproject.toml uv.lock README.md .
COPY datasets/ datasets
COPY helpers/ helpers

RUN mkdir .venv \
 && chown -R integration .venv

ENV DATA_DIR=/opt/postgis-integration/data
RUN mkdir /opt/postgis-integration/data \
 && chown -R integration:integration /opt/postgis-integration/data
VOLUME /opt/postgis-integration/data

USER integration

# Disable development dependencies
ENV UV_NO_DEV=1

# Install dependencies
RUN uv sync --locked





