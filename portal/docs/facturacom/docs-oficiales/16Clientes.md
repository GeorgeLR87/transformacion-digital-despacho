Clientes
Listar clientes
Este endpoint permite obtener una lista de los clientes registrados en el catálogo. Soporta filtrado por atributos específicos y paginación de resultados.

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/clients

Ejemplo: https://api.factura.com/v1/clients

Utilice los siguientes parámetros opcionales en la URL para filtrar los resultados por RFC o razón social, o para aplicar paginación en la respuesta:

Parámetro	Tipo	Requerido	Detalles
razon_social	string	Opcional	
Indica la razon social del cliente que se quiere consultar, puede estar completo o no.

Ejemplo: /v1/clients?razon_social=Venta al público

rfc	string	Opcional	
Agrega el RFC del cliente que quieres buscar en el catalogo.

Ejemplo: /v1/clients?rfc=XAXX010101000

page	Integer	Opcional	Indica número de página a consultar, por default posiciona en la página 1.
Ejemplo: /v1/clients?page=1&perPage=10

per_page	Integer	Opcional	Indica el limite de resultados para mostrar, por default retorna todos los clientes del catalogo.
Ejemplo: /v1/clients?page=1&perPage=10

Los parámetros de consulta deben incluirse en la URL. Utilice "?" para el primer parámetro y "&" para concatenar parámetros adicionales.

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para listar cliente
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients?razon_social=Venta al público"

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
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Respuesta exitosa
JSON

{
    "status": "success",
    "response": "success",
    "data": [
        {
            "UID": "63b5b2d9e30b4",
            "RazonSocial": "Venta al público en general",
            "RFC": "XAXX010101000",
            "Regimen": "Sin obligaciones fiscales",
            "RegimenId": "616",
            "Calle": "",
            "Numero": "",
            "Interior": "",
            "Colonia": "",
            "CodigoPostal": "45418",
            "Ciudad": "",
            "Delegacion": "",
            "Estado": "Jalisco",
            "Localidad": null,
            "Pais": "MEX",
            "NumRegIdTrib": "",
            "UsoCFDI": "S01",
            "Contacto": {
                "Nombre": "",
                "Apellidos": "",
                "Email": "email@ejemplo.com",
                "Email2": "contador@ejemplo.com",
                "Email3": "",
                "Telefono": ""
            },
            "cfdis": 1,
            "cuentas_banco": []
        },
        {
            "UID": "63b5b8b749ac7",
            "RazonSocial": "VENTA AL PUBLICO EN GENERAL",
            "RFC": "XAXX010101000",
            "Regimen": "Sin obligaciones fiscales",
            "RegimenId": "616",
            "Calle": "",
            "Numero": "",
            "Interior": "",
            "Colonia": "",
            "CodigoPostal": "45418",
            "Ciudad": "",
            "Delegacion": "",
            "Estado": "",
            "Localidad": null,
            "Pais": "MEX",
            "NumRegIdTrib": "",
            "UsoCFDI": "S01",
            "Contacto": {
                "Nombre": "",
                "Apellidos": "",
                "Email": "email@ejemplo.com",
                "Email2": "",
                "Email3": "",
                "Telefono": ""
            },
            "cfdis": 12,
            "cuentas_banco": []
        },
        {
            "UID": "688c03324cd38",
            "RazonSocial": "Venta al público en general extranjero",
            "RFC": "XEXX010101000",
            "Regimen": "Sin obligaciones fiscales",
            "RegimenId": "616",
            "Calle": "",
            "Numero": "",
            "Interior": "",
            "Colonia": "",
            "CodigoPostal": "00000",
            "Ciudad": "",
            "Delegacion": "",
            "Estado": "",
            "Localidad": null,
            "Pais": "EUA",
            "NumRegIdTrib": null,
            "UsoCFDI": "S01",
            "Contacto": {
                "Nombre": "",
                "Apellidos": "",
                "Email": "email@ejemplo.com",
                "Email2": "contador@ejemplo.com",
                "Email3": "",
                "Telefono": ""
            },
            "cfdis": 1,
            "cuentas_banco": []
        }
    ],
    "pagination": {
        "total": 3,
        "lastPage": 1,
        "currentPage": 1,
        "to": 3,
        "from": 1
    }
}

Consultar cliente
A continuación se explica el método con el cual podremos consultar un cliente en específico de nuestro catalogo.

Para consultar un cliente en específico podemos realizarlo con alguno de los siguientes parametros:

Parámetro	Tipo	Requerido	Detalles
RFC	String	Opcional

