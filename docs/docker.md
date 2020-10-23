# Pruebas de Dockerfiles

## Imágenes probadas
Se han probado varias imágenes, todas ellas generadas mediante un Dockerfile siguiendo las [mejores prácticas de Docker](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) y testeando el Dockerfile con la [GitHub Action](https://github.com/ManuelJNunez/footStats/blob/master/.github/workflows/linters.yml) correspondiente.

### alpine:latest
Alpine es una imagen de Linux muy ligera y básica (solo pesa 5.57MB) y debido a eso, es de las más usadas. El contenedor que he construido sobre esta imagen ha sido generado usando una construcción multietapa (esto ayuda a que el contenedor construido sea más ligero).

~~~dockerfile
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
~~~

En la primera etapa (base), se instala node y npm, la opción `--no-cache` evita que apk cree archivos adicionales de cache en el contenedor, ya que nos conviene que este solo contenga lo básico para funcionar para que el contenedor final ocupe lo menos posible.

En la segunda etapa (dependencies) se copian los archivos `package.json` y `package-lock.json` para poder instalar las dependencias de la aplicación.

En la etapa final (test), se copian los módulos de node generados en la etapa anterior. Después se cambia el directorio de trabajo a `/test` y se edita una variable de entorno para que npm use los `node_modules` de otro path (tal y como se indica [aquí](https://www.docker.com/blog/keep-nodejs-rockin-in-docker/)).

La imagen final ocupa 172MB.

### ubuntu:latest
Ubuntu es una imagen más pesada que alpine (ocupa 72,9MB), aunque también se usa bastante. En este caso también he usado construcción multi etapa.

~~~dockerfile
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
~~~

En la primera etapa se instala curl para poder descargar la última LTS de node, posteriormente se limpia la cache del gestor de paquetes de ubuntu para que la imagen final ocupe lo menos posible. En las demás etapas se hace lo mismo que en alpine.

La imagen final ocupa 316MB.

### node:lts
Esta imagen es la más pesada de las cuatro que he probado (ocupa 918MB), contiene la última versión LTS de node.

~~~dockerfile
FROM node:lts AS base

#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

# Instalación de las dependencias de la aplicación
RUN npm install --silent --progress=false

FROM node:lts AS test
#Copiando los node_modules desde un stage anterior
COPY --from=base /node_modules /node_modules

#Creación del volumen
VOLUME ["/test"]
WORKDIR /test

#PATH del node_modules
ENV PATH=/node_modules/.bin:$PATH

#Ejecución de los tests
CMD ["npm", "test"]
~~~

El contenedor generado ocupa 1.03GB.

### node:lts-alpine
Esta imagen contiene la última versión LTS de node en alpine y es la más recomendada si deseamos una imagen pequeña, como en este caso. La imagen original ocupa 89.6MB.

~~~dockerfile
FROM node:lts-alpine AS base

#Copia de los archivos de dependencias
COPY package.json package-lock.json ./

# Instalación de las dependencias de la aplicación
RUN npm install --silent --progress=false

FROM node:lts-alpine AS test
#Copiando los node_modules desde un stage anterior
COPY --from=base /node_modules /node_modules

#Creación del volumen
VOLUME ["/test"]
WORKDIR /test

#PATH del node_modules
ENV PATH=/node_modules/.bin:$PATH

#Ejecución de los tests
CMD ["npm", "test"]
~~~

La imagen final ocupa 206MB.

## Pruebas de distintas imágenes
Se han hecho cuatro pruebas para cada contenedor del tiempo que tardan en descargar y construir el contenedor y ejecutar los tests (lógicamente después de cada descargar eliminaba las imágenes locales).

~~~shell
time docker run -t -v `pwd`:/test mjnunez/footstats:tag
~~~

|    **Imagen**   | **Tiempo 1** | **Tiempo 2** | **Tiempo 3** | **Tiempo 4** | **Tiempo medio** |
|:---------------:|:------------:|:------------:|:------------:|:------------:|:----------------:|
|     node:lts    |    89,88s    |    80,95s    |    75,35s    |    84,94s    |      82,78s      |
| node:lts-alpine |    25,005s   |    17,621s   |    20,035s   |    17,501s   |      20,04s      |
|  ubuntu:latest  |    32,443s   |    39,156s   |    28,826s   |    28,574s   |      32,25s      |
|  alpine:latest  |    17,782s   |    17,985s   |    18,664s   |    18,348s   |      18,195s     |

Como podemos ver, de media es mejor el contenedor cuya imagen base es alpine:latest, que también es el contenedor más ligero de los 4. Por tanto elijo ese para ejecutar los tests del código del repositorio.

> **Nota:** el Dockerfile final difiere un poco, pero solo "estéticamente" para poder pasar el test de hadolint. El funcionamiento y lo que ocupa el contenedor sigue siendo igual.