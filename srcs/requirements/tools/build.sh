#!/bin/bash

if [ ! -d ./srcs/.env ]
then
	cp ./srcs/.env.example ./srcs/.env
fi

if [ ! -f ./srcs/app/secrets/public-certificate.pem ]
then
	touch ./srcs/app/secrets/public-certificate.pem
fi

if [ ! -f ./srcs/app/secrets/private-key.pem ]
then
	touch ./srcs/app/secrets/private-key.pem
fi