*Requerido en el caso de querer consultar solo a un cliente.	Indica el RFC del cliente a buscar
ejemplo: WERX631016S30
UID	String	Opcional

*Requerido en el caso de querer consultar solo a un cliente.	Es el identificador unico dentro de el sistema que pertenece a el cliente a buscar
ejemplo: 63ebd090d6015
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Ejemplo para consultar un cliente en especifico por RFC
Endpoint: /v1/clients/{RFC}

Ejemplo: https://api.factura.com/v1/clients/WERX631016S30

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients/WERX631016S30"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Ejemplo para consultar un cliente en especifico por UID
Endpoint: /v1/clients/{UID}

Ejemplo: https://api.factura.com/v1/clients/61f1a6157e8d8

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients/61f1a6157e8d8"

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
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Respuesta exitosa
JSON

{
    "status": "success",
    "Data": {
        "RazonSocial": "XAIME WEIR ROJO",
        "RFC": "WERX631016S30",
        "Regimen": "Personas Físicas con Actividades Empresariales y Profesionales",
        "RegimenId": "612",
        "Calle": "COPERNICO",
        "Numero": "18374",
        "Interior": "INT 02",
        "Colonia": "PERLA",
        "CodigoPostal": "01279",
        "Ciudad": "CIUDAD DE MEXICO",
        "Delegacion": "ALVARO OBREGON",
        "Estado": "CIUDAD DE MEXICO",
        "Pais": "MEX",
        "NumRegIdTrib": "",
        "UsoCFDI": "G01",
        "Contacto": {
            "Nombre": "XAIME",
            "Apellidos": "WEIR ROJO",
            "Email": "xaimeweir@gmail.com",
            "Email2": "",
            "Email3": "",
            "Telefono": "3344556677"
        },
        "UID": "63ebd090d6015",
        "cfdis": 123,
        "cuentas_banco": []
    }
}
Consultar RFC repetido con diferente información
A continuación se explica como consultar un RFC dado de alta más de una vez pero con distintas razones sociales o distintos datos.

Para consultar un RFC en específico es necesario enviarlo en la petición.

Parámetro	Tipo	Requerido	Detalles
RFC	String	Opcional

*Requerido en el caso de querer consultar solo a un cliente.	Indica el RFC a buscar, para traer toda la información de los clientes registrados que tengan este dato repetido dentro de nuestro catalogo.
Atención

La URL que se utiliza para consultar un RFC repetido tiene similitudes con el metodo para buscar un cliente en especifico, es importante tener cuidado al utilizar la URL ya que contiene "/rfc" en ella para poder realizar esta petición.

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/clients/rfc/{RFC}

Ejemplo: https://api.factura.com/v1/clients/rfc/WERX631016S30

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Importante

En caso de tener más de un cliente registrado con el mismo RFC, la respuesta a esta petición incluirá a todos los clientes dados de alta cuyo RFC coincida con el solicitado, de este modo podrás elegir de entre los resultados el cliente que requieres.

Ejemplo para consultar un RFC repetido
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients/rfc/WERX631016S30"

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
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Respuesta exitosa
JSON

{
    "status": "success",
    "Data": [
        {
            "UID": "645404557e9c2",
            "RazonSocial": "XENON INDUSTRIAL ARTICLES",
            "RFC": "XIA190128J61",
            "Regimen": "General de Ley Personas Morales",
            "RegimenId": "601",
            "Calle": "AV. CIRCUNVALACION",
            "Numero": "7947",
            "Interior": "B-1",
            "Colonia": "Militar",
            "CodigoPostal": "76343",
            "Ciudad": "SANTIAGO DE QUERETARO",
            "Delegacion": "SANTIAGO DE QUERETARO",
            "Estado": "QUERETARO",
            "Localidad": "JALPAN DE SERRA",
            "Pais": "MEX",
            "NumRegIdTrib": "",
            "UsoCFDI": "G01",
            "Contacto": {
                "Nombre": "SAUL",
                "Apellidos": "ESTRADA",
                "Email": "xenon@iarticles.com",
                "Email2": "altemail@mail.com",
                "Email3": "emailrespaldo@mail.com",
                "Telefono": "3344556677"
            },
            "cfdis": 49,
            "cuentas_banco": [
                {
                    "banco": "BANAMEX",
                    "cuenta": "0987"
                }
            ]
        },
        {
            "UID": "649485557a8b1",
            "RazonSocial": "XENON ARTICLES",
            "RFC": "XIA190128J61",
            "Regimen": "General de Ley Personas Morales",
            "RegimenId": "601",
            "Calle": "AV. NORTE",
            "Numero": "1200",
            "Interior": "",
            "Colonia": "Militar",
            "CodigoPostal": "76343",
            "Ciudad": "SANTIAGO DE QUERETARO",
            "Delegacion": "SANTIAGO DE QUERETARO",
            "Estado": "QUERETARO",
            "Localidad": "ESTACION UNIVERSIDAD",
            "Pais": "MEX",
            "NumRegIdTrib": "",
            "UsoCFDI": "G01",
            "Contacto": {
                "Nombre": "PALOMA",
                "Apellidos": "JUAREZ",
                "Email": "paloma@iarticles.com",
                "Email2": "altemail@mail.com",
                "Email3": "emailrespaldo@mail.com",
                "Telefono": "3344556677"
            },
            "cfdis": 0,
            "cuentas_banco": []
        }
    ]
}

