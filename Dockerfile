ARG NODE_VERSION=16
FROM node:${NODE_VERSION}-alpine

# 设置时区为CST
ENV TZ=Asia/Shanghai
ENV SERVER_PORT=3000
ARG NPM_CONFIG_REGISTRY
ENV NPM_CONFIG_REGISTRY=$NPM_CONFIG_REGISTRY

# Create app directory
WORKDIR /usr/src/app
# VOLUME /usr/src/app/logs

RUN npm i -g healthcheck-cli

ADD package.json .
ADD package-lock.json .
# ADD .npmrc .

RUN npm ci --prefer-offline

ADD . .

EXPOSE $SERVER_PORT
CMD [ "npm", "start" ]

HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD healthcheck localhost $SERVER_PORT /
