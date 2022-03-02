#!/bin/bash

npm_install_react ()
{
	if [ ! -d "./client/node_modules" ]
	then
		cd ./client
		npm install
		cd ..
	fi
}

npm_install_nest ()
{
	if [ ! -d "./server/node_modules" ]
	then
		cd ./server
		npm install
		cd ..
	fi
}

npm_install_react
npm_install_nest
