Empresas
Introducción
Descubre la versatilidad de nuestro sistema: puedes establecer múltiples empresas con sus propios RFC y datos fiscales. Cada empresa tiene su propio espacio, con historial completo de transacciones, clientes y productos. ¿Deseas saber cuántas empresas puedes crear según tu plan? Encuentra esa información en nuestra plataforma.

Listar Empresas
A continuación se explica el servicio con el cual podemos listar todas las empresas que forman parte de nuestra cuenta con un ejemplo y muestra de posibles respuestas obtenidas.

Importante

El método que se utiliza para listar todas las empresas es de tipo GET

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/accounts

Ejemplo: https://api.factura.com/v1/accounts

Utilice los siguientes parámetros opcionales en la URL para filtrar los resultados por RFC o razón social, o para aplicar paginación en la respuesta:

Parámetro	Tipo	Requerido	Detalles
razon_social	string	Opcional	
Indica la razon social del cliente que se quiere consultar, puede estar completo o no.

Ejemplo: /v1/accounts?razon_social=Venta al público

rfc	string	Opcional	
Agrega el RFC de la empresa que quieres buscar en el catalogo.

Ejemplo: /v1/accounts?rfc=XAXX010101000

page	Integer	Opcional	Indica número de página a consultar, por default posiciona en la página 1.
Ejemplo: /v1/accounts?page=1&perPage=3

per_page	Integer	Opcional	Indica el limite de resultados para mostrar, por default retorna todos los clientes del catalogo.
Ejemplo: /v1/accounts?page=1&perPage=3

Los parámetros de consulta deben incluirse en la URL. Utilice "?" para el primer parámetro y "&" para concatenar parámetros adicionales.

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para listar todas las empresas
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/accounts?page=1&perPage=3"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuestas al listar todas las empresas
Respuesta exitosa
JSON

{
    "response": "success",
    "data": [
        {
            "uid": "63b4bb361a7b3",
            "razon_social": "OSCAR KALA HAAK",
            "rfc": "KAHO641101B39",
            "regimen_fiscal": "Incorporación Fiscal",
            "curp": "XEXX010101HNEXXA4",
            "calle": "",
            "exterior": "",
            "interior": "",
            "colonia": "",
            "codpos": "01010",
            "ciudad": "",
            "estado": "",
            "email": "ejemplo@ejemplo.com",
            "logo_path": "file_name.png",
            "api_key": "Tu API key",
            "secret_key": "Tu Secret key",
            "cer": "file_name.cer",
            "key": "file_name.key",
            "fielcer": "file_name.cer",
            "fielkey": "file_name.key"
        },
        {
            "uid": "66918361be931",
            "razon_social": "XOCHILT CASAS CHAVEZ",
            "rfc": "CACX7605101P8",
            "regimen_fiscal": "Personas Físicas con Actividades Empresariales y Profesionales",
            "curp": "",
            "calle": "Naciones unidas",
            "exterior": "1331",
            "interior": "",
            "colonia": "San Gaspar",
            "codpos": "22000",
            "ciudad": "Tijuana",
            "estado": "Baja california",
            "email": "ejemplo@ejemplo.com",
            "logo_path": "file_name.png",
            "api_key": "Tu API key",
            "secret_key": "Tu Secret key",
            "cer": "file_name.cer",
            "key": "file_name.key",
            "fielcer": "file_name.cer",
            "fielkey": "file_name.key"
        },
        {
            "uid": "67730fa07d40f",
            "razon_social": "LUCES & OBRAS",
            "rfc": "L&O950913MSA",
            "regimen_fiscal": "Régimen Simplificado de Confianza",
            "curp": "",
            "calle": "AV Terranova",
            "exterior": "1209",
            "interior": "",
            "colonia": "",
            "codpos": "60922",
            "ciudad": "Las Guacamayas",
            "estado": "Michoacan",
            "email": "ejemplo@ejemplo.com",
            "logo_path": "file_name.png",
            "api_key": "Tu API key",
            "secret_key": "Tu Secret key",
            "cer": "file_name.cer",
            "key": "file_name.key",
            "fielcer": "file_name.cer",
            "fielkey": "file_name.key"
        }
    ],
    "pagination": {
        "total": 15,
        "lastPage": 5,
        "currentPage": 1,
        "to": 3,
        "from": 1
    }
}

Respuesta erronea
JSON

{
    "status": "error",
    "message": "La cuenta que intenta autenticarse no existe",
    "Data": "",
    "Secret": "$2y$10$.Rl4Wb.K0SYCGXaLJ1yC/./lr7ORWTEEg/9P2KRqLlnE.qkrcNLk."
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Consultar empresa actual
A continuación se explica el método para consultar la informacion de la empresa actual es decir con la que nos encontramos trabajando.

Importante

El método que se utiliza para consultar la empresa actual es de tipo GET

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/current/account

Ejemplo: https://api.factura.com/v1/current/account

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de consulta de empresa actual
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/current/account"

payload={}
files={}
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload, files=files)

print(response.text)

Respuestas al consultar la empresa actual
Respuesta exitosa
JSON

{
    "status": "success",
    "data": {
        "uid": "607a062eae2bb",
        "razon_social": "ESCUELA KEMPER URGATE",
        "rfc": "EKU9003173C9",
        "regimen_fiscal": "General de Ley Personas Morales",
        "curp": "PEPJ901010HJCRRN03",
        "calle": "Avenida connecticut",
        "exterior": "1989",
        "interior": "32",
        "colonia": "Bosques de Tepatitlan",
        "codpos": "42501",
        "ciudad": "Paracho",
        "estado": "Michoacan",
        "email": "mail@mail.com",
        "logo_path": "file_name.png",
        "api_key": "Tu API key",
        "secret_key": "Tu Secret key",
        "cer": "file_name.cer",
        "key": "file_name.key",
        "fielcer": "file_name.cer",
        "fielkey": "file_name.key"
    }
}

Respuesta erronea
JSON

