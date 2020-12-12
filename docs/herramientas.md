# Herramientas

- **Lenguaje**: `TypeScript` porque es un lenguaje que se puede usar tanto para el front-end como para el back-end y permite programación asíncrona. Además es un superset de JavaScript que además permite, entre otras características, usar tipos para las variables. 
- **Tests**: `jest`, ya que trae las órdenes para assert, utilidades para mocking y una herramienta para hacer los tests de cobertura. Por el contrario, `mocha` necesitaría de librerías como por ejemplo `chai` para aserciones, `sinon` para mocking y `nyc` para los tests de cobertura.
- **Task runner**: `npm` porque las órdenes que llevo implementadas hasta ahora no requieren más complejidad, todo lo puedo ejecutar desde npm sin problema (la aplicación, los tests, el linter).
- **Logging**: usaré el logger que trae `NestJS`, no es necesario descargar otro, con ese es suficiente..