FROM nginx:1.13

RUN apt-get update \
    && apt-get install gettext-base \
    && cp /usr/bin/envsubst /usr/local/bin/envsubst \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY . /src

COPY docker/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80