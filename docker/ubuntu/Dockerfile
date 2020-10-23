FROM ubuntu AS base

#Instalación de curl y node, vaciado de cache y comprobación de que funciona
RUN apt-get update \
    && apt-get install -y curl \
    && curl -sL https://deb.nodesource.com/setup_12.x | bash \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/* \
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

