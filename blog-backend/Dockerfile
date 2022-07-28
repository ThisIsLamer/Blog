FROM node:16-alpine3.12 as base
USER node

RUN mkdir /home/node/Blog
WORKDIR /home/node/Blog

COPY --chown=node:node . ./

WORKDIR /home/node/Blog
RUN npm i
RUN npm run build

FROM base as production