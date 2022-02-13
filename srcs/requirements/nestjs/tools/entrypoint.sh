#!/bin/bash

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
    nest start
}

init_project app
npm_install app
start_server app