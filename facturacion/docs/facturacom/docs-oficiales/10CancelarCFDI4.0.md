Cancelar CFDI 4.0
A continuación se explica como funciona el servicio con el cual podras realizar cancelaciones de tus comprobantes con la versión de CFDI 4.0.

Aviso

A partir del 1 de Enero del 2022 entra en vigor el nuevo esquema de cancelaciones, la actualización aplica para todas las versiones de CFDI

Para las cancelaciones en la versión 4.0 se utilizaran los siguientes parametros para la creación del metodo:

Parámetro	Tipo	Requerido	Detalles
cfdi_uid	string	Requerido	Indica el UID o UUID del CFDI que deseas cancelar.

Ejemplo:
55c0fdc67593d
motivo	string	Requerido	
Indica motivo por el cual es solicitada la cancelación del CFDI.

Ejemplo:
01

folioSustituto	string	Requerido	
Indica el UID o UUID del CFDI que reemplazara el CFDI cancelado.

Ejemplo:
3336cbb9-ebd4-45e8-b60b-e7bfa6f6b5e0

Tip

Para indicar el motivo de la cancelación de los CFDI se utilizarán distintas claves que se explican a continuación.

Clave	Motivo	Descripción	Acción
01	Comprobante emitido con errores con relación	Aplica cuando la factura generada contiene un error en la clave del producto, valor unitario, descuento o cualquier otro dato, por lo que se debe reexpedir.	Primero se sustituye la factura y cuando se solicita la cancelación, se incorpora el folio de la factura que sustituye a la cancelada.
02	Comprobante emitido con errores sin relación	Aplica cuando la factura generada contiene un error en la clave del producto, valor unitario, descuento o cualquier otro dato y no se requiera relacionar con otra factura generada.	No hay acción adicional requerida.
03	No se llevó; a cabo la operación	Aplica cuando se facturó; una operación que no se concreta.	No hay acción adicional requerida.
04	Operación nominativa relacionada en la factura global	Aplica cuando se incluye una venta en la factura global de operaciones con el público en general y, posterior a ello, el cliente solicita su factura nominativa; es decir, a su nombre y RFC.	Se cancela la factura global, se reexpide sin incluir la operación por la que se solicita factura. Se expide la factura nominativa.
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/cfdi_uid/cancel

Ejemplo: https://api.factura.com/v4/cfdi40/55c0fdc67593d/cancel

Ejemplo para cancelar CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/61ba335bd48fa/cancel"

payload = json.dumps({
  "motivo": "01",
  "folioSustituto": "3336cbb9-ebd4-45e8-b60b-e7bfa6f6b5e0"
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
    "message": "Estimado cliente tu CFDI F66(a80387be-bb02-45c4-ac33-c85ed48a49ab) se canceló exitosamente",
    "respuestaapi": {
        "response": "success",
        "acuse": "<?xml version=\"1.0\" encoding=\"utf-8\"?><Acuse xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\" xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" Fecha=\"2021-12-28T14:30:48.3934087\" RfcEmisor=\"XOJI740919U48\"><Folios xmlns=\"http://cancelacfd.sat.gob.mx\"><UUID>A80387BE-BB02-45C4-AC33-C85ED48A49AB</UUID><EstatusUUID>201</EstatusUUID></Folios><Signature Id=\"SelloSAT\" xmlns=\"http://www.w3.org/2000/09/xmldsig#\"><SignedInfo><CanonicalizationMethod Algorithm=\"http://www.w3.org/TR/2001/REC-xml-c14n-20010315\" /><SignatureMethod Algorithm=\"http://www.w3.org/2001/04/xmldsig-more#hmac-sha512\" /><Reference URI=\"\"><Transforms><Transform Algorithm=\"http://www.w3.org/TR/1999/REC-xpath-19991116\"><XPath>not(ancestor-or-self::*[local-name()='Signature'])</XPath></Transform></Transforms><DigestMethod Algorithm=\"http://www.w3.org/2001/04/xmlenc#sha512\" /><DigestValue>pyf1Z8DeV/R934tgx7duakRCDSK0rlY+1Ql3pfc6OMXLMJnthgDyfNY20jXzxncIsJR1JGRKjj08AcGuLM4r1Q==</DigestValue></Reference></SignedInfo><SignatureValue>vagn0h0kJ9UJf0g5+fX6s7uSUnor7+by0Uj/CdYiEba8KM6a5HO2/DxUZqw8XovbxKrVyducZpqBamLXDTrG5w==</SignatureValue><KeyInfo><KeyName>BF66E582888CC845</KeyName><KeyValue><RSAKeyValue><Modulus>n5YsGT0w5Z70ONPbqszhExfJU+KY3Bscftc2jxUn4wxpSjEUhnCuTd88OK5QbDW3Mupoc61jr83lRhUCjchFAmCigpC10rEntTfEU+7qtX8ud/jJJDB1a9lTIB6bhBN//X8IQDjhmHrfKvfen3p7RxLrFoxzWgpwKriuGI5wUlU=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue></KeyValue></KeyInfo></Signature></Acuse>"
    }
}

Aviso

El mensaje de error puede variar dependiendo el nodo en el que haya información incorrecta.

Te sugerimos leer cuidadosamente el mensaje del error ya que en el mismo se indica donde es necesario corregir la información.