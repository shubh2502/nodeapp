FROM node:latest

MAINTAINER shubham

ENV NODE_ENV=production

ENV PORT=4300

COPY . /var/www

WORKDIR /var/www

RUN  npm install

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]