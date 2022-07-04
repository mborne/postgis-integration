
FROM node:16-alpine

ENV PGHOST=postgis
ENV PGUSER=postgis
ENV PGPASSWORD=postgis
ENV PGDATABASE=gis
ENV DATA_DIR=/var/lib/postgis-integration
	
RUN sed -i 's/dl-cdn.alpinelinux.org/uk.alpinelinux.org/g' /etc/apk/repositories \
 && apk add --no-cache --virtual .fetch-deps \
	postgresql14-client \
	wget curl \
	zip \
	p7zip \
	gdal-tools

# && ln -s /usr/lib/libproj.so.25 /usr/lib/libproj.so

RUN mkdir /var/lib/postgis-integration && chmod 777 /var/lib/postgis-integration
VOLUME /var/lib/postgis-integration

COPY --chown=node:node . /opt/postgis-integration
WORKDIR /opt/postgis-integration
USER node
RUN npm install




