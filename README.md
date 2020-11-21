# FootStats
<div align="center">
    <a href="https://github.com/ManuelJNunez/TFG/workflows/Comprueba%20README/badge.svg"><img alt="Comprueba README" src="https://github.com/ManuelJNunez/TFG/workflows/Comprueba%20README/badge.svg"></a>
    <a href="https://github.com/ManuelJNunez/footStats/workflows/linter/badge.svg"><img alt="linter" src="https://github.com/ManuelJNunez/footStats/workflows/linter/badge.svg"></a>
    <a href="https://github.com/ManuelJNunez/footStats/workflows/Node.js%20CI%20&%20Autobuild/badge.svg"><img alt="Node.js CI & Autobuild" src="https://github.com/ManuelJNunez/footStats/workflows/Node.js%20CI%20&%20Autobuild/badge.svg"></a>
    <a href="https://travis-ci.com/ManuelJNunez/footStats"><img alt="Build Status" src="https://travis-ci.com/ManuelJNunez/footStats.svg?branch=master"></a>
    <a href="https://circleci.com/gh/ManuelJNunez/footStats"><img alt="CircleCI" src="https://circleci.com/gh/ManuelJNunez/footStats.svg?style=svg"></a>
    <a href="https://codecov.io/gh/ManuelJNunez/footStats"><img alt="codecov" src="https://codecov.io/gh/ManuelJNunez/footStats/branch/master/graph/badge.svg?token=PDG35I3X2I"></a>
    <a href="https://app.netlify.com/sites/footstats/deploys"><img alt="Netlify Status" src="https://api.netlify.com/api/v1/badges/06df7745-42b4-48a5-8960-7428cca8542e/deploy-status)](https://app.netlify.com/sites/footstats/deploys"></a>
</div>


## Descripción
Este proyecto trata sobre desarrollar una API que recoge estadísticas de un partido de fútbol (como por ejemplo el número de ataques o defensas acertados o fallidos) para que los entrenadores puedan usarlo para planificar mejor los entrenamientos, pudiendo focalizarlos en lo que de verdad necesita el equipo. También se pretende desarrollar una aplicación web como front-end.

## Herramientas
- **Lenguaje**: `TypeScript` porque es un lenguaje que se puede usar tanto para el front-end como para el back-end y permite programación asíncrona. Además es un superset de JavaScript que además permite, entre otras características, usar tipos para las variables. 
- **Tests**: `mocha` y `chai`. Mocha lo uso porque permite BDD (Behavior-Driven Development) lo cual me permite agrupar los tests en bloques (en función de su historia) y además deja más claro para que sirve cada grupo de tests. Por otro lado, chai lo escogí porque tiene varias interfaces (expect, assert y should) y me permite escoger aquella con la que me sienta más cómodo.
- **Task runner**: `npm` porque las órdenes que llevo implementadas hasta ahora no requieren más complejidad, todo lo puedo ejecutar desde npm sin problema (la aplicación, los tests, el linter).
- **Logging**: usaré `Pino`, ya que es la librería más rápida para logging debido a que trabaja en un thread a parte de la aplicación.

## Órdenes para el task runner
Para iniciar esta aplicación, primero hay que instalar las dependencias del proyecto con la siguiente orden

    npm install

Para iniciar la aplicación hay que enviar la orden

    npm start

Para correr los tests ejecutar la siguiente orden

    npm run test

Para comprobar que la sintaxis/estilo del código es correcta (ejecutar el linter de ES)

    npm run lint

Para correr los tests de cobertura

    npm run coverage

Para reportar los resultados del test de cobertura hacia `codecov`

    npm run coverage-report

Para generar la documentación

    npm run doc

## Clases testadas
- [Usuario](https://github.com/ManuelJNunez/footStats/blob/master/src/models/usuario.model.ts). esta clase se usará para manejar la información de los usuarios (entrenadores) que usen la aplicación. Cada entrenador guardará en la aplicación información sobre sus partidos. Puedes ver los tests de esta clase [aquí](https://github.com/ManuelJNunez/footStats/blob/master/tests/usuario.test.ts).
- [Partido](https://github.com/ManuelJNunez/footStats/blob/master/src/models/partido.model.ts). para manejar los partidos guardados por los usuarios, así como las estadísticas de las jugadas que sucedan en los mismos. Puedes ver los tests de esta clase [aquí](https://github.com/ManuelJNunez/footStats/blob/master/tests/partido.test.ts).
- [Jugada](https://github.com/ManuelJNunez/footStats/blob/master/src/models/jugada.model.ts). para manejar la información sobre las jugadas sucedidas durante un partido. Puedes ver los tests de esta clase [aquí](https://github.com/ManuelJNunez/footStats/blob/master/tests/jugada.test.ts).

## Integración continua
He configurado tres servicios de CI y han sido los siguientes:
- GitHub Actions (este ya lo tenía antes)
- Travis
- CircleCI

La documentación sobre la Integración continua se puede encontrar [aquí](https://github.com/ManuelJNunez/footStats/tree/master/docs/ci.md).

## Enlaces de interés
Todos ellos están en el directorio docs. También se pueden consultar en [GH pages](https://manueljnunez.github.io/footStats/).
- [Creación y preparación del repositorio de GitHub y configuración de git](https://github.com/ManuelJNunez/footStats/blob/master/docs/git-setup.md)
- [Historias de Usuario](https://github.com/ManuelJNunez/footStats/blob/master/docs/HU.md)
- [Explicación de los módulos del proyecto](https://github.com/ManuelJNunez/footStats/blob/master/docs/modulos.md)
- [Siguientes pasos](https://github.com/ManuelJNunez/footStats/blob/master/docs/siguientespasos.md)
- [Documentación del Dockerfile](https://github.com/ManuelJNunez/footStats/blob/master/docs/docker.md)

## Autor
- [Manuel Jesús Núñez Ruiz](https://github.com/ManuelJNunez)

