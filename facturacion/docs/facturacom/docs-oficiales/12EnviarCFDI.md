Enviar CFDI
A continuación se explica como enviar un CFDI.

Podemos enviar un CFDI haciendo uso del siguiente parámetro:

Parámetro	Tipo	Requerido	Detalles
cfdi_uid	string	Requerido	Indica el UID o UUID del CFDI que deseas enviar.
Ejemplo:
55c0fdc67593d
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/cfdi_uid/email

Ejemplo: https://api.factura.com/v4/cfdi40/55c0fdc67593d/email

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente. Además de reemplazar cfdi_uid por el UID del CFDI que deseas enviar.

Ejemplo de enviar CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/61d4c3fe77dd8/email"

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
Ejemplo de envio exitoso de CFDI
JSON

{
    "response": "success",
    "uid": "6169fc02637e1",
    "message": "Hemos enviado tu Factura con exito al e-mail's ejemplo@mail.com"
}

