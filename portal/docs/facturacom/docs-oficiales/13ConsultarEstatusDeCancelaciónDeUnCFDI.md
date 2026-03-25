Consultar estatus de cancelación de un CFDI
A continuación se explica como consultar el estatus de la cancelación de un CFDI con un ejemplo de como hacerlo.

Podemos consultar el estatus CFDI haciendo uso del siguiente parámetro:

Parámetro	Tipo	Requerido	Detalles
cfdi_uid	string	Requerido	Indica el UID o UUID del CFDI que deseas consultar.
Ejemplo:
55c0fdc67593d
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/uid/cancel_status

Ejemplo: https://api.factura.com/v4/cfdi40/c55df8b4-37b3-47cf-9e35-efdb4c3261b4/cancel_status Ejemplo: https://api.factura.com/v4/cfdi40/c55df8b4/cancel_status

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente. Además de reemplazar uid por el UID o UUID del CFDI que deseas consultar.

Ejemplo de estatus de CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/616d946410050/cancel_status"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta
Importante

El mensaje de respuesta puede variar dependiendo de el estatus en el que se encuentre el CFDI. Es importante mencionar que, a pesar de que el nuevo método de cancelación entró en vigor el día 1 de enero de 2022, el SAT continúa presentando problemas con el servicio de consulta. Debido a esto, es posible que al consultar un CFDI cancelado, su estatus aparezca como vigente por un tiempo.

Estatus vigente cancelable
JSON

{
    "response": "success",
    "data": {
        "CodigoEstatus": "S - Comprobante obtenido satisfactoriamente.",
        "Estado": "Vigente",
        "EsCancelable": "Cancelable sin aceptación",
        "EstatusCancelacion": []
    }
}

Estatus cancelado
JSON

{
    "response": "success",
    "data": {
        "CodigoEstatus": "S - Comprobante obtenido satisfactoriamente.",
        "Estado": "Cancelado",
        "EsCancelable": "Cancelable sin aceptación",
        "EstatusCancelacion": "Cancelado sin aceptación"
    }
}

Estatus vigente no cancelable
JSON

{
    "response": "success",
    "data": {
        "CodigoEstatus": "S - Comprobante obtenido satisfactoriamente.",
        "Estado": "Vigente",
        "EsCancelable": "No Cancelable",
        "EstatusCancelacion": []
    }
}