Crear cliente
A continuación se explica como dar de alta un nuevo cliente.

Podemos crear un nuevo cliente haciendo uso de los siguientes parámetros:

Parámetro	Tipo	Requerido	Detalles
rfc	String	Requerido	Se utiliza para indicar el RFC del cliente que vamos a registrar en nuestro catalogo
razons	String	Requerido	
Indica la razón social de nuestro clienete, recuerda que la razon social debe escribirse como aparece en la constancia de situacion fiscal ademas, debes ingresar la razón socal sin el régimen capital.

Ejemplo:

Razón social:   RAZON SOCIAL DE PRUEBA S.A. DE C.V.

Parametro que enviaremos:   "rfc": "RAZON SOCIAL DE PRUEBA"

codpos	Numerico	Requerido	 Se utiliza para indicar el codigo postal que pertenece a el domicilio fiscal de nuestro cliente.
email	String	Requerido	 Contiene la direccion de correo electronico de nuestro cliente y tambien a este correo es a el que se enviaran los comprobantes en caso de asi configurarlo en el timbrado.
usocfdi	String	Opcional	 Se utiliza para definir el tipo de uso de CFDI que utilizara el cliente, este valor se almacena de forma provisional para recuperarlo pero por cada CFDI genereado a el cliente este uso de CFDI puede ser configurado
regimen	String	Requerido	
 Indica el regimen fiscal a el cual pertenece nuestro cliente, este valor debe ser expresado con la clave correspondiente a el regimen:

Ejemplo: Para General de Ley Personas Morales se envia el parametro

"regimen": "601"

Consulta el catálogo de claves de Uso de CFDI aqui.
calle	String	Opcional	 Se utiliza para indicar la calle de el domicilio fiscal de nuestro cliente.
numero_exterior	String	Opcional	 Se utiliza para indicar el numero exterior de el domicilio fiscal de nuestro cliente.
numero_interior	String	Opcional	  Se utiliza para indicar el numero interior de el domicilio fiscal de nuestro cliente.
colonia	String	Opcional	  Se utiliza para indicar la colonia de el domicilio fiscal de nuestro cliente.
ciudad	String	Opcional	  Se utiliza para indicar la ciudad de el domicilio fiscal de nuestro cliente.
delegacion	String	Opcional	  Se utiliza para indicar la delegacion de el domicilio fiscal de nuestro cliente.
localidad	String	Opcional	   Se utiliza para indicar la localidad de el domicilio fiscal de nuestro cliente.
estado	String	Opcional	   Se utiliza para indicar el estado de el domicilio fiscal de nuestro cliente.
pais	String	Requerido	
   Se utiliza para indicar el pais de el domicilio fiscal de nuestro cliente, este debe ingresarse con la abreviatura correspondiente

Ejemplo: "pais": "MEX"

Consulta el catálogo de paises aqui.
numregidtrib	String	Opcional	Campo condicional para registrar el número de identificación o registro fiscal del país de residencia para los efectos fiscales del remitente de los bienes o mercancías que se trasladan, cuando sea residente en el extranjero.
nombre	String	Opcional	 Indica el nombre de nuestro cliente.
apellidos	String	Opcional	 Se utiliza para ingresar los apellidos de nuestro cliente.
telefono	String	Opcional	 Campo para almacenar el numero telefonico para contactar a nuestro cliente.
email2	String	Opcional	 Podemos almacenar una direccion de correo electronico alternativa para nuestro cliente.
email3	String	Opcional	 Podemos almacenar una segunda direccion de correo electronico alternativa para nuestro cliente.
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/clients/create

Ejemplo: https://api.factura.com/v1/clients/create

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para dar de alta un nuevo cliente
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients/create"

