NAME			= ft_transcendence

DOCKER			= docker
COMPOSE			= docker compose

SERVICES		=							\
					react					\
					nestjs					\
					postgres				\
					adminer					\

#############################
## DOCKER COMPOSE COMMANDS ##
#############################

build:
	@$(COMPOSE) build

up:
	@$(COMPOSE) up -d

down:
	@$(COMPOSE) down

start:
	@$(COMPOSE) start

stop:
	@$(COMPOSE) stop

ps:
	@$(COMPOSE) ps

$(SERVICES):
	@$(COMPOSE) exec $@ bash

logs:
	@$(COMPOSE) logs $(S)

flogs:
	@$(COMPOSE) logs --follow --tail 16 $(S)

#####################
## DOCKER COMMANDS ##
#####################

prune:
	$(DOCKER) system prune --all --force --volumes

###########
## PHONY ##
###########

.PHONY: build up down start stop ps $(SERVICES) logs flogs prune
