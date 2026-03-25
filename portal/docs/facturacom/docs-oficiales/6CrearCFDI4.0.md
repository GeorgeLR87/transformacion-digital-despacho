Crear CFDI 4.0
A continuación se explica como crear un CFDI, con un ejemplo y muestra de posibles respuestas obtenidas.

Importante

Recuerda que aunque estés en el modo de pruebas (Sandbox) es necesario que los datos sean reales. Es decir, las API KEY, SECRET KEY, Id de serie y UID de cliente deben ser tomados de tu cuenta en el panel de https://sandbox.factura.com. Además, la Clave de producto/servicio, unidad de medida y clave de unidad de medida deben ser tomados de los catálogos oficiales del SAT.

Podemos crear un CFDI haciendo uso de los siguientes parametros:

Parámetro	Tipo	Requerido	Detalles
Receptor	array	Requerido	Indica el UID del receptor/cliente previamente creado en Factura.com

Ver listado de atributos posibles para este nodo.

Ejemplo:
"Receptor":
{
"ResidenciaFiscal": "",
"UID": "55c0fdc67593d",
"RegimenFiscalR": "612"
}
TipoDocumento	string	Requerido	Indica la clave del tipo de documento que deseas timbrar.

Ver listado de tipos de documentos.

Ejemplo:
"TipoDocumento": "factura"
RegimenFiscal	number	Opcional	Indica la clave del régimen fiscal del emisor, si este campo no se manda, se usará la clave del régimen que está en la configuración de la empresa.

Ver listado de claves de régimen fiscal.

Ejemplo:
"RegimenFiscal": "601"
BorradorSiFalla	string	Opcional	Esta bandera funciona para crear un borrador al intentar timbrar un CFDI que contenga algun error en su construcción, al estar activa crearemos un CFDI y en caso de que presente algun error que no permita el timbrado el formato con la informacion enviada generara un borrador el cual podremos recuperar para corregirlo

Los valores admitidos son "0" para falso y "1" para verdadero, por defecto si no se envia se interpeta como falso
Ejemplo:
"BorradorSiFalla": "1"
Draft	string	Opcional	Esta bandera se utiliza para generar un borrador de CFDI, al utilizarla los datos enviados seran directamente guardados en un borrador estos datos deben cumplir con las caractreisticas minimas de timbrado de CFDI para generar un borrador por lo que no s puede almacenar cualquier información

Los valores admitidos son "0" para falso y "1" para verdadero, por defecto si no se envia se interpreta como falso
Ejemplo:
"Draft": "1"
Conceptos	array	Requerido	Es un arreglo de objetos, en el que cada objeto corresponde a un concepto con sus atibutos para agregar al CFDI.

Ver listado de atributos posibles para este nodo.

Ejemplo:
"Conceptos": [
{
"ClaveProdServ": "43232408",
"NoIdentificacion": "0021",
"Cantidad": "1.000000",
"ClaveUnidad": "E48",
"Unidad": "Unidad de servicio",
"Descripcion": "Desarrollo web a la medida",
"ValorUnitario": "15000.000000",
"Importe":
"15000.000000",
"Descuento": "0",
"ObjetoImp":"02",
"Impuestos": {
"Traslados": [
{
"Base":
"15000.000000",
"Impuesto": "002",
"TipoFactor": "Tasa",
"TasaOCuota": "0.16",
"Importe": "2400.000000"
}
],
"Retenidos": [],
"Locales": []
},
}
]
UsoCFDI	string	Requerido	Indica la clave del Uso de CFDI, ésta debe ser válida para el SAT.

Ver catálogo de claves de uso de cfdi.

Ejemplo:
"UsoCFDI": "G01"
Serie	number	Requerido	Indica id de la serie con la que deseas timbrar el documento.

Ésta debe estar dada de alta en tu panel de Factura.com y coincidir con el tipo de CFDI que deseas timbrar. Para obtenerlo Inicia sesión y dirígete al Menú lateral - Configuraciones - Series y folios​

Ejemplo:
"Serie": 1247
FormaPago	string	Requerido	Indica la clave de la forma de pago.

Ésta puedes consultarla en el Catálogo de formas de pago.

Ejemplo:
"FormaPago": "01"
MetodoPago	string	Requerido	Indica la clave del método de pago

Ésta puedes consultarla en el Catálogo de métodos de pago.

Ejemplo:
"MetodoPago": "PUE",
CondicionesDePago	string	Opcional	Indica las condiciones de pago del CFDI, éstas deben tener una longitud minima de 1 y máxima de 1000 caracteres.

Ejemplo:
"CondicionesDePago": "Pago en 9 meses"
CfdiRelacionados	array	Opcional	En caso que tu CFDI vaya relacionado con otro(s), envía un arreglo con el/los UUID's con los que está relacionado.

Ver listado de atributos posibles para este nodo.

Ejemplo:
"CfdiRelacionados": {
"TipoRelacion": "01",
"UUID": [
"29c98cb2-f72a-4cbe-a297-606da335e187",
"a96f6b9a-70aa-4f2d-bc5e-d54fb7371236"
]
}
Moneda	string	Requerido	Indica la clave de la moneda del CFDI.

Ésta puedes consultarla en el Catálogo de monedas

Ejemplo:
"Moneda": "MXN"
TipoCambio	string	Opcional / Requerido en caso que el atributo Moneda sea diferente de MXN	Indicar el tipo de cambio vigente al momento de crear el CFDI.

Ejemplo:
"TipoCambio": "19.85"
NumOrder	string	Opcional	Indica el número de orden o pedido.

Este dato es solo para control interno.

Ejemplo:
"NumOrder": "85abf36"
FechaFromAPI	string	Opcional	Indica una fecha con formato (Y-m-d\TH: m :s).

Es posible enviar hasta 72 horas de atraso a la fecha actual, sin embargo no están permitidas las fechas futuras.

Ejemplo:
"FechaFromAPI": "2020-03-20\T12:53:23"
Comentarios	string	Opcional	Indica si deseas que aparezcan comentarios en el PDF de tu CFDI.

Ejemplo:
"Comentarios": "El pedido aún no es entregado"
Cuenta	string	Opcional	En caso de desearlo, indica los últimos 4 dígitos de la tarjeta o cuenta bancaria del cliente.

Ejemplo:
"Cuenta": "0025"
EnviarCorreo	bolean	Opcional	Indica si deseas que el CFDI se envíe a tu cliente por correo electrónico. Por default esta opción es true.

Ejemplo:
"EnviarCorreo": "true"
LugarExpedicion	string	Opcional	Indica el Código postal del lugar de expedición del CFDI.

Éste debe tener 5 caracteres.

Ejemplo:
"LugarExpedicion": "44650"
Importante

