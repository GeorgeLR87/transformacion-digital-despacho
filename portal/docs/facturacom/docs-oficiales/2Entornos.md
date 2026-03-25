Entornos
El API de Factura.com cuenta con dos entornos disponibles:

Sandbox
Host: https://sandbox.factura.com/api

Es un entorno de pruebas que simula el funcionamiento de nuestra API en producción, generando CFDIs sin validez fiscal.

Importante

Es necesario solicitar una cuenta para el entorno de desarrollo sandbox antes de comenzar a utilizarlo, para esto envía un correo a soporte@factura.com

Producción
Host: https://api.factura.com

Es el host para realizar el timbrado real, te recomendamos hacer pruebas en la versión sandbox primero, ya que los CFDIs generados en este entorno si tienen validez fiscal.

Composición de la URL
Independientemente del entorno en el que estes trabajando, la estructura de la URL se compone de la siguiente forma:

Host = sandbox https://sandbox.factura.com/api o producción https://api.factura.com
Version = Versión de la API = api/v1, api/v3 ó api/v4
Endpoint = Describe el método al que se está haciendo la petición.
Por ejemplo, para traer listado de facturas en el entorno de producción la url es la siguiente:

https://api.factura.com/v1/invoices