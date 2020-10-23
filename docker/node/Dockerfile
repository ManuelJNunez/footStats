FROM node:lts AS base

#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

# Instalación de las dependencias de la aplicación
RUN npm install --silent --progress=false

FROM node:lts AS dependencies
#Copiando los node_modules desde un stage anterior
COPY --from=dependencies /node_modules /node_modules

#Creación del volumen
VOLUME ["/test"]
WORKDIR /test

#PATH del node_modules
ENV PATH=/node_modules/.bin:$PATH

#Ejecución de los tests
CMD ["npm", "test"]