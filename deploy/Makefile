HERBERT_BRANCH ?= local
ANSIBLE_INVENTORY ?= ansible/inventory

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

.PHONY: check_inventory
check_inventory:
ifeq ($(ANSIBLE_INVENTORY),)
	@echo ""
	@echo "Must set ANSIBLE_INVENTORY. Use \"ansible/inventory\" to use invetory"
  @echo	"from current repository."
	@echo ""
	@exit 1
endif

.PHONY: deploy-all
deploy-all: deploy-databases \
deploy-servers \
deploy-socket-servers \
deploy-workers \
deploy-clients \
deploy-kiosks

.PHONY: build
build: check_branch check_inventory
	./build.sh $(SERVICE) $(HERBERT_BRANCH) ${ANSIBLE_INVENTORY}

.PHONY: deploy
deploy:
	ansible-playbook -i ${ANSIBLE_INVENTORY} ansible/$(SERVICE).yml

.PHONY: deploy-databases
deploy-databases:
	$(MAKE) deploy SERVICE=database

.PHONY: deploy-servers
deploy-servers:
	$(MAKE) build SERVICE=server
	$(MAKE) deploy SERVICE=server

.PHONY: deploy-socket-servers
deploy-socket-servers:
	$(MAKE) build SERVICE=socket-server
	$(MAKE) deploy SERVICE=socket-server

.PHONY: deploy-clients
deploy-clients:
	$(MAKE) build SERVICE=client
	$(MAKE) deploy SERVICE=client

.PHONY: deploy-workers
deploy-workers:
	$(MAKE) build SERVICE=worker
	$(MAKE) deploy SERVICE=worker

.PHONY: deploy-kiosks
deploy-kiosks:
	$(MAKE) build SERVICE=kiosk
	$(MAKE) deploy SERVICE=kiosk
