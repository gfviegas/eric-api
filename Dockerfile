FROM node:alpine

RUN mkdir -p /var/www/eric-api
WORKDIR /var/www/eric-api

RUN apk add --no-cache make gcc g++ python

COPY package.json /var/www/eric-api
RUN npm i --silent --no-progress

COPY . /var/www/eric-api

EXPOSE 3000
CMD ["npm", "run", "dev"]
