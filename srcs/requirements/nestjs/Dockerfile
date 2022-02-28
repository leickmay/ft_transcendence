FROM debian:buster

RUN apt-get update \
&& apt-get -y upgrade \
&& apt-get -y install git curl wget zsh procps \
&& sh -c "$(wget https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh -O -)"

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
&& apt-get install -y nodejs

RUN npm i -g @nestjs/cli

COPY ./tools /tools

RUN mv /tools/entrypoint.sh /usr/local/bin/entrypoint.sh \
&& chmod +x /usr/local/bin/entrypoint.sh \
&& rm -rf /tools
ENTRYPOINT ["entrypoint.sh"]
