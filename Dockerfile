
FROM node:8-alpine

ENV PGHOST=postgis
ENV PGUSER=postgis
ENV PGPASSWORD=postgis
ENV PGDATABASE=gis
ENV DATA_DIR=/var/lib/postgis-integration

RUN apk add --no-cache --virtual .fetch-deps \
	postgresql-client \
	zip \
	p7zip \
 && apk add --no-cache --virtual .build-deps-testing \
	--repository http://dl-cdn.alpinelinux.org/alpine/edge/testing \
	gdal \
	proj4 \
 && ln -s /usr/lib/libproj.so.15 /usr/lib/libproj.so

COPY --chown=node:node . /opt/postgis-integration
WORKDIR /opt/postgis-integration
USER node
RUN npm install

VOLUME /var/lib/postgis-integration
