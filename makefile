.PHONY: deploy
deploy:
	yarn run build
	yarn --production --modules-folder layers/nodejs/node_modules
	SLS=debug sls deploy
