FROM node:lts-alpine

VOLUME ["/test"]
WORKDIR /test

RUN npm install --silent --progress=false

CMD ["npm", "test"]