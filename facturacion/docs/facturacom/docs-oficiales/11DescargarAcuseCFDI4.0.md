Descargar acuse CFDI 4.0
A continuación se explica como funciona el servicio con el cual podras descargar el acuse de cancelación de tus comprobantes con la versión de CFDI 4.0.

Tip

Importante el metodo para descargar el acuse de CFDI 4.0 pasa a ser de tipo GET

Para descargar el acuse de cancelación en la versión 4.0 se utilizaran los siguientes parametros para la creación del metodo:

Parámetro	Tipo	Requerido	Detalles
cfdi_uid	string	Requerido	Indica el UID o UUID del CFDI que deseas cancelar.
Ejemplo:
620d79fd116d9
Construcción de la URL
Host: https://api.factura.com (producción) / https://sandbox.factura.com/api (sandbox)

Endpoint: /v4/cfdi40/cfdi_uid/acuse

Ejemplo: https://api.factura.com/v4/cfdi40/620d79fd116d9/acuse

Ejemplo para descargar acuse de cancelación CFDI
PHPNode.jsPythonRuby

import requests
import json

url = "{ HOST }/v4/cfdi40/cfdi_uid/acuse"

payload = ""
headers = {
  'Content-Type': 'application/json',
  'F-PLUGIN': '9d4095c8f7ed5785cb14c0e3b033eeb8252416ed',
  'F-Api-Key': 'Tu API key',
  'F-Secret-Key': 'Tu secret key'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.text)

Respuesta
Respuesta exitosa
JSON

<?xml version="1.0" encoding="utf-8"?>
<Acuse xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" Fecha="2022-02-18T18:12:14.2906078" RfcEmisor="XAXX010101000">
    <Folios xmlns="http://cancelacfd.sat.gob.mx">
        <UUID>7C665342-65F1-46A8-ABB2-58F5909FB14A</UUID>
        <EstatusUUID>201</EstatusUUID>
    </Folios>
    <Signature Id="SelloSAT" xmlns="http://www.w3.org/2000/09/xmldsig#">
        <SignedInfo>
            <CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" />
            <SignatureMethod Algorithm="http://www.w3.org/2001/04/xmldsig-more#hmac-sha512" />
            <Reference URI="">
                <Transforms>
                    <Transform Algorithm="http://www.w3.org/TR/1999/REC-xpath-19991116">
                        <XPath>not(ancestor-or-self::*[local-name()='Signature'])</XPath>
                    </Transform>
                </Transforms>
                <DigestMethod Algorithm="http://www.w3.org/2001/04/xmlenc#sha512" />
                <DigestValue>UdAXttKXwWcmQwY7RVvMxBs37qLT4O0ysHH+hLao+Ah96ldD+RKUZ70UR9CaksZFzfxMHMgjbgMxvaMFkcgg4A==</DigestValue>
            </Reference>
        </SignedInfo>
        <SignatureValue>dSU5q9IXiK7xTFFOrcDC8UJUFvOXY46dsBFaoDnnD47CotH/c6IHRTnPD6bGUxA8URutCCmBg0lcxVxBAl4GCQ==</SignatureValue>
        <KeyInfo>
            <KeyName>BF66E582888CC845</KeyName>
            <KeyValue>
                <RSAKeyValue>
                    <Modulus>n5YsGT0w5Z70ONPbqszhExfJU+KY3Bscftc2jxUn4wxpSjEUhnCuTd88OK5QbDW3Mupoc61jr83lRhUCjchFAmCigpC10rEntTfEU+7qtX8ud/jJJDB1a9lTIB6bhBN//X8IQDjhmHrfKvfen3p7RxLrFoxzWgpwKriuGI5wUlU=</Modulus>
                    <Exponent>AQAB</Exponent>
                </RSAKeyValue>
            </KeyValue>
        </KeyInfo>
    </Signature>
</Acuse>
