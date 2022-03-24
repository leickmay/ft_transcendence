FROM debian:buster

WORKDIR /app

EXPOSE 80
EXPOSE 443

RUN apt-get -y update \
&& apt-get -y upgrade \
&& apt-get -y install curl openssl

RUN mkdir /.ssh

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-subj "/C=FR/ST=France/L=Lyon/emailAddress=chervy@student.42lyon.fr/CN=localhost" \
		-keyout /etc/ssl/private/private-key.key \
		-out /etc/ssl/certs/public-certificate.crt

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

RUN npm install --global @nestjs/cli

COPY package.json ./
COPY package-lock.json ./
RUN npm install

CMD ["nest", "start", "--watch", "--preserveWatchOutput"]

