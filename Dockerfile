FROM alpine:3.12.1 AS base
#Creación de grupo y usuario node. Instalación de node y npm.
RUN addgroup -S node && adduser -S node -G node \
    && apk add --no-cache --update nodejs=12.20.1-r0 npm=12.20.1-r0 make=4.3-r0 \
    && node -v \
    && npm -v \
    && mkdir /node_modules && chown node:node /node_modules

# Cambio a un usuario no privilegiado
USER node

FROM base AS dependencies
# Cambio al directorio donde guardaré las dependencias de la aplicación
WORKDIR /

#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

# Instalación de las dependencias de la aplicación
RUN npm ci

FROM base AS test
#Copiando los node_modules desde un stage anterior
COPY --from=dependencies /node_modules /node_modules

#Creación del volumen
VOLUME ["/test"]
WORKDIR /test

#PATH del node_modules
ENV PATH=/node_modules/.bin:$PATH

#Ejecución de los tests
CMD ["npm", "test"]