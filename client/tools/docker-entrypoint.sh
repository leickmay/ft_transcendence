#!/bin/bash

# root_folder_init ()
# {
# 	chown -R www-data:www-data /var/www/html
# 	chmod -R 755 /var/www/html
# }

npm_install ()
{
		cd /var/www/html/$1
		npm install
}

start_server ()
{
	cd /var/www/html/$1
    npm start
}

npm_install client
start_server client
