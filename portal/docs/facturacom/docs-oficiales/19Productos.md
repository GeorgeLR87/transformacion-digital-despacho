Productos
Listar productos
Este endpoint permite obtener el listado completo de productos y servicios registrados. Incluye capacidades de filtrado por nombre, precio o clave SAT, así como gestión de paginación.

Construcción de la URL
Importante

Este método de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/products/list

Ejemplo: https://api.factura.com/v3/products/list

Es posible filtrar el catálogo de productos y servicios utilizando los siguientes parámetros de consulta en la URL:

Parámetro	Tipo	Requerido	Detalles
name	string	Opcional	Filtra productos por coincidencia en el nombre o descripción.
Ejemplo: /v3/products/list?name=Playera tipo polo

price	number	Opcional	Filtra productos que coincidan con el precio exacto proporcionado.
Ejemplo: /v3/products/list?price=200.00

clave_prod_serv	string	Opcional	Filtra por la clave de producto o servicio asignada por el SAT.
Ejemplo: /v3/products/list?clave_prod_serv=50131800

page	integer	Opcional	Indica número de página a consultar, por default posiciona en la página 1.
Ejemplo: /v3/products/list?page=1&perPage=10

per_page	integer	Opcional	Indica el limite de resultados para mostrar, por default retorna todo el catalogo.
Ejemplo: /v3/products/list?page=1&perPage=10

Los parámetros de consulta deben incluirse en la URL. Utilice "?" para el primer parámetro y "&" para concatenar parámetros adicionales.

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para listado de productos
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/api/v3/products/list?page=1&perPage=5"

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
    "data": [
        {
            "uid": "654ad5373a77a",
            "name": "Producto 1",
            "price": "49.000000",
            "sku": "77",
            "unidad": "Pieza",
            "claveprodserv": "81111500",
            "claveunidad": "H87"
        },
        {
            "uid": "66b10f3cb7bca",
            "name": "Producto 2",
            "price": "1615.000000",
            "sku": "80",
            "unidad": "Pieza",
            "claveprodserv": "24111503",
            "claveunidad": "H87"
        },
        {
            "uid": "66b3b3769d340",
            "name": "Producto 3",
            "price": "249.000000",
            "sku": "103",
            "unidad": "Pieza",
            "claveprodserv": "43211601",
            "claveunidad": "H87"
        },
        {
            "uid": "63b5b3e2938ba",
            "name": "Producto 4",
            "price": "1.000000",
            "sku": "01",
            "unidad": "Actividad",
            "claveprodserv": "01010101",
            "claveunidad": "ACT"
        },
        {
            "uid": "69656ff6c3297",
            "name": "Producto 5",
            "price": "879.990000",
            "sku": "",
            "unidad": "Unidad de servicio",
            "claveprodserv": "82111803",
            "claveunidad": "E48"
        }
    ],
    "pagination": {
        "total": 49,
        "lastPage": 10,
        "currentPage": 1,
        "to": 5,
        "from": 1
    }
}

Buscar un producto por UID
A continuación se explica como buscar un producto de nuestro catalogo por medio de su UID, con un ejemplo y la muestra de posibles respuestas obtenidas.

Podemos buscar un CFDI utilizando el UID como parámetro y obtener la información relacionada con este, a continuación se muestran las características de este valor.

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador interno para la plataforma de Factura.com asignado al producto cuando lo creamos.
Construcción de la URL
Importante

Este método de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/products/show/{ UID de tu producto }

Ejemplo: https://api.factura.com/v3/products/show/6543f3bf0016d

Tip

Para probar el ejemplo de código, necesitas cambiar "Tu API key" por la clave de API de tu cuenta, y "Tu Secret key" por la clave secreta correspondiente.

Ejemplo para listado de productos
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/api/v3/products/show/6543f3bf0016d"

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
Ejemplo de respuesta exitosa
JSON

{
    "response": "success",
    "data": {
        "uid": "6543f3bf0016d",
        "name": "Gafas de sol",
        "price": "2000.523100",
        "sku": "142",
        "unidad": "Pieza",
        "claveprodserv": "78102203",
        "claveunidad": "H87"
    }
}

Ejemplo de respuesta erronea


{
  "response": "error",
  "data": "No se encontraron datos correspondientes a tu producto (6543f3f0016d)"
}
Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Crear producto
A continuación se explica como dar de alta un nuevo producto.

Podemos crear un nuevo producto haciendo uso de los siguientes parámetros:

Parámetro	Tipo	Requerido	Detalles
code	string	Opcional	Indica el código o SKU de tu producto.
name	string	Requerido	Indica el nombre de tu producto.

Éste nombre se mostrará en el apartado de Conceptos de tu CFDI.
price	numeric	Requerido	Indica el precio sin IVA de tu producto o servicio.
clavePS	string	Requerido	Indica la clave del producto o servicio correspondiente a tu concepto.

