#!/bin/bash

# root_folder_init ()
# {
# 	chown -R www-data:www-data /var/www/html
# 	chmod -R 755 /var/www/html
# }

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
    npm start
}

npm_install client
start_server client
