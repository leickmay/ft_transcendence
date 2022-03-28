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
	cp -n .env.example .env | exit 0
	@$(COMPOSE) build

up:
	@$(COMPOSE) up -d

down:
	@$(COMPOSE) down

start:
	@$(COMPOSE) start

stop:
	@$(COMPOSE) stop

restart:
	@$(COMPOSE) restart

reload:
	@docker-compose up --build --force-recreate -d

ps:
	@$(COMPOSE) ps

$(filter-out adminer,$(SERVICES)):
	@$(COMPOSE) exec $@ bash

adminer:
	@$(COMPOSE) exec $@ sh

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
## CLEAN ##
###########

clean: stop prune

fclean: clean
	rm -rf \
		./client/node_modules \
		./server/node_modules \
		./server/dist \
		.env

###########
## PHONY ##
###########

.PHONY: build up down start stop restart reload ps $(SERVICES) logs flogs prune clean fclean
