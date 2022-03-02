#!/bin/bash

READY="0"

POSTGRES_READY="database system is ready to accept connections"
NESTJS_READY="Nest application successfully started"
REACT_READY="Compiled successfully!"

POSTGRES="$(cat ./logs/up.log| grep "$POSTGRES_READY" | wc -l | sed 's/ //g')"
NESTJS="$(cat ./logs/up.log| grep "$NESTJS_READY" | wc -l | sed 's/ //g')"
REACT="$(cat ./logs/up.log| grep "$REACT_READY" | wc -l | sed 's/ //g')"

while [ "$READY" == "0" ]
do
	clear

	echo "########################"
	echo "### ft_transcendence ###"
	echo "########################"
	echo ""

	if [ "$POSTGRES" != "0" ]
	then
		echo "Postgres is ready !!!"
	else
		echo "Postgres ..."
	fi

	if [ "$NESTJS" != "0" ]
	then
		echo "NestJS is ready !!!"
	else
		echo "NestJS ..."
	fi

	if [ "$REACT" != "0" ]
	then
		echo "React is ready !!!"
	else
		echo "React ..."
	fi

	echo ""
	echo "LOGS :"
	echo ""
	tail -n 4 ./logs/up.log

	if [[ "$POSTGRES" != "0" && "$NESTJS" != "0" && "$REACT" != "0" ]]
	then
		READY="1"
	fi

	sleep 1

POSTGRES="$(cat ./logs/up.log| grep "$POSTGRES_READY" | wc -l | sed 's/ //g')"
NESTJS="$(cat ./logs/up.log| grep "$NESTJS_READY" | wc -l | sed 's/ //g')"
REACT="$(cat ./logs/up.log| grep "$REACT_READY" | wc -l | sed 's/ //g')"
done

echo ""
echo "#####################################"
echo "### ft_transcendence is ready !!! ###"
echo "#####################################"
