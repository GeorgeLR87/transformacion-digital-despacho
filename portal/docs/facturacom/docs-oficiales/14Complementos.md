Complementos
Complementos de pago
A continuación se explica como funciona el servicio con el cual podras crear un complemento de pago en su version 2.0

Podemos crear un CFDI con complemento de pago haciendo uso de los siguientes parámetros:

Parámetro	Tipo	Requerido	Detalles
TipoCfdi	String	Requerido	Es necesario enviar la clave pago en este campo.

Ejemplo:
"TipoDocumento": "pago"
RegimenFiscal	number	Opcional	Indica la clave del régimen fiscal del emisor, si este campo no se manda, se usará la clave del régimen que está en la configuración de la empresa.

Ver listado de claves de régimen fiscal.

Ejemplo:
"RegimenFiscal": "601"
Serie	Numerico	Requerido	Indica id de la serie con la que deseas timbrar el documento.

Ésta debe estar dada de alta en tu panel de Factura.com y coincidir con el tipo de CFDI que deseas timbrar.

Para obtenerlo Inicia sesión y dirígete al Menú lateral - Configuraciones - Series y folios


Ejemplo:
"Serie": 1247
FechaFromAPI	String	Opcional	Indica una fecha con formato (Y-m-d\TH: m :s).

Es posible enviar hasta 72 horas de atraso a la fecha actual, sin embargo no están permitidas las fechas futuras.

Ejemplo:
"FechaFromAPI": "2022/04/08"
LugarExpedicion	String	Opcional	
Se utiliza para ingresar el codigo postal de el domicilio fiscal en donde se realiza el pago.

Ejemplo:
"LugarExpedicion": "44555"

UsoCFDI	String	Requerido	Indica siempre la clave CP01 correspondiente a Pagos.

Ejemplo:
"UsoCFDI": "CP01"
Moneda	String	Requerido	Se debe registrar siempre el valor "XXX".

Ejemplo:
"Moneda": "XXX"
EnviarCorreo	Boolean	Opcional	Indica si deseas que el CFDI se envíe a tu cliente por correo electrónico. Por default esta opción es true.

Ejemplo:
"EnviarCorreo": "true"
Draft	String	Opcional	Esta bandera se utiliza para generar un borrador de CFDI, al utilizarla los datos enviados seran directamente guardados en un borrador estos datos deben cumplir con las caractreisticas minimas de timbrado de CFDI para generar un borrador por lo que no se puede almacenar cualquier información

Los valores admitidos son "0" para falso y "1" para verdadero, por defecto si no se envia se interpreta como falso
Ejemplo:
"Draft": "1"
Receptor	Array	Requerido	Indica el UID del receptor/cliente previamente creado en Factura.com.


Ver listado de atributos posibles para este nodo.

Ejemplo:
"Receptor": {
"UID": "55c0fdc67593d"
"RegimenFiscalR": "612"
}
Conceptos	Array	Requerido	Es un arreglo de objetos, en el que debe definirse un solo objeto con la siguiente información.

Ejemplo:
"Conceptos": [
{
"ClaveProdServ": "84111506",
"Cantidad": "1",
"ClaveUnidad": "ACT",
"Descripcion": "Pago",
"ValorUnitario": "0",
"Importe": "0"
}
]
Pagos	Array	Requerido	
Indica los datos del complemento de pago.
Ejemplo:

