FROM alpine AS base
#Instalación de nodejs lts y npm (y comprobación de que funcionan)
RUN apk add --no-cache --update nodejs npm \
    && node -v \
    && npm -v

FROM base AS dependencies
#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

# Instalación de las dependencias de la aplicación
RUN npm install --silent --progress=false

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