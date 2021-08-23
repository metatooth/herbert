.PHONY: docker
docker:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build

.PHONY: up
up:
	docker-compose up -d

.PHONY: down
down:
	docker-compose down

.PHONY: down-data
down-data:
	docker-compose down --volumes

.PHONY: logs
logs:
	docker-compose logs -f
