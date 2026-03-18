Catálogos
A continuación se enlistan los tipos de CFDI aceptados por Factura.com, para hacer uso de el parametro "TipoDocumento" al momento de generar un CFDI es necesario utilizar el valor de la columna "Clave" y corresponde a el valor "Tipo de CFDI"

Importante

Si especificamos que tipo de documento con estas claves es importante tomar en cuenta que debe coincidir con el tipo de documento asignado a la serie que utilizamos para timbrar nuestro documento, este paso es opcional y podemos asignar una serie con el tipo de documento que deseamos utilizar, y se asignara de forma correcta el tipo de documento que se asigno al momento de crear la serie.

Tipos de documento
Clave	Tipo de CFDI
factura	Factura
factura_hotel	Factura para hoteles
honorarios	Recibo de honorarios
nota_cargo	Nota de cargo
donativos	Donativo
arrendamiento	Recibo de arrendamiento
nota_credito	Nota de crédito
nota_debito	Nota de débito
nota_devolucion	Nota de devolución
carta_porte	Carta porte
carta_porte_ingreso	Carta porte de Ingreso
pago	Pago
retencion	Retención
Catálogos SAT
Puedes consultar los catálogos que el SAT provee para el timbrado.

El API de Factura.com cuenta con endpoints puestos a tu disposición para consultar los catálogos de claves válidas para el SAT.

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/nombre_catalogo

Ejemplo: https://api.factura.com/v3/catalogo/nombre_catalogo

Tip

Es necesario cambiar en la url nombre_catalogo por el nombre del catálogo que deseas consultar.

Clave Producto/Servicio
Consulta el catálogo de Clave Producto/Servicio

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/ClaveProductServ

Ejemplo: https://api.factura.com/v3/catalogo/ClaveProductServ

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de clave producto/servicio
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/ClaveProductServ"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo clave producto/servicio
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
        "key": "10201500",
        "name": "Rosales vivos azules o lavanda o púrpura",
        "complement": ""
    },
    {
        "key": "10201501",
        "name": "Rosal vivo allure o sterling 95",
        "complement": ""
    },
    {
        "key": "10201502",
        "name": "Rosal vivo amnesia",
        "complement": ""
    },
    {
        "key": "10201503",
        "name": "Rosal vivo augusta louise",
        "complement": ""
    },
    {
        "key": "10201504",
        "name": "Rosal vivo avant garde",
        "complement": ""
    },
    {
        "key": "10201505",
        "name": "Rosal vivo blue bird",
        "complement": ""
    },
    {
        "key": "10201506",
        "name": "Rosal vivo curiosa",
        "complement": ""
    },
    {
        "key": "10201507",
        "name": "Rosal vivo cool water",
        "complement": ""
    },
  ]
}

Aduana
Consulta el catálogo de Aduanas

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/Aduana

Ejemplo: https://api.factura.com/v3/catalogo/Aduana

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de aduana
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/Aduana"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo aduana
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
      "key": "01",
      "name": "ACAPULCO, ACAPULCO DE JUAREZ, GUERRERO"
    },
    {
      "key": "02",
      "name": "AGUA PRIETA, AGUA PRIETA, SONORA"
    },
    {
      "key": "05",
      "name": "SUBTENIENTE LOPEZ, SUBTENIENTE LOPEZ, QUINTANA ROO"
    },
    {
      "key": "06",
      "name": "CIUDAD DEL CARMEN, CIUDAD DEL CARMEN, CAMPECHE"
    },
    {
      "key": "07",
      "name": "CIUDAD JUAREZ, CIUDAD JUAREZ, CHIHUAHUA"
    },
    {
      "key": "08",
      "name": "COATZACOALCOS, COATZACOALCOS, VERACRUZ"
    },
    {
      "key": "11",
      "name": "ENSENADA, ENSENADA, BAJA CALIFORNIA"
    },
  ]
}

Unidad
Consulta el catálogo de Unidades de medida

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/ClaveUnidad

Ejemplo: https://api.factura.com/v3/catalogo/ClaveUnidad

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de unidad de medida
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/ClaveUnidad"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo unidad de medida
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
      "key": "C81",
      "name": "Radián"
    },
    {
      "key": "C25",
      "name": "Milirradián"
    },
    {
      "key": "B97",
      "name": "Microrradián"
    },
    {
      "key": "DD",
      "name": "Grado [unidad de ángulo]"
    },
    {
      "key": "D61",
      "name": "Minuto [unidad de ángulo]"
    }
  ]
}

Forma de pago
Consulta el catálogo de forma de pago

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/FormaPago

Ejemplo: https://api.factura.com/v3/catalogo/FormaPago

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de forma de pago
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/FormaPago"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo forma de pago
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
      "key": "01",
      "name": "Efectivo"
    },
    {
      "key": "02",
      "name": "Cheque nominativo"
    },
    {
      "key": "03",
      "name": "Transferencia electrónica de fondos"
    },
    {
      "key": "04",
      "name": "Tarjeta de crédito"
    },
    {
      "key": "05",
      "name": "Monedero electrónico"
    }
  ]
}

