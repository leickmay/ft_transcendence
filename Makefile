NAME			= ft_transcendence

DOC_FILE		= ./docker-compose.yml
DOC_ENV			= ./env
DOC_FLAG		= --file ${DOC_FILE} --env-file ${DOC_ENV}
DOC_FLAGS		= docker compose ${DOC_FLAG}
DOC				= docker-compose

#########
## ALL ##
#########

all: npm build run
.PHONY:all

####################
## DOCKER-COMPOSE ##
####################

npm:
	@bash ./tools/npm.sh
.PHONY:npm

build:
	rm -rf ./logs/*.log
	@bash ./tools/build.sh
	${DOC} build
.PHONY:build

run:
	rm -rf ./logs/*.log
	${DOC} up -d
.PHONY:run

drun:
	${DOC} up > ./logs/up.log &
	bash ./tools/run.sh
.PHONY:run

ready:
	bash ./tools/ready.sh
.PHONY:ready

stop:
	${DOC} stop
.PHONY:stop

kill:
	${DOC} kill
.PHONY:kill

prune:
	docker system prune --all --force --volumes
.PHONY:prune

###########
## CLEAN ##
###########

clean: stop
.PHONY:clean

fclean: clean prune
	rm -rf .env
	rm -rf ./server/secrets/private-key.pem
	rm -rf ./server/secrets/public-certificate.pem
	rm -rf ./logs/*.log
.PHONY:fclean

##########
## LOGS ##
##########

logs:
	docker compose logs nestjs react postgres
.PHONY:logs

flogs:
	docker compose logs nestjs react postgres --follow --tail 16
.PHONY:flogs

pglogs:
	docker compose logs pgadmin --follow
.PHONY:pglogs

###########
## SHELL ##
###########

react:
	docker exec -ti react zsh
.PHONY:react

nestjs:
	docker exec -ti nestjs zsh
.PHONY:nestjs

postgre:
	docker exec -ti postgres bash
.PHONY:postgre

pgadmin:
	docker exec -ti pgadmin sh
.PHONY:pgadmin
