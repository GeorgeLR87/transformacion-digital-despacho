Buscar CFDI
Por UID
A continuación se explica como buscar un CFDI por UID, con un ejemplo y la muestra de posibles respuestas obtenidas.

Tip

Es importante tomar en cuenta que el valor UID es distinto a el valor UUID ya que en el nombre son muy similares pero utilizan diferente endpoint, mas delante se muestran detalles de su uso y caracteristicas.

Podemos buscar un CFDI utilizando el UID como parámetro y obtener la información relacionada con este, a continuación se muestran las características de este valor.

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador interno para la plataforma de Factura.com asignado al CFDI cuando lo creamos
Construcción de la URL
Importante

El método que se utiliza para la busqueda de un CFDI es de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi/uid/{UID de tu CFDI}

Ejemplo: https://api.factura.com/v4/cfdi/uuid/1a7cf8f9-3406-4024-9028-84266cab1f13

Tip

Para probar el código de ejemplo es necesario que reemplaces el valor del UID por el que necesitas buscar en tu cuenta y el texto "Tu API key" por el API key de tu cuenta y "Tu Secret key" por el Secret key correspondiente a tu cuenta.

Ejemplo
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi/uid/63389a6a27f88"

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
Ejemplo de respuesta exitosa
JSON

{
    "status": "success",
    "message": "CFDI obtenido exitosamente",
    "data": {
        "RazonSocialReceptor": "ALBA XKARAJAM MENDEZ",
        "Folio": "F 693",
        "UID": "63389a6a27f88",
        "UUID": "1a7cf8f9-3406-4024-9028-84266cab1f13",
        "Subtotal": "400.000000",
        "Total": "745.480000",
        "ReferenceClient": 0,
        "NumOrder": null,
        "Receptor": "XAMA620210DQ5",
        "FechaTimbrado": "2022-10-01",
        "Status": "enviada",
        "Version": "4.0",
        "TipoDocumento": "F",
        "XML": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...................
    }
}

Ejemplo de respuesta erronea
JSON

{
    "status": "error",
    "message": "No se encontró CFDI: 63389a627f88"
}

Ejemplo de respuesta erronea de autenticación
JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe"
}

Por UUID
A continuación se explica como buscar un CFDI por UUID, con un ejemplo y la muestra de posibles respuestas obtenidas.

Tip

Es importante tomar en cuenta que el valor UID es distinto a el valor UUID ya que en el nombre son muy similares pero utilizan diferente endpoint, mas delante se muestran detalles de su uso y caracteristicas.

Podemos buscar un CFDI utilizando el UUID como parámetro y obtener la información relacionada con este, a continuación se muestran las características de este valor.

Parámetro	Tipo	Requerido	Detalles
UUID	String	Requerido	Es el identificador unico que asigna el SAT a nuestro CFDI cuando lo timbramos, otra forma en la que lo podemos encontrar es como "Folio fiscal"
Construcción de la URL
Importante

El método que se utiliza para la busqueda de un CFDI es de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi/uuid/{UUID de tu CFDI}

Ejemplo: https://api.factura.com/v4/cfdi/uuid/1a7cf8f9-3406-4024-9028-84266cab1f13

Tip

Para probar el código de ejemplo es necesario que reemplaces el valor del UID por el que necesitas buscar en tu cuenta y el texto "Tu API key" por el API key de tu cuenta y "Tu Secret key" por el Secret key correspondiente a tu cuenta.

Ejemplo
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi/uuid/1a7cf8f9-3406-4024-9028-84266cab1f13"

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
Ejemplo de respuesta exitosa
JSON

{
    "status": "success",
    "message": "CFDI obtenido exitosamente",
    "data": {
        "RazonSocialReceptor": "ALBA XKARAJAM MENDEZ",
        "Folio": "F 693",
        "UID": "63389a6a27f88",
        "UUID": "1a7cf8f9-3406-4024-9028-84266cab1f13",
        "Subtotal": "400.000000",
        "Total": "745.480000",
        "ReferenceClient": 0,
        "NumOrder": null,
        "Receptor": "XAMA620210DQ5",
        "FechaTimbrado": "2022-10-01",
        "Status": "enviada",
        "Version": "4.0",
        "TipoDocumento": "F",
        "XML": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...................
    }
}

Ejemplo de respuesta erronea al introducir un UUID que no existe
JSON

{
    "status": "error",
    "message": "No se encontró CFDI: 1a7cf8f9-3406-4024-9028-84266ab1f13"
}

Ejemplo de respuesta erronea de autenticación
JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe"
}

Por Folio
A continuación se explica como buscar un CFDI por Folio, con un ejemplo y la muestra de posibles respuestas obtenidas.

Podemos buscar un CFDI utilizando el Folio como parámetro y obtener la información relacionada con este, a continuación se muestran las características de este valor.

Parámetro	Tipo	Requerido	Detalles
Folio	String	Requerido	Este valor se asigna al crear un nuevo CFDI dependiendo de la serie que utilicemos para el control de nuestros consecutivos y consta de la letra de esta serie + el consecutivo, por ejemplo: "F693" o "f693" (Es importante introducir sin espacios el folio que buscamos y puede ser en mayúsculas o minúsculas)
Construcción de la URL
Importante

El método que se utiliza para la busqueda de un CFDI es de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi/folio/{Folio de tu CFDI}

Ejemplo: https://api.factura.com/v4/cfdi/folio/F693

Tip

Para probar el código de ejemplo es necesario que reemplaces el valor del Folio por el que necesitas buscar en tu cuenta y el texto "Tu API key" por el API key de tu cuenta y "Tu Secret key" por el Secret key correspondiente a tu cuenta.

Ejemplo
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi/folio/F693"

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
Ejemplo de respuesta exitosa
JSON

{
    "status": "success",
    "message": "CFDI obtenido exitosamente",
    "data": {
        "RazonSocialReceptor": "ALBA XKARAJAM MENDEZ",
        "Folio": "F 693",
        "UID": "63389a6a27f88",
        "UUID": "1a7cf8f9-3406-4024-9028-84266cab1f13",
        "Subtotal": "400.000000",
        "Total": "745.480000",
        "ReferenceClient": 0,
        "NumOrder": null,
        "Receptor": "XAMA620210DQ5",
        "FechaTimbrado": "2022-10-01",
        "Status": "enviada",
        "Version": "4.0",
        "TipoDocumento": "F",
        "XML": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>...................
    }
}

Ejemplo de respuesta erronea al introducir un folio que no existe
JSON

{
    "status": "error",
    "message": "No se encontró CFDI: F6934"
}

Ejemplo de respuesta erronea de autenticación
JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe"
}
