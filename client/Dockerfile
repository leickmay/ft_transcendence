FROM debian:buster

WORKDIR /app

EXPOSE 80
EXPOSE 443

RUN apt-get -y update \
&& apt-get -y upgrade \
&& apt-get -y install curl

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - && apt-get install -y nodejs

COPY package.json ./
COPY package-lock.json ./
RUN npm install

CMD ["npm", "start"]
