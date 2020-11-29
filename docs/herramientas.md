# Herramientas

- **Lenguaje**: `TypeScript` porque es un lenguaje que se puede usar tanto para el front-end como para el back-end y permite programación asíncrona. Además es un superset de JavaScript que además permite, entre otras características, usar tipos para las variables. 
- **Tests**: `mocha` y `chai`. Mocha lo uso porque permite BDD (Behavior-Driven Development) lo cual me permite agrupar los tests en bloques (en función de su historia) y además deja más claro para que sirve cada grupo de tests. Por otro lado, chai lo escogí porque tiene varias interfaces (expect, assert y should) y me permite escoger aquella con la que me sienta más cómodo.
- **Task runner**: `npm` porque las órdenes que llevo implementadas hasta ahora no requieren más complejidad, todo lo puedo ejecutar desde npm sin problema (la aplicación, los tests, el linter).
- **Logging**: usaré `Pino`, ya que es la librería más rápida para logging debido a que trabaja en un thread a parte de la aplicación.