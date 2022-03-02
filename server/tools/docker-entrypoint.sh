#!/bin/bash

# root_folder_init ()
# {
# 	chown -R www-data:www-data /var/www/html
# 	chmod -R 755 /var/www/html
# }

ssl_certificate ()
{
	KEY=/var/www/html/$1/secrets/private-key.pem
	CERT=/var/www/html/$1/secrets/public-certificate.pem
	DOMAIN_NAME=localhost

	if [ ! -s "${KEY}" ]
	then
		openssl req \
			-x509 \
			-days 365 \
			-newkey rsa:4096 -nodes -keyout ${KEY} \
			-out ${CERT} \
			-subj "/C=FR/ST=Rhone/L=Lyon/O=42/OU=chervy/CN=$DOMAIN_NAME"
	fi
}

init_project ()
{
	if [ "$(ls -A /var/www/html/$1 | wc -l | sed 's/ //g')" == "0" ]
	then
		cd /var/www/html
		nest new $1 \
			--skip-git \
			--package-manager npm
		cd $1
		npm install --save @nestjs/typeorm typeorm pg
	fi
}

npm_install ()
{
	if [ ! -d "/var/www/html/$1/node_modules" ]
	then
		cd /var/www/html/$1
		npm install
	fi
}

start_server ()
{
	cd /var/www/html/$1
    nest start --watch --preserveWatchOutput
}

#npm_install server
ssl_certificate server
start_server server
