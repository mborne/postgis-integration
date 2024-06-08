
FROM node:20-alpine

RUN apk add --no-cache \
	postgresql16-client \
	wget curl \
	zip \
	p7zip \
	gdal-tools

RUN mkdir -p /opt/postgis-integration
WORKDIR /opt/postgis-integration

COPY package-lock.json package.json .
RUN npm install --omit=dev

COPY bin/ bin
COPY datasets/ datasets
COPY helper/ helper
COPY LICENSE index.js .

RUN mkdir -p /home/node/.npm \
 && chown -R node:node "/home/node/.npm"

ENV DATA_DIR=/opt/postgis-integration/data
RUN mkdir /opt/postgis-integration/data \
 && chown -R node:node /opt/postgis-integration/data
VOLUME /opt/postgis-integration/data

USER node




