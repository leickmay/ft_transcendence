FROM debian:buster

WORKDIR /app

EXPOSE 80
EXPOSE 443

RUN apt-get -y update \
&& apt-get -y upgrade \
&& apt-get -y install curl

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

COPY ./docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT ["docker-entrypoint.sh"]