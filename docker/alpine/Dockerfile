FROM alpine AS base
#Instalación de nodejs lts y npm (y comprobación de que funcionan)
RUN apk add --no-cache nodejs npm \
    && node -v \
    && npm -v
#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

FROM base AS dependencies
#Instalación de las dependencias de la aplicación
RUN npm install --silent --progress=false

FROM base AS test
#Creación del volumen
VOLUME ["/test"]
WORKDIR /test

#Copiando los node_modules desde un stage anterior
COPY --from=dependencies /node_modules ./node_modules

#Ejecución de los tests
CMD ["npm", "test"]