payload = json.dumps({
  "rfc": "XIA190128J61",
  "razons": "XENON INDUSTRIAL ARTICLES",
  "codpos": 76343,
  "email": "xenon@iarticles.com",
  "usocfdi": "G01",
  "regimen": "601",
  "calle": "AV. CIRCUNVALACION",
  "numero_exterior": "7947",
  "numero_interior": "B-1",
  "colonia": "Militar",
  "ciudad": "SANTIAGO DE QUERETARO",
  "delegacion": "NAVARRO",
  "localidad": "JALPAN DE SERRA",
  "estado": "QUERETARO",
  "pais": "MEX",
  "numregidtrib": "",
  "nombre": "SAUL",
  "apellidos": "ESTRADA",
  "telefono": "3344556677",
  "email2": "altemail@mail.com",
  "email3": "emailrespaldo@mail.com"
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
    "status": "success",
    "Data": {
        "RazonSocial": "XENON INDUSTRIAL ARTICLES",
        "RFC": "XIA190128J61",
        "Regimen": "General de Ley Personas Morales",
        "RegimenId": "601",
        "Calle": "AV. CIRCUNVALACION",
        "Numero": "7947",
        "Interior": "B-1",
        "Colonia": "Militar",
        "CodigoPostal": "76343",
        "Ciudad": "SANTIAGO DE QUERETARO",
        "Delegacion": "SANTIAGO DE QUERETARO",
        "Estado": "QUERETARO",
        "Pais": "MEX",
        "NumRegIdTrib": "",
        "UsoCFDI": "G01",
        "Contacto": {
            "Nombre": "SAUL",
            "Apellidos": "ESTRADA",
            "Email": "xenon@iarticles.com",
            "Email2": "altemail@mail.com",
            "Email3": "emailrespaldo@mail.com",
            "Telefono": "3344556677"
        },
        "UID": "6531ab68f20c6",
        "cfdis": 0,
        "cuentas_banco": []
    }
}

Respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
  "status": "error",
  "message": {
    "rfc": [
      "El campo rfc es requerido"
    ]
  }
}

Actualizar cliente
A continuación se explica el método con el cual podremos actualizar un cliente de nuestra cuenta.

Podemos actualizar un cliente haciendo uso de los siguientes parámetros:

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador unico con el cual haremos referencia a el cliente que deseamos editar.
rfc	String	Requerido	Se utiliza para indicar el RFC del cliente que vamos a registrar en nuestro catalogo
razons	String	Requerido	
Indica la razón social de nuestro clienete, recuerda que la razon social debe escribirse como aparece en la constancia de situacion fiscal ademas, debes ingresar la razón socal sin el régimen capital.

Ejemplo:

Razón social:   RAZON SOCIAL DE PRUEBA S.A. DE C.V.

Parametro que enviaremos:   "rfc": "RAZON SOCIAL DE PRUEBA"

codpos	Numerico	Requerido	 Se utiliza para indicar el codigo postal que pertenece a el domicilio fiscal de nuestro cliente.
email	String	Requerido	 Contiene la direccion de correo electronico de nuestro cliente y tambien a este correo es a el que se enviaran los comprobantes en caso de asi configurarlo en el timbrado.
usocfdi	String	Opcional	 Se utiliza para definir el tipo de uso de CFDI que utilizara el cliente, este valor se almacena de forma provisional para recuperarlo pero por cada CFDI genereado a el cliente este uso de CFDI puede ser configurado
regimen	String	Requerido	
 Indica el regimen fiscal a el cual pertenece nuestro cliente, este valor debe ser expresado con la clave correspondiente a el regimen:

Ejemplo: Para General de Ley Personas Morales se envia el parametro

"regimen": "601"

Consulta el catálogo de claves de Uso de CFDI aqui.
calle	String	Opcional	 Se utiliza para indicar la calle de el domicilio fiscal de nuestro cliente.
numero_exterior	String	Opcional	 Se utiliza para indicar el numero exterior de el domicilio fiscal de nuestro cliente.
numero_interior	String	Opcional	  Se utiliza para indicar el numero interior de el domicilio fiscal de nuestro cliente.
colonia	String	Opcional	  Se utiliza para indicar la colonia de el domicilio fiscal de nuestro cliente.
ciudad	String	Opcional	  Se utiliza para indicar la ciudad de el domicilio fiscal de nuestro cliente.
delegacion	String	Opcional	  Se utiliza para indicar la delegacion de el domicilio fiscal de nuestro cliente.
localidad	String	Opcional	   Se utiliza para indicar la localidad de el domicilio fiscal de nuestro cliente.
estado	String	Opcional	   Se utiliza para indicar el estado de el domicilio fiscal de nuestro cliente.
pais	String	Requerido	
   Se utiliza para indicar el pais de el domicilio fiscal de nuestro cliente, este debe ingresarse con la abreviatura correspondiente

