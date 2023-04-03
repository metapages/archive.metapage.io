###############################################################
# Minimal commands to develop, build, test, and deploy
###############################################################
# just docs: https://github.com/casey/just
set shell                          := ["bash", "-c"]
set dotenv-load                    := true

# minimal formatting, bold is very useful
bold                               := '\033[1m'
normal                             := '\033[0m'
green                              := "\\e[32m"
yellow                             := "\\e[33m"
blue                               := "\\e[34m"
magenta                            := "\\e[35m"
grey                               := "\\e[90m"

# If not in docker, get inside
@_help:
    echo -e ""
    just --list --unsorted --list-heading $'🌱 Commands:\n\n'
    echo -e ""
    echo -e "    Github  URL 🔗 {{green}}$(cat packages/metapage-grid-react/package.json | jq -r '.repository.url'){{normal}}"
    echo -e "    Publish URL 🔗 {{green}}https://$(cat packages/metapage-grid-react/package.json | jq -r '.homepage'){{normal}}"
    echo -e "    npm     URL 🔗 {{green}}https://www.npmjs.com/package/$(cat packages/metapage-grid-react/package.json | jq -r '.name')/{{normal}}"
    echo -e ""

# Run the metapage-app dev server. Opens the web app in browser.
dev:
    just packages/metapage-app/dev

# Run the metapage-app dev server. Opens the web app in browser.
dev-examples:
    just packages/examples/dev

# Increment semver version, push the tags (triggers "deploy-tag-version")
@tag-version npmversionargs="patch":
    just packages/metapage-grid-react/tag-version {{npmversionargs}}

# Publish targets (add to the end of the deploy-tag-version command to execute):
#   - `deploy-tag-version-npm`: publish to npm
#   - `deploy-tag-version-github-pages`: publish to github pages
#   - `_cloudflare_pages_publish`: publish to cloudflare pages
# Reaction to "tag-version". On new git version tag: publish code [github pages, cloudflare pages, npm]
deploy-tag-version:
    just packages/metapage-app/deploy-tag-version

# Test: currently bare minimum: only building. Need proper test harness.
@test:
    just packages/metapage-app/test
