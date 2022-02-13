#!/bin/bash

nestjs_log()
{
	echo "##############"
	echo "### NestJS ###"
	echo "##############"
	echo ""
	cat ./logs/docker-compose.log | grep "nestjs"
	echo ""
}

postgre_log()
{
	echo "###############"
	echo "### Postgre ###"
	echo "###############"
	echo ""
	cat ./logs/docker-compose.log | grep "postgre"
	echo ""
}

echo "############"
echo "### Logs ###"
echo "############"

echo ""
echo "Default	: all"
echo "NestJS	: 1"
echo "Postgre	: 2"
echo ""

echo -n "Logs : "
read tmp
echo ""

if [ "$tmp" == "1" ]
then
	nestjs_log
fi

if [ "$tmp" == "2" ]
then
	postgre_log
fi

if [ "$tmp" == "" ]
then
	postgre_log
	nestjs_log
fi
