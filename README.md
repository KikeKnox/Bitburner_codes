# Bitburner_codes
 Códigos para el juego [Bitburner](https://danielyxie.github.io/bitburner/)
 
## ¿Qué me voy a encontrar aquí?
 Básicamente, unos códigos que he generado para mi partida de Bitburner.
 Inicialmente están separados en carpetas en función del tipo de ordenador (dentro del juego, no el tuyo personal) que se tenga y a que alturas de partida esté.
 Los más básicos:
  - init.js: Es un archivo para iniciar según se inicia el run. Ejecuta el autocomprador de la hacknet y crea archivos de autohackeo en todos los servidores.
  - hacknet.js: Es un archivo de autocompras de la hacknet.
  - kike.js: Es el archivo base para generar los archivos de autohackeo en servidores.
 
 V01: init.js puede limpiarse de algunas cosas que ya no son necesarias pero que quedaron como restos de antiguas funciones.
 
 Posibles mejoras generales:
  - hacknet.js compra la mejora más barata o un nodo nuevo, lo que sea más barato; y hasta el infinito. Es posible que sea mejor añadir un limite de nodos y que las compras vayan en función de lo que más beneficio de.
  - Crear un archivo de compraventa de acciones.
  - Hacer hackeos en home y en el servidor a hackear, en este segundo caso sin el weaken de por medio.
  - Crear un archivo de autocompra de servidores y ejecutar los mismos codigos que home.