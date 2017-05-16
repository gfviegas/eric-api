FROM node:alpine

RUN mkdir -p /var/www/sremg-api
WORKDIR /var/www/sremg-api

RUN apk add --no-cache make gcc g++ python

COPY package.json /var/www/sremg-api
RUN npm i --silent --no-progress

COPY . /var/www/sremg-api

EXPOSE 3000
CMD ["npm", "run", "dev"]
