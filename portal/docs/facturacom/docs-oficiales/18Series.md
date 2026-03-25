Series
Listar series
A continuación se explica como listar las series, con un ejemplo y muestra de posibles respuestas obtenidas.

Podemos consultar todas las series correspondientes a la empresa

Construcción de la URL
Importante

El método que se utiliza para listar todas las series es de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/series

Ejemplo: https://api.factura.com/v4/series

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para listado de series
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/series"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta
Respuesta exitosa
JSON

{
    "status": "success",
    "data": [
        {
            "SerieID": 19843,
            "SerieName": "R",
            "SerieType": "factura",
            "SerieDescription": "Factura",
            "SerieStatus": "Activa"
        },
        {
            "SerieID": 18379,
            "SerieName": "COP",
            "SerieType": "pago",
            "SerieDescription": "Complemento Pago",
            "SerieStatus": "Activa"
        },
        {
            "SerieID": 17813,
            "SerieName": "NDB",
            "SerieType": "nota_debito",
            "SerieDescription": "Nota de Débito",
            "SerieStatus": "Activa"
        },
        {
            "SerieID": 17327,
            "SerieName": "RT",
            "SerieType": "retencion",
            "SerieDescription": "Retención",
            "SerieStatus": "Activa"
        }
    ]
}

Ejemplo de respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}

Listar serie por UID
A continuación se explica como listar una serie por el UID asignado, con un ejemplo y muestra de posibles respuestas obtenidas.

Podemos listar una serie con los siguientes parametros

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador unico asignado a la serie
Construcción de la URL
Importante

El método que se utiliza para listar una serie es de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/series/UID

Ejemplo: https://api.factura.com/v4/series/UID

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente. Ademas de la palabra UID por el UID correspondiente a la serie que deseamos consultar.

Ejemplo para listar una serie por UID
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/series/19843"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta
Respuesta exitosa
JSON

{
    "status": "success",
    "data": {
        "SerieID": 19843,
        "SerieName": "R",
        "SerieType": "factura",
        "SerieDescription": "Factura",
        "SerieStatus": "Activa"
    }
}

Ejemplo de respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}

Crear nueva serie
A continuación se explica el método con el cual podremos crear una nueva serie para nuestros comprobantes, con un ejemplo y muestra de posibles respuestas obtenidas.

Podemos crear una nueva serie haciendo uso de los siguientes parametros:

Parámetro	Tipo	Requerido	Detalles
 letra	 String	 Requerido	 Con este parametro podemos definir una letra como identificador para la serie que vamos a crear
 tipoDocumento	 String	 Requerido	
 Inica el tipo de CFDI o documento que corresponde a la serie

El tipo de documento lo puedes consultarla en este catalogo.

Ejemplo:
"tipoDocumento": "factura",

 folio	 Numerico	 Opcional	 Se utiliza para indicar si queremos que el contador de nuestra serie inicialice en algun numero personalizado, si este campo no se envia por defecto el consecutivo de la serie se inicia en 1
Construcción de la URL
Importante

El método que se utiliza para la creación de una serie es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/series/create

Ejemplo: https://api.factura.com/v4/series/create

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para crear una serie
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/series/create"

payload = json.dumps({
  "letra": "RR",
  "tipoDocumento": "factura",
  "folio": 1
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Respuesta
Respuesta exitosa
JSON

{
    "response": "success",
    "message": "Serie creada correctamente"
}

Ejemplo de respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}

Desactivar una serie
A continuación se explica el método con el cual podremos desactivar una serie de nuestra cuenta.

Importante

Es importante tomar en cuenta que al crear una nueva serie esta se genera activada por default

Podemos desactivar una serie con los siguientes parametros

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador unico asignado a la serie
Construcción de la URL
Importante

El método que se utiliza para desactivar una serie es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/series/UID/down

Ejemplo: https://api.factura.com/v4/series/UID/down

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para desactivar una serie
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/series/19844/down"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Respuesta
Ejemplo de respuesta exitosa.
JSON

{
    "status": "success",
    "messsage": "La serie se pausó correctamente"
}

Ejemplo de respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}

Activar una serie
A continuación se explica el método con el cual podremos activar una serie de nuestra cuenta.

Importante

Es importante tomar en cuenta que al crear una nueva serie esta se genera activada por default

Podemos activar una serie con los siguientes parametros

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador unico asignado a la serie
Construcción de la URL
Importante

El método que se utiliza para activar una serie es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/series/UID/up

Ejemplo: https://api.factura.com/v4/series/UID/up

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para activar una serie
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/series/19844/up"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Respuesta
Ejemplo de respuesta exitosa.
JSON

{
    "status": "success",
    "messsage": "La serie se activó correctamente"
}

Ejemplo de respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}

Eliminar una serie
A continuación se explica el método con el cual podremos eliminar una serie.

Podemos eliminar una serie utilizando los siguientes parametros

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador unico asignado a la serie
Construcción de la URL
Importante

El método que se utiliza para la eliminación de una serie es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/series/UID/drop

Ejemplo: https://api.factura.com/v4/series/UID/drop

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para eliminar una serie
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/series/19845/drop"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Respuestas
Ejemplo de respuesta exitosa.
JSON

{
    "status": "success",
    "message": "Serie eliminada correctamente"
}

Ejemplo de respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}
