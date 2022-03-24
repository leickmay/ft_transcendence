NAME			= ft_transcendence

DOCKER			= docker compose

SERVICES		=							\
					react					\
					nestjs					\
					postgres				\
					adminer					\

#####################
## DOCKER COMMANDS ##
#####################

build:
	@$(DOCKER) build

up:
	@$(DOCKER) up -d

down:
	@$(DOCKER) down

start:
	@$(DOCKER) start

stop:
	@$(DOCKER) stop

status:
	@bash ./tools/ready.sh

prune:
	docker system prune --all --force --volumes

$(SERVICES):
	docker exec -ti $@ bash

logs:
	docker compose logs $(SERVICES)

flogs:
	docker compose logs $(SERVICES) --follow --tail 16

.PHONY: build up down start stop status prune $(SERVICES) logs flogs
