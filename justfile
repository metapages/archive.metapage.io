# https://github.com/casey/just

# just runs the dev server by default
PROJECT_NAME := `basename $PWD`
NODE_ENV := 'development'
FINAL_BUILD_TARGET := "../../docs/_metapages/metapage-app/"
PORT := env_var_or_default("PORT", "4010")

_first:
	@if [ -f /.dockerenv ]; then \
		just --list; \
	else \
		just _get-in-docker; \
	fi

# serve and build on [src] change
serve:
    npm run dev

# build artifact to {{FINAL_BUILD_TARGET}}
build:
    npm run build
    @# rsync -arv --delete build/ {{FINAL_BUILD_TARGET}}

# [src] change -> build artifact to {{FINAL_BUILD_TARGET}}
watch:
    nodemon --watch src --exec just build

# deploy to gh-pages branch
deploy:
	npm run deploy


_get-in-docker:
	docker-compose run --rm -p '4010:{{PORT}}' metapage-app /bin/sh
