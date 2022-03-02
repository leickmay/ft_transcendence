#!/bin/bash

while [ "$(cat ./logs/up.log | wc -l | sed 's/ //g')" != "0" ]
do
	sleep 1;
done