"Pagos": [
{
"FechaPago": "2022-04-08T12:00:00",
"FormaDePagoP": "01",
"MonedaP": "MXN",
"TipoCambioP": "1",
"Monto": "2500",
"NumOperacion": "",
"RfcEmisorCtaOrd": "",
"CtaOrdenante": "",
"NomBancoOrdExt": "",
"CtaBeneficiario": "",
"DoctoRelacionado": [  ]

}

Importante

Es necesario que envíes los valores (precios, cálculo de impuestos, subtotales, etc) de acuerdo a tus necesidades. Esto incluye número de decimales y redondeos.

Nodo: Pagos
Es el nodo en el que se ingresa la información correspondiente complemento de pagos.

A continuación se presentan los atibutos que debe incluir el nodo Pagos:

Parámetro	Tipo	Requerido	Detalles
FechaPago	String	Requerido	Indica la fecha y hora en la que el beneficiario recibe el pago, debe estar expresada en el siguiente formato: aaaa-mm-ddThh:mm:ss.

Ejemplo:
"FechaPago": "2018-12-01T12:00:00"
FormaDePagoP	String	Requerido	Indica la clave de la forma de pago.

Ésta puedes consultarla en el Catálogo de formas de pago.

Nota: debe ser distinta a la clave 99 - Por definir.

Ejemplo:
"FormaPago": "01"
MonedaP	String	Requerido	Indica la clave de la moneda del pago.

Ésta puedes consultarla en el Catálogo de monedas

Ejemplo:
"Moneda": "MXN"
TipoCambioP	String	Opcional	
Indica el tipo de cambio vigente al momento de recibir el pago.

El campo "TipoCambioP" debe contener la tasa de cambio de la moneda utilizada en el pago con respecto al peso mexicano (MXN). Es decir, si el pago se realiza en una moneda distinta al MXN, "TipoCambioP" debe reflejar la equivalencia de dicha moneda en pesos mexicanos. Por otro lado, si el pago se efectúa en pesos mexicanos (MXN), el valor de "TipoCambioP" deberá ser 1.

Ejemplo:

Cuando el pago se recibe en dolares USD

1USD = 19.85MXN
"TipoCambio": "19.85"

Cuando el pago se recibe en euros EUR

1EUR = 21.24MXN 

"TipoCambio": "21.24"

Es necesario indicar la equivalencia de la moneda con respecto a MXN en este campo.

Cuando el pago se realiza en pesos mexicanos MXN

1MXN = 1MXN

"TipoCambio": "1"

Monto	Numerico	Requerido	Indica el importe del pago, éste debe ser mayor a 0.

Ejemplo:
"Monto": "1000.00"
NumOperacion	String	Opcional	Indica el número de orden o pedido.

Este dato es solo para control interno.

Ejemplo:
"NumOrder": "85abf36"
RfcEmisorCtaOrd	String	Opcional	Si lo deseas, indica el RFC del banco de la cuenta de origen de la transferencia.

Ejemplo:
"RfcEmisorCtaOrd": "BSM970519DU8"
CtaOrdenante	String	Opcional	Si lo deseas, indica el número de la cuenta con la que se realizó el pago, o la CLABE interbancaria de la cuenta desde donde se hizo la transferencia.

Ejemplo:
"CtaOrdenante": "15478952364"
NomBancoOrdExt	String	Opcional	Si lo deseas, indica el nombre del banco de la cuenta ordenante.

Ejemplo:
"NomBancoOrdExt": "BANCO SANTANDER (MEXICO) S.A."
RfcEmisorCtaBen	 String	Opcional	 Si lo deseas, indica el RFC del banco de la cuenta de destino de la transferencia.

Ejemplo:
"RfcEmisorCtaOrd": "BBA130722BR7"
CtaBeneficiario	String	Opcional	Si lo deseas, indica el número de la cuenta o la CLABE interbancaria de la cuenta desde donde se recibió el pago.

Ejemplo:
"CtaBeneficiario": "15478952364"
DoctoRelacionado	array	Requerido	
Indica al menos un documento relacionado para tu complemento de pago.

Ejemplo:

"DoctoRelacionado": [
{
"IdDocumento": "3e27ae21-b190-4c4c-a8d1-d3b6ab993122",
"MonedaDR": "MXN",
"EquivalenciaDR": "",
"NumParcialidad": "1",
"ImpSaldoAnt": "1200",
"ImpPagado": "1200",
"ImpSaldoInsoluto": "0",
"Impuestos": {
"Traslados": [         ],
"Retenidos": [         ]
}

 Impuestos	 Array	Requerido	
 Arreglo que contiene los diferentes tipos de impuestos para nuestro pago en este caso "traslado" y "retenidos"

Ejemplo:

"Impuestos": {

"Traslados": [  ],

"Retenidos": [  ]

}

 

 Traslados	 Array	Requerido	
 Arreglo que contiene los impuestos de traslado especificos aplicados a nuestro pago

Ejemplo: IVA, IEPS....


"Traslados": [
{
"Base": "1300.000000",
"Impuesto": "002",
"TipoFactor": "Tasa",
"TasaOCuota": "0.16",
"Importe": "208.000000"
},
{
"Base": "1200.000000",
"Impuesto": "003",
"TipoFactor": "Cuota",
"TasaOCuota": "0.083333",
"Importe": "100.000000"
}
]

 Retenidos	 String	 Requerido	
 Arreglo que contiene los impuestos de retencion especificos aplicados a nuestro pago

Ejemplo: Retencion de ISR ............

"Retenidos": [
{
"Base": "1300.000000",
"Impuesto": "001",
"TipoFactor": "Tasa",
"TasaOCuota": "0.10",
"Importe": "130.000000"
}
]

 Base	 String	 Requerido	 Indica el subtotal del cual se calcula el impuesto
 Impuesto	 String	 Requerido	
 Indica el tipo de impuesto que se aplicara a nuestro pago

Se debe ingresar con el codigo que le corresponde ejemplo:

"002" corresponde a IVA

 TipoFactor	 String	 Requerido	 Indica el tipo de factor que correponde a nuestro impuesto
 TasaCuota	 String	 Requerido	
 Indica el porcentaje correspondiente al impuesto que aplicaremos

Se utiliza ingresando el monto por el cual multiplica nuestra base, ejemplo:

"0.16" para el 16% de IVA

 Importe	 String	 Requerido	 Indica el monto que corresponde de nuestrio impuesto
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/create

Ejemplo: https://api.factura.com/v4/cfdi40/create

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente. Así como cambiar los UID de los CFDIs relacionados y de receptor.

Ejemplo para crear complemento de pagos v2.0
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create"

payload = json.dumps({
  "TipoCfdi": "pago",
  "RegimenFiscal": 621,
  "EnviarCorreo": True,
  "Version": "4.0",
  "Serie": 18379,
  "FechaFromAPI": "2024/05/28",
  "LugarExpedicion": "63180",
  "UsoCFDI": "CP01",
  "Moneda": "XXX",
  "Draft": False,
  "Receptor": {
    "UID": "63ebd090d6015"
  },
  "Conceptos": [
    {
      "ClaveProdServ": "84111506",
      "Cantidad": 1,
      "ClaveUnidad": "ACT",
      "Descripcion": "Pago",
      "ValorUnitario": 0,
      "Importe": 0
    }
  ],
  "Pagos": [
    {
      "FechaPago": "2024-05-28T12:00:00",
      "FormaDePagoP": "03",
      "MonedaP": "MXN",
      "TipoCambioP": "1",
      "Monto": "232",
      "NumOperacion": "9999",
      "RfcEmisorCtaOrd": "BRM940216EQ6",
      "CtaOrdenante": "123456789012345678",
      "NomBancoOrdExt": "BANREGIO",
      "CtaBeneficiario": "123456789012345678",
      "RfcEmisorCtaBen": "BMN930209927",
      "DoctoRelacionado": [
        {
          "IdDocumento": "1f4946e4-98b3-46d5-987b-fc61a4d20707",
          "MonedaDR": "MXN",
          "EquivalenciaDR": "1",
          "NumParcialidad": "1",
          "ImpSaldoAnt": "232",
          "ImpPagado": "232",
          "ImpSaldoInsoluto": "0.000000",
          "NoObligadoADesglose": "",
          "Impuestos": {
            "Traslados": [
              {
                "Base": "200.000000",
                "Impuesto": "002",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.160000",
                "Importe": "32.000000"
              }
            ],
            "Retenidos": []
          },
          "Serie": "F",
          "Folio": "639"
        }
      ],
      "TipoCadPago": ""
    },
    {
      "FechaPago": "2024-05-28T12:00:00",
      "FormaDePagoP": "03",
      "MonedaP": "USD",
      "TipoCambioP": "16.81",
      "Monto": "116",
      "NumOperacion": "2768",
      "RfcEmisorCtaOrd": "BRM940216EQ6",
      "CtaOrdenante": "123456789012345678",
      "NomBancoOrdExt": "BANREGIO",
      "CtaBeneficiario": "123456789012345678",
      "RfcEmisorCtaBen": "BMN930209927",
      "DoctoRelacionado": [
        {
          "IdDocumento": "ed2e295e-daf4-405a-8726-f44fb79b6cc8",
          "Serie": "F",
          "Folio": "638",
          "MonedaDR": "USD",
          "EquivalenciaDR": "1",
          "NumParcialidad": "1",
          "ImpSaldoAnt": "116",
          "ImpPagado": "116",
          "ImpSaldoInsoluto": "0.000000",
          "Impuestos": {
            "Traslados": [
              {
                "Base": "100.000000",
                "Impuesto": "002",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.160000",
                "Importe": "16.000000"
              }
            ],
            "Retenidos": []
          }
        }
      ],
      "TipoCadPago": "01"
    },
    {
      "FechaPago": "2024-05-28T12:00:00",
      "FormaDePagoP": "03",
      "MonedaP": "MXN",
      "TipoCambioP": "1",
      "Monto": 19496.12,
      "NumOperacion": "abc123",
      "RfcEmisorCtaOrd": "BRM940216EQ6",
      "CtaOrdenante": "123456789012345678",
      "NomBancoOrdExt": "BANREGIO",
      "CtaBeneficiario": "123456789012345678",
      "RfcEmisorCtaBen": "BMN930209927",
      "DoctoRelacionado": [
        {
          "IdDocumento": "1700e7f2-e89d-4ae5-a727-320bca44bda2",
          "MonedaDR": "USD",
          "EquivalenciaDR": "0.0594990183",
          "NumParcialidad": "1",
          "ImpSaldoAnt": "1160",
          "ImpPagado": "1160",
          "ImpSaldoInsoluto": "0.000000",
          "NoObligadoADesglose": False,
          "Impuestos": {
            "Traslados": [
              {
                "Base": "1000.000000",
                "Impuesto": "002",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.160000",
                "Importe": "160.000000"
              }
            ],
            "Retenidos": []
          },
          "Serie": "AB",
          "Folio": 133
        }
      ],
      "TipoCadPago": ""
    }
  ]
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
Respuesta Exitosa
JSON

{
    "response": "success",
    "message": "Factura creada y enviada satisfactoriamente",
    "UUID": "8c5cb78d-d73c-42ef-b422-929e4d63267c",
    "uid": "6250a6ba8a3f8",
    "SAT": {
        "UUID": "8c5cb78d-d73c-42ef-b422-929e4d63267c",
        "FechaTimbrado": "2022-04-08T16:17:33",
        "NoCertificadoSAT": "30001000000400002495",
        "Version": "1.1",
        "SelloSAT": "Tl2SwgGWL5yyEHN/8CBrLc5sPPP9uXyYJBWshid53i5IvJptteqHP9OtFScBhShvnVxNfdrK8eu0JnmTH5dvHgJ7gooWnvhXFuCfM1ZbIe+dUSc76ZS9n15M/er+OCFAvULUNzdV12d5E27xJ0LCgRbw2v4/kqD2vy2jJoY932dB8fF6wQUuImcgZ4hbaRAyjdC89/aWVPPNqKDuVkB5lcEN87PkLc0OGdjN4OIiSQ7KEMtE7DYtT8FpIPN4AB1yR9+knNI0FQmfowwJO+RzkmICf8ZpToKIXgs3pYENyLeguRqIPC4vUGmgW/WoOne/PgdMSkgo5QAhiRLT9wVq3Q==",
        "SelloCFD": "C77oxk1OVF+fzeO7ZHbfxsiMxSO7VQArFtZZ9up5c8wCWJSEliVIf2/bg1DdmJGw36L4vXKNa1jESlSjQ0v8QgKMLhZcr+PhR1gPEMdn0GGWLUDO5ELQzLqEAE68H0cyHC8shgHOJIsGOwsR0eHV2UnKrWh3VFD2+svq/31H5gBxGkgtOCpIr5SCvihqX/VCHKgWN6A1tzZfMldKxLSwd3lHsyQAzXF8TjLoXcPBX7wjkZpzA419cG+EjiqFJSEvek1F90OXj80ZEFBO2z9Cktxy+9I8IsBnnkv7/kGHbuiC4QuUXzy4XGDgIjje1yaQT8vmnQA4UA27abinHh1oPA=="
    },
    "INV": {
        "Serie": "COP",
        "Folio": 38
    },
    "invoice_uid": "6250a6ba8a3f8"
}

Respuesta Erronea
JSON

{
    "response": "error",
    "message": {
        "message": "401 - El rango de la fecha de generación no debe de ser mayor a 72 horas para la emisión del timbre.",
        "messageDetail": "Comprobante.Fecha: Fecha de emisión: 2021-04-08T17:41:47 Fecha del Servidor: 2022-04-08T17:32:17 La fecha de emision  no se encuentra en el rango permitido: 2022-04-05T17:32:17 - 2022-04-08T17:37:17",
        "data": null,
        "status": "error"
    },
    "xmlerror": "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<cfdi:Comprobante xmlns:cfdi=\"http://www.sat.gob.mx/cfd/4\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:pago20=\"http://www.sat.gob.mx/Pagos20\" xsi:schemaLocation=\"http://www.sat.gob.mx/cfd/4 http://www.sat.gob.mx/sitio_internet/cfd/4/cfdv40.xsd http://www.sat.gob.mx/Pagos20 http://www.sat.gob.mx/sitio_internet/cfd/Pagos/Pagos20.xsd\" Version=\"4.0\" Serie=\"COP\" Folio=\"42\" Fecha=\"2021-04-08T17:41:47\" TipoDeComprobante=\"P\" NoCertificado=\"30001000000400002330\" Moneda=\"XXX\" Total=\"0\" SubTotal=\"0\" Exportacion=\"01\" LugarExpedicion=\"11111\" Sello=\"dg1bQHzT5HeHU6y5W2+Tb5e58JW77EnGgDmggs/Fa+DzYXGuG752ENDGN1/8qlSMQBVFjjY7x4M7peA+Y6Rv4Q2cuz3lugDjJ2BhzRKQ+yEverHWFvqGgB2RbJhiV7mIbH/d3HQDsj1ASzKMlIfBWC3vKGyZP1cUFXy/HEkpFEdO3jCPaBtkokx7+tjxMVBNABRWi+MoFXPa/2n41hRispcUGdwtpcvNv91kq6jEe+E4URmx/7nqXJmqi4qIJGJ1sLww7enyvezOTfUEutTYOt/figa8cxosdc1NemuvvLGeRTrcw0fBdRrLqO8EhjvE5ItgWo4bZ7SQknm4Rn0EzA==\" Certificado=\"MIIFijCCA3KgAwIBAgIUMzAwMDEwMDAwMDA0MDAwMDIzMzAwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWRpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMTkwNTI5MTgzNzQyWhcNMjMwNTI5MTgzNzQyWjCBsTEdMBsGA1UEAxMUSU5HUklEIFhPREFSIEpJTUVORVoxHTAbBgNVBCkTFElOR1JJRCBYT0RBUiBKSU1FTkVaMR0wGwYDVQQKExRJTkdSSUQgWE9EQVIgSklNRU5FWjEWMBQGA1UELRMNWE9KSTc0MDkxOVU0ODEbMBkGA1UEBRMSWE9KSTc0MDkxOU1RVERNTjAyMR0wGwYDVQQLExRJTkRSSUQgWE9EQVIgSklNRU5FWjCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIo8voRABIB6aqN9pU3lJWSPo0mMx/rC5lUuN+qwTuwDfq156to9eJ5tQIy+O5YYDo8bcZFsNNm20c/xN9W5jcTCOEQw8C9Vt3YBxvW5Mn5h+v4AwveeN2UTGP/hTKx7Kh1RueULx7LzJgY80CJHONRPymjfNj+E+t77ZhiyO2JHSU/YtoKzmy69/UzAobRJ3uCI2OR5ulgIvTAYlCo1JWcWzRvzLRLnFS9jqMgzMc3z8LESddrWJH8C/CZlSkUuVvZX0QwaNoCr0BkBC1niSbtrMLUfnqmUFz5DlTIlk9xdHkWY8fJhrDF6IHRMsmSrFBDGhegMv6Uw/E7jnzK7JXMCAwEAAaMdMBswDAYDVR0TAQH/BAIwADALBgNVHQ8EBAMCBsAwDQYJKoZIhvcNAQELBQADggIBADPFRl/VS//6r/+BLfhbJYAcnh448QiOnuvEXGNnhlas14+dVn0CUSSTfJBZmKH6vOteq9cEjVvGqPBM/Jxia72xQ0njFAavYaGiuVUA7DVdzljLgoVcKgY+0hdvFtV2kkY82WcYLuzbdgs5wpAjytVYWe16bqNrLH0XAV7Hh9203v6FV92/OFG4/t8iaG+WnM/0cjzYJaFL6f+ukqLxmCwE10f6/5lKp7kEYl7gTD5wJw8hHvelqgL+oZdBklG84Gk7a9vUI/Ms+VDODAs4UmAK/KybY8Q3wZ6ElF5BQ+mVqxtowCkrLvLe7NECIPwypqiiXVqn8j9nWzutGOQSvryS9cV4I6c68pHkr0ilO7QRbL9cOBEo2c8QkYLLo7ve66AG1nNxorjm2l7SG4tzkC5GpsraiF654XM/tsdit09Saj4pkG152FUAe/5+dBZFXGSC6P5JboUIF+lIDfdcbOIQ2gQIJvm2XSz811z9x7PxbWKa9bmWgth0yY8UsQKoTG/tyuAZt66trRbXcHwZbMXv7B7NGRHDrpZK6foxrLfBUrlC40syN/j4I23cRDA+nwkzdiM6D+LuxwNSsWEZ/JZ+B98iYH6cckJEACVwIQgOnDxdzaw0FdVJ7GrPhWnbuI+tUIcippIJ4lKzSAwCuA/SqyUU1S1C1Psoc2+3XmVL\"><cfdi:Emisor Rfc=\"XOJI740919U48\" Nombre=\"INGRID XODAR JIMENEZ\" RegimenFiscal=\"621\"/><cfdi:Receptor Rfc=\"XOJI740919U48\" Nombre=\"INGRID XODAR JIMENEZ\" DomicilioFiscalReceptor=\"88965\" RegimenFiscalReceptor=\"616\" UsoCFDI=\"CP01\"/><cfdi:Conceptos><cfdi:Concepto ClaveProdServ=\"84111506\" Cantidad=\"1\" ClaveUnidad=\"ACT\" Descripcion=\"Pago\" ValorUnitario=\"0\" Importe=\"0\" ObjetoImp=\"01\"/></cfdi:Conceptos><cfdi:Complemento><pago20:Pagos Version=\"2.0\"><pago20:Totales TotalRetencionesISR=\"130\" TotalTrasladosBaseIVA16=\"2500\" TotalTrasladosImpuestoIVA16=\"400\" MontoTotalPagos=\"3700\"/><pago20:Pago FechaPago=\"2022-04-08T12:00:00\" FormaDePagoP=\"01\" MonedaP=\"MXN\" TipoCambioP=\"1\" Monto=\"2500.00\"><pago20:DoctoRelacionado IdDocumento=\"3e27ae21-b190-4c4c-a8d1-d3b6ab993122\" MonedaDR=\"MXN\" EquivalenciaDR=\"1\" NumParcialidad=\"1\" ImpSaldoAnt=\"1200.00\" ImpPagado=\"1200.00\" ImpSaldoInsoluto=\"0.00\" ObjetoImpDR=\"02\"><pago20:ImpuestosDR><pago20:RetencionesDR><pago20:RetencionDR BaseDR=\"1300.000000\" ImpuestoDR=\"001\" TipoFactorDR=\"Tasa\" TasaOCuotaDR=\"0.100000\" ImporteDR=\"130.000000\"/></pago20:RetencionesDR><pago20:TrasladosDR><pago20:TrasladoDR BaseDR=\"1300.000000\" ImpuestoDR=\"002\" TipoFactorDR=\"Tasa\" TasaOCuotaDR=\"0.160000\" ImporteDR=\"208.000000\"/><pago20:TrasladoDR BaseDR=\"1200.000000\" ImpuestoDR=\"003\" TipoFactorDR=\"Cuota\" TasaOCuotaDR=\"0.083333\" ImporteDR=\"100.000000\"/></pago20:TrasladosDR></pago20:ImpuestosDR></pago20:DoctoRelacionado><pago20:ImpuestosP><pago20:RetencionesP><pago20:RetencionP ImpuestoP=\"001\" ImporteP=\"130\"/></pago20:RetencionesP><pago20:TrasladosP><pago20:TrasladoP BaseP=\"1300.000000\" ImpuestoP=\"002\" TipoFactorP=\"Tasa\" TasaOCuotaP=\"0.160000\" ImporteP=\"208.000000\"/><pago20:TrasladoP BaseP=\"1200.000000\" ImpuestoP=\"003\" TipoFactorP=\"Cuota\" TasaOCuotaP=\"0.083333\" ImporteP=\"100.000000\"/></pago20:TrasladosP></pago20:ImpuestosP></pago20:Pago><pago20:Pago FechaPago=\"2022-04-08T12:00:00\" FormaDePagoP=\"01\" MonedaP=\"MXN\" TipoCambioP=\"1\" Monto=\"1200.00\" NumOperacion=\"01872\"><pago20:DoctoRelacionado IdDocumento=\"3e27ae21-b190-4c4c-a8d1-d3b6ab993122\" MonedaDR=\"MXN\" EquivalenciaDR=\"1\" NumParcialidad=\"1\" ImpSaldoAnt=\"1200.00\" ImpPagado=\"1200.00\" ImpSaldoInsoluto=\"0.00\" ObjetoImpDR=\"02\"><pago20:ImpuestosDR><pago20:TrasladosDR><pago20:TrasladoDR BaseDR=\"1200.000000\" ImpuestoDR=\"002\" TipoFactorDR=\"Tasa\" TasaOCuotaDR=\"0.160000\" ImporteDR=\"192.000000\"/></pago20:TrasladosDR></pago20:ImpuestosDR></pago20:DoctoRelacionado><pago20:ImpuestosP><pago20:TrasladosP><pago20:TrasladoP BaseP=\"1200.000000\" ImpuestoP=\"002\" TipoFactorP=\"Tasa\" TasaOCuotaP=\"0.160000\" ImporteP=\"192.000000\"/></pago20:TrasladosP></pago20:ImpuestosP></pago20:Pago></pago20:Pagos></cfdi:Complemento></cfdi:Comprobante>\n"
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Documentos Relacionados
A continuación se describen los atributos que deben incluirse en el nodo "DoctoRelacionado" dentro del nodo "Pagos".

Importante

Se explican 2 casos distintos para los documentos relacionados para explicar de forma mas clara como utilizar los campos que son variables

Moneda identica entre el pago y el docto. relacionado y cuando estas son distintas
Al realizar un complemento de pago debemos tener en cuenta que se pueden presentar 2 situaciones distintas, es importante tomar en cuenta que existen 2 campos para representar el tipo de cambio uno de estos es "TipoCambioP" que pertenece a el pago como tal y este se utiliza para expresar el tipo de cambio entre la moneda que se realizo el pago contra el peso mexicano(MXN).

El segundo caso es el campo "EquivalenciaDR" el cual pertenece a el CFDI original que se pudo haber realizado en cualquier moneda, si la moneda original del CFDI es diferente a la que se realizo el pago aqui deberiamos expresar el tipo de cambio entre estas monedas.

Parámetro	
Tipo

Detalles moneda identica entre pago y documento relacionado	Detalles moneda diferente entre pago y documento relacionado
IdDocumento	
String

Requerido

Indica el folio fiscal del CFDI al que quieras agregarle un pago.


Ejemplo:
"IdDocumento": "54feddcf-af15-4715-8a1f-80a122d1db54"	Indica el folio fiscal del CFDI al que quieras agregarle un pago.


Ejemplo:
"IdDocumento": "54feddcf-af15-4715-8a1f-80a122d1db54" 
MonedaDR	
String

Requerido

Se utiliza para indicar la moneda en la que se genero el CFDI original

(En este caso se utiliza como ejemplo un pago que se realizo en moneda USD y un documento relacionado en moneda USD)

Ejemplo:
"MonedaDR" : "USD"

 Se utiliza para indicar la moneda en la que se genero el CFDI original

(En este caso se utiliza como ejemplo un pago que se realizo en moneda USD y el documento relacionado en moneda MXN

Ejemplo:
"MonedaDR" : "MXN"

EquivalenciaDR	
Numerico

Requerido

El campo "EquivalenciaDR" presenta dos casos distintos como ejemplo:

Cuando el documento relacionado y el pago se realizan en la misma moneda extranjera (USD):

En este caso, "EquivalenciaDR" debe tener el valor 1.
Cuando el documento relacionado y el pago se realizan en la misma moneda nacional (MXN):

En este caso, "EquivalenciaDR" debe tener el valor 1.


Ejemplo:

Cuando se realiza el Pago en USD y Documento relacionado en USD


"EquivalenciaDR": "1"

 

Cuando se realiza el Pago en MXN y Documento relacionado en MXN


"EquivalenciaDR": "1"

 

El campo "EquivalenciaDR" presenta dos casos distintos como ejemplo:

Tipo de cambio: 1USD = 18MXN

Cuando el documento relacionado se realiza en moneda nacional(MXN) y el pago se realizan una moneda extranjera(USD):

En este caso, "EquivalenciaDR" debe tener el valor 18.

 

Ejemplo:

Cuando se realiza el Pago en MXN y Documento relacionado en USD


"EquivalenciaDR": "18"

El tipo de cambio corresponde a 

1USD = 18MXN

-----------------------------

Cuando el documento relacionado se realiza en moneda extranjera(USD) y el pago se realiza en moneda nacional(MXN).

En este caso, "EquivalenciaDR" debe tener el valor 0.055555.

 

Ejemplo:

Cuando se realiza el Pago en USD y Documento relacionado en MXN


"EquivalenciaDR": "0.055555"

 El tipo de cambio corresponde a

1MXN = 0.055555USD

 

Nota:

Te recomendamos tener cuidado con el tipo de cambio que se coloca en el pago ya que este podria causar confusiones al realizar la conversion.

Recuerda que el tipo de cambio en EquivalenciaDR corresponde a convertir la moneda del documento relacionado a la moneda del pago.

 Impuestos	
 Array

Requerido

 Arreglo que contiene los diferentes tipos de impuestos para nuestro pago en este caso "traslado" y "retenidos"

Ejemplo:

"Impuestos": {

"Traslados": [  ],

"Retenidos": [  ]

}

 

 Arreglo que contiene los diferentes tipos de impuestos para nuestro pago en este caso "traslado" y "retenidos"

Ejemplo:

"Impuestos": {

"Traslados": [  ],

"Retenidos": [  ]

}

 
 Traslados	
 Array

Requerido

Identico para ambos casos	
Arreglo que contiene los impuestos de traslado especificos aplicados a nuestro pago

Ejemplo: IVA, IEPS....


"Traslados": [
{
"Base": "1300.000000",
"Impuesto": "002",
"TipoFactor": "Tasa",
"TasaOCuota": "0.16",
"Importe": "208.000000"
},
{
"Base": "1200.000000",
"Impuesto": "003",
"TipoFactor": "Cuota",
"TasaOCuota": "0.083333",
"Importe": "100.000000"
}
]

 Retenidos	
 String

Requerido

 Identico para ambos casos	
 Arreglo que contiene los impuestos de retencion especificos aplicados a nuestro pago

Ejemplo: Retencion de ISR ............

"Retenidos": [
{
"Base": "1300.000000",
"Impuesto": "001",
"TipoFactor": "Tasa",
"TasaOCuota": "0.10",
"Importe": "130.000000"
}
]

 Base	
 String

Requerido

 Identico para ambos casos	 Indica el subtotal del cual se calcula el impuesto
 Impuesto	
 String

Requerido

 Identico para ambos casos	
 Indica el tipo de impuesto que se aplicara a nuestro pago

Se debe ingresar con el codigo que le corresponde ejemplo:

"002" corresponde a IVA

 TipoFactor	
 String

Requerido

 Identico para ambos casos	 Indica el tipo de factor que correponde a nuestro impuesto
 TasaCuota	
 String

Requerido

 Identico para ambos casos	
 Indica el porcentaje correspondiente al impuesto que aplicaremos

Se utiliza ingresando el monto por el cual multiplica nuestra base, ejemplo:

"0.16" para el 16% de IVA

 Importe	
 String

Requerido

 Identico para ambos casos	 Indica el monto que corresponde de nuestrio impuesto
NumParcialidad	
String

Requerido

Identico para ambos casos	Indica el número de pago o abono que corresponde. En caso de ser el primer pago poner 1.

Ejemplo:
"NumParcialidad" : "5" 
ImpSaldoAnt	
Numerico

Requerido

Indica el monto del saldo pendiente de la parcialidad anterior. En el caso de que sea la primer parcialidad este campo debe contener el importe total del documento relacionado.

Ejemplo:
"ImpSaldoAnt" : "720"	
 Indica el monto del saldo pendiente de la parcialidad anterior. En el caso de que sea la primer parcialidad este campo debe contener el importe total del documento relacionado.

En moneda distinta continuamos utilizando la moneda del CFDI original

Ejemplo:
"ImpSaldoAnt" : "40"

ImpPagado	
Numerico

Requerido

Indica el importe del abono que se está haciendo actualmente al CFDI.

Ejemplo:
"ImpPagado" : "720"	
 Indica el importe del abono que se está haciendo actualmente al CFDI.

En moneda distinta continuamos utilizando la moneda del CFDI original

Ejemplo:
"ImpPagado" : "20"

ImpSaldoInsoluto	
Numerico

Requerido

Indica el monto del saldo pendiente por pagar. Es la diferencia entre el Saldo anterior y el monto de pago.

Ejemplo:
"ImpSaldoInsoluto" : "0"	 Indica el monto del saldo pendiente por pagar. Es la diferencia entre el Saldo anterior y el monto de pago.

Ejemplo:
"ImpSaldoInsoluto" : "20"
ObjetoImpuesto	
String

Opcional

Identico para ambos casos	
Campo para indicar si el documento relacionado es objeto de impuesto, admite los siguientes valores:

"01", "02", "03" y "04"

En caso de que este campo se envie vacio o no se envie se valida si el documento relacionado contiene impuestos, en caso de que existan por defecto se asignara el valor "02" y si no existen impuestos se asignara el valor "01"

Para los casos en los que se utilizen las claves 01, 03 o 04 si se envia el documento relacionado con impuestos estos seran ignorados junto a su desglose y el documento se presentara como si no incluyera impuestos ya que se da prioridad a la clave

Los valores de las claves son los siguientes:

01 - No objeto de impuesto

02 - Sí, objeto de impuesto

03 - Sí, objeto de impuesto y no obligado al desglose

04 -Sí, objeto de impuesto y no causa impuesto

Ejemplo con monedas identicas pago(MXN) y docto. relacionado(MXN)
JSON

"DoctoRelacionado": [
        {
          "IdDocumento": "3e27ae21-b190-4c4c-a8d1-d3b6ab993122",
          "MonedaDR": "MXN",
          "EquivalenciaDR": "1",
          "Impuestos": {
            "Traslados": [
              {
                "Base": "620.690000",
                "Impuesto": "002",
                "TipoFactor": "Tasa",
                "TasaOCuota": "0.16",
                "Importe": "99.310000"
              }
            ],
            "Retenidos": []
          },
          "NumParcialidad": "5",
          "ImpSaldoAnt": "720",
          "ImpPagado": "720",
          "ImpSaldoInsoluto": "0",
          "NoObligadoADesglose": false
        }
      ]

Ejemplo con monedas identicas pago(USD) y docto. relacionado(USD)
JSON

"DoctoRelacionado": [
      {
        "IdDocumento": "5fb01ad1-7c1a-47fc-a4b5-88c8304be341",
        "MonedaDR": "USD",
        "EquivalenciaDR": "1",
        "Impuestos": {
          "Traslados": [
            {
              "Base": "10205.310000",
              "Importe": "1632.849600",
              "Impuesto": "002",
              "TasaOCuota": "0.160000",
              "TipoFactor": "Tasa"
            }
          ],
          "Retenidos": []
        },
        "NumParcialidad": "1",
        "ImpSaldoAnt": "11838.16",
        "ImpPagado": "11838.16",
        "ImpSaldoInsoluto": "0.000000",
        "NoObligadoADesglose": false
      }
      ],

Ejemplo de pago en moneda distinta pago USD y docto. relacionado(MXN)
JSON

"DoctoRelacionado": [
      {
        "IdDocumento": "5fb01ad1-7c1a-47fc-a4b5-88c8304be341",
        "MonedaDR": "USD",
        "EquivalenciaDR": "16.8070",
        "Impuestos": {
          "Traslados": [
            {
              "Base": "10205.310000",
              "Importe": "1632.849600",
              "Impuesto": "002",
              "TasaOCuota": "0.160000",
              "TipoFactor": "Tasa"
            }
          ],
          "Retenidos": []
        },
        "NumParcialidad": "1",
        "ImpSaldoAnt": "11838.16",
        "ImpPagado": "11838.16",
        "ImpSaldoInsoluto": "0.000000",
        "NoObligadoADesglose": false
      }
      ],

CFDIs relacionados a complemento de pago
Este nodo es opcional y se utiliza para especificar cuando un complemento de pago está sustituyendo a otro.

A continuación se describen los atributos que conforman el nodo CfdiRelacionados:

Tip

El nodo CfdiRelacionados es opcional, en caso de agregarlo es necesario hacerlo dentro del objeto pincipal que se enviará en la petición y en este caso el tipo de relación siempre debe ser: 04 -Sustitución.

El nodo de CfdiRelacionados se conforma de los siguientes atributos:

Parámetro	Tipo	Requerido	Detalles
TipoRelacion	String	Requerido	Indicar la clave del tipo de relación correspondiente.

Revisar el listado de claves proporcionado por el SAT.

Ejemplo:
"TipoRelacion": "04"
UUID	Array	Requerido	Indicar el o los UID de los CFDIS con los que se relaciona el actual.

Ejemplo:
"UUID": [
"29c98cb2-f72a-4cbe-a297-606da335e187",
"a96f6b9a-70aa-4f2d-bc5e-d54fb7371236"
]
Ejemplo de CFDI relacionado
JSON

"CfdiRelacionados": {
    "TipoRelacion": "04",
    "UUID": [
      "29c98cb2-f72a-4cbe-a297-606da335e187",
      "a96f6b9a-70aa-4f2d-bc5e-d54fb7371236"
    ]
  },