Es necesario que envíes los valores (precios, cálculo de impuestos, subtotales, etc) de acuerdo a tus necesidades. Esto incluye número de decimales y redondeos.

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/create

Ejemplo: https://api.factura.com/v4/cfdi40/create

Importante

Por disposición del SAT los valores de traslados, descuentos, precios, etc, deberán tener hasta 6 decimales. El redondeo debe ser a 2 decimales y aplica solamente a subtotales, suma de traslados y suma de retenidos.

Ejemplo para crear CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create"

payload = json.dumps({
  "Receptor": {
    "UID": "6169fc02637e1"
  },
  "TipoDocumento": "factura",
  "RegimenFiscal": 601,
  "Conceptos": [
    {
      "ClaveProdServ": "81112101",
      "Cantidad": 1,
      "ClaveUnidad": "E48",
      "Unidad": "Unidad de servicio",
      "ValorUnitario": 229.9,
      "Descripcion": "Desarrollo a la medida",
      "ObjetoImp":"02",
      "Impuestos": {
        "Traslados": [
          {
            "Base": 229.9,
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.16",
            "Importe": 36.784
          }
        ],
        "Locales": [
          {
            "Base": 229.9,
            "Impuesto": "ISH",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.03",
            "Importe": 6.897
          }
        ]
      }
    }
  ],
  "UsoCFDI": "P01",
  "Serie": 17317,
  "FormaPago": "03",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "EnviarCorreo": False
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Ejemplo para crear CFDI Exento
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create"

payload = json.dumps({
  "Receptor": {
    "UID": "6169fc02637e1"
  },
  "TipoDocumento": "factura",
  "Conceptos": [
    {
      "ClaveProdServ": "81112101",
      "Cantidad": 1,
      "ClaveUnidad": "E48",
      "Unidad": "Unidad de servicio",
      "ValorUnitario": 229.9,
      "Descripcion": "Desarrollo a la medida",
      "ObjetoImp":"02",
      "Impuestos": {
        "Traslados": [
          {
            "Base": 229.9,
            "Impuesto": "002",
            "TipoFactor": "Exento",
            "TasaOCuota": "0.00",
            "Importe": 0
          }
        ]
      }
    }
  ],
  "UsoCFDI": "G03",
  "Serie": 17317,
  "FormaPago": "03",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "EnviarCorreo": False
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Respuesta
Ejemplo de respuesta exitosa
JSON

{
  "response": "success",
  "message": "Factura creada y enviada satisfactoriamente",
  "UUID": "8ff503a2-c6b7-4a25-XXX-a25610e6b488",
  "uid": "5c06fa8b3bbe6",
  "SAT": {
    "UUID": "8ff503a2-c6b7-XXX-92c7-a25610e6b488",
    "FechaTimbrado": "2018-12-04T16:07:08",
    "NoCertificadoSAT": "20001000000300022323",
    "Version": "1.1",
    "SelloSAT": "lzlv2bEVsjx8XkiJHJvlfCjr7xJ/laxZnvSmGSKF3C/HI9WFDYFFk4NfGyILBj8ll7m1VoCqlkSLvu9dRex4jSSGfPJOPGDrx7w/4AOj/scHPU23uIPhztnaHIYHKg9UxP4L9rgX814msJ8V86IXZ1nY7akr77Cpf2c2yAnHaO1fm81oQIe32obIs2GrOey6JG9oxQNrcUawSXXXXXXXX",
    "SelloCFD": "NJQH6WT8eLxAeti7pUWhB7F6C6xrdSqkFfORf3+SeGkhu+5E0cZZUQjgaSZLpPcgk01aQUf0Jayw2GewYou5MjD4OLzZnZuizPwy3cSfQXzgX6sJTtAsI00VyhQewxLYDSMqFUrPpniNQG8Nl/eEg1kx72kkmqih2KX2Z+URkhx14W7CMG2aMJnhDyZuyliF+cy3utjXwzxQMl+28A/mgnlfUXzZd/3IunTtxM/p4bpqbYinK+7Bd/n+90Z6axsFBs6N7wxUX6aK9YL58owhgVGXXXXXXXX"
  },
  "INV": {
    "Serie": "F",
    "Folio": 1433
  },
  "invoice_uid": "5c06fa8b3bXXX"
}

Ejemplo de respuesta de error
JSON

{
  "response": "error",
  "message": {
    "message": "CFDI33161 - El valor del campo Importe o que corresponde a Traslado no se encuentra entre el limite inferior y superior permitido.",
    "messageDetail": "Comprobante:Concepto:Impuestos:Traslado:Importe: El Importe es mayor o menor al limite superior/inferior calculado. LimiteSuperiorCalculado: 17 LimiteInferiorCalculado: 15 Comprobante:Concepto:Impuestos:Traslado:Importe: 19",
    "data": null,
    "status": "error"
  },
  "xmlerror": "\n</cfdi:Traslados></cfdi:Impuestos></cfdi:Concepto></cfdi:Conceptos></cfdi:Traslados></cfdi:Impuestos></cfdi:Comprobante>\n"
}

Ejemplo de error al crear CFDI numero de orden repetido
JSON

{
    "response": "error",
    "message": "Ya existe un CFDI con folio y serie [F-1]",
    "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<cfdi:Comprobante xmlns:cfdi=\"http://www.sat.gob.mx/cfd/3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd\" Version=\"3.3\" Serie=\"F\" Folio=\"1\" Fecha=\"2021-04-18T10:26:27\" FormaPago=\"02\" NoCertificado=\"30001000000400002330\" SubTotal=\"1635.48\" Moneda=\"MXN\" Total=\"2502.28\" TipoDeComprobante=\"I\" MetodoPago=\"PUE\" LugarExpedicion=\"45562\" Sello=\"TPFAOe/vqOpiyVRMKzO4yd5ZEG4g3RwBTTd/FfbLNvPYtmFh8Stra9gFDgXRcI43NSh6ABgz5+Tum+5KYYeoTwRF3LY7O5iww3lzSe8pJZJuBrUyONeFIzWkmdW9SIfZJdYjT6M5G2zNOxTodtk7/8kEFF0mSQZoeXZ1Z5X+jBHmxSy2sqWheuJJP92TVhstRRqwOgNGxqGoQUNebNPlWn2cAxsesc5hJkajj1D/RAkHl0eHLsdFQTf7f8yRUu5vnn3RtdVYn7zsx4uXdQE9kgGFVYv+FNrsj/chtF0GAL6D0liIFlA2fdDVgh7ulxr0eexVC5kNjV4xzKTay3IRGw==\" Certificado=\"MIIFijCCA3KgAwIBAgIUMzAwMDEwMDAwMDA0MDAwMDIzMzAwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWRpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMTkwNTI5MTgzNzQyWhcNMjMwNTI5MTgzNzQyWjCBsTEdMBsGA1UEAxMUSU5HUklEIFhPREFSIEpJTUVORVoxHTAbBgNVBCkTFElOR1JJRCBYT0RBUiBKSU1FTkVaMR0wGwYDVQQKExRJTkdSSUQgWE9EQVIgSklNRU5FWjEWMBQGA1UELRMNWE9KSTc0MDkxOVU0ODEbMBkGA1UEBRMSWE9KSTc0MDkxOU1RVERNTjAyMR0wGwYDVQQLExRJTkRSSUQgWE9EQVIgSklNRU5FWjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIo8voRABIB6aqN9pU3lJWSPo0mMx/rC5lUuN+qwTuwDfq156to9eJ5tQIy+O5YYDo8bcZFsNNm20c/xN9W5jcTCOEQw8C9Vt3YBxvW5Mn5h+v4AwveeN2UTGP/hTKx7Kh1RueULx7LzJgY80CJHONRPymjfNj+E+t77ZhiyO2JHSU/YtoKzmy69/UzAobRJ3uCI2OR5ulgIvTAYlCo1JWcWzRvzLRLnFS9jqMgzMc3z8LESddrWJH8C/CZlSkUuVvZX0QwaNoCr0BkBC1niSbtrMLUfnqmUFz5DlTIlk9xdHkWY8fJhrDF6IHRMsmSrFBDGhegMv6Uw/E7jnzK7JXMCAwEAAaMdMBswDAYDVR0TAQH/BAIwADALBgNVHQ8EBAMCBsAwDQYJKoZIhvcNAQELBQADggIBADPFRl/VS//6r/+BLfhbJYAcnh448QiOnuvEXGNnhlas14+dVn0CUSSTfJBZmKH6vOteq9cEjVvGqPBM/Jxia72xQ0njFAavYaGiuVUA7DVdzljLgoVcKgY+0hdvFtV2kkY82WcYLuzbdgs5wpAjytVYWe16bqNrLH0XAV7Hh9203v6FV92/OFG4/t8iaG+WnM/0cjzYJaFL6f+ukqLxmCwE10f6/5lKp7kEYl7gTD5wJw8hHvelqgL+oZdBklG84Gk7a9vUI/Ms+VDODAs4UmAK/KybY8Q3wZ6ElF5BQ+mVqxtowCkrLvLe7NECIPwypqiiXVqn8j9nWzutGOQSvryS9cV4I6c68pHkr0ilO7QRbL9cOBEo2c8QkYLLo7ve66AG1nNxorjm2l7SG4tzkC5GpsraiF654XM/tsdit09Saj4pkG152FUAe/5+dBZFXGSC6P5JboUIF+lIDfdcbOIQ2gQIJvm2XSz811z9x7PxbWKa9bmWgth0yY8UsQKoTG/tyuAZt66trRbXcHwZbMXv7B7NGRHDrpZK6foxrLfBUrlC40syN/j4I23cRDA+nwkzdiM6D+LuxwNSsWEZ/JZ+B98iYH6cckJEACVwIQgOnDxdzaw0FdVJ7GrPhWnbuI+tUIcippIJ4lKzSAwCuA/SqyUU1S1C1Psoc2+3XmVL\"><cfdi:Emisor Rfc=\"XOJI740919U48\" Nombre=\"CRISTIAN\" RegimenFiscal=\"612\"/><cfdi:Receptor Rfc=\"XAXX010101000\" Nombre=\"General\" UsoCFDI=\"G01\"/><cfdi:Conceptos><cfdi:Concepto ClaveProdServ=\"50202200\" Unidad=\"Pieza\" Cantidad=\"1.000000\" ClaveUnidad=\"H87\" Descripcion=\"producto 1\" ValorUnitario=\"1635.480000\" Importe=\"1635.480000\"><cfdi:Impuestos><cfdi:Traslados><cfdi:Traslado Base=\"1635.480000\" Impuesto=\"003\" TipoFactor=\"Tasa\" TasaOCuota=\"0.530000\" Importe=\"866.804400\"/></cfdi:Traslados></cfdi:Impuestos></cfdi:Concepto></cfdi:Conceptos><cfdi:Impuestos TotalImpuestosTrasladados=\"866.80\"><cfdi:Traslados><cfdi:Traslado Impuesto=\"003\" TipoFactor=\"Tasa\" TasaOCuota=\"0.530000\" Importe=\"866.80\"/></cfdi:Traslados></cfdi:Impuestos><cfdi:Complemento><tfd:TimbreFiscalDigital xmlns:tfd=\"http://www.sat.gob.mx/TimbreFiscalDigital\" xsi:schemaLocation=\"http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd\" Version=\"1.1\" UUID=\"1250466f-4424-4e8a-a236-c5a714224f56\" FechaTimbrado=\"2021-04-19T11:18:15\" RfcProvCertif=\"SPR190613I52\" SelloCFD=\"TPFAOe/vqOpiyVRMKzO4yd5ZEG4g3RwBTTd/FfbLNvPYtmFh8Stra9gFDgXRcI43NSh6ABgz5+Tum+5KYYeoTwRF3LY7O5iww3lzSe8pJZJuBrUyONeFIzWkmdW9SIfZJdYjT6M5G2zNOxTodtk7/8kEFF0mSQZoeXZ1Z5X+jBHmxSy2sqWheuJJP92TVhstRRqwOgNGxqGoQUNebNPlWn2cAxsesc5hJkajj1D/RAkHl0eHLsdFQTf7f8yRUu5vnn3RtdVYn7zsx4uXdQE9kgGFVYv+FNrsj/chtF0GAL6D0liIFlA2fdDVgh7ulxr0eexVC5kNjV4xzKTay3IRGw==\" NoCertificadoSAT=\"30001000000400002495\" SelloSAT=\"VnVdqPsb7KANYN9GBDBy3F765+MAZGRuRmhXAGXBnfJ6HOcOIBZZO4wnKbruPyFXy4n+//lkcG7C6GRrTlfGV01ZJnJV3++X0E41H/ayy+j2gfCyVAxD6NX7YTBT7I9ccvSK63BRuLyhf5e3AtC4Dp+rjBrX/wldgvrXsoBGvz04pwMZZXPwJTj9TvwZn+ITtrushJFWg5ywSbhZsezd0F21TZ3ZOA00EZ3G67Iu/VSyIF91t3FRP05lbkMnsfjXP+PQe/rhghiHcRxnynLZIbdehxCVXE5WKmKWPcESScEyUA1F228IZP/u/AoYXdjowR8S4DGHR5r4c/1mPIizbw==\"/></cfdi:Complemento></cfdi:Comprobante>\n",
    "uid": "607dad4789745",
    "uuid": "1250466f-4424-4e8a-a236-c5a714224f56"
}

Error al crear CFDI con numero de orden existente
A continuación se explica un caso de error que puede ocurrir al crear un CFDI cuando utilizamos un numero de orden repetido, en nuestra plataforma existe una validación que evita que el numero o folio de orden que asignemos a nuestro CFDI sea repetido esto es para evitar crear CFDIs con los mismos identificadores que podria causar confusión, a continuacion se lista la variable de la cual depende este error.

Parámetro	Tipo	Requerido	Detalles
NumOrder	string	Opcional	Indica el número de orden o pedido.

Este dato es solo para control interno.

Ejemplo:
"NumOrder": "85abf36"
Ejemplo de error al crear CFDI numero de orden repetido
JSON

{
  "response": "error",
  "message": "Ya existe un CFDI con folio y serie [F-1]",
  "xml": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<cfdi:Comprobante xmlns:cfdi=\"http://www.sat.gob.mx/cfd/3\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sat.gob.mx/cfd/3 http://www.sat.gob.mx/sitio_internet/cfd/3/cfdv33.xsd\" Version=\"3.3\" Serie=\"F\" Folio=\"1\" Fecha=\"2021-04-18T10:26:27\" FormaPago=\"02\" NoCertificado=\"30001000000400002330\" SubTotal=\"1635.48\" Moneda=\"MXN\" Total=\"2502.28\" TipoDeComprobante=\"I\" MetodoPago=\"PUE\" LugarExpedicion=\"45562\" Sello=\"TPFAOe/vqOpiyVRMKzO4yd5ZEG4g3RwBTTd/FfbLNvPYtmFh8Stra9gFDgXRcI43NSh6ABgz5+Tum+5KYYeoTwRF3LY7O5iww3lzSe8pJZJuBrUyONeFIzWkmdW9SIfZJdYjT6M5G2zNOxTodtk7/8kEFF0mSQZoeXZ1Z5X+jBHmxSy2sqWheuJJP92TVhstRRqwOgNGxqGoQUNebNPlWn2cAxsesc5hJkajj1D/RAkHl0eHLsdFQTf7f8yRUu5vnn3RtdVYn7zsx4uXdQE9kgGFVYv+FNrsj/chtF0GAL6D0liIFlA2fdDVgh7ulxr0eexVC5kNjV4xzKTay3IRGw==\" Certificado=\"MIIFijCCA3KgAwIBAgIUMzAwMDEwMDAwMDA0MDAwMDIzMzAwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWRpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMTkwNTI5MTgzNzQyWhcNMjMwNTI5MTgzNzQyWjCBsTEdMBsGA1UEAxMUSU5HUklEIFhPREFSIEpJTUVORVoxHTAbBgNVBCkTFElOR1JJRCBYT0RBUiBKSU1FTkVaMR0wGwYDVQQKExRJTkdSSUQgWE9EQVIgSklNRU5FWjEWMBQGA1UELRMNWE9KSTc0MDkxOVU0ODEbMBkGA1UEBRMSWE9KSTc0MDkxOU1RVERNTjAyMR0wGwYDVQQLExRJTkRSSUQgWE9EQVIgSklNRU5FWjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIo8voRABIB6aqN9pU3lJWSPo0mMx/rC5lUuN+qwTuwDfq156to9eJ5tQIy+O5YYDo8bcZFsNNm20c/xN9W5jcTCOEQw8C9Vt3YBxvW5Mn5h+v4AwveeN2UTGP/hTKx7Kh1RueULx7LzJgY80CJHONRPymjfNj+E+t77ZhiyO2JHSU/YtoKzmy69/UzAobRJ3uCI2OR5ulgIvTAYlCo1JWcWzRvzLRLnFS9jqMgzMc3z8LESddrWJH8C/CZlSkUuVvZX0QwaNoCr0BkBC1niSbtrMLUfnqmUFz5DlTIlk9xdHkWY8fJhrDF6IHRMsmSrFBDGhegMv6Uw/E7jnzK7JXMCAwEAAaMdMBswDAYDVR0TAQH/BAIwADALBgNVHQ8EBAMCBsAwDQYJKoZIhvcNAQELBQADggIBADPFRl/VS//6r/+BLfhbJYAcnh448QiOnuvEXGNnhlas14+dVn0CUSSTfJBZmKH6vOteq9cEjVvGqPBM/Jxia72xQ0njFAavYaGiuVUA7DVdzljLgoVcKgY+0hdvFtV2kkY82WcYLuzbdgs5wpAjytVYWe16bqNrLH0XAV7Hh9203v6FV92/OFG4/t8iaG+WnM/0cjzYJaFL6f+ukqLxmCwE10f6/5lKp7kEYl7gTD5wJw8hHvelqgL+oZdBklG84Gk7a9vUI/Ms+VDODAs4UmAK/KybY8Q3wZ6ElF5BQ+mVqxtowCkrLvLe7NECIPwypqiiXVqn8j9nWzutGOQSvryS9cV4I6c68pHkr0ilO7QRbL9cOBEo2c8QkYLLo7ve66AG1nNxorjm2l7SG4tzkC5GpsraiF654XM/tsdit09Saj4pkG152FUAe/5+dBZFXGSC6P5JboUIF+lIDfdcbOIQ2gQIJvm2XSz811z9x7PxbWKa9bmWgth0yY8UsQKoTG/tyuAZt66trRbXcHwZbMXv7B7NGRHDrpZK6foxrLfBUrlC40syN/j4I23cRDA+nwkzdiM6D+LuxwNSsWEZ/JZ+B98iYH6cckJEACVwIQgOnDxdzaw0FdVJ7GrPhWnbuI+tUIcippIJ4lKzSAwCuA/SqyUU1S1C1Psoc2+3XmVL\"><cfdi:Emisor Rfc=\"XOJI740919U48\" Nombre=\"CRISTIAN\" RegimenFiscal=\"612\"/><cfdi:Receptor Rfc=\"XAXX010101000\" Nombre=\"General\" UsoCFDI=\"G01\"/><cfdi:Conceptos><cfdi:Concepto ClaveProdServ=\"50202200\" Unidad=\"Pieza\" Cantidad=\"1.000000\" ClaveUnidad=\"H87\" Descripcion=\"producto 1\" ValorUnitario=\"1635.480000\" Importe=\"1635.480000\"><cfdi:Impuestos><cfdi:Traslados><cfdi:Traslado Base=\"1635.480000\" Impuesto=\"003\" TipoFactor=\"Tasa\" TasaOCuota=\"0.530000\" Importe=\"866.804400\"/></cfdi:Traslados></cfdi:Impuestos></cfdi:Concepto></cfdi:Conceptos><cfdi:Impuestos TotalImpuestosTrasladados=\"866.80\"><cfdi:Traslados><cfdi:Traslado Impuesto=\"003\" TipoFactor=\"Tasa\" TasaOCuota=\"0.530000\" Importe=\"866.80\"/></cfdi:Traslados></cfdi:Impuestos><cfdi:Complemento><tfd:TimbreFiscalDigital xmlns:tfd=\"http://www.sat.gob.mx/TimbreFiscalDigital\" xsi:schemaLocation=\"http://www.sat.gob.mx/TimbreFiscalDigital http://www.sat.gob.mx/sitio_internet/cfd/TimbreFiscalDigital/TimbreFiscalDigitalv11.xsd\" Version=\"1.1\" UUID=\"1250466f-4424-4e8a-a236-c5a714224f56\" FechaTimbrado=\"2021-04-19T11:18:15\" RfcProvCertif=\"SPR190613I52\" SelloCFD=\"TPFAOe/vqOpiyVRMKzO4yd5ZEG4g3RwBTTd/FfbLNvPYtmFh8Stra9gFDgXRcI43NSh6ABgz5+Tum+5KYYeoTwRF3LY7O5iww3lzSe8pJZJuBrUyONeFIzWkmdW9SIfZJdYjT6M5G2zNOxTodtk7/8kEFF0mSQZoeXZ1Z5X+jBHmxSy2sqWheuJJP92TVhstRRqwOgNGxqGoQUNebNPlWn2cAxsesc5hJkajj1D/RAkHl0eHLsdFQTf7f8yRUu5vnn3RtdVYn7zsx4uXdQE9kgGFVYv+FNrsj/chtF0GAL6D0liIFlA2fdDVgh7ulxr0eexVC5kNjV4xzKTay3IRGw==\" NoCertificadoSAT=\"30001000000400002495\" SelloSAT=\"VnVdqPsb7KANYN9GBDBy3F765+MAZGRuRmhXAGXBnfJ6HOcOIBZZO4wnKbruPyFXy4n+//lkcG7C6GRrTlfGV01ZJnJV3++X0E41H/ayy+j2gfCyVAxD6NX7YTBT7I9ccvSK63BRuLyhf5e3AtC4Dp+rjBrX/wldgvrXsoBGvz04pwMZZXPwJTj9TvwZn+ITtrushJFWg5ywSbhZsezd0F21TZ3ZOA00EZ3G67Iu/VSyIF91t3FRP05lbkMnsfjXP+PQe/rhghiHcRxnynLZIbdehxCVXE5WKmKWPcESScEyUA1F228IZP/u/AoYXdjowR8S4DGHR5r4c/1mPIizbw==\"/></cfdi:Complemento></cfdi:Comprobante>\n",
  "uid": "607dad4789745",
  "uuid": "1250466f-4424-4e8a-a236-c5a714224f56"
}

Receptor
A continuación se describen los atributos que deben incluirse en el nodo Receptor

Importante

El receptor debe estar previamente registrado en el sistema para poder obtener el UID del mismo.

El receptor debe incluir los siguientes atributos:

Parámetro	Tipo	Requerido	Detalles
 UID	 string	Requerido 	 Indica el UID del receptor del CFDI.

Ejemplo:
"UID": "55c0fdc67593d"
 ResidenciaFiscal	 string	 Opcional	 Indicar el número de residencia fiscal cuando el receptor del comprobante sea un residente en el extranjero.

Ejemplo:
"ResidenciaFiscal": "5256452"
 RegimenFiscalR	 number	 Opcional	  Indica la clave del régimen fiscal del receptor, si este campo no se manda, se usará la clave del régimen que está guardado en el catálogo de clientes.

Ejemplo:
"RegimenFiscalR": "612"
Ejemplo de Receptor
JSON

{
  "Receptor": {
      "ResidenciaFIscal": "",
      "UID": "55c0fdc67593d"
  },
}

Conceptos
A continuación se describen los atributos que deben incluirse en el nodo Conceptos

Para cada concepto es necesario incluir los siguientes atributos:

Parámetro	Tipo	Requerido	Detalles
ClaveProdServ	string	Requerido	Indica la clave del producto o servicio correspondiente a tu concepto.

Es importante que ésta la tomes del catálogo indicado por el SAT para que sea válida.

Ejemplo:
"ClaveProdServ": "43232408"
NoIdentificacion	string	Opcional	Indica el número de identificación o SKU en caso de tenerlo.

Ejemplo:
"NoIdentificacion": "WEBDEV10"
Cantidad	number	Requerido	Indica la cantidad.

Ejemplo:
'Cantidad' : '1'
ClaveUnidad	string	Requerido	Indica la clave de la unidad de medida correspondiente a tu concepto.

Consulta el listado de claves válidas para el SAT.

Ejemplo:
"ClaveUnidad": "E48"
Unidad	string	Requerido	Indica la unidad de medida. Ésta debe coincidir con la clave de la unidad ingresada en el parámetro anterior.

Consulta el listado de claves válidas para el SAT.

Ejemplo:
"Unidad": "Unidad de servicio"
ValorUnitario	string	Requerido	Indica el precio unitario sin incluir impuestos.

Ejemplo:
"ValorUnitario": "15000.00"
Descripcion	string	Requerido	Indica la descripción del concepto.

Ejemplo:
"Descripcion": "Desarrollo web a la medida"
Descuento	string	Opcional	Indica el importe del descuento, en caso de desear agregarlo.

Ejemplo:
"Descuento": "10.00"
ObjetoImp	string	Requerido	Este campo define el tipo de impuesto que se aplica al concepto facturado, hay 4 opciones distintas para seleccionar

Opciones:
"01": No objeto de impuesto.
"02": Si objeto de impuesto.
"03": Si objeto de impuesto y no obligado al desglose
"04": Si objeto de impuesto y no causa impuesto

Es importante seleccionar la opción correcta, ya que determina si el concepto está sujeto a impuestos y si es necesario desglosarlos en la factura, cabe mencionar que a este campo se le da prioridad, por ejemplo, si se envía la opción 01, 03 o 04, aunque se esté enviando algún impuesto en la petición, el sistema no lo tomara en cuenta.
Impuestos	array	Opcional	Indicar los impuestos (traslados, locales y retenidos) que tendrá el concepto.

Consulta los parámetros que debe contener.

Ejemplo:
"Impuestos": {
"Traslados": [
{
"Base": "15000.000000",
"Impuesto": "002",
"TipoFactor": "Tasa",
"TasaOCuota": "0.16",
"Importe": "2400.000000"
}
],
"Retenidos": [],
"Locales": []
}
NumeroPedimento	string	Opcional	Indica el número del pedimento correspondiente a la importación del bien.

Ejemplo:
"NumeroPedimento" : "15 48 3009 0001234"
Predial	string	Opcional	necesario.

Ejemplo:
"Predial": "56485422",
Partes	array	Opcional	Indica las partes o componentes que integran la totalidad del concepto.

Ver los atributos que puede contener.
Ejemplo de Conceptos
JSON

{
  "Conceptos": [
    {
      "ClaveProdServ": "43232408",
      "NoIdentificacion": "WEBDEV10",
      "Cantidad": "1.000000",
      "ClaveUnidad": "E48",
      "Unidad": "Unidad de servicio",
      "Descripcion": "Desarrollo web a la medida",
      "ValorUnitario": "15000.000000",
      "Importe": "15000.000000",
      "Descuento": "0",
      "ObjetoImp":"02",
      "honorarioInverso": "",
      "montoHonorario": "0",
      "Impuestos": {
        "Traslados": [
          {
            "Base": "15000.000000",
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.16",
            "Importe": "2400.000000"
          }
        ],
        "Retenidos": [],
        "Locales": []
      },
      "NumeroPedimento": "",
      "Predial": "",
      "Partes": "0",
      "Complemento": "0"
    }
  ],
}

Impuestos
A continuación se describen los atributos que deben incluirse en el nodo de impuestos

Tip

El nodo Impuestos debe incluirse dentro de cada concepto agregado en el nodo Conceptos

Parámetro	Tipo	Requerido	Detalles
Traslados	array	
Requerido*

* Es requerido siempre y cuando la factura lleve el tipo de impuesto Traslado.

Indica los impuestos trasladados que se aplican a tu concepto.

Ver listado de atributos posibles para este nodo.

Ejemplo:
"Traslados": [
{
"Base": "15000.00",
"Impuesto": "002",
"TipoFactor": "Tasa",
"TasaOCuota": "0.16",
"Importe": "2400.00"
}
],


Ejemplo Excento:
"Traslados": [
{
"Base": "15000.00",
"Impuesto": "002",
"TipoFactor":"Exento",
"TasaOCuota": "0.00",
"Importe": "0.00"
}
],
Retenidos	array	Requerido*

* Es requerido siempre y cuando la factura lleve el tipo de impuesto Retenciones.	Indica los impuestos retenidos que se aplican a tu concepto.

Ver listado de atributos posibles para este nodo.

Ejemplo:
"Retenidos": [
{
"Base": "15000.00",
"Impuesto": "002",
"TipoFactor": "Tasa",
"TasaOCuota": "0.16",
"Importe": "2400.00"
}
],
 Locales	array 	Requerido*

* Es requerido siempre y cuando la factura lleve el tipo de impuesto Locales	Indica los impuestos locales que se aplican a tu concepto. En el campo "TasaOCuota" solo se puede agregar la tasa, y no la cuota, a diferencia de los demás impuestos.

Ver listado de atributos posibles para este nodo.

Ejemplo:
"Locales": [
{
"Impuesto": "ISH",
"TasaOCuota": "5.00",
}
],
Ejemplo de Impuestos
JSON

{
  "Impuestos": {
    "Traslados": [
      {
        "Base": "15000.000000",
        "Impuesto": "002",
        "TipoFactor": "Tasa",
        "TasaOCuota": "0.16",
        "Importe": "2400.000000"
      }
    ],
    "Retenidos": [
      {
        "Base": "15000.000000",
        "Impuesto": "002",
        "TipoFactor": "Tasa",
        "TasaOCuota": "0.16",
        "Importe": "2400.000000"
      }
    ],
    "Locales": [
      {
        "Impuesto": "CEDULAR",
        "TasaOCuota": "5.00",
      }
    ]
  },
}

Atributos de los nodos Traslados y Retenidos
A continuación se describen los nodos que componen cada impuesto que desees agregar a tu concepto.

Un concepto puede tener más de un traslado y más de una retención. Cada impuesto debe incluirse dentro de un objeto, que a su vez es contenido por en el arreglo del tipo de impuesto correspondiente.

Los impuestos que pueden incluirse dentro de traslados son:

IVA
IEPS
Los impuestos que pueden incluirse dentro de retenciones son:

IVA
ISR
Parámetro	Tipo	Requerido	Detalles
Base	float	Requerido	Indica el valor sobre el cual se calculará el impuesto.

Ejemplo:
"Base": "15000.00",
Impuesto	string	Requerido	Indica la clave correspondiente al impuesto que deseas agregar.

Consultar el catálogo de claves de Impuestos.

Ejemplo:
"Impuesto": "002"
TipoFactor	string	Requerido	Indica tipo de factor correspondiente al impuesto que deseas agregar.

Consultar el catálogo de Tipo factor.

Ejemplo:
"TipoFactor": "Tasa"
TasaOCuota	float	Requerido	Indica la tasa o cuota correspondiente al impuesto que deseas agregar.

Consultar el catálogo de Tasa o cuota.

Ejemplo:
"TasaOCuota": "0.16"
Importe	float	Requerido	Indica el importe del impuesto trasladado que aplica a cada concepto. No se permiten valores negativos.


Ejemplo:
"Importe": "2400.00"
Atributos del nodo Locales
A continuación se describen los nodos que componen los impuestos locales:

Parámetro	Tipo	Requerido	Detalles
Impuesto	string	Requerido	Indica el impuesto que deseas agregar, éste puede ser CEDULAR o ISH

Ejemplo:
"Impuesto": "CEDULAR"
TasaOCuota	float	Requerido	Indica el valor de la tasa o cuota del impuesto que deseas agregar.

Ejemplo:
"TasaOCuota": "0.05"
Tip

Por disposición del SAT un concepto no puede tener ISH e IEPS al mismo tiempo. Por favor valida tus conceptos para evitar errores al momento de timbrar.

Partes
Este nodo es opcional y se utiliza para especificar los componentes de un concepto.

Ejemplo:

Si tu concepto es un kit de herramientas, en el nodo partes puedes especificar los elementos que conforman ese kit como: martillo, desarmador, pienzas,etc.

A continuación se describen los atributos que conforman el nodo Partes:

Tip

El nodo Partes es opcional, en caso de agregarlo es necesario hacerlo dentro de uno (o varios) conceptos en el nodo Conceptos

Parámetro	Tipo	Requerido	Detalles
ClaveProdServ	string	Requerido	Indica la clave del producto o servicio correspondiente a tu concepto.

Es importante que ésta la tomes del catálogo proveído por el SAT para que sea válida.

Ejemplo:
"ClaveProdServ": "43232408"
NoIdentificacion	string	Opcional	Indica el número de identificación o SKU en caso de tenerlo.

Ejemplo:
"NoIdentificacion": "WEBDEV10"
Cantidad	number	Requerido	Indica la cantidad.

Ejemplo:
'Cantidad' : '1'
Unidad	string	Requerido	Indica la unidad de medida. Ésta debe coincidir con la clave de la unidad ingresada en el parámetro anterior.

Consulta el listado de claves válidas para el SAT.

Ejemplo:
"Unidad": "Unidad de servicio"
ValorUnitario	float	
Requerido

Indica el precio unitario sin incluir impuestos.

Ejemplo:
"ValorUnitario": "15000.00"
Descripcion	string	Requerido	Indica la descripción del concepto.

Ejemplo:
"Descripcion": "Desarrollo web a la medida"
Ejemplo de Partes
JSON

{
  "Partes":[
      { 
      "ClaveProdServ": "43232408",
          "NoIdentificacion":"WEBDEV10",
      "Cantidad":"1",
      "Unidad": "Unidad de servicio",
      "ValorUnitario": "15000.00",
      "Descripcion": "Desarrollo web a la medida"
    }
  ]
}

CFDIs relacionados
Este nodo es opcional y se utiliza para especificar los CFDIs con los que se encuentra relacionado el CFDI que se está timbrando.

Ejemplo:

Si tu CFDI está sustituyendo a un CFDI timbrado y cancelado anteriormente al mismo receptor, entonces deberás indicar en este el UID y el tipo de relación que existe entre ambos.

A continuación se describen los atributos que conforman el nodo CfdiRelacionados:

Tip

El nodo CfdiRelacionados es opcional, en caso de agregarlo es necesario hacerlo dentro del objeto pincipal que se enviará en la petición.

Parámetro	Tipo	Requerido	Detalles
TipoRelacion	string	Requerido	Indicar la clave del tipo de relación correspondiente.

Revisar el listado de claves proporcionado por el SAT.

Ejemplo:
"TipoRelacion": "01"
UUID	array	Requerido	Indicar el o los UID de los CFDIS con los que se relaciona el actual.

Ejemplo:
"UUID": [
"29c98cb2-f72a-4cbe-a297-606da335e187",
"a96f6b9a-70aa-4f2d-bc5e-d54fb7371236"
]
Ejemplo de CfdiRelacionados
JSON

{
  "CfdiRelacionados": {
    "TipoRelacion": "01",
    "UUID": [
      "29c98cb2-f72a-4cbe-a297-606da335e187",
      "a96f6b9a-70aa-4f2d-bc5e-d54fb7371236"
    ]
  },
}

Borradores
Este nodo es opcional y se utiliza para especificar si deseamos crear un borrador de CFDI, existen 2 situaciones distintas donde podremos generar un borrador.

La primera es utilizando la bandera BorradorSiFalla con la cual trataremos de timbrar nuestro CFDI y en caso de que contenga algun error en la información enviada o configuraciones de nuestro cliente o algun problema en la configuración de nuestra empresa la información que enviamos generara un borrador el cual podremos recuperar y modificar para timbrar de nuevo nuestro comprobante despues de las correcciones necesarias

La segunda situación es con la bandera Draft la cual al estar activa utilizaremos el método para crear un CFDI pero este no intentara ser timbrado este directamente se almacena como borrador

Importante

Información immportante sobre las banderas de borradores:

En la construcción de un CFDI se pueden utilizar ambas banderas pero la bandera DRAFT tiene prioridad sobre BorradorSiFalla
Los campos minimos para crear un borrador estan definidos por los campos minimos para crear un CFDI por lo que no se puede almacenar cualquier dato, es necesario utilizar el formato y caracteristicas de un CFDI
Las banderas son opcionales por lo tanto si no se envian se encuentran en un estado por default en falso por lo que no generaran borradores a menos que las integremos en nuestra construcción del CFDI
Ejemplo de petición
JSON

{
  "BorradorSiFalla": "1",
  "Draft": "0"
}

Ejemplo Si tu CFDI utiliza la bandera BorradorSiFalla y el CFDI contiene algun error lo primero que veremos en la respuesta es el error por el cual no puede ser timbrado y a continuación la confirmación del borrador generado

Ejemplo de repuesta de borrador generado por error en el timbrado
JSON

{
    "response": "error",
    "message": {
        "message": "CFDI40111 - El TipoDeComprobante no es I,E o N, y un concepto incluye el campo descuento.",
        "messageDetail": "El atributo Comprobante:Descuento no es igual a la suma de los atributos Descuento registrados en los conceptos Valor Esperado: 81.47 Valor Reportado: 81.46",
        "data": null,
        "status": "error"
    },
    "xmlerror": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<cfdi:Comprobante xmlns:cfdi=\"http://www.sat.gob.mx/cfd/4\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xsi:schemaLocation=\"http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd\" Version=\"4.0\" Serie=\"F\" Folio=\"401\" Fecha=\"2022-04-06T10:47:27\" TipoDeComprobante=\"I\" NoCertificado=\"30001000000400002330\" Descuento=\"81.46\" FormaPago=\"01\" Exportacion=\"01\" SubTotal=\"543.10\" Moneda=\"MXN\" Total=\"73584.50\" MetodoPago=\"PUE\" LugarExpedicion=\"11111\" Sello=\"NmtzfcCp1rLhUZYFh/GmBYYtgloTo8p9cjwl4oMsmxlR7pf91CZsJq4Owb7NgTY80/UHx+xkY+AAHw4qlZVnc4qf3E/Cbc25xjr9ArEwZ5DPdT94mfnipLQ9tmNADVh9Hm5S1lRWIFX5AoQZ+whr82rZ3ukcFyOiwIRW0mthJHuK/PfSZyUFSOrj/t3G3qV/iW5FwmakK1ir8Ww+8xdkGAqBm7uPFpow/AVOJf3tvhI+z5HCIOA56pSUbWRk4L1zI9ZdpeOtpkwzLWZHrJYZ73LTOQC5/0E3wZvPHEgJDcaqfSyeZkb56JUzPYbLMBZ3YcnAUW9SV7kp1fiFj3OrVg==\" Certificado=\"MIIFijCCA3KgAwIBAgIUMzAwMDEwMDAwMDA0MDAwMDIzMzAwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWRpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMTkwNTI5MTgzNzQyWhcNMjMwNTI5MTgzNzQyWjCBsTEdMBsGA1UEAxMUSU5HUklEIFhPREFSIEpJTUVORVoxHTAbBgNVBCkTFElOR1JJRCBYT0RBUiBKSU1FTkVaMR0wGwYDVQQKExRJTkdSSUQgWE9EQVIgSklNRU5FWjEWMBQGA1UELRMNWE9KSTc0MDkxOVU0ODEbMBkGA1UEBRMSWE9KSTc0MDkxOU1RVERNTjAyMR0wGwYDVQQLExRJTkRSSUQgWE9EQVIgSklNRU5FWjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIo8voRABIB6aqN9pU3lJWSPo0mMx/rC5lUuN+qwTuwDfq156to9eJ5tQIy+O5YYDo8bcZFsNNm20c/xN9W5jcTCOEQw8C9Vt3YBxvW5Mn5h+v4AwveeN2UTGP/hTKx7Kh1RueULx7LzJgY80CJHONRPymjfNj+E+t77ZhiyO2JHSU/YtoKzmy69/UzAobRJ3uCI2OR5ulgIvTAYlCo1JWcWzRvzLRLnFS9jqMgzMc3z8LESddrWJH8C/CZlSkUuVvZX0QwaNoCr0BkBC1niSbtrMLUfnqmUFz5DlTIlk9xdHkWY8fJhrDF6IHRMsmSrFBDGhegMv6Uw/E7jnzK7JXMCAwEAAaMdMBswDAYDVR0TAQH/BAIwADALBgNVHQ8EBAMCBsAwDQYJKoZIhvcNAQELBQADggIBADPFRl/VS//6r/+BLfhbJYAcnh448QiOnuvEXGNnhlas14+dVn0CUSSTfJBZmKH6vOteq9cEjVvGqPBM/Jxia72xQ0njFAavYaGiuVUA7DVdzljLgoVcKgY+0hdvFtV2kkY82WcYLuzbdgs5wpAjytVYWe16bqNrLH0XAV7Hh9203v6FV92/OFG4/t8iaG+WnM/0cjzYJaFL6f+ukqLxmCwE10f6/5lKp7kEYl7gTD5wJw8hHvelqgL+oZdBklG84Gk7a9vUI/Ms+VDODAs4UmAK/KybY8Q3wZ6ElF5BQ+mVqxtowCkrLvLe7NECIPwypqiiXVqn8j9nWzutGOQSvryS9cV4I6c68pHkr0ilO7QRbL9cOBEo2c8QkYLLo7ve66AG1nNxorjm2l7SG4tzkC5GpsraiF654XM/tsdit09Saj4pkG152FUAe/5+dBZFXGSC6P5JboUIF+lIDfdcbOIQ2gQIJvm2XSz811z9x7PxbWKa9bmWgth0yY8UsQKoTG/tyuAZt66trRbXcHwZbMXv7B7NGRHDrpZK6foxrLfBUrlC40syN/j4I23cRDA+nwkzdiM6D+LuxwNSsWEZ/JZ+B98iYH6cckJEACVwIQgOnDxdzaw0FdVJ7GrPhWnbuI+tUIcippIJ4lKzSAwCuA/SqyUU1S1C1Psoc2+3XmVL\"><cfdi:Emisor Rfc=\"XOJI740919U48\" Nombre=\"INGRID XODAR JIMENEZ\" RegimenFiscal=\"621\"/><cfdi:Receptor Rfc=\"XOJI740919U48\" Nombre=\"INGRID XODAR JIMENEZ\" DomicilioFiscalReceptor=\"88965\" RegimenFiscalReceptor=\"616\" UsoCFDI=\"P01\"/><cfdi:Conceptos><cfdi:Concepto ClaveProdServ=\"30161503\" NoIdentificacion=\"AT01\" Unidad=\"Pieza\" Cantidad=\"5\" ClaveUnidad=\"H87\" Descripcion=\"PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM\" ValorUnitario=\"108.62\" Importe=\"543.100000\" Descuento=\"81.465\" ObjetoImp=\"02\"><cfdi:Impuestos><cfdi:Traslados><cfdi:Traslado Base=\"461.635\" Impuesto=\"002\" TipoFactor=\"Tasa\" TasaOCuota=\"0.160000\" Importe=\"73122.8616\"/></cfdi:Traslados></cfdi:Impuestos></cfdi:Concepto></cfdi:Conceptos><cfdi:Impuestos TotalImpuestosTrasladados=\"73122.86\"><cfdi:Traslados><cfdi:Traslado Base=\"543.10\" Impuesto=\"002\" TipoFactor=\"Tasa\" TasaOCuota=\"0.160000\" Importe=\"73122.86\"/></cfdi:Traslados></cfdi:Impuestos><cfdi:Complemento/></cfdi:Comprobante>\n",
    "draft": {
        "response": "success",
        "message": "Borrador creado satisfactoriamente",
        "UUID": "sin_uuid",
        "uid": "624db6101b8e7",
        "SAT": {
            "UUID": "sin_uuid",
            "FechaTimbrado": null,
            "NoCertificadoSAT": null,
            "Version": null,
            "SelloSAT": null,
            "SelloCFD": null
        },
        "INV": {
            "Serie": "F",
            "Folio": 401
        },
        "invoice_uid": "624db6101b8e7"
    }
}

Ejemplo Si tu CFDI utiliza la bandera Draft directamente recibiremos la respuesta del estado del borrador con la informacion correspondiente

Ejemplo de borrador generado directamente
JSON

{
    "response": "success",
    "message": "Borrador creado satisfactoriamente",
    "UUID": "sin_uuid",
    "uid": "624db7b10b1bd",
    "SAT": {
        "UUID": "sin_uuid",
        "FechaTimbrado": "sin_FechaTimbrado",
        "NoCertificadoSAT": "NoCertificadoSAT",
        "Version": "sin_Version",
        "SelloSAT": "SelloSAT",
        "SelloCFD": "sin_SelloCFD"
    },
    "INV": {
        "Serie": "F",
        "Folio": 402
    },
    "invoice_uid": "624db7b10b1bd"
}

A continuación se muestran los valores que necesitaremos si queremos generar un borrador de algun CFDI

Tip

Recuerda que estos parametros forman parte de la construccion de un CFDI

Parámetro	Tipo	Requerido	Detalles
BorradorSiFalla	string	Opcional	Esta bandera funciona para crear un borrador al intentar timbrar un CFDI que contenga algun error en su construcción, al estar activa crearemos un CFDI y en caso de que presente algun error que no permita el timbrado el formato con la informacion enviada generara un borrador el cual podremos recuperar para corregirlo

Los valores admitidos son "0" para falso y "1" para verdadero, por defecto si no se envia se interpeta como falso
Ejemplo:
"BorradorSiFalla": "1"
Draft	string	Opcional	Esta bandera se utiliza para generar un borrador de CFDI, al utilizarla los datos enviados seran directamente guardados en un borrador estos datos deben cumplir con las caractreisticas minimas de timbrado de CFDI para generar un borrador por lo que no s puede almacenar cualquier información

Los valores admitidos son "0" para falso y "1" para verdadero, por defecto si no se envia se interpreta como falso
Ejemplo:
"Draft": "1"