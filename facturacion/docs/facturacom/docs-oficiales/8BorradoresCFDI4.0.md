Borradores CFDI 4.0
Crear borrador
Este nodo es opcional y se utiliza para especificar si deseamos crear un borrador de CFDI, existen 2 situaciones distintas donde podremos generar un borrador.

La primera es utilizando la bandera BorradorSiFalla con la cual trataremos de timbrar nuestro CFDI y en caso de que contenga algun error en la información enviada o configuraciones de nuestro cliente o algun problema en la configuración de nuestra empresa la información que enviamos generara un borrador el cual podremos recuperar y modificar para timbrar de nuevo nuestro comprobante despues de las correcciones necesarias

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/create

Ejemplo: https://api.factura.com/v4/cfdi40/create

Ejemplo para crear borrador de CFDI con bandera "borradorSiFalla"
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create"

payload = json.dumps({
  "Receptor": {
    "UID": "623396a68457b"
  },
  "TipoDocumento": "factura",
  "EnviarCorreo": "1",
  "BorradorSiFalla": "1",
  "Serie": "22",
  "Conceptos": [
    {
      "ClaveProdServ": "30161503",
      "Cantidad": "5",
      "Descripcion": "PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM",
      "Descuento": "81.47",
      "NoIdentificacion": "AT01",
      "ClaveUnidad": "H87",
      "Unidad": "Pieza",
      "ValorUnitario": "108.62",
      "ObjetoImp":"02",
      "Impuestos": {
        "Traslados": [
          {
            "Base": "7254461.63",
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.16",
            "Importe": "73.8716"
          }
        ]
      }
    }
  ],
  "UsoCFDI": "P01",
  "FormaPago": "01",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "Comentarios": "Prueba V3.0"
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

La segunda situación es con la bandera Draft la cual al estar activa utilizaremos el método para crear un CFDI pero este no intentara ser timbrado este directamente se almacena como borrador

Importante

Información immportante sobre las banderas de borradores:

En la construcción de un CFDI se pueden utilizar ambas banderas pero la bandera DRAFT tiene prioridad sobre BorradorSiFalla
Los campos minimos para crear un borrador estan definidos por los campos minimos para crear un CFDI por lo que no se puede almacenar cualquier dato, es necesario utilizar el formato y caracteristicas de un CFDI
Las banderas son opcionales por lo tanto si no se envian se encuentran en un estado por default en falso por lo que no generaran borradores a menos que las integremos en nuestra construcción del CFDI
Ejemplo para crear borrador de CFDI con bandera "draft"
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create"

payload = json.dumps({
  "Receptor": {
    "UID": "623396a68457b"
  },
  "TipoDocumento": "factura",
  "EnviarCorreo": "1",
  "Draft": "1",
  "Serie": "22",
  "Conceptos": [
    {
      "ClaveProdServ": "30161503",
      "Cantidad": "5",
      "Descripcion": "PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM",
      "Descuento": "81.47",
      "NoIdentificacion": "AT01",
      "ClaveUnidad": "H87",
      "Unidad": "Pieza",
      "ValorUnitario": "108.62",
      "ObjetoImp":"02",
      "Impuestos": {
        "Traslados": [
          {
            "Base": "7254461.63",
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.16",
            "Importe": "73.8716"
          }
        ]
      }
    }
  ],
  "UsoCFDI": "P01",
  "FormaPago": "01",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "Comentarios": "Prueba V3.0"
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)

Ejemplo

Si tu CFDI utiliza la bandera BorradorSiFalla y el CFDI contiene algun error lo primero que veremos en la respuesta es el error por el cual no puede ser timbrado y a continuación la confirmación del borrador generado

Respuesta
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

Ejemplo

Si tu CFDI utiliza la bandera Draft directamente recibiremos la respuesta del estado del borrador con la informacion correspondiente

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

A continuación se muestran las banderas utilizadas en los borradores

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
Recuperar borrador
A continuación se explica como funciona el servicio con el cual podras recuperar los borradores de CFDI este método no hace distinción entre versiones de CFDI por lo que todos seran listados

Tip

Importante el metodo para recuperar los borradores es de tipo GET

Para recuperar los borradores se utilizaran los siguientes parametros para la creación del metodo:

Parámetro	Tipo	Requerido	Detalles
perPage	Numerico	Requerido	Indica el numero de borradores que queremos recupear por pagina
page	Numerico	Requerido	Se utiliza para indicar la pagina en la que queremos localizar los borradores
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/drafts

Ejemplo: https://api.factura.com/v4/drafts

Ejemplo para recuperar borradores de CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/drafts"

payload = json.dumps({
  "perPage": 25,
  "page": 1
})
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta
JSON

{
    "response": "success",
    "total": 32,
    "perPage": 2,
    "currentPage": 1,
    "lastPage": 16,
    "data": [
        {
            "UUID": "62478ea8b9b9e",
            "Serie": "F",
            "Folio": 392,
            "Version": "4.0",
            "draft": {
                "Receptor": {
                    "UID": "6169fc02637e1"
                },
                "TipoDocumento": "factura",
                "EnviarCorreo": "1",
                "BorradorSiFalla": "1",
                "Serie": "17317",
                "Conceptos": [
                    {
                        "ClaveProdServ": "30161503",
                        "Cantidad": "5",
                        "Descripcion": "PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM",
                        "Descuento": "81.465",
                        "NoIdentificacion": "AT01",
                        "ClaveUnidad": "H87",
                        "Unidad": "Pieza",
                        "ValorUnitario": "108.62",
                        "ObjetoImp":"02",
                        "Impuestos": {
                            "Traslados": [
                                {
                                    "Base": "543.1",
                                    "Impuesto": "002",
                                    "TipoFactor": "Tasa",
                                    "TasaOCuota": "0.16",
                                    "Importe": "73122.8616"
                                }
                            ]
                        }
                    }
                ],
                "UsoCFDI": "P01",
                "FormaPago": "01",
                "MetodoPago": "PUE",
                "Moneda": "MXN",
                "Comentarios": "Prueba"
            }
        },
        {
            "UUID": "6247841ce68ed",
            "Serie": "F",
            "Folio": 389,
            "Version": "3.3",
            "draft": {
                "TipoCfdi": "factura",
                "Comentarios": "Prueba",
                "EnviarCorreo": "1",
                "Abonado": "",
                "Draft": "1",
                "DocumentoAbonado": {
                    "Cuenta": "",
                    "PagarTotal": "1",
                    "Monto": "536",
                    "Fecha": "",
                    "Estado": "",
                    "Referencia": "",
                    "Nota": ""
                },
                "AppOrigin": "cb958479f1f201e367aed1aa76a2022e30dde66430099d7557001bd29dddd2f0",
                "Version": "4.0",
                "Serie": "17317",
                "Folio": "",
                "Fecha": "2022/04/01",
                "Sello": "",
                "FormaPago": "01",
                "NoCertificado": "",
                "Certificado": "",
                "SubTotal": "543",
                "Descuento": "81.47",
                "Moneda": "MXN",
                "Total": "536",
                "TipoDeComprobante": "",
                "MetodoPago": "PUE",
                "LugarExpedicion": "11111",
                "LugarExpedicionId": "",
                "Confirmacion": "",
                "UsoCFDI": "P01",
                "CfdiRelacionados": {
                    "UUID": []
                },
                "Emisor": {
                    "Rfc": "",
                    "Nombre": "",
                    "RegimenFiscal": ""
                },
                "Receptor": {
                    "ResidenciaFiscal": "",
                    "UID": "6169fc02637e1"
                },
                "Conceptos": [
                    {
                        "ClaveProdServ": "30161503",
                        "NoIdentificacion": "AT01",
                        "Cantidad": "5",
                        "ClaveUnidad": "H87",
                        "Unidad": "Pieza",
                        "Descripcion": "PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM",
                        "ValorUnitario": "108.62",
                        "Importe": "543.100000",
                        "Descuento": "81.47",
                        "tipoDesc": "cantidad",
                        "ObjetoImp":"02",
                        "Impuestos": {
                            "Traslados": [
                                {
                                    "Base": "461.630000",
                                    "Impuesto": "002",
                                    "TipoFactor": "Tasa",
                                    "TasaOCuota": "0.16",
                                    "Importe": "73.8616"
                                }
                            ],
                            "Retenidos": [],
                            "Locales": []
                        },
                        "Partes": "0",
                        "Complemento": "0"
                    }
                ]
            }
        }
    ]
}

Recuperar borrador por UID
A continuación se explica como funciona el servicio con el cual podras recuperar los borradores de CFDI este método no hace distinción entre versiones de CFDI por lo que todos seran listados

Tip

Importante el metodo para recuperar los borradores es de tipo GET

Para recuperar un borrador por UID se utilizaran los siguientes parametros para la creación del metodo:

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Indica el UID del borrador que deseamos recuperar
Tip

Es necesario cambiar el la palabra UID por el UID correspondiente del borrador que deseamos recuperar como se muestra en la sección de codigo

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/drafts/UID

Ejemplo: https://api.factura.com/v4/drafts/UID

Ejemplo para recuperar borradores de CFDI por UID
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/drafts/6245d596c1be2"

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
    "response": "success",
    "data": {
        "UUID": "6245d596c1be2",
        "Serie": "F",
        "Folio": 384,
        "Version": "4.0",
        "draft": {
            "Receptor": {
                "UID": "6169fc02637e1"
            },
            "TipoDocumento": "factura",
            "EnviarCorreo": "1",
            "BorradorSiFalla": "1",
            "Serie": "17317",
            "Conceptos": [
                {
                    "ClaveProdServ": "30161503",
                    "Cantidad": "5",
                    "Descripcion": "PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM",
                    "Descuento": "81.465",
                    "NoIdentificacion": "AT01",
                    "ClaveUnidad": "H87",
                    "Unidad": "Pieza",
                    "ValorUnitario": "108.62",
                    "ObjetoImp":"02",
                    "Impuestos": {
                        "Traslados": [
                            {
                                "Base": "543.1",
                                "Impuesto": "002",
                                "TipoFactor": "Tasa",
                                "TasaOCuota": "0.16",
                                "Importe": "73122.8616"
                            }
                        ]
                    }
                }
            ],
            "UsoCFDI": "P01",
            "FormaPago": "01",
            "MetodoPago": "PUE",
            "Moneda": "MXN",
            "Comentarios": "Prueba"
        }
    }
}

Modificar borrador
A continuación se explica como funciona el servicio con el cual podras modificar los borradores de CFDI

La forma en la que se modifican los borradores es por medio del UID correspondiente a nuestro borrador y enviaremos el campo bandera "Draft": "1" en este caso utilizaremos el mismo folio asignado donde se encuentra nuestro borrador original y enviaremos el json con toda la información del CFDI.

Importante

Es importante tomar en cuenta que no podemos modificar un campo de nuestro borrador unicamente, es decir generamos el json del CFDI completo y este sustituye el borrador previo por lo que al modificar un borrador deberemos enviar toda la informacion del CFDI Ademas es importante que si no indicamos el UID al realizar la actualización del borrador este generara uno nuevo

Para modificar un borrador se utilizaran los siguientes parametros para la creación del metodo:

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Indica el UID del borrador que deseamos recuperar
Tip

Es necesario cambiar el la palabra UID por el UID correspondiente del borrador que deseamos modificar como se muestra en la sección de codigo

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/create/UID

Ejemplo: https://api.factura.com/v4/cfdi40/create/UID

Tip

Importante el metodo para modificar los borradores es de tipo POST

Ejemplo para modificar borradores de CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create/6245d596c1be2"

payload = json.dumps({
  "Receptor": {
    "UID": "6169fc02637e1"
  },
  "TipoDocumento": "factura",
  "EnviarCorreo": "1",
  "Draft": "1",
  "BorradorSiFalla": "1",
  "Serie": 17317,
  "Conceptos": [
    {
      "ClaveProdServ": "30161503",
      "Cantidad": "5",
      "Descripcion": "PANEL DE YESO LIGTH REY DE 1.22 X 2.44 12.7 MM",
      "Descuento": "81.465",
      "NoIdentificacion": "AT01",
      "ClaveUnidad": "H87",
      "Unidad": "Pieza",
      "ValorUnitario": "108.62",
      "ObjetoImp":"02",
      "Impuestos": {
        "Traslados": [
          {
            "Base": "543.1",
            "Impuesto": "002",
            "TipoFactor": "Tasa",
            "TasaOCuota": "0.16",
            "Importe": "86.89"
          }
        ]
      }
    }
  ],
  "UsoCFDI": "P01",
  "FormaPago": "01",
  "MetodoPago": "PUE",
  "Moneda": "MXN",
  "Comentarios": "Prueba V3.0"
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
    "message": "Borrador creado satisfactoriamente",
    "UUID": "sin_uuid",
    "uid": "6245d596c1be2",
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
        "Folio": 384
    },
    "invoice_uid": "6245d596c1be2"
}

Timbrar borrador
A continuación se explica como funciona el servicio con el cual podras timbrar los borradores de CFDI, al timbrar un borrador este utiliza el mismo folio o UID que el borrador

Importante

Es importante tomar en cuenta que si el CFDI contiene errores en su estructura no se podra timbrar

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Indica el UID del borrador que deseamos recuperar
Tip

Es necesario cambiar el la palabra UID por el UID correspondiente del borrador que deseamos modificar como se muestra en la sección de codigo

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/UID/timbrarborrador

Ejemplo: https://api.factura.com/v4/cfdi40/UID/timbrarborrador

Tip

Importante el metodo para timbrar los borradores es de tipo POST

PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/62683c478e319/timbrarborrador"

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
Respuesta exitosa
JSON

{
    "response": "success",
    "message": "Factura creada y enviada satisfactoriamente",
    "UUID": "d72667bd-c189-4734-bfff-5b3eed9448dc",
    "uid": "62683c478e319",
    "SAT": {
        "UUID": "d72667bd-c189-4734-bfff-5b3eed9448dc",
        "FechaTimbrado": "2022-04-26T17:04:06",
        "NoCertificadoSAT": "30001000000400002495",
        "Version": "1.1",
        "SelloSAT": "pG/AMq9sip4G70TPpflXGOdLJB5DKHz6Do0ATQemBjxLQ73YZu0vuRziyW7QeuTerXyHhscl/tPwgcDPIrjXbhqnCdUHdDqvKnRyjqWXGj38Eg37L/bNKudytKRNs6TnfOr6WlZDrojD6vVHLUvVSuvjS74S4mObdAT67XorWIe6CJVlIsP+cllKngXZ+wGxgzz/ywjtHlCinIFScbH3lS1oIXDrvNGeMFerq3I/ScmttClp+EpNoeR9G2QcDAoDeMKZtiwkxaNGsQPNDcRvn/0f81ezFlWawIncYRDsfegMj/oo1RZEMNh2Zwbh+0+IpRUWrobNrcvxh4E3wOLL0Q==",
        "SelloCFD": "a0FjZ6MRPkzZh1WLffQsJMqZpbiOWB69p09Rojy1+IVhimJkKOc2XEfSKRytAuu2di77kgwaLJKpXT0Zq/VSV2pzmTr0SHDnHoHjjYLja62G5f/EXKHepjYPbHdrgPLHzjIJZvsluXZcI5PCt7u1sWl40/RsrHS+4VmWB/uD42ExXzFkG44gTbbEO3uv0Yf43ohWkGCcayIUC46U8X8hlBgrm38gB12BfygS5g32gKSAjTOZQ692jDwo2Pkl3X3mzpDyLlGS6vHKP2w3tIGrbCZheqoqAhSMVym2rnyW8nhHG+PhGldht6Wy7fcqCROHs7MiI60pACrLgYopLBqhXw=="
    },
    "INV": {
        "Serie": "F",
        "Folio": 425
    },
    "invoice_uid": "62683c478e319"
}

Eliminar borrador
A continuación se explica como funciona el servicio con el cual podras eliminar los borradores de CFDI almacenados en tu cuenta, este método no hace distinción entre versiones de CFDI por lo que se pueden eliminar borradores para CFDI 3.3 y 4.0

tip

Importante el metodo para eliminar los borradores es de tipo POST

Para Eliminar los borradores se utilizaran los siguientes parametros en nuestro método:

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador unico que hace referencia a el borrador el cual deseamos eliminar, se utiliza en el endpoint para la solicitud
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/drafts/UID/drop

Ejemplo: https://api.factura.com/v4/drafts/UID/drop

Ejemplo para eliminar un borrador de CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/drafts/62506108ebad9/drop"

payload={}
files={}
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)

Respuesta
Respuesta exitosa
JSON

{
    "response": "success",
    "message": "Borrador eliminado",
    "0": "extra",
    "1": {
        "inv_id": 53873,
        "inv_uid": "62506108ebad9",
        "inv_version": "4.0",
        "inv_user_id": 1765,
        "inv_account_id": 1832,
        "inv_status": "eliminada",
        "inv_folio_letra": "F-62506108ebad9",
        "inv_folio_numero": 406
    }
}
