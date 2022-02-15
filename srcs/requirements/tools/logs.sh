#!/bin/bash

follow_log()
{
	docker compose --file ./srcs/docker-compose.yml --env-file ./srcs/.env logs --follow --tail=16
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
	echo "################"
	echo "### Postgres ###"
	echo "################"
	echo ""
	docker logs postgres
	echo ""
}

pgadmin_log()
{
	echo "################"
	echo "### PgAdmin ###"
	echo "################"
	echo ""
	docker logs pgadmin
	echo ""
}

echo "############"
echo "### Logs ###"
echo "############"

echo ""
echo "0 : Follow log output"
echo "1 : All logs"
echo "2 : NestJS"
echo "3 : Postgres"
echo "4 : PgAdmin"
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

if [ "$tmp" == "4" ]
then
	pgadmin_log
fi