Consulta el catálogo de Clave Producto/Servicio .
unity	string	Requerido	Indica la unidad de medida, ésta debe corresponder a la clave indicada en el atributo claveUnity .

Consulta el catálogo de Clave Unidad .
claveUnity	string	Requerido	Indica la clave de la unidad de medida, ésta debe corresponder a la unidad indicada en el atributo unity .

Consulta el catálogo de Clave Unidad .
Construcción de la URL
Importante

Este método es de es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/products/create

Ejemplo: https://api.factura.com/v3/products/create

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente

Ejemplo para crear productos
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v3/products/create"

payload = json.dumps({
  "code": "K001",
  "name": "Desarrollo de banner para publicidad",
  "price": "35.9",
  "clavePS": 1154544511,
  "unity": "Unidad de servicio",
  "claveUnity": "E48"
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
Importante

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.

Respuesta exitosa
JSON

{
    "response": "success",
    "data": {
        "uid": "616de203d2ff7",
        "name": "Desarrollo de banner para publicidad",
        "sku": "K001",
        "price": "35.9",
        "clavePS": "1154544511",
        "unity": "Unidad de servicio",
        "claveUnity": "E48"
    }
}

Actualizar un producto
A continuación se explica el metódo con el cual podremos actualizar la información de un producto que existe dentro de nuestro catalogo junto algunos ejemplos de como realizarlo.

Para actualizar un producto son necesarios los siguientes parametros.

Parámetro	Tipo	Requerido	Detalles
UID	string	Requerido	Es el identificador unico correspondiente a el producto que deseamos actualizar.
code	string	Opcional	Indica el código o SKU de tu producto.
name	string	Requerido	Indica el nombre de tu producto.

Éste nombre se mostrará en el apartado de Conceptos de tu CFDI.
price	numeric	Requerido	Indica el precio sin IVA de tu producto o servicio.
clavePS	string	Requerido	Indica la clave del producto o servicio correspondiente a tu concepto.

Consulta el catálogo de Clave Producto/Servicio .
unity	string	Requerido	Indica la unidad de medida, ésta debe corresponder a la clave indicada en el atributo claveUnity .

Consulta el catálogo de Clave Unidad .
claveUnity	string	Requerido	Indica la clave de la unidad de medida, ésta debe corresponder a la unidad indicada en el atributo unity .

Consulta el catálogo de Clave Unidad .
Construcción de la URL
Importante

Este método es de es de tipo POST

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/products/update/{ UID de tu producto }

Ejemplo: https://api.factura.com/v3/products/66830797f2254/

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente

Ejemplo para crear productos
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/api/v3/products/update/66830797f2254"

payload = json.dumps({
  "code": "K002",
  "name": "Desarrollo a la medida",
  "price": "35.9",
  "clavePS": 81111500,
  "unity": "Unidad de servicio",
  "claveUnity": "E48"
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
Ejemplo de respuesta exitosa
JSON

{
    "response": "success",
    "data": {
        "uid": "668331248fcf5",
        "name": "Desarrollo de software de productividad",
        "sku": "SOFT001",
        "price": "36000.99",
        "clavePS": "81111500",
        "unity": "Unidad de servicio",
        "claveUnity": "E48"
    }
}

Ejemplo de respuesta erronea
JSON

{
    "response": "error",
    "message": "El producto que intentas actualizar ya no existe"
}

Aviso

El mensaje de error puede variar dependiendo del nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje de error ya que en el mismo se indica donde es necesario corregir la información.

Eliminar un producto
A continuación se explica el metódo con el cual podremos elminar un producto y toda su información de nuestro catalogo junto algunos ejemplos de como realizarlo.

Podemos eliminar un CFDI utilizando el UID como parámetro para realizar esta acción , a continuación se muestran las características de este valor.

Parámetro	Tipo	Requerido	Detalles
UID	String	Requerido	Es el identificador interno para la plataforma de Factura.com asignado al producto cuando lo creamos.
Construcción de la URL
Importante

Este método es de es de tipo GET

Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v3/products/delete/{ UID de tu producto }

Ejemplo: https://api.factura.com/v3/delete/66830797f2254/

Tip

Para probar el código de ejemplo es necesario que reemplaces el texto Tu API key por el API KEY de tu cuenta, e Tu Secret key por el SECRET KEY correspondiente

Ejemplo para crear productos
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/api/v3/products/delete/66830797f2254"

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
Ejemplo de respuesta exitosa
JSON

{
    "response": "success",
    "message": "Producto eliminado exitosamente"
}

Ejemplo de respuesta erronea
JSON

{
    "response": "error",
    "message": "Producto no eliminado intenta más tarde"
}

Aviso

El mensaje de error puede variar dependiendo del nodo en el que haya información incorrecta. Te sugerimos leer cuidadosamente el mensaje de error ya que en el mismo se indica donde es necesario corregir la información.