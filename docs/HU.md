# Historias de usuario

## HU0

### Descripción de alto nivel

El usuario debe de ser capaz de registrarse en la base de datos.

### Dado/Y/Entonces/Cuando

Dado un usuario que quiera usar este servicio, debe de poder registrarse para obtener un Token que le permita hacer uso del resto de funciones de la API.

## HU1

### Descripción de alto nivel

El usuario debe de ser capaz de logearse para obtener un nuevo token

### Dado/Y/Entonces/Cuando

Dado un usuario que quiera usar este servicio y ya esté registrado pero su token ha expirado, podrá logearse para obtener uno nuevo.

## HU2

### Descripción de alto nivel

El usuario debe de poder registrar un partido.

### Dado/Y/Entonces/Cuando

Dado un usuario con un token de acceso válido, podrá añadir un partido a la base de datos al cual solo tendrá acceso él. El usuario deberá añadir la fecha, hora de inicio y de fin.

## HU3

### Descripción de alto nivel

El usuario debe de ser capaz de recuperar los partidos registrados en la BD.

### Dado/Y/Entonces/Cuando

Dado un usuario con un token válido, debe de poder acceder a los partidos que ha registrado (solo a los suyos) para poder consultar las estadísticas.

## HU4

### Descripción de alto nivel

El usuario debe de ser capaz de registrar las estadísticas en el partido oportuno.

### Dado/Y/Entonces/Cuando

Dado un usuario con un token válido, debe de poder añadir en sus partidos las defensas o ataques que su equipo ha realizado bien o mal, para su posterior análisis.