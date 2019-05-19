# https://github.com/casey/just

NODE_ENV := 'development'
PORT := env_var_or_default("PORT", "4010")

# If we're not running in a docker container
_first:
	just --list
	# Disabled this for now. Experimenting with automatically
	# putting the CLI user in a docker shell context to ensure
	# all tools are available.
	# @if [ -f /.dockerenv ]; then \
	# 	just --list; \
	# else \
	# 	just _get-in-docker; \
	# fi

# serve and build on [src] change
serve:
    npm run dev

# build artifact to {{FINAL_BUILD_TARGET}}
build:
    npm run build

# [src] change -> build artifact to {{FINAL_BUILD_TARGET}}
watch:
    nodemon --watch src --exec just build

# deploy to gh-pages branch
deploy:
	npm run deploy


_get-in-docker:
	docker-compose run --rm -p '4010:{{PORT}}' metapage-app /bin/sh
