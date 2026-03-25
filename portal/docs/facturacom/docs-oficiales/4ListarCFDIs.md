Listar CFDI's
A continuación se explica como listar los CFDI's , con un ejemplo y la muestra de posibles respuestas obtenidas.

Podemos consultar los CFDI's filtrando por los siguientes parámetros:

Parámetro	Tipo	Requerido	Detalles
month	number	Opcional	Induca el número de mes que deseas consultar. Éste debe estar escrito en 2 dígitos. Ejemplo: Enero = 01, Diciembre = 12, etc.
year	number	Opcional	Indica el año que deseas consultar. Éste debe estar escrito en 4 dígitos. Ejemplo: 2017.
rfc	string	Opcional	Indica un RFC para traer todos los CFDI's timbrados al mismo. Ejemplo: XAXX010101000.
page	int	Opcional	Indica número de página a consultar, por default posiciona en la página 1.
per_page	int	Opcional	Indica el limite de resultados para mostrar, por default retorna 100 registros.
Construcción de la URL
Importante

El método que se utiliza para la busqueda de un CFDI es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi/list

Ejemplo: https://api.factura.com/v4/cfdi/list

TIP

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente.

PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/api/v4/cfdi/list"

payload = json.dumps({
  "month": "01",
  "year": "2024",
  "rfc": "WERX631016S30",
  "page": 1,
  "per_page": 15
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
Ejemplo de respuesta exitosa
JSON

{
    "total": 1161,
    "per_page": 15,
    "current_page": 1,
    "last_page": 75,
    "from": 1,
    "to": 15,
    "data": [
        {
            "UUID": "ed20099a-3c7d-4277-be8a-377715fbcbb2",
            "UID": "61d4c2d768a14",
            "Folio": "F 100",
            "FechaTimbrado": "2024-01-04",
            "Receptor": "XAXX010101000",
            "RazonSocialReceptor": "PRUEBAS",
            "ReferenceClient": 0,
            "Total": "259.780000",
            "Subtotal": "229.900000",
            "NumOrder": "FACT100",
            "Status": "enviada",
            "Version": "4.0"
        },
        {
            "UUID": "ed20099a-3c7d-4277-be8a-377715fbcbb2",
            "UID": "61d4c2d768a14",
            "Folio": "F 100",
            "FechaTimbrado": "2024-01-04",
            "Receptor": "XAXX010101000",
            "RazonSocialReceptor": "PRUEBAS",
            "ReferenceClient": 0,
            "Total": "259.780000",
            "Subtotal": "229.900000",
            "NumOrder": "FACT100",
            "Status": "enviada",
            "Version": "4.0"
        },
        {
            "UUID": "ed20099a-3c7d-4277-be8a-377715fbcbb2",
            "UID": "61d4c2d768a14",
            "Folio": "F 100",
            "FechaTimbrado": "2024-01-04",
            "Receptor": "XAXX010101000",
            "RazonSocialReceptor": "PRUEBAS",
            "ReferenceClient": 0,
            "Total": "259.780000",
            "Subtotal": "229.900000",
            "NumOrder": "FACT100",
            "Status": "enviada",
            "Version": "4.0"
        }
  ]
}
Ejemplo de respuesta erronea
JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "$2y$10$8a9S8o8WeiRhPh1YT6bnXun6uPs1ZdiZBUHjGwSqn3X44mbYSmY4.",
    "Secret": "$2y$10$c5KNUW06w8r9OhH4MVPNz.BgpQfjHVZjPPYsVbX13WPQZomnYtxq"
}