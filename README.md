# FootStats
<div align="center">
    <a href="https://github.com/ManuelJNunez/TFG/workflows/Comprueba%20README/badge.svg"><img alt="Comprueba README" src="https://github.com/ManuelJNunez/TFG/workflows/Comprueba%20README/badge.svg"></a>
    <a href="https://github.com/ManuelJNunez/footStats/workflows/linter/badge.svg"><img alt="linter" src="https://github.com/ManuelJNunez/footStats/workflows/linter/badge.svg"></a>
    <a href="https://github.com/ManuelJNunez/footStats/workflows/Node.js%20CI%20&%20Autobuild/badge.svg"><img alt="Node.js CI & Autobuild" src="https://github.com/ManuelJNunez/footStats/workflows/Node.js%20CI%20&%20Autobuild/badge.svg"></a>
    <a href="https://github.com/ManuelJNunez/footStats/workflows/Firebase%20CD/badge.svg"><img alt="Firebase CD" src="https://github.com/ManuelJNunez/footStats/workflows/Firebase%20CD/badge.svg"></a>
    <a href="https://travis-ci.com/ManuelJNunez/footStats"><img alt="Build Status" src="https://travis-ci.com/ManuelJNunez/footStats.svg?branch=master"></a>
    <a href="https://circleci.com/gh/ManuelJNunez/footStats"><img alt="CircleCI" src="https://circleci.com/gh/ManuelJNunez/footStats.svg?style=svg"></a>
    <a href="https://codecov.io/gh/ManuelJNunez/footStats"><img alt="codecov" src="https://codecov.io/gh/ManuelJNunez/footStats/branch/master/graph/badge.svg?token=PDG35I3X2I"></a>
    <a href="https://app.netlify.com/sites/footstats/deploys"><img alt="Netlify Status" src="https://api.netlify.com/api/v1/badges/06df7745-42b4-48a5-8960-7428cca8542e/deploy-status"></a>
</div>


## Descripción
Este proyecto trata sobre desarrollar una API que recoge estadísticas de un partido de fútbol (como por ejemplo el número de ataques o defensas acertados o fallidos) para que los entrenadores puedan usarlo para planificar mejor los entrenamientos, pudiendo focalizarlos en lo que de verdad necesita el equipo. También se pretende desarrollar una aplicación web como front-end.

## Órdenes para el task runner
### Instalación de dependencias

    npm install

### Transpilar a JavaScript

    npm run build

### Arrancar para desarrollo

    npm start

### Arrancar para producción

    npm run start:prod

### Arrancar para producción en un contenedor

    npm run start:docker

### Testear

    npm test

### Ejecutar ESlint

    npm run lint

### Formatear el código (`prettier`)

    npm run format

### Tests de cobertura

    npm run test:cov

### Reportar resultados a `codecov`

    npm run coverage-report

### Generar documentación

    npm run doc

## Platform as a Service

Se ha utilizado Heroku para el despliegue del microservicio. Puede encontrar toda la información sobre el despliegue así como de la implementación de la base de datos [aquí](https://github.com/ManuelJNunez/footStats/blob/master/docs/heroku.md).

## Enlaces de interés
Todos ellos están en el directorio docs. También se pueden consultar en [GH pages](https://manueljnunez.github.io/footStats/).
- [Creación y preparación del repositorio de GitHub y configuración de git](https://github.com/ManuelJNunez/footStats/blob/master/docs/git-setup.md)
- [Historias de Usuario](https://github.com/ManuelJNunez/footStats/blob/master/docs/HU.md)
- [Herramientas usadas](https://github.com/ManuelJNunez/footStats/blob/master/docs/herramientas.md)
- [Explicación de los módulos del proyecto](https://github.com/ManuelJNunez/footStats/blob/master/docs/modulos.md)
- [Siguientes pasos](https://github.com/ManuelJNunez/footStats/blob/master/docs/siguientespasos.md)
- [Documentación del Dockerfile](https://github.com/ManuelJNunez/footStats/blob/master/docs/docker.md)
- [Integración Continua](https://github.com/ManuelJNunez/footStats/blob/master/docs/ci.md)
- [Serverless](https://github.com/ManuelJNunez/footStats/blob/master/docs/serverless.md)
- [Microservicios](https://github.com/ManuelJNunez/footStats/blob/master/docs/microservicios.md)

## Autor
- [Manuel Jesús Núñez Ruiz](https://github.com/ManuelJNunez)

