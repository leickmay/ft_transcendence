#!/bin/bash

follow_log()
{
	docker compose logs --follow --tail=16
	echo ""
}

all_log()
{
	docker compose logs
	echo ""
}

react_log()
{
	echo "#############"
	echo "### React ###"
	echo "#############"
	echo ""
	docker logs react --follow
	echo ""
}

nestjs_log()
{
	echo "##############"
	echo "### NestJS ###"
	echo "##############"
	echo ""
	docker logs nestjs --follow;
	echo ""
}

postgre_log()
{
	echo "################"
	echo "### Postgres ###"
	echo "################"
	echo ""
	docker logs postgres --follow
	echo ""
}

pgadmin_log()
{
	echo "################"
	echo "### PgAdmin ###"
	echo "################"
	echo ""
	docker logs pgadmin --follow
	echo ""
}

echo "############"
echo "### Logs ###"
echo "############"

echo ""
echo "0 : Follow log output"
echo "1 : All logs"
echo "2 : React"
echo "3 : NestJS"
echo "4 : Postgres"
echo "5 : PgAdmin"
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
	react_log
fi

if [ "$tmp" == "3" ]
then
	nestjs_log
fi

if [ "$tmp" == "4" ]
then
	postgre_log
fi

if [ "$tmp" == "5" ]
then
	pgadmin_log
fi
