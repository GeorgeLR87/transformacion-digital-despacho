Crear CFDI Global 4.0
A continuación se explica la forma de crear un CFDI global 4.0, es importante tomar en cuenta que la creación de este CFDI es similar a un CFDI normal a el cual se añadiran datos como la Periodicidad y los elementos que la componen para definir el lapso de tiempo que cubre este CFDI global.

Tip

Esta sección solo se centra en información relacionada con los elementos extra necesarios para generar nuestro CFDI global por lo que es necesario consultar primero la creación del CFDI 4.0 para poder utilizar esta información, puedes encontrar la primera parte en este link.

Los elementos necesarios para la creación de un CFDI global son los siguientes:

Valor	Descripción
InformacionGlobal	Se utiliza como el identificador para definir un CFDI global y es el arreglo que contendrá los valores de "Periodicidad", "Meses", "Año" al utilizarlo es necesario enviar información en todos los campos que lo componen.
Periodicidad	
Define el periodo de tiempo que abarca el CFDI global y los valores corresponden a los tipos de periodicidad:

"01"  -  Diario

"02"  -  Semanal

"03"  -  Quincenal

"04"  -  Mensual

"05"  -  Bimestral

Meses	
Corresponde al mes en el cual se va a generar el CFDI global y los valores corresponden a los meses como se muestra aquí:

"01"  -  Enero

"02"  -  Febrero

"03"  -  Marzo

"04"  -  Abril

"05"  -  Mayo

"06"  -  Junio

"07"  -  Julio

"08"  -  Agosto

"09"  -  Septiembre

"10"  -  Octubre

"11"  -  Noviembre

"12"  -  Diciembre

Al utilizar la periodicidad "05"(Bimestral) se deben utilizar los siguientes valores con los bimestres correspondientes como se muestra a continuación:

"13"  -  Enero - Febrero

"14"  -  Marzo - Abril

"15"  -  Mayo - Junio

"16"  -  Julio - Agosto

"17"  -  Septiembre - Octubre

"18"  -  Noviembre - Diciembre

Año	En este campo se ingresa el año a el cual corresponde el CFDI global en este campo se debe ingresar únicamente el año a cuatro dígitos ejemplo: "2022"
Ejemplo de bloque para CFDI global
JSON

{
  "InformacionGlobal": {
    "Periodicidad" : "05",
      "Meses" : "14",
      "Año" : "2021"
  }
}

Construcción de la URL
Importante

El método que se utiliza para la creación de un CFDI global es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/create

Ejemplo: https://api.factura.com/v4/cfdi40/create

Ejemplo de creación de CFDI global
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/create"

payload = json.dumps({
  "Receptor": {
    "UID": "6169fc02637e1"
  },
  "TipoDocumento": "factura",
  "InformacionGlobal": {
    "Periodicidad": "05",
    "Meses": "14",
    "Año": "2021"
  },
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
  'F-Api-Key': '{{API-key}}',
  'F-Secret-Key': '{{Secret-key}}'
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

Importante

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error, ya que en el mismo se indica donde es necesario corregir la información.