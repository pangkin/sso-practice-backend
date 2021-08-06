FROM node:lts-buster

WORKDIR /usr/src/backend

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

COPY . .

EXPOSE 4000

CMD ["yarn", "start"]