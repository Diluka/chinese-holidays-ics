FROM node:14-alpine

WORKDIR /usr/src/app

ENV TZ=Asia/Shanghai
ENV NODE_ENV=production

RUN npm i -g healthcheck-cli

ADD package.json .
ADD package-lock.json .
RUN npm ci

ADD . .

EXPOSE 3000

CMD npm start

HEALTHCHECK --interval=30s --timeout=30s --start-period=30s --retries=3 CMD healthcheck localhost 3000 /
