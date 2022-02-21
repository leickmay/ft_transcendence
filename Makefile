NAME			= ft_transcendence

DOC_FILE		= ./docker-compose.yml
DOC_ENV			= ./env
DOC_FLAG		= --file ${DOC_FILE} --env-file ${DOC_ENV}
DOCKER_COMPOSE	= docker compose ${DOC_FLAG}

all: build run
.PHONY:all

logs:
	@bash ./srcs/requirements/tools/logs.sh
.PHONY:logs

build:
	@bash ./srcs/requirements/tools/build.sh
	@${MAKE} clean
	${DOCKER_COMPOSE} build
.PHONY:build

run: stop
	${DOCKER_COMPOSE} up -d
.PHONY:run

stop:
	${DOCKER_COMPOSE} stop
.PHONY:stop

kill:
	${DOCKER_COMPOSE} kill
.PHONY:kill

clean: stop
.PHONY:clean

fclean: clean
	rm -rf .env
	rm -rf ./srcs/app_nest/secrets/private-key.pem
	rm -rf ./srcs/app_nest/secrets/public-certificate.pem
	docker system prune --all --force --volumes
.PHONY:fclean

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
