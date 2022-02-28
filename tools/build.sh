#!/bin/bash

if [ ! -f .env ]
then
	cp .env.example .env
fi

if [ ! -f ./server/secrets/public-certificate.pem ]
then
	touch ./server/secrets/public-certificate.pem
fi

if [ ! -f ./server/secrets/private-key.pem ]
then
	touch ./server/secrets/private-key.pem
fi
