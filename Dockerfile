FROM alpine:3.12.1 AS base
#Creación de grupo y usuario node. Instalación de node y npm
RUN addgroup -S node && adduser -S node -G node \
    && apk add --no-cache --update nodejs-dev=12.18.4-r0 npm=12.18.4-r0 \
    && node -v \
    && npm -v \
    && mkdir /dependencies && chown node:node /dependencies

USER node

FROM base AS dependencies
# Cambio al directorio donde guardaré las dependencias de la aplicación
WORKDIR /dependencies

#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

# Instalación de las dependencias de la aplicación
RUN npm install --silent --progress=false --no-optional

FROM base AS test
#Copiando los node_modules desde un stage anterior
COPY --from=dependencies /dependencies/node_modules /dependencies/node_modules

#Creación del volumen
VOLUME ["/test"]
WORKDIR /test

#PATH del node_modules
ENV PATH=/dependencies/node_modules/.bin:$PATH

#Ejecución de los tests
CMD ["npm", "test"]