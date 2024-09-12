#Node版本

From node:16.15.1

ARG NODE_ENV=production

ENV NODE_ENV $NODE_ENV

copy ./dist /dist

copy ./package.json /package.json

copy ./package-lock.json /package-lock.json

RUN NODE_ENV=$NODE_ENV npm install

EXPOSE 3000

CMD ["node","dist/app.js"]
