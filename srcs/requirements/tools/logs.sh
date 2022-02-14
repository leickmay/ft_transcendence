#!/bin/bash

follow_log()
{
	docker compose --file ./srcs/docker-compose.yml --env-file ./srcs/.env logs -f
	echo ""
}

all_log()
{
	docker compose --file ./srcs/docker-compose.yml --env-file ./srcs/.env logs
	echo ""
}

nestjs_log()
{
	echo "##############"
	echo "### NestJS ###"
	echo "##############"
	echo ""
	docker logs nestjs
	echo ""
}

postgre_log()
{
	echo "###############"
	echo "### Postgre ###"
	echo "###############"
	echo ""
	docker logs postgre
	echo ""
}

echo "############"
echo "### Logs ###"
echo "############"

echo ""
echo "0 : Follow log output"
echo "1 : All logs"
echo "2 : NestJS"
echo "3 : Postgre"
echo ""
echo "Default : Exit"
echo ""

echo -n "Selection : "
read tmp
echo ""

if [ "$tmp" == "0" ]
then
	follow_log
fi

if [ "$tmp" == "1" ]
then
	all_log
fi

if [ "$tmp" == "2" ]
then
	nestjs_log
fi

if [ "$tmp" == "3" ]
then
	postgre_log
fi

