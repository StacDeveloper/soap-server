const XSD_TYPES = ["string", "integer", "boolean", "float", "double", "date", "dateTime"]

const toXSDTypes = (type) => {
    return XSD_TYPES.includes(type) ? `xsd:${type}` : type
}

function generateTypes(operations, namespace) {
    let types = ""
 
    for (const op of operations) {
        // Request element
        types += `
        <xsd:element name="${op.name}Request">
            <xsd:complexType>
                <xsd:sequence>
                    ${Object.entries(op.input)
                        .map(([field, type]) => `<xsd:element name="${field}" type="${toXSDTypes(type)}"/>`)
                        .join("\n                    ")}
                </xsd:sequence>
            </xsd:complexType>
        </xsd:element>`
 
        // Response element
        types += `
        <xsd:element name="${op.name}Response">
            <xsd:complexType>
                <xsd:sequence>
                    ${Object.entries(op.output)
                        .map(([field, type]) => `<xsd:element name="${field}" type="${toXSDTypes(type)}"/>`)
                        .join("\n                    ")}
                </xsd:sequence>
            </xsd:complexType>
        </xsd:element>`
    }
 
    return types
}

function generateMessages(operations) {
    return operations.map(op => `
    <message name="${op.name}Input">
        <part name="parameters" element="tns:${op.name}Request"/>
    </message>
    <message name="${op.name}Output">
        <part name="parameters" element="tns:${op.name}Response"/>
    </message>`).join("")
}

function generatePortType(operations, portTypeName) {
    const ops = operations.map(op => `
        <operation name="${op.name}">
            <input  message="tns:${op.name}Input"/>
            <output message="tns:${op.name}Output"/>
        </operation>`).join("")
    return ` <portType name="${portTypeName}">
        ${ops}
    </portType>`
}

function generateBinding(operations, bindingName, portTypeName) {
    const ops = operations.map(op => `
        <operation name="${op.name}">
            <soap:operation soapAction="${op.name}"/>
            <input><soap:body use="literal"/></input>
            <output><soap:body use="literal"/></output>
        </operation>`).join("")
    return `
    <binding name="${bindingName}" type="tns:${portTypeName}">
        <soap:binding style="document" transport="http://schemas.xmlsoap.org/soap/http"/>
        ${ops}
    </binding>`
}

function generateService(serviceName, portName, bindingName, address) {
    return `
    <service name="${serviceName}">
        <port name="${portName}" binding="tns:${bindingName}">
            <soap:address location="${address}"/>
        </port>
    </service>`
}

export function generateWSDL({ serviceName, namespace, port, path = "/soap", operations }) {
    const portTypeName = `${serviceName}PortType`
    const bindingName = `${serviceName}Binding`
    const portName = `${serviceName}Port`
    const address = `http://localhost:${port}${path}`

    return `<?xml version="1.0" encoding="UTF-8"?>
<definitions
    name="${serviceName}"
    targetNamespace="${namespace}"
    xmlns="http://schemas.xmlsoap.org/wsdl/"
    xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/"
    xmlns:tns="${namespace}"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema">
 
    <!-- Types -->
    <types>
        <xsd:schema targetNamespace="${namespace}">
            ${generateTypes(operations, namespace)}
        </xsd:schema>
    </types>
 
    <!-- Messages -->
    ${generateMessages(operations)}
 
    <!-- Port Type -->
    ${generatePortType(operations, portTypeName)}
 
    <!-- Binding -->
    ${generateBinding(operations, bindingName, portTypeName)}
 
    <!-- Service -->
    ${generateService(serviceName, portName, bindingName, address)}
 
</definitions>`
}