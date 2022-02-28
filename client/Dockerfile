FROM debian:buster

RUN apt-get update \
&& apt-get -y upgrade \
&& apt-get -y install git curl wget zsh \
&& sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
&& apt-get install -y nodejs

COPY ./tools /tools

RUN mv /tools/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh \
&& chmod +x /usr/local/bin/docker-entrypoint.sh \
&& rm -rf /tools
ENTRYPOINT ["docker-entrypoint.sh"]
