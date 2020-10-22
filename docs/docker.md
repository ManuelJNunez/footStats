# Pruebas de Dockerfiles

## Imágenes probadas
Se han probado varias imágenes, todas ellas generadas mediante un Dockerfile siguiendo las [mejores prácticas](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/) para su construcción. Los Dockerfiles se encuentran en el directorio [docker](https://github.com/ManuelJNunez/footStats/tree/master/docker) de este repositorio.

### alpine:latest
Alpine es una imagen de Linux muy ligera y básica (solo pesa 5.57MB) y debido a eso, es de las más usadas. El contenedor que he construido sobre esta imagen ha sido generado usando una construcción multietapa (esto ayuda a que el contenedor construido sea más ligero).

En la primera etapa (base), se instala node y npm, la opción `--no-cache` evita que apk cree archivos adicionales de cache en el contenedor, ya que nos conviene que este solo contenga lo básico para funcionar para que el contenedor final ocupe lo menos posible. Después de esto, se copian los ficheros `package.json` y `package-lock.json` del host dentro del contenedor.

En la segunda etapa (dependencies) se instalan todas las dependencias registradas en el fichero `package.json` anteriormente copiado.

En la etapa final (test), se copian los módulos de node generados en la etapa anterior en el contenedor final. Antes de eso se crea el volumen y se actualiza el directorio de trabajo. Por último se ejecuta la orden del task runner necesaria para ejecutar los tests.

El Dockerfile que usa esta imagen base se encuentra [aquí](https://github.com/ManuelJNunez/footStats/blob/master/docker/alpine/Dockerfile).

### ubuntu:latest
Ubuntu es una imagen más pesada que alpine (ocupa 72,9MB), aunque también se usa bastante. En este caso también he usado construcción multi etapa.

En la primera etapa se instala curl para poder descargar la LTS de node, posteriormente a ello se limpia la cache del gestor de paquetes de ubuntu para que la imagen final ocupe lo menos posible. En las demás etapas se hace lo mismo que en el Dockerfile de alpine.

El Dockerfile que usa esta imagen base se encuentra [aquí](https://github.com/ManuelJNunez/footStats/blob/master/docker/ubuntu/Dockerfile).

### node:lts
Esta imagen es la más pesada de las cuatro que he probado. Esta imagen se ha construido mediante [este Dockerfile](https://github.com/nodejs/docker-node/blob/a8494b1676216bfe274073993016da0c2e0bfcdd/12/stretch/Dockerfile).

El Dockerfile que usa esta imagen base se encuentra [aquí](https://github.com/ManuelJNunez/footStats/blob/master/docker/node/Dockerfile).

### node:lts-alpine
  


## Pruebas de distintas imágenes
Se han hecho cuatro pruebas para cada contenedor del tiempo que tardan en descargar y construir el contenedor y ejecutar los tests (lógicamente después de cada descargar eliminaba las imágenes locales).
~~~shell
time docker run -t -v `pwd`:/test mjnunez/footstats:tag
~~~

|    **Imagen**   | **Tiempo 1** | **Tiempo 2** | **Tiempo 3** | **Tiempo 4** | **Tiempo medio** |
|:---------------:|:------------:|:------------:|:------------:|:------------:|:----------------:|
|     node:lts    |    31,034s   |    34,471s   |    42,313s   |    44,879s   |      38,174s     |
| node:lts-alpine |    11,644s   |    14,271s   |    10,329s   |    10,258s   |      11,625s     |
|  ubuntu:latest  |    22,635s   |    14,608s   |    14,996s   |    24,387s   |      19,156s     |
|  alpine:latest  |    12,043s   |    12,674s   |    12,337s   |    11,728s   |      12,195s     |

Como podemos ver, de media es mejor el contenedor node:lts-alpine.