FROM node:14.17.6-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package.json ./

RUN yarn

COPY --chown=node:node . .

USER node

EXPOSE 3000

CMD ["yarn", "start"]
