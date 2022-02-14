NAME			= ft_transcendence

DOC_FILE		= ./srcs/docker-compose.yml
DOC_ENV			= ./srcs/.env
DOC_FLAG		= --file ${DOC_FILE} --env-file ${DOC_ENV}
DOCKER_COMPOSE	= docker compose ${DOC_FLAG}

all: build run
.PHONY:all

logs:
	@bash ./srcs/requirements/tools/logs.sh
.PHONY:logs

build: clean
	${DOCKER_COMPOSE} build
.PHONY:build

run: clean
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
	rm -rf ./srcs/app/secrets/private-key.pem
	touch ./srcs/app/secrets/private-key.pem
	rm -rf ./srcs/app/secrets/public-certificate.pem
	touch ./srcs/app/secrets/public-certificate.pem
	docker system prune --all --force --volumes
.PHONY:fclean

zsh_nestjs:
	docker exec -ti nestjs zsh
.PHONY:zsh_nestjs

bash_nestjs:
	docker exec -ti nestjs bash
.PHONY:bash_nestjs

bash_postgre:
	docker exec -ti postre bash
.PHONY:bash_postgre