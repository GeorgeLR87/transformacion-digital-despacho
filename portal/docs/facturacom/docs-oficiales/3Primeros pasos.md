Primeros pasos
Para hacer uso del API de Factura.com es necesario hacer uso del formato JSON . Todas las respuestas, exitosas o de error, están en formato JSON. Es necesario incluir en las cabeceras el token de acceso llamado API key y Secret key

Obtener API KEY y SECRET KEY
Para obtener tus llaves de acceso deber seguir los siguientes pasos:

Iniciar sesión para acceder a tu panel (Si es en producción en https://api.factura.com, si es en sandbox en https://sandbox.factura.com/api ).
En el menú lateral dirígete a Desarrolladores -> API -> Datos de acceso .
En caso de que tu API se encuentre desactivada puedes activarla aqui.
Copia los valores de tus API keys y pegalos en su variable correspondiente.
Agregar a la cabecera
Necesitas crear una cabecera como la siguiente para poder realizar tu petición al API de Factura.com.
El valor para el dato F-PLUGIN siempre sera: 9d4095c8f7ed5785cb14c0e3b033eeb8252416ed
JSON

{
    "Content-Type: application/json",
    "F-PLUGIN": . "9d4095c8f7ed5785cb14c0e3b033eeb8252416ed",
    "F-Api-Key": . "JDJ5JDEwJGRuT1Y3cUM3WnJEMUNaaXRwVW5UUmVMS3RLUHhHMjlYZndaeWxyRXVpUjBLVmwxOHBPWFXX",
    "F-Secret-Key":  . "JDJ5JDEwJDZaTjRhWDVVRXh3ejZIRmxEU1pjeE9GMVRHakh4OGY0MG5lRS5DclhISGFoeUFmaThxaUXX"
}