#!/bin/bash

if [ ! -d ./srcs/.env ]
then
	cp .env.example .env
fi

if [ ! -f ./srcs/app_nest/secrets/public-certificate.pem ]
then
	touch ./srcs/app_nest/secrets/public-certificate.pem
fi

if [ ! -f ./srcs/app_nest/secrets/private-key.pem ]
then
	touch ./srcs/app_nest/secrets/private-key.pem
fi
