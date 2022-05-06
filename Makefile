NAME			= ft_transcendence

DOCKER			= docker

COMPOSE			= docker compose

SERVICES		= react \
					nestjs \
					postgres \
					adminer

all: env stop build up flogs
.PHONY: all

env:
	cp -n .env.example .env | exit 0
.PHONY: env

############
## DOCKER ##
############

build:
	@$(COMPOSE) build
.PHONY: build

up:
	@$(COMPOSE) up -d
.PHONY: up

down:
	@$(COMPOSE) down
.PHONY: down

start:
	@$(COMPOSE) start
.PHONY: start

stop:
	@$(COMPOSE) stop
.PHONY: stop

restart:
	@$(COMPOSE) restart
.PHONY: restart

reload:
	@docker-compose up --build --force-recreate -d
.PHONY: reload

############
## STATUS ##
############

ps:
	@$(COMPOSE) ps
.PHONY: ps

###########
## SHELL ##
###########

$(filter-out adminer,$(SERVICES)):
	@$(COMPOSE) exec $@ bash
.PHONY: $(filter-out adminer,$(SERVICES))

adminer:
	@$(COMPOSE) exec $@ sh
.PHONY: adminer

##########
## LOGS ##
##########

logs:
	@$(COMPOSE) logs $(S)
.PHONY: logs

flogs:
	@$(COMPOSE) logs --follow --tail 16 $(S)
.PHONY: flogs

###########
## CLEAN ##
###########

prune:
	$(DOCKER) system prune --all --force --volumes
.PHONY: prune

clean: stop prune
.PHONY: clean

fclean: clean
	rm -rf \
		./client/node_modules \
		./server/node_modules \
		./server/dist \
		.env
.PHONY: fclean
