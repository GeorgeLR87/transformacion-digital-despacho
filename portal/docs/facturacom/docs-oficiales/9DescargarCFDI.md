Descargar CFDI
A continuación se explica como descargar un CFDI 4.0

Cada CFDI puede ser descargado a través de nuestra API en dos tipos de archivo distintos:

PDF
XML
Para obtener uno u otro solo es necesario cambiar el endpoint al que estamos apuntando:

/pdf
/xml
Tambien para descargar un CFDI es necesario el uso del siguiente parámetro el cual se utiliza en la construcción del enpoint para identificar el CFDI que deseamos descargar:

Parámetro	Tipo	Requerido	Detalles
cfdi_uid	String	Requerido	Indica el UID o UUID del CFDI que deseas descargar.
Ejemplo:
55c0fdc67593d
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint PDF: /v4/cfdi40/{cfdi_uid}/pdf
Endpoint XML: /v4/cfdi40/{cfdi_uid}/xml
Ejemplo: https://api.factura.com/v4/cfdi40/55c0fdc67593d/pdf

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta e Tu Secret key por el SECRET KEY correspondiente.

Además de reemplazar cfdi_uid por el UID del CFDI que deseas descargar.

Ejemplo para descargar CFDI en formato PDF
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/61d4c3fe77dd8/pdf"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Ejemplo para descargar CFDI en formato XML
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/61d4c3fe77dd8/xml"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)