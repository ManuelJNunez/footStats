FROM node:lts

VOLUME ["/test"]
WORKDIR /test

RUN npm install --silent --progress=false

CMD ["npm", "test"]