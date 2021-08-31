.PHONY: docker
docker:
	COMPOSE_DOCKER_CLI_BUILD=1 DOCKER_BUILDKIT=1 docker-compose build

.PHONY: up
up:
	docker-compose up -d

.PHONY: scale-worker
scale-worker:
	docker-compose up --scale=$(NUM_WORKERS)

.PHONY: down
down:
	docker-compose down

.PHONY: down-data
down-data:
	docker-compose down --volumes

.PHONY: logs
logs:
	docker-compose logs -f