Catálogo de impuestos
Consulta el catálogo de impuestos

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/Impuesto

Ejemplo: https://api.factura.com/v3/catalogo/Impuesto

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de impuestos
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/Impuesto"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo impuestos
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
        {
     "key": "001",
     "name": "ISR"
        },
    {
      "key": "002",
      "name": "IVA"
    },
    {
      "key": "003",
      "name": "IEPS"
    }
  ]
}

Métodos de pago
Consulta el catálogo de métodos de pago

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/MetodoPago

Ejemplo: https://api.factura.com/v3/catalogo/MetodoPago

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de métodos de pago
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/MetodoPago"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo métodos de pago
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
        {
      "key": "PUE",
      "name": "Pago en una sola exhibición"
    },
    {
      "key": "PPD",
      "name": "Pago en parcialidades o diferido"
    }

  ]
}

Moneda
Consulta el catálogo de monedas

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/Moneda

Ejemplo: https://api.factura.com/v3/catalogo/Moneda

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de monedas
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/Moneda"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo monedas
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
      "key": "AED",
      "name": "Dirham de EAU"
    },
    {
      "key": "AFN",
      "name": "Afghani"
    },
    {
      "key": "ALL",
      "name": "Lek"
    },
    {
      "key": "AMD",
      "name": "Dram armenio"
    },
    {
      "key": "ANG",
      "name": "Florín antillano neerlandés"
    },
  ]
}

País
Consulta el catálogo de paises

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/Pais

Ejemplo: https://api.factura.com/v3/catalogo/Pais

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de pais
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/Pais"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo paises
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
      "key": "AFG",
      "name": "Afganistán"
    },
    {
      "key": "ALA",
      "name": "Islas Åland"
    },
    {
      "key": "ALB",
      "name": "Albania"
    },
    {
      "key": "DEU",
      "name": "Alemania"
    }
  ]
}

Régimen fiscal
Consulta el catálogo de régimen fiscal

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/RegimenFiscal

Ejemplo: https://api.factura.com/v3/catalogo/RegimenFiscal

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de regimen fiscal
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/RegimenFiscal"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo regimen fiscal
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
        "key": "601",
        "name": "General de Ley Personas Morales"
    },
    {
        "key": "603",
        "name": "Personas Morales con Fines no Lucrativos"
    },
    {
        "key": "605",
        "name": "Sueldos y Salarios e Ingresos Asimilados a Salarios"
    },
    {
        "key": "606",
        "name": "Arrendamiento"
    },
    {
        "key": "608",
        "name": "Demás ingresos"
    }
  ]
}

Tipo de relación
Consulta el catálogo de

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/catalogo/Relacion

Ejemplo: https://api.factura.com/v3/catalogo/Relacion

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de tipo de relacion
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/catalogo/Relacion"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo tipo de relación
Respuesta exitosa
JSON

{
  "response": "success",
  "data": [
    {
        "key": "01",
        "name": "Nota de crédito de los documentos relacionados"
    },
    {
        "key": "02",
        "name": "Nota de débito de los documentos relacionados"
    },
    {
        "key": "03",
        "name": "Devolución de mercancía sobre facturas o traslados previos"
    },
    {
        "key": "04",
        "name": "Sustitución de los CFDI previos"
    }
  ]
}

Uso de CFDI
Consulta el catálogo de claves de uso de CFDI

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/catalogo/UsoCfdi

Ejemplo: https://api.factura.com/v4/catalogo/UsoCfdi

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de uso de CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/catalogo/UsoCfdi"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'API.Key',
  'F-Secret-Key': 'Secret.Key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo de claves de uso de CFDI
JSON

{
    "key": "G01",
    "name": "Adquisición de mercancias",
    "use": "ambos",
    "regimenes": ["601", "603", "606", "612", "620", "621", "622", "623", "624", "625", "626"]
  },
  {
    "key": "G02",
    "name": "Devoluciones, descuentos o bonificaciones",
    "use": "ambos",
    "regimenes": ["601", "603", "606", "612", "620", "621", "622", "623", "624", "625", "626"]
  },
  {
    "key": "G03",
    "name": "Gastos en general",
    "use": "ambos",
    "regimenes": ["601", "603", "606", "612", "620", "621", "622", "623", "624", "625", "626"]
  },
  {
    "key": "I01",
    "name": "Construcciones",
    "use": "ambos",
    "regimenes": ["601", "603", "606", "612", "620", "621", "622", "623", "624", "625", "626"]
  }

Clave de Retención
Consulta el catálogo de claves de retención

Construcción de la URL

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/catalogos/retenciones/claveRetencion

Ejemplo: https://api.factura.com/v4/catalogos/retenciones/claveRetencion

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de uso de Clave de retención
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/catalogos/retenciones/claveRetencion"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta de catálogo de claves de retención
Respuesta exitosa
JSON

[
    {
        "key": "01",
        "name": "Servicios profesionales"
    },
    {
        "key": "02",
        "name": "Regalías por derechos de autor"
    },
    {
        "key": "03",
        "name": "Autotransporte terrestre de carga"
    }
]