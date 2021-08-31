.PHONY: all
all: deploy-all

.PHONY: check_branch
check_branch:
ifeq ($(HERBERT_BRANCH),)
	@echo ""
	@echo "Must set HERBERT_BRANCH. Use \"local\" to deploy current changes,"
	@echo "or use a tag version to deploy a release."
	@echo ""
	@exit 1
endif

.PHONY: deploy-all
deploy-all: deploy-databases deploy-servers deploy-workers deploy-clients

.PHONY: build
build: check_branch
	./build.sh $(SERVICE) $(HERBERT_BRANCH)

.PHONY: deploy
deploy:
	ansible-playbook -i ansible/inventory ansible/$(SERVICE).yml

.PHONY: deploy-databases
deploy-databases:
	$(MAKE) deploy SERVICE=database

.PHONY: deploy-servers
deploy-servers:
	$(MAKE) build SERVICE=server
	$(MAKE) deploy SERVICE=server

.PHONY: deploy-clients
deploy-clients:
	$(MAKE) build SERVICE=client
	$(MAKE) deploy SERVICE=client

.PHONY: deploy-workers
deploy-workers:
	$(MAKE) build SERVICE=worker
	$(MAKE) deploy SERVICE=worker