Ejemplo: "pais": "MEX"

Consulta el catálogo de paises aqui.
numregidtrib	String	Opcional	Campo condicional para registrar el número de identificación o registro fiscal del país de residencia para los efectos fiscales del remitente de los bienes o mercancías que se trasladan, cuando sea residente en el extranjero.
nombre	String	Opcional	 Indica el nombre de nuestro cliente.
apellidos	String	Opcional	 Se utiliza para ingresar los apellidos de nuestro cliente.
telefono	String	Opcional	 Campo para almacenar el numero telefonico para contactar a nuestro cliente.
email2	String	Opcional	 Podemos almacenar una direccion de correo electronico alternativa para nuestro cliente.
email3	String	Opcional	 Podemos almacenar una segunda direccion de correo electronico alternativa para nuestro cliente.
Importante

El método que se utiliza para actualizar un cliente es de tipo POST

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/clients/{UID}/update

Ejemplo: https://api.factura.com/v1/clients/647143505f3f2/update

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para actualizar un cliente
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients/647143505f3f2/update"

payload = json.dumps({
  "rfc": "XIA190128J61",
    "razons": "XENON INDUSTRIAL ARTICLES",
    "codpos": 76343,
    "email": "xenon@iarticles.com",
    "usocfdi": "G01",
    "regimen": "601",
    "calle": "AV. CIRCUNVALACION",
    "numero_exterior": "7947",
    "numero_interior": "B-1",
    "colonia": "Militar",
    "ciudad": "SANTIAGO DE QUERETARO",
    "delegacion": "NAVARRO",
    "localidad": "JALPAN DE SERRA",
    "estado": "QUERETARO",
    "pais": "MEX",
    "numregidtrib": "",
    "nombre": "SAUL",
    "apellidos": "ESTRADA",
    "telefono": "3344556677",
    "email2": "altemail@mail.com",
    "email3": "emailrespaldo@mail.com"
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
    "status": "success",
    "Data": {
        "RazonSocial": "XENON INDUSTRIAL ARTICLES",
        "RFC": "XIA190128J61",
        "Regimen": "General de Ley Personas Morales",
        "RegimenId": "601",
        "Calle": "AV. CIRCUNVALACION",
        "Numero": "7947",
        "Interior": "B-1",
        "Colonia": "Militar",
        "CodigoPostal": "76343",
        "Ciudad": "SANTIAGO DE QUERETARO",
        "Delegacion": "SANTIAGO DE QUERETARO",
        "Estado": "QUERETARO",
        "Pais": "MEX",
        "NumRegIdTrib": "",
        "UsoCFDI": "G01",
        "Contacto": {
            "Nombre": "SAUL",
            "Apellidos": "ESTRADA",
            "Email": "xenon@iarticles.com",
            "Email2": "altemail@mail.com",
            "Email3": "emailrespaldo@mail.com",
            "Telefono": "3344556677"
        },
        "UID": "6531ab68f20c6",
        "cfdis": 0,
        "cuentas_banco": []
    }
}

Respuesta erronea
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
  "status": "error",
  "message": {
    "rfc": [
      "El campo rfc debe ser menor que 13 caracteres."
    ]
  }
}

Eliminar cliente
A continuación se explica el método con el cual podremos eliminar un cliente de nuestra cuenta.

Importante

Es importante tomar en cuenta que un cliente solo podra ser eliminado de nuestro catalogo de clientes cuando este no contiene CFDIs creados de otra forma aparecera un mensaje explicando el motivo como se muestra mas delante

Podemos eliminar un cliente de nuestra cuenta haciendo uso de los siguientes parámetros:

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador aisgnado a nuestro cliente en la plataforma

Ejemplo:

"UID": "62b1dcf75a60f"
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/clients/destroy/{UID}

Ejemplo: https://api.factura.com/v1/clients/destroy/62b1dcf75a60f

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para eliminar un cliente de nuestra cuenta
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/clients/destroy/62b1dcf75a60f"

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
    "message": "Cliente eliminado exitosamente."
}

Ejemplo de respuesta de error
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

JSON

{
    "response": "error",
    "message": "El cliente ya cuenta con CFDI's por lo que no puede ser eliminado"
}