{
  "status": "error",
  "message": "La cuenta que intenta autenticarse no existe",
  "Data": "$2y$10$dnOV7qC7ZrD1CZitpUnTReLKtKPxG29XfwZylrEuiR0KVl18pOXXX",
  "Secret": "$2y$10$6ZN4aX5UExwz6HFlDSZcxOF1TGjHx8f40neE.CrXHHahyAfi8XXX."
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Buscar una empresa en especifico
A continuación se explica el método que nos ayuda a obtener los detalles de una empresa en especifico que tengamos registrada en nuestra cuenta.

Para buscar una empresa se necesitan los siguientes parametros.

Parámetro	Tipo	Requerido	Detalles
uid	String	Requerido	Es el identificador unico para la empresa en la plataforma.

Ejemplo:
5670a524cfc65
Importante

El método que se utiliza para buscar una empresa es de tipo GET

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v1/account/{uid}

Ejemplo: https://api.factura.com/v1/account/607a062eae2bb

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo de la consulta de la empresa actual
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v1/account/61e20b1903bad"

payload={}
files={}
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("GET", url, headers=headers, data=payload, files=files)

print(response.text)

Respuestas al buscar una empresa en especifico
Respuesta exitosa
JSON

{
    "status": "success",
    "data": {
        "uid": "607a062eae2bb",
        "razon_social": "ESCUELA KEMPER URGATE",
        "rfc": "EKU9003173C9",
        "regimen_fiscal": "General de Ley Personas Morales",
        "curp": "PEPJ901010HJCRRN03",
        "calle": "Avenida connecticut",
        "exterior": "1989",
        "interior": "32",
        "colonia": "Bosques de Tepatitlan",
        "codpos": "42501",
        "ciudad": "Paracho",
        "estado": "Michoacan",
        "email": "mail@mail.com",
        "logo_path": "file_name.png",
        "api_key": "Tu API key",
        "secret_key": "Tu Secret key",
        "cer": "file_name.cer",
        "key": "file_name.key",
        "fielcer": "file_name.cer",
        "fielkey": "file_name.key"
    }
}

Respuesta erronea
JSON

{
  "status": "error",
  "message": "La cuenta que intenta autenticarse no existe",
  "Data": "$2y$10$dnOV7qC7ZrD1CZitpUnTReLKtKPxG29XfwZylrEuiR0KVl18pOXXX",
  "Secret": "$2y$10$6ZN4aX5UExwz6HFlDSZcxOF1TGjHx8f40neE.CrXHHahyAfi8XXX."
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Crear nueva empresa
A continuación se explica como funciona el servicio con el cual podras crear una nueva empresa en nuestra cuenta.

Tip

Recuerda que necesitaras contar con tu Certificado de Sello Digital (CSD) que obtuviste con el SAT y deberas proporcionar tus archivos .cer y .key y que la Razón Social, Codigo Postal y RFC deben coincidir con los datos que se dieron de alta ante el SAT para poder crear tu empresa y comenzar a utilizarla.

Importante

Si no sabes como conseguir tu Certificado de Sello Digital(CSD) puedes consultarlo en la siguiente guia:

¿Como generar el Certificado del Sello Digital(CSD)?

Para la creación de una nueva empresa son necesarios los siguientes parametros.

Parámetro	Tipo	Requerido	Detalles
razons	String	Requerido	La razón social de tu empresa
rfc	String	Requerido	El RFC de tu empresa
codpos	String	Requerido	El codigo postal en el que esta registrada tu empresa
calle	String	Opcional	Calle del domicilio fiscal de tu empresa
numero_exterior	String	Opcional	Numero exterior del domicilio fiscal de tu empresa
numero_interior	String	Opcional	Numero interior del domicilio fiscal de tu empresa
colonia	String	Opcional	Indica la colonia del domicilio fiscal de tu empresa
estado	String	Opcional	Indica el estado del domicilio fiscal de tu empresa
ciudad	String	Opcional	Indica la ciudad del domicilio fiscal de tu empresa
delegacion	String	Opcional	Indica la delegacion del domicilio fiscal de tu empresa
email	String	Requerido	La direccion principal de correo electronico para tu empresa
regimen	String	Opcional	Indica el regimen fiscal al cual pertenece tu empresa para generar CFDIs
mailtomyconta	String	Opcional	Indica si se quiere enviar una copia de los correos electronicos de los CFDIs generados a tu contador
mail_conta	String	Opcional	El correo electronico del contador
mailtomyself	String	Opcional	Indica si se quiere enviar una copia de los correos electronicos de los CFDIs generados a tu direccion principal
regimen_nomina	String	Requerido	Indica el regimen al cual pertenece tu empresa para generar nominas
cant_folios_min	String	Opcional	Indica el limite minimo de folios disponible para tu empresa, genera una alerta cuando estas por agotar tus folios cuando se alcanza el numero minimo
smtp	String	Opcional	Si utilizas un servidor de SMTP para enviar tus comprobantes aqui se indica el nombre
smtp_email	String	Opcional	El correo que corresponde a tu servicio de SMTP para el envio de comprobantes
smtp_password	String	Opcional	Contraseña de tu SMTP
smtp_port	String	Opcional	Indica el puerto que utiliza tu SMTP
smtp_host	String	Opcional	Indica el host de tu SMTP
smtp_encryption	String	Opcional	Indica el tip de encriptacion que utiliza tu SMTP
telefono	String	Opcional	El numero telefonico de tu empresa
curp	String	Opcional	El CURP bajo la cual esta registrada tu empresa
logo	Archivo tipo jpg, jpeg o png	Opcional	Indica el logo que se utilizara para tu empresa
password	String	Requerido	La contraseña que utilizaste cuando creaste tus archivos CSD (.cer y .key)
cer	Archivo .cer	Requerido	El archivo .cer correspondiente a tu empresa
key	Archivo .key	Requerido	El archivo .key correspondiente a tu empresa
fielcer	Archivo .cer	Opcional	El archivo .cer correspondiente a tu e.firma o FIEL
fielkey	Archivo .key	Opcional	El archivo .key correspondiente a tu e.firma o FIEL
fielpassword	String	Opcional / Requerido si se envia "fielcer" y "fielkey"	La contraseña que utilizaste para la creación de tu e.firma o FIEL
Importante

El método que se utiliza para la creacion de la empresa es de tipo POST

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/account/create

Ejemplo: https://api.factura.com/v4/account/create

Ejemplo para crear nueva empresa
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/account/create"

payload = {'razons': 'Razon de prueba',
'rfc': 'FUNK123456PH7',
'codpos': '44444',
'calle': 'Ramon corona',
'numero_exterior': '123',
'numero_interior': '4',
'colonia': 'Centro',
'estado': 'Jalisco',
'ciudad': 'Arandas',
'delegacion': 'Santiaguito',
'email': 'mail@example.com',
'regimen': '612',
'mailtomyconta': '1',
'mail_conta': 'conta@example.com',
'mailtomyself': '1',
'regimen_nomina': '612',
'cant_folios_min': '66',
'smtp': '1',
'smtp_email': 'senderEmail@example.com',
'smtp_password': 'password',
'smtp_port': '4433',
'smtp_host': 'gmail.com',
'smtp_encryption': 'tls',
'telefono': '3344556677',
'curp': 'FUNK123456PH7PD89',
'password': '12345678a',
'fielpasswordd': '12345678a'}
files=[
  ('logo',('file',open('/path/to/file','rb'),'application/octet-stream'))
  ('cer',('file',open('/path/to/file','rb'),'application/octet-stream')),
  ('key',('file',open('/path/to/file','rb'),'application/octet-stream')),
  ('fielcer',('file',open('/path/to/file','rb'),'application/octet-stream')),
  ('fielkey',('file',open('/path/to/file','rb'),'application/octet-stream'))
]
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'JDJ5JDEwJEtZQ1ljMktldmM0Zy9KeUlHQklmdS56WDBpWnpVOWxIZHM2eXN4WG95blZrTFRqWlhISDJh',
  'F-Secret-Key': 'JDJ5JDEwJC5SbDRXYi5LMFNZQ0dYYUxKMXlDLy4vbHI3T1JXVEVFZy85UDJLUnFMbG5FLnFrcmNOTGsu'
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)

Respuestas al crear una empresa
Respuesta exitosa
JSON

{
    "status": "create",
    "0": {
        "acco_uid": "64efdcdce7927",
        "acco_create": "2023-08-30",
        "acco_user_id": 1364,
        "acco_api_key": "Tu API key",
        "acco_secret_key": "Tu Secret key",
        "acco_regimen": "Personas Físicas con Actividades Empresariales y Profesionales",
        "acco_regimen_33": "612",
        "acco_razon_social": "RAZON DE PRUEBA",
        "acco_rfc": "FUNK123456PH7",
        "acco_calle": "Ramon corona",
        "acco_numero": "123",
        "acco_interior": "4",
        "acco_colonia": "Centro",
        "acco_codpos": "44444",
        "acco_estado": "Jalisco",
        "acco_delegacion": "Arandas",
        "acco_ciudad": "Arandas",
        "acco_telefono": "3344556677",
        "acco_email": "mail@example.com",
        "acco_smtp": "1",
        "acco_curp": "FUNK123456PH7PD89",
        "acco_regimen_nomina": "612",
        "acco_mailtomyconta": "1",
        "acco_email_conta": "conta@example.com",
        "acco_mailtomyself": "1",
        "acco_folios_alert": "66",
        "acco_id": 1521,
        "acco_fiel_key": "file_name.key",
        "acco_fiel_cer": "file_name.cer",
        "acco_cer_path": "fiel_name.cer",
        "acco_key_path": "fiel_name.key"
    }
}
Solución de problemas al cargar archivos CSD o FIEL
Cuando existe un problema para subir los archivos CSD o de la FIEL por medio de API por cuestiones de permisos o problemas por el tamaño de los archivos estos pueden subirse a traves de una cadena en "base 64" en lugar de tratar de enviar el archivo, se muestra a continuacion un ejemplo de como se deberian enviar los campos en caso de hacerlo de esta forma, recuerda que la peticion es igual y solo reemplazaremos el archivo de los CSD o FIEL por un campo de texto.

Importante

Para codificar los archivos CSD o FIEL en base 64 varia dependiendo el lenguaje que utilices para obtener tu propia cadena debes buscar la forma correcta de realizarlo para tu caso en especifico.

Como un ejemplo se necesitan los siguientes pasos:

Obetener el contenido de el CSD o FIEL (.cer y .key)
Codificar el contenido en base 64 (encode64 o base64 son algunos de los terminos mas comunes)
Obtener la cadena resultante y enviarlo
Para enviar los archivos en base 64 a traves para crear o actualizar una empresa se necesitan los siguientes parametros.

 Parámetro	 Tipo	 Requerido	 Detalles
 csd_cer_b64	 String	 Requerido	Archivo CSD .cer codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .cer
 csd_key_b64 	 String 	 Requerido 	 Archivo CSD .key codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .key
password 	 String 	 Requerido si se envia cer y key 	 Se requiere incluir en la petición al enviar las cadenas cer y key
 fiel_cer_b64	 String	 Requerido	Archivo FIEL .cer codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .cer
 fiel_key_b64 	 String 	 Requerido 	 Archivo FIEL .key codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .key
fielpassword 	 String 	 Requerido si se envia fielcer y fielkey 	 Se requiere incluir en la petición al enviar las cadenas fielcer y fielkey
JSON

{
    "cer": "MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS8AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucRFLOMmsAaFJThFS4JUw+FB6qBT2Lo+JjDBghZX3Hfv6MlDSxgiwul8zjb1YQM22U5PJT5IRqv3zjLRwh1criHOC9ndzIM6UauJoFaS/35WUIKi0QPw/QhXHbqMnszvAxtWRgpDsvRzd9wmWRMh/0Ud6HiUlHw79oxoCXXj6GAJAiQmXEGp9cV1B7hihtm241u8Gly9oq1oAAl3gnoth8KrWAsMrHMvAvBtkynYZPx9SV/8x8snnThqYj7TkHFrfmsZsqpW8GBhagLo93bpBLKpGwF2ycxIsStDQfh2xFg2v7SyCkvK9WyIbEVn29RAux88MPQ1YEhMjmWmx/umutQC6aK/8UpEgMcQtXeJXj2Uhep8xIxt0iX46FWnSY04biPzRBuDzU7mxsoPR84vc8pJD0xv3YMNm3W0QsiB53vwkv9AIo54q+NHD5hu0OfcYmrrOaSdWqTrLrzDsa+k7Akc9VwgfInMfRo+fBvWa3t35lM9+Rew+cC9caT6oNY6vQrw/cwE4XzCuC02GpZ89RhZuh7UWmb+DCaAbKdz+1uXwM8x9bEjujErf+xxc4kL/sW/yuFllk7ymE3KQk3cyKKJYIXJ3AsTT03k1yJYNlmUEUyv2h+i+0tkxtD33N59Wo8VC0LTH2p4hXaJ6M01VMlkANM+T9wsXpzh6xmjNdW7uLLZBuUZEOu96auzN7cS5iEQfcni04IBoKr4TKf00Z3w4WAfkpNBCuo5Bikefsc+gGzPvu5T01DpTXhxNm8HuTynMcRaIZkMnJ8JLghDL8bf6iwKb9YNIMSpxkfDoSRRhDknXHcUR1chXdskujTZWCsk/3ndTWuitP0ggedlf8TnExqvqUeDp/bhLGKxSG4n2k07hMx8A0gFOaBftJjS37OuORHvmD9LJV20ThK5TuOppdPJLkod00bcIaIb40KOHzDmf8ACkH4BAeu6v3u3zqzSfqxb4Ec9OHmonbacYcggW1kSeLEhYpVOdK+JVD0haizlpkRxeyOVhyI98bPkiC8ayP0T/ikd30Qb1DAw39nk07omjcvb+PXSZoOOCJTyDog51MdxBo/Huy7osrE+0YJ2RPp0sqzQdPxbyau3+LRX1tOy0DMriqdkFk6UQqnU+7vWsw2q0YQJkz/zVhsXOlDQKL4Ml5944E6OjZZzHee8RafTQM8mEGGN6iQhh+gQfDvGvJx+WgH1JfHbCsf/fQqanQHjutSq9crxaXYH0YoTZADy6RT70c1sXrgWxhmgpjgdhZ13xbono5P9c2ANyfkKLQxY7Lr9v5AVi5dZD9OeyvodMDT0/OIMV9KVCuCQ9tMWoHJJEzoxmhxLOjLNBsOkSTTrPr1Ogl8EgcTwGHn7PlM2seEx0PCVbSFaay70SbWUv0bkBOQMgLg94uJDubXcOB00Aw8FaHXnw0DetGiRrYzcqtBQju/0akE5YPrgAaOaMK4A6Ko36uZifDiIE+cKcscu8y5rpZvAtlXLY3hNbU8Vp3LmRrxgDE5nJqdbcN8mGgMI/flOppw7KRHlAFy0z0NlJTBjwq2brRRPH8igb+r5IAVFZzqEiqKFjO/uU/c3loPNQTK57r7Busp930=",
    "key": "MIIFgDCCA2igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDMzMTcwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTA5MjEzNzM3WhcNMjcwNTA5MjEzNzM3WjCBpzEdMBsGA1UEAxMUWE9DSElMVCBDQVNBUyBDSEFWRVoxHTAbBgNVBCkTFFhPQ0hJTFQgQ0FTQVMgQ0hBVkVaMR0wGwYDVQQKExRYT0NISUxUIENBU0FTIENIQVZFWjEWMBQGA1UELRMNQ0FDWDc2MDUxMDFQODEbMBkGA1UEBRMSQ0FDWDc2MDUxME1HVFNIQzA0MRMwEQYDVQQLEwpTdWN1cnNhbCAyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApG2xe/cC25l8y4uF/cq/R4CipKrbDJ+mVHkQ0X0vd/7/bjCvphYuF41HIr91T3Ux51jkuIBZdZ1A9o2W7nwt+MNY165p6+/dunXPDMaM8gIOShITK1Hno+6VYr9sbuciYkrxTbY1kU9M8f8TJ1Z8zYPTxHvuRma7fcWyg1uNXgQyuOFRDwzIk3pDK1YtDkDZzxpkDokYFu4oKhHb1TKUtT2uhGc3fmYG5zP6/bUDDgf4ugGNQccsd5QWm4SzplEsiyK2ggfLQ8q6ZC4SPQZolM10iUyOst4iZ9a5V7/7xOJW9qir40hCguZqhyvamsO6UXok9mOYAOo4rErV4D7FJQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAnrMfNcLjPZOw85YRNwwyhieoFp5E2swK9DMS8PwbmE50g0fRV3E25LNc7JzCzFC/Aai1ghNWPBr0SeHoBh4pizIj93frkmkOPzHPZk6DXIOW7zng+QuB5osQ+XFv3WPNYuNlqsmlgwOooW0t2cgY8eSUgupSkh4HQMQ9fOCzeL1bTLUFwGLB7qCxT/OAT9IOM59OJgytPD/j5jb8hScFOQJg/Hd0HunYuB1+DLiGSUt31JhkbiAOI+GLH0VaiR0tOkJHKqVvvgAX2JwouYrLBODoEsvgPd28YclHho8kIIu2rDWxPVBfbVLpSBQcp2vYo9GQg5u43kOg84xE5+Llm5zsNtkbvpdsbfk7IYTAB38GGDll0VysHtOw8oNAmCK8Fndjjc1PYOArJmrZqSaDTj5v3n/mNnN0a6ZEtE58IwpDhFbT/M4nD9Ct8WZYdOkMvSg/mqrlfd84y39Jz0u/yrGcgszqGJdjTOM+C83rZJP6ldlDAhbks2mJofXH/69W07gkMy5x94ZuJdCTd05n9puQitYvfKGVz+XEtcexs2S9b20FRNQsdQbFIjmANjEITVkxbAOnj2Lait7WNyoVx/BIZRNO7WWMxMVuYpJY1vY7fZw4zDa5Da7fPTmA5AbiFt+T0nZDXhoeTWGs7FEC1Ydpx7EIX8cVcxtsOVbp12I=",
    "password": "12345678a",
    "fielcer": "MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS8AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucRFLOMmsAaFJThFS4JUw+FB6qBT2Lo+JjDBghZX3Hfv6MlDSxgiwul8zjb1YQM22U5PJT5IRqv3zjLRwh1criHOC9ndzIM6UauJoFaS/35WUIKi0QPw/QhXHbqMnszvAxtWRgpDsvRzd9wmWRMh/0Ud6HiUlHw79oxoCXXj6GAJAiQmXEGp9cV1B7hihtm241u8Gly9oq1oAAl3gnoth8KrWAsMrHMvAvBtkynYZPx9SV/8x8snnThqYj7TkHFrfmsZsqpW8GBhagLo93bpBLKpGwF2ycxIsStDQfh2xFg2v7SyCkvK9WyIbEVn29RAux88MPQ1YEhMjmWmx/umutQC6aK/8UpEgMcQtXeJXj2Uhep8xIxt0iX46FWnSY04biPzRBuDzU7mxsoPR84vc8pJD0xv3YMNm3W0QsiB53vwkv9AIo54q+NHD5hu0OfcYmrrOaSdWqTrLrzDsa+k7Akc9VwgfInMfRo+fBvWa3t35lM9+Rew+cC9caT6oNY6vQrw/cwE4XzCuC02GpZ89RhZuh7UWmb+DCaAbKdz+1uXwM8x9bEjujErf+xxc4kL/sW/yuFllk7ymE3KQk3cyKKJYIXJ3AsTT03k1yJYNlmUEUyv2h+i+0tkxtD33N59Wo8VC0LTH2p4hXaJ6M01VMlkANM+T9wsXpzh6xmjNdW7uLLZBuUZEOu96auzN7cS5iEQfcni04IBoKr4TKf00Z3w4WAfkpNBCuo5Bikefsc+gGzPvu5T01DpTXhxNm8HuTynMcRaIZkMnJ8JLghDL8bf6iwKb9YNIMSpxkfDoSRRhDknXHcUR1chXdskujTZWCsk/3ndTWuitP0ggedlf8TnExqvqUeDp/bhLGKxSG4n2k07hMx8A0gFOaBftJjS37OuORHvmD9LJV20ThK5TuOppdPJLkod00bcIaIb40KOHzDmf8ACkH4BAeu6v3u3zqzSfqxb4Ec9OHmonbacYcggW1kSeLEhYpVOdK+JVD0haizlpkRxeyOVhyI98bPkiC8ayP0T/ikd30Qb1DAw39nk07omjcvb+PXSZoOOCJTyDog51MdxBo/Huy7osrE+0YJ2RPp0sqzQdPxbyau3+LRX1tOy0DMriqdkFk6UQqnU+7vWsw2q0YQJkz/zVhsXOlDQKL4Ml5944E6OjZZzHee8RafTQM8mEGGN6iQhh+gQfDvGvJx+WgH1JfHbCsf/fQqanQHjutSq9crxaXYH0YoTZADy6RT70c1sXrgWxhmgpjgdhZ13xbono5P9c2ANyfkKLQxY7Lr9v5AVi5dZD9OeyvodMDT0/OIMV9KVCuCQ9tMWoHJJEzoxmhxLOjLNBsOkSTTrPr1Ogl8EgcTwGHn7PlM2seEx0PCVbSFaay70SbWUv0bkBOQMgLg94uJDubXcOB00Aw8FaHXnw0DetGiRrYzcqtBQju/0akE5YPrgAaOaMK4A6Ko36uZifDiIE+cKcscu8y5rpZvAtlXLY3hNbU8Vp3LmRrxgDE5nJqdbcN8mGgMI/flOppw7KRHlAFy0z0NlJTBjwq2brRRPH8igb+r5IAVFZzqEiqKFjO/uU/c3loPNQTK57r7Busp930=",
    "fielkey": "MIIFgDCCA2igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDMzMTcwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTA5MjEzNzM3WhcNMjcwNTA5MjEzNzM3WjCBpzEdMBsGA1UEAxMUWE9DSElMVCBDQVNBUyBDSEFWRVoxHTAbBgNVBCkTFFhPQ0hJTFQgQ0FTQVMgQ0hBVkVaMR0wGwYDVQQKExRYT0NISUxUIENBU0FTIENIQVZFWjEWMBQGA1UELRMNQ0FDWDc2MDUxMDFQODEbMBkGA1UEBRMSQ0FDWDc2MDUxME1HVFNIQzA0MRMwEQYDVQQLEwpTdWN1cnNhbCAyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApG2xe/cC25l8y4uF/cq/R4CipKrbDJ+mVHkQ0X0vd/7/bjCvphYuF41HIr91T3Ux51jkuIBZdZ1A9o2W7nwt+MNY165p6+/dunXPDMaM8gIOShITK1Hno+6VYr9sbuciYkrxTbY1kU9M8f8TJ1Z8zYPTxHvuRma7fcWyg1uNXgQyuOFRDwzIk3pDK1YtDkDZzxpkDokYFu4oKhHb1TKUtT2uhGc3fmYG5zP6/bUDDgf4ugGNQccsd5QWm4SzplEsiyK2ggfLQ8q6ZC4SPQZolM10iUyOst4iZ9a5V7/7xOJW9qir40hCguZqhyvamsO6UXok9mOYAOo4rErV4D7FJQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAnrMfNcLjPZOw85YRNwwyhieoFp5E2swK9DMS8PwbmE50g0fRV3E25LNc7JzCzFC/Aai1ghNWPBr0SeHoBh4pizIj93frkmkOPzHPZk6DXIOW7zng+QuB5osQ+XFv3WPNYuNlqsmlgwOooW0t2cgY8eSUgupSkh4HQMQ9fOCzeL1bTLUFwGLB7qCxT/OAT9IOM59OJgytPD/j5jb8hScFOQJg/Hd0HunYuB1+DLiGSUt31JhkbiAOI+GLH0VaiR0tOkJHKqVvvgAX2JwouYrLBODoEsvgPd28YclHho8kIIu2rDWxPVBfbVLpSBQcp2vYo9GQg5u43kOg84xE5+Llm5zsNtkbvpdsbfk7IYTAB38GGDll0VysHtOw8oNAmCK8Fndjjc1PYOArJmrZqSaDTj5v3n/mNnN0a6ZEtE58IwpDhFbT/M4nD9Ct8WZYdOkMvSg/mqrlfd84y39Jz0u/yrGcgszqGJdjTOM+C83rZJP6ldlDAhbks2mJofXH/69W07gkMy5x94ZuJdCTd05n9puQitYvfKGVz+XEtcexs2S9b20FRNQsdQbFIjmANjEITVkxbAOnj2Lait7WNyoVx/BIZRNO7WWMxMVuYpJY1vY7fZw4zDa5Da7fPTmA5AbiFt+T0nZDXhoeTWGs7FEC1Ydpx7EIX8cVcxtsOVbp12I=",
    "fielpassword": "12345678a"
}

Respuesta erronea cuando hay informacion faltante
JSON

{
    "status": "error",
    "message": {
        "razons": [
            "El campo razons es requerido"
        ]
    }
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Actualizar empresa
A continuación se explica como actualizar los datos de una empresa dada de alta en Factura.com

Para actualizar la información de una empresa es necesario enviar minimo alguno de los siguientes parámetros:

Importante

Es importante tomar en cuenta que cada uno de los datos de nuestra empresa pueden ser modificados individualmente enviando minimo alguno de los parametros listados a continuación, pero si deseamos actualizar los certificados CSD o los certificados de la e.firma o FIEL de nuestra empresa sera necesario enviar los archivos .cer y .key junto al password que corresponde a nuestras credenciales en conjunto es decir que nuestro método debera incluir estos tres parametros juntos para que puedan ser actualizados.

Parámetro	Tipo	Requerido	Detalles
razons	String	Requerido	La razón social de tu empresa
rfc	String	Requerido	El RFC de tu empresa
codpos	String	Requerido	El codigo postal en el que esta registrada tu empresa
calle	String	Opcional	Calle del domicilio fiscal de tu empresa
numero_exterior	String	Opcional	Numero exterior del domicilio fiscal de tu empresa
numero_interior	String	Opcional	Numero interior del domicilio fiscal de tu empresa
colonia	String	Opcional	Indica la colonia del domicilio fiscal de tu empresa
estado	String	Opcional	Indica el estado del domicilio fiscal de tu empresa
ciudad	String	Opcional	Indica la ciudad del domicilio fiscal de tu empresa
delegacion	String	Opcional	Indica la delegacion del domicilio fiscal de tu empresa
email	String	Requerido	La direccion principal de correo electronico para tu empresa
regimen	String	Opcional	Indica el regimen fiscal al cual pertenece tu empresa para generar CFDIs
mailtomyconta	String	Opcional	Indica si se quiere enviar una copia de los correos electronicos de los CFDIs generados a tu contador
mail_conta	String	Opcional	El correo electronico del contador
mailtomyself	String	Opcional	Indica si se quiere enviar una copia de los correos electronicos de los CFDIs generados a tu direccion principal
regimen_nomina	String	Opcional	Indica el regimen al cual pertenece tu empresa para generar nominas
cant_folios_min	String	Opcional	Indica el limite minimo de folios disponible para tu empresa, genera una alerta cuando estas por agotar tus folios cuando se alcanza el numero minimo
smtp	String	Opcional	Si utilizas un servidor de SMTP para enviar tus comprobantes aqui se indica el nombre
smtp_email	String	Opcional	El correo que corresponde a tu servicio de SMTP para el envio de comprobantes
smtp_password	String	Opcional	Contraseña de tu SMTP
smtp_port	String	Opcional	Indica el puerto que utiliza tu SMTP
smtp_host	String	Opcional	Indica el host de tu SMTP
smtp_encryption	String	Opcional	Indica el tip de encriptacion que utiliza tu SMTP
telefono	String	Opcional	El numero telefonico de tu empresa
curp	String	Opcional	El CURP bajo la cual esta registrada tu empresa
logo	Archivo tipo jpg, jpeg o png	Opcional	Indica el logo que se utilizara para tu empresa
password	String	Requerido	La contraseña que utilizaste cuando creaste tus archivos CSD (.cer y .key)
cer	Archivo .cer	Requerido	El archivo .cer correspondiente a tu empresa
key	Archivo .key	Requerido	El archivo .key correspondiente a tu empresa
fielcer	Archivo .cer	Opcional	El archivo .cer correspondiente a tu e.firma o FIEL
fielkey	Archivo .key	Opcional	El archivo .key correspondiente a tu e.firma o FIEL
fielpassword	String	Opcional / Requerido si se envia "fielcer" y "fielkey"	La contraseña que utilizaste para la creación de tu e.firma o FIEL
Importante

El método que se utiliza para actualizar una empresa es de tipo POST

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/account/{uid}/update

Ejemplo: https://api.factura.com/v4/account/607a062eae2bb/update

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente.

Ademas de reemplazar la palabra UID por el UID correspondiente a la empresa que vamos a modificar

Ejemplo para actualizar empresa
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/account/607a062eae2bb/update"

payload = {'razons': 'Razon de prueba',
'rfc': 'FUNK123456PH7',
'codpos': '44444',
'calle': 'Ramon corona',
'numero_exterior': '123',
'numero_interior': '4',
'colonia': 'Centro',
'estado': 'Jalisco',
'ciudad': 'Arandas',
'delegacion': 'Santiaguito',
'email': 'mail@example.com',
'regimen': '612',
'mailtomyconta': '1',
'mail_conta': 'conta@example.com',
'mailtomyself': '1',
'regimen_nomina': '612',
'cant_folios_min': '66',
'smtp': '1',
'smtp_email': 'senderEmail@example.com',
'smtp_password': 'password',
'smtp_port': '4433',
'smtp_host': 'gmail.com',
'smtp_encryption': 'tls',
'telefono': '3344556677',
'curp': 'FUNK123456PH7PD89',
'password': '12345678a',
'fielpasswordd': '12345678a'}
files=[
  ('logo',('file',open('/path/to/file','rb'),'application/octet-stream'))
  ('cer',('file',open('/path/to/file','rb'),'application/octet-stream')),
  ('key',('file',open('/path/to/file','rb'),'application/octet-stream')),
  ('fielcer',('file',open('/path/to/file','rb'),'application/octet-stream')),
  ('fielkey',('file',open('/path/to/file','rb'),'application/octet-stream'))
]
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'JDJ5JDEwJEtZQ1ljMktldmM0Zy9KeUlHQklmdS56WDBpWnpVOWxIZHM2eXN4WG95blZrTFRqWlhISDJh',
  'F-Secret-Key': 'JDJ5JDEwJC5SbDRXYi5LMFNZQ0dYYUxKMXlDLy4vbHI3T1JXVEVFZy85UDJLUnFMbG5FLnFrcmNOTGsu'
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)

Respuestas al actualizar una empresa
Respuesta exitosa
JSON

{
    "status": "create",
    "0": {
        "acco_id": 1954,
        "acco_uid": "61e20b1903bad",
        "acco_razon_social": "TU RAZON SOCIAL",
        "acco_rfc": "FUNK123456PH7",
        "acco_regimen": "Personas Físicas con Actividades Empresariales y Profesionales",
        "acco_regimen_33": "612",
        "acco_calle": "Ramon corona",
        "acco_numero": "123",
        "acco_interior": "4",
        "acco_colonia": "Centro",
        "acco_codpos": "44444",
        "acco_estado": "Jalisco",
        "acco_delegacion": "Arandas",
        "acco_ciudad": "Arandas",
        "acco_telefono": "3344556677",
        "acco_create": "2023-01-14",
        "acco_lastupdate": "2023-05-16",
        "acco_cer_path": "file_name.cer",
        "acco_key_path": "file_name.key",
        "acco_pem_path": "file_name.pem",
        "acco_psswrd_cer": "password",
        "acco_cer_no": "no_cer",
        "acco_logo_path": "file_name.jpg",
        "acco_cedula_path": "",
        "acco_main": 0,
        "acco_deleted": 0,
        "acco_user_id": 1765,
        "acco_email": "example@mail.com",
        "acco_api_key": "apikey",
        "acco_secret_key": "secretkey",
        "acco_smtp": "1",
        "acco_pdf": "{\"background\":\"#20436F\",\"color\":\"#ffffff\"}",
        "acco_email_settings": null,
        "acco_mailtomyself": "1",
        "acco_mailtomyconta": "1",
        "acco_email_conta": "conta@example.com",
        "acco_curp": "FUNK123456PH7PD89",
        "acco_regimen_nomina": "612",
        "acco_fiel_cer": "file_name.cer",
        "acco_fiel_key": "file_name.key",
        "acco_fiel_pwd": "password",
        "acco_apps": null,
        "acco_folios_alert": "66"
    }
}

Solución de problemas al cargar archivos CSD o FIEL
Cuando existe un problema para subir los archivos CSD o de la FIEL por medio de API por cuestiones de permisos o problemas por el tamaño de los archivos estos pueden subirse a traves de una cadena en "base 64" en lugar de tratar de enviar el archivo, se muestra a continuacion un ejemplo de como se deberian enviar los campos en caso de hacerlo de esta forma, recuerda que la peticion es igual y solo reemplazaremos el archivo de los CSD o FIEL por un campo de texto.

Importante

Para codificar los archivos CSD o FIEL en base 64 varia dependiendo el lenguaje que utilices para obtener tu propia cadena debes buscar la forma correcta de realizarlo para tu caso en especifico.

Como un ejemplo se necesitan los siguientes pasos:

Obetener el contenido de el CSD o FIEL (.cer y .key)
Codificar el contenido en base 64 (encode64 o base64 son algunos de los terminos mas comunes)
Obtener la cadena resultante y enviarlo
Para enviar los archivos en base 64 a traves para crear o actualizar una empresa se necesitan los siguientes parametros.

 Parámetro	 Tipo	 Requerido	 Detalles
 csd_cer_b64	 String	 Requerido	Archivo CSD .cer codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .cer
 csd_key_b64 	 String 	 Requerido 	 Archivo CSD .key codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .key
password 	 String 	 Requerido si se envia cer y key 	 Se requiere incluir en la petición al enviar las cadenas cer y key
 fiel_cer_b64	 String	 Requerido	Archivo FIEL .cer codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .cer
 fiel_key_b64 	 String 	 Requerido 	 Archivo FIEL .key codificado en base64, se debe enviar la cadena resultante al codificar el contenido del .key
fielpassword 	 String 	 Requerido si se envia fielcer y fielkey 	 Se requiere incluir en la petición al enviar las cadenas fielcer y fielkey
JSON

{
    "cer": "MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS8AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucRFLOMmsAaFJThFS4JUw+FB6qBT2Lo+JjDBghZX3Hfv6MlDSxgiwul8zjb1YQM22U5PJT5IRqv3zjLRwh1criHOC9ndzIM6UauJoFaS/35WUIKi0QPw/QhXHbqMnszvAxtWRgpDsvRzd9wmWRMh/0Ud6HiUlHw79oxoCXXj6GAJAiQmXEGp9cV1B7hihtm241u8Gly9oq1oAAl3gnoth8KrWAsMrHMvAvBtkynYZPx9SV/8x8snnThqYj7TkHFrfmsZsqpW8GBhagLo93bpBLKpGwF2ycxIsStDQfh2xFg2v7SyCkvK9WyIbEVn29RAux88MPQ1YEhMjmWmx/umutQC6aK/8UpEgMcQtXeJXj2Uhep8xIxt0iX46FWnSY04biPzRBuDzU7mxsoPR84vc8pJD0xv3YMNm3W0QsiB53vwkv9AIo54q+NHD5hu0OfcYmrrOaSdWqTrLrzDsa+k7Akc9VwgfInMfRo+fBvWa3t35lM9+Rew+cC9caT6oNY6vQrw/cwE4XzCuC02GpZ89RhZuh7UWmb+DCaAbKdz+1uXwM8x9bEjujErf+xxc4kL/sW/yuFllk7ymE3KQk3cyKKJYIXJ3AsTT03k1yJYNlmUEUyv2h+i+0tkxtD33N59Wo8VC0LTH2p4hXaJ6M01VMlkANM+T9wsXpzh6xmjNdW7uLLZBuUZEOu96auzN7cS5iEQfcni04IBoKr4TKf00Z3w4WAfkpNBCuo5Bikefsc+gGzPvu5T01DpTXhxNm8HuTynMcRaIZkMnJ8JLghDL8bf6iwKb9YNIMSpxkfDoSRRhDknXHcUR1chXdskujTZWCsk/3ndTWuitP0ggedlf8TnExqvqUeDp/bhLGKxSG4n2k07hMx8A0gFOaBftJjS37OuORHvmD9LJV20ThK5TuOppdPJLkod00bcIaIb40KOHzDmf8ACkH4BAeu6v3u3zqzSfqxb4Ec9OHmonbacYcggW1kSeLEhYpVOdK+JVD0haizlpkRxeyOVhyI98bPkiC8ayP0T/ikd30Qb1DAw39nk07omjcvb+PXSZoOOCJTyDog51MdxBo/Huy7osrE+0YJ2RPp0sqzQdPxbyau3+LRX1tOy0DMriqdkFk6UQqnU+7vWsw2q0YQJkz/zVhsXOlDQKL4Ml5944E6OjZZzHee8RafTQM8mEGGN6iQhh+gQfDvGvJx+WgH1JfHbCsf/fQqanQHjutSq9crxaXYH0YoTZADy6RT70c1sXrgWxhmgpjgdhZ13xbono5P9c2ANyfkKLQxY7Lr9v5AVi5dZD9OeyvodMDT0/OIMV9KVCuCQ9tMWoHJJEzoxmhxLOjLNBsOkSTTrPr1Ogl8EgcTwGHn7PlM2seEx0PCVbSFaay70SbWUv0bkBOQMgLg94uJDubXcOB00Aw8FaHXnw0DetGiRrYzcqtBQju/0akE5YPrgAaOaMK4A6Ko36uZifDiIE+cKcscu8y5rpZvAtlXLY3hNbU8Vp3LmRrxgDE5nJqdbcN8mGgMI/flOppw7KRHlAFy0z0NlJTBjwq2brRRPH8igb+r5IAVFZzqEiqKFjO/uU/c3loPNQTK57r7Busp930=",
    "key": "MIIFgDCCA2igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDMzMTcwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTA5MjEzNzM3WhcNMjcwNTA5MjEzNzM3WjCBpzEdMBsGA1UEAxMUWE9DSElMVCBDQVNBUyBDSEFWRVoxHTAbBgNVBCkTFFhPQ0hJTFQgQ0FTQVMgQ0hBVkVaMR0wGwYDVQQKExRYT0NISUxUIENBU0FTIENIQVZFWjEWMBQGA1UELRMNQ0FDWDc2MDUxMDFQODEbMBkGA1UEBRMSQ0FDWDc2MDUxME1HVFNIQzA0MRMwEQYDVQQLEwpTdWN1cnNhbCAyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApG2xe/cC25l8y4uF/cq/R4CipKrbDJ+mVHkQ0X0vd/7/bjCvphYuF41HIr91T3Ux51jkuIBZdZ1A9o2W7nwt+MNY165p6+/dunXPDMaM8gIOShITK1Hno+6VYr9sbuciYkrxTbY1kU9M8f8TJ1Z8zYPTxHvuRma7fcWyg1uNXgQyuOFRDwzIk3pDK1YtDkDZzxpkDokYFu4oKhHb1TKUtT2uhGc3fmYG5zP6/bUDDgf4ugGNQccsd5QWm4SzplEsiyK2ggfLQ8q6ZC4SPQZolM10iUyOst4iZ9a5V7/7xOJW9qir40hCguZqhyvamsO6UXok9mOYAOo4rErV4D7FJQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAnrMfNcLjPZOw85YRNwwyhieoFp5E2swK9DMS8PwbmE50g0fRV3E25LNc7JzCzFC/Aai1ghNWPBr0SeHoBh4pizIj93frkmkOPzHPZk6DXIOW7zng+QuB5osQ+XFv3WPNYuNlqsmlgwOooW0t2cgY8eSUgupSkh4HQMQ9fOCzeL1bTLUFwGLB7qCxT/OAT9IOM59OJgytPD/j5jb8hScFOQJg/Hd0HunYuB1+DLiGSUt31JhkbiAOI+GLH0VaiR0tOkJHKqVvvgAX2JwouYrLBODoEsvgPd28YclHho8kIIu2rDWxPVBfbVLpSBQcp2vYo9GQg5u43kOg84xE5+Llm5zsNtkbvpdsbfk7IYTAB38GGDll0VysHtOw8oNAmCK8Fndjjc1PYOArJmrZqSaDTj5v3n/mNnN0a6ZEtE58IwpDhFbT/M4nD9Ct8WZYdOkMvSg/mqrlfd84y39Jz0u/yrGcgszqGJdjTOM+C83rZJP6ldlDAhbks2mJofXH/69W07gkMy5x94ZuJdCTd05n9puQitYvfKGVz+XEtcexs2S9b20FRNQsdQbFIjmANjEITVkxbAOnj2Lait7WNyoVx/BIZRNO7WWMxMVuYpJY1vY7fZw4zDa5Da7fPTmA5AbiFt+T0nZDXhoeTWGs7FEC1Ydpx7EIX8cVcxtsOVbp12I=",
    "password": "12345678a",
    "fielcer": "MIIFDjBABgkqhkiG9w0BBQ0wMzAbBgkqhkiG9w0BBQwwDgQIAgEAAoIBAQACAggAMBQGCCqGSIb3DQMHBAgwggS8AgEAMASCBMh4EHl7aNSCaMDA1VlRoXCZ5UUmqErAbucRFLOMmsAaFJThFS4JUw+FB6qBT2Lo+JjDBghZX3Hfv6MlDSxgiwul8zjb1YQM22U5PJT5IRqv3zjLRwh1criHOC9ndzIM6UauJoFaS/35WUIKi0QPw/QhXHbqMnszvAxtWRgpDsvRzd9wmWRMh/0Ud6HiUlHw79oxoCXXj6GAJAiQmXEGp9cV1B7hihtm241u8Gly9oq1oAAl3gnoth8KrWAsMrHMvAvBtkynYZPx9SV/8x8snnThqYj7TkHFrfmsZsqpW8GBhagLo93bpBLKpGwF2ycxIsStDQfh2xFg2v7SyCkvK9WyIbEVn29RAux88MPQ1YEhMjmWmx/umutQC6aK/8UpEgMcQtXeJXj2Uhep8xIxt0iX46FWnSY04biPzRBuDzU7mxsoPR84vc8pJD0xv3YMNm3W0QsiB53vwkv9AIo54q+NHD5hu0OfcYmrrOaSdWqTrLrzDsa+k7Akc9VwgfInMfRo+fBvWa3t35lM9+Rew+cC9caT6oNY6vQrw/cwE4XzCuC02GpZ89RhZuh7UWmb+DCaAbKdz+1uXwM8x9bEjujErf+xxc4kL/sW/yuFllk7ymE3KQk3cyKKJYIXJ3AsTT03k1yJYNlmUEUyv2h+i+0tkxtD33N59Wo8VC0LTH2p4hXaJ6M01VMlkANM+T9wsXpzh6xmjNdW7uLLZBuUZEOu96auzN7cS5iEQfcni04IBoKr4TKf00Z3w4WAfkpNBCuo5Bikefsc+gGzPvu5T01DpTXhxNm8HuTynMcRaIZkMnJ8JLghDL8bf6iwKb9YNIMSpxkfDoSRRhDknXHcUR1chXdskujTZWCsk/3ndTWuitP0ggedlf8TnExqvqUeDp/bhLGKxSG4n2k07hMx8A0gFOaBftJjS37OuORHvmD9LJV20ThK5TuOppdPJLkod00bcIaIb40KOHzDmf8ACkH4BAeu6v3u3zqzSfqxb4Ec9OHmonbacYcggW1kSeLEhYpVOdK+JVD0haizlpkRxeyOVhyI98bPkiC8ayP0T/ikd30Qb1DAw39nk07omjcvb+PXSZoOOCJTyDog51MdxBo/Huy7osrE+0YJ2RPp0sqzQdPxbyau3+LRX1tOy0DMriqdkFk6UQqnU+7vWsw2q0YQJkz/zVhsXOlDQKL4Ml5944E6OjZZzHee8RafTQM8mEGGN6iQhh+gQfDvGvJx+WgH1JfHbCsf/fQqanQHjutSq9crxaXYH0YoTZADy6RT70c1sXrgWxhmgpjgdhZ13xbono5P9c2ANyfkKLQxY7Lr9v5AVi5dZD9OeyvodMDT0/OIMV9KVCuCQ9tMWoHJJEzoxmhxLOjLNBsOkSTTrPr1Ogl8EgcTwGHn7PlM2seEx0PCVbSFaay70SbWUv0bkBOQMgLg94uJDubXcOB00Aw8FaHXnw0DetGiRrYzcqtBQju/0akE5YPrgAaOaMK4A6Ko36uZifDiIE+cKcscu8y5rpZvAtlXLY3hNbU8Vp3LmRrxgDE5nJqdbcN8mGgMI/flOppw7KRHlAFy0z0NlJTBjwq2brRRPH8igb+r5IAVFZzqEiqKFjO/uU/c3loPNQTK57r7Busp930=",
    "fielkey": "MIIFgDCCA2igAwIBAgIUMzAwMDEwMDAwMDA1MDAwMDMzMTcwDQYJKoZIhvcNAQELBQAwggErMQ8wDQYDVQQDDAZBQyBVQVQxLjAsBgNVBAoMJVNFUlZJQ0lPIERFIEFETUlOSVNUUkFDSU9OIFRSSUJVVEFSSUExGjAYBgNVBAsMEVNBVC1JRVMgQXV0aG9yaXR5MSgwJgYJKoZIhvcNAQkBFhlvc2Nhci5tYXJ0aW5lekBzYXQuZ29iLm14MR0wGwYDVQQJDBQzcmEgY2VycmFkYSBkZSBjYWxpejEOMAwGA1UEEQwFMDYzNzAxCzAJBgNVBAYTAk1YMRkwFwYDVQQIDBBDSVVEQUQgREUgTUVYSUNPMREwDwYDVQQHDAhDT1lPQUNBTjERMA8GA1UELRMIMi41LjQuNDUxJTAjBgkqhkiG9w0BCQITFnJlc3BvbnNhYmxlOiBBQ0RNQS1TQVQwHhcNMjMwNTA5MjEzNzM3WhcNMjcwNTA5MjEzNzM3WjCBpzEdMBsGA1UEAxMUWE9DSElMVCBDQVNBUyBDSEFWRVoxHTAbBgNVBCkTFFhPQ0hJTFQgQ0FTQVMgQ0hBVkVaMR0wGwYDVQQKExRYT0NISUxUIENBU0FTIENIQVZFWjEWMBQGA1UELRMNQ0FDWDc2MDUxMDFQODEbMBkGA1UEBRMSQ0FDWDc2MDUxME1HVFNIQzA0MRMwEQYDVQQLEwpTdWN1cnNhbCAyMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEApG2xe/cC25l8y4uF/cq/R4CipKrbDJ+mVHkQ0X0vd/7/bjCvphYuF41HIr91T3Ux51jkuIBZdZ1A9o2W7nwt+MNY165p6+/dunXPDMaM8gIOShITK1Hno+6VYr9sbuciYkrxTbY1kU9M8f8TJ1Z8zYPTxHvuRma7fcWyg1uNXgQyuOFRDwzIk3pDK1YtDkDZzxpkDokYFu4oKhHb1TKUtT2uhGc3fmYG5zP6/bUDDgf4ugGNQccsd5QWm4SzplEsiyK2ggfLQ8q6ZC4SPQZolM10iUyOst4iZ9a5V7/7xOJW9qir40hCguZqhyvamsO6UXok9mOYAOo4rErV4D7FJQIDAQABox0wGzAMBgNVHRMBAf8EAjAAMAsGA1UdDwQEAwIGwDANBgkqhkiG9w0BAQsFAAOCAgEAnrMfNcLjPZOw85YRNwwyhieoFp5E2swK9DMS8PwbmE50g0fRV3E25LNc7JzCzFC/Aai1ghNWPBr0SeHoBh4pizIj93frkmkOPzHPZk6DXIOW7zng+QuB5osQ+XFv3WPNYuNlqsmlgwOooW0t2cgY8eSUgupSkh4HQMQ9fOCzeL1bTLUFwGLB7qCxT/OAT9IOM59OJgytPD/j5jb8hScFOQJg/Hd0HunYuB1+DLiGSUt31JhkbiAOI+GLH0VaiR0tOkJHKqVvvgAX2JwouYrLBODoEsvgPd28YclHho8kIIu2rDWxPVBfbVLpSBQcp2vYo9GQg5u43kOg84xE5+Llm5zsNtkbvpdsbfk7IYTAB38GGDll0VysHtOw8oNAmCK8Fndjjc1PYOArJmrZqSaDTj5v3n/mNnN0a6ZEtE58IwpDhFbT/M4nD9Ct8WZYdOkMvSg/mqrlfd84y39Jz0u/yrGcgszqGJdjTOM+C83rZJP6ldlDAhbks2mJofXH/69W07gkMy5x94ZuJdCTd05n9puQitYvfKGVz+XEtcexs2S9b20FRNQsdQbFIjmANjEITVkxbAOnj2Lait7WNyoVx/BIZRNO7WWMxMVuYpJY1vY7fZw4zDa5Da7fPTmA5AbiFt+T0nZDXhoeTWGs7FEC1Ydpx7EIX8cVcxtsOVbp12I=",
    "fielpassword": "12345678a"
}

Respuesta erronea
JSON

{
  "status": "error",
  "message": "La cuenta que intenta autenticarse no existe",
  "Data": "$2y$10$dnOV7qC7ZrD1CZitpUnTReLKtKPxG29XfwZylrEuiR0KVl18pOXXX",
  "Secret": "$2y$10$6ZN4aX5UExwz6HFlDSZcxOF1TGjHx8f40neE.CrXHHahyAfi8XXX."
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Eliminar empresa
A continuación se explica como funciona el servicio con el cual podras borrar una empresa de tu cuenta de Factura.com

Tip

Es necesario conocer el uid que representa la empresa que deseas borrar y hacerlo con cuidado ya que por medio de API no existe confirmación para eliminar la empresa.

A continuación se listan los atributos que se utilizan para la eliminación de una empresa que pueden ser enviados en la petición.

Parámetro	Tipo	Requerido	Detalles
uid	String	Requerido	Indica el id unico por el cual se encuentra identificada una empresa en Factura.com
Importante

El método que se utiliza para borrar una empresa es de tipo POST

Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/account/{uid}/delete

Ejemplo: https://api.factura.com/v4/account/64efdcdce7927/delete

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para eliminar una empresa
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/account/64efdcdce7927/delete"

payload={'_method': 'delete'}
files=[

]
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu Secret key'
}

response = requests.request("POST", url, headers=headers, data=payload, files=files)

print(response.text)

Respuestas al eliminar una empresa
Respuesta exitosa
JSON

{
    "status": "success",
    "0": "La cuenta ha sido eliminada con exito"
}

Respuesta erronea al no encontrar la empresa
JSON

{
    "status": "failed",
    "0": "La empresa que intentas borrar no existe"
}

Respuesta erronea por problemas para autenticarse
JSON

{
  "status": "error",
  "message": "La cuenta que intenta autenticarse no existe",
  "Data": "$2y$10$dnOV7qC7ZrD1CZitpUnTReLKtKPxG29XfwZylrEuiR0KVl18pOXXX",
  "Secret": "$2y$10$6ZN4aX5UExwz6HFlDSZcxOF1TGjHx8f40neE.CrXHHahyAfi8XXX."
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.