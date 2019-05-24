# https://github.com/casey/just

NODE_ENV := 'development'
PORT := env_var_or_default("PORT", "4010")

# If we're not running in a docker container
_first:
	just --list

help:
    @just --list

# Run the stack, defaulting to all. Just target "jekyll" for a minimal server
run +TARGET='jekyll builder-haxe test':
    docker-compose up --remove-orphans {{TARGET}}

# serve and build on [src] change
serve:
    npm run dev

# build artifact to {{FINAL_BUILD_TARGET}}
build:
	npm run build
	cp src/CNAME build/
	sed -i -e 's#href="/#href="#g' build/index.html
	sed -i -e 's#/assets#assets#g' build/sw.js
	sed -i -e 's#/assets#assets#g' build/manifest.json

# [src] change -> build artifact to {{FINAL_BUILD_TARGET}}
watch:
    nodemon --watch src --exec just build

# deploy to gh-pages branch
deploy: build
	npm run deploy

# CLI shell in the docker container
docker-cli:
	just _get-in-docker

_get-in-docker:
	docker-compose run --rm -p '4010:{{PORT}}' metapage-app /bin/sh
