# Microservicios
## Justificación técnica del microframework

He decidido usar `NestJS` por varios motivos:
- Utiliza todas las características de `TypeScript` más recientes, como por ejemplo los decoradores.
- Mientras que en otros frameworks como `express` solo existen los `Middleware`, en `NestJS` existen los Guards (determinan si una petición será manejada por la función de la ruta o no), Pipes (para transformar y validar los datos de una petición), Interceptors (inspirados en Aspect Oriented Programming, sirven para añadir lógica extra antes/después de la ejecución de un método, por ejemplo para logging).
- Tiene una estructura modular (basada en la del framework `Angular`) para separar la API de la lógica de negocio, la cual he usado de la siguiente manera (el código se encuentra en [src](https://github.com/ManuelJNunez/footStats/tree/master/src)):
  - [usuario](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario): contiene toda la lógica para manejar las peticiones de los datos de los usuarios.
    - [usuario.entity.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.entity.ts): contiene la clase que representa a los usuarios del microservicio. Los tests unitarios de esta clase se encuentran en [test/usuario.spec.ts](https://github.com/ManuelJNunez/footStats/blob/master/test/usuario.spec.ts).
    - [usuario.service.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.service.ts): maneja los objetos de la clase Usuario almacenada en [usuario.entity.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.entity.ts) y los guarda en un array. Es decir, se encarga del almacenamiento y recuperación de usuarios. Los tests unitarios de este servicio se encuentran en [src/usuario/usuario.service.spec.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.service.spec.ts).
    - [usuario.controller.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.controller.ts): aquí se encuentran implementados los manejadores de las peticiones. Los tests unitarios de este controlador se encuentran en [src/usuario/usuario.controller.spec.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.controller.spec.ts).
    - [usuario.module.ts](https://github.com/ManuelJNunez/footStats/tree/master/src/usuario/usuario.module.ts): se utiliza para organizar la estructura de la aplicación.
  - [common](https://github.com/ManuelJNunez/footStats/tree/master/src/common): contiene los middlewares, guards, interceptors,...
- Usa `express` por debajo, un framework de microservicios muy robusto, aunque también puede usarse con `Fastify`.

## Diseño de la API

Como he dicho en el anterior apartado, he usado la estructura de directorios de `NestJS` para desacoplar la lógica de negocio de la API. Las rutas implementadas son las siguientes:

En [src/app.controller.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/app.controller.ts) se encuentra la siguiente ruta:
- **GET /status**. Sirve para saber si el servidor está online. En caso afirmativo devuelve estado 200 OK y un mensaje en formato JSON. El test unitario del manejador de la ruta se encuentra en [src/app.controller.spec.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/app.controller.spec.ts) y su test de integración está en [test/app.e2e-spec.ts](https://github.com/ManuelJNunez/footStats/blob/master/test/app.e2e-spec.ts).

En [src/usuario/usuario.controller.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/usuario/usuario.controller.ts) se encuentran las siguientes rutas las cuales han servidor para avanzar en [HU0](https://github.com/ManuelJNunez/footStats/issues/3) y [HU1](https://github.com/ManuelJNunez/footStats/issues/4) (los tests de integración se encuentran en [test/usuario.e2e-spec.ts](https://github.com/ManuelJNunez/footStats/blob/master/test/usuario.e2e-spec.ts)):
- **POST /user/login**. Su utilidad es retornar al usuario un JWT para poder usar el resto de endpoints de la clase UsuarioController, excepto el POST /user. Para ello recibe un objeto del tipo [LoginDTO](https://github.com/ManuelJNunez/footStats/blob/master/src/usuario/dto/login.dto.ts) en el body de la petición. El token se genera en el método generarToken de [usuario.service.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/usuario/usuario.service.ts), el cual antes revisa que la combinacion email-password es correcta y en caso afirmativo firma un token que contiene la información del usuario (ID, email y nickname) en el PayLoad usando la password secreta que contiene la variable de entorno JWT_SECRET. Después, se le manda el token al usuario con estado 200 OK. En caso de no ser correcta la combinación email-pass se lanza una excepción para devolverle al usuario estado 401 UNAUTHORIZED.

- **POST /user**. Sirve para registrar a usuario nuevos. Recibe un objeto del tipo [CreateUserDTO](https://github.com/ManuelJNunez/footStats/blob/master/src/usuario/dto/create-user.dto.ts) y se usa un ValidationPipe implementado ya por el microframework que se encarga de revisar si de verdad lo que viene en el body es un objeto del tipo anterior. Llama al método create de UsuarioService, el cual revise que no haya un usuario registrado anteriormente con el mismo email y nickname. En caso afirmativo devuelve 201 CREATED y en caso de fallo devuelve 400 BAD REQUEST.

- **GET /user**. Devuelve al usuario su propia información. Hace uso del [Guard](https://github.com/ManuelJNunez/footStats/blob/master/src/common/guards/auth.guard.ts) que implementé (y [testeé](https://github.com/ManuelJNunez/footStats/blob/master/src/common/guards/auth.guard.spec.ts)) para comprobar la validez del JWT que viene en los headers de la petición (campo Authorization), el cual comprueba la validez, integridad y si está expirado o no. Si el JWT no es válido, ha sido modificado por el usuario o ha expirado, no le deja usar este endpoint y devuelve 403 FORBIDDEN. El manejador usa el token que viene en los headers para decodificarlo y obtener el email del usuario. A continuación hace uso del método findById de UsuarioService. En caso de que el usuario use un JWT válido y exista devuelve 200 OK, en caso de no existir (por haber sido eliminado) devuelve 404 NOT FOUND.

- **PUT /user**. Modifica el objeto de tipo Usuario. Hace uso del Guard de autenticación explicado anteriormente y del ValidationPipe. Recoge el id del JWT pasado en los headers y modifica el usuario haciendo uso del CreateUserDTO pasado en el body de la petición. Hace uso del método update de UsuarioService. En caso de realizar la petición con éxito devuelve 200 OK. Si ocurre una expcepción por e-mail o nicknames ya registrados, devuelve 400 BAD REQUEST.

- **DELETE /user**. Elimina el usuario. Hace uso del Guard para la autenticación. Si el usuario existe lo elimina y devuelve 200 OK. En caso de excepción devuelve 400 BAD REQUEST.

## Uso de buenas prácticas
### Logging

Para esto, he implementado el [LoggerInterceptor](https://github.com/ManuelJNunez/footStats/blob/master/src/common/interceptors/logger.interceptor.ts), el cual se encarga de manejar las respuestas de los manejadores para recogerla en los logs. También maneja las excepciones producidas para registrarlas. Se ha usado el Logger de `NestJS` por lo cual no es necesario instalar otra librería para logging.

### Configuración dsitribuida

He implementado un servicio para poder hacer uso de `etcd` el cual se encuentra en [src/etcd/etcd.service.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/etcd/etcd.service.ts). Sus tests unitarios se han escrito en [este fichero](https://github.com/ManuelJNunez/footStats/blob/master/src/etcd/etcd.service.spec.ts). Si no se encuentra activo el servidor de `etcd`, hace uso de variables de entorno.

### Middleware

No he usado middleware como tal, he usado las variantes que proporciona `NestJS` anteriormente descritas para implementar el [LoggerInterceptor](https://github.com/ManuelJNunez/footStats/blob/master/src/common/interceptors/logger.interceptor.ts) y el [AuthGuard](https://github.com/ManuelJNunez/footStats/blob/master/src/common/guards/auth.guard.ts).

## Contendor para despliegue

Se ha implementado [Dockerfile.prod](https://github.com/ManuelJNunez/footStats/blob/master/Dockerfile.prod), el cual parte de Alpine, compila el proyecto a JavaScript, instala las dependencias de desarrollo y arranca la API llamando a `npm run start:docker`. Dicho script hace uso de la orden pm2-runtime que es la que recomiendan en la [documentación](https://pm2.keymetrics.io/docs/usage/docker-pm2-nodejs/) para usar en un Dockerfile para producción.

Se lanza con:

    docker run --env JWT_SECRET=\<tu-secreto> -p 3000:3000 production 

## Próximos pasos:

- Conectar los logs a una plataforma externa, tal como `Papertrail` o `logDNA`.
- Implementar los endpoints para Partido y Jugada. Ahora mismo tengo implementado [partido.entity.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/partido/partido.entity.ts) y [jugada.entity.ts](https://github.com/ManuelJNunez/footStats/blob/master/src/jugada/jugada.entity.ts). Con sus tests respectivos en [test/jugada.spec.ts](https://github.com/ManuelJNunez/footStats/blob/master/test/jugada.spec.ts) y en [test/partido.spec.ts](https://github.com/ManuelJNunez/footStats/blob/master/test/partido.spec.ts).
- Hacer uso de la configuración distribuida en el despliegue de este microservicio.
