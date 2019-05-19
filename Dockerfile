FROM node:12.2.0-alpine

RUN apk update
RUN apk add \
    curl

RUN curl -LSfs https://japaric.github.io/trust/install.sh | \
  sh -s -- --git casey/just --target x86_64-unknown-linux-musl --to /bin

RUN npm install -g preact-cli@2.2.1 yarn nodemon

WORKDIR /workspace
