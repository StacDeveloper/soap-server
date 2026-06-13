import http from "http"
import { generateWSDL } from "../src/wsdl-generator.js"

function extractTag(xml, tag) {
    const findTag = xml.match(new RegExp(`<(?:[^:>]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[^:>]+:)?${tag}>`))
    return findTag ? findTag[1].trim() : null
}

function extractAllFields(xml, fields) {
    const result = {}
    for (const field of fields) {
        result[field] = extractTag(xml, field) || null
    }
    return result
}

function buildSoapResponse(namespace, opearationName, outputFields) {
    const fields = Object.entries(outputFields).map(([key, val]) => `<${key}>${val}</${key}>`).join("\n            ")
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tns="${namespace}">
    <soapenv:Header/>
    <soapenv:Body>
        <tns:${opearationName}Response>
            ${fields}
        </tns:${opearationName}Response>
    </soapenv:Body>
</soapenv:Envelope>`
}

function buildSoapFault(code, message) {
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/">
    <soapenv:Body>
        <soapenv:Fault>
            <faultcode>${code}</faultcode>
            <faultstring>${message}</faultstring>
        </soapenv:Fault>
    </soapenv:Body>
</soapenv:Envelope>
    `
}

export function createSoapServer({ serviceName, namespace, port, path = "/soap", operations, handlers }) {
    const wsdl = generateWSDL({ serviceName, namespace, port, path, operations })
    const operationMap = {};
    for (const op of operations) {
        operationMap[op.name] = {
            inputFields: Object.keys(op.input),
            outputFields: Object.keys(op.output),
            handler: handlers[op.name]
        }
    }
    const server = http.createServer((req, res) => {
        const url = new URL(req.url, `http://${req.headers.host}`)
        if (req.method === "GET" && url.searchParams.has("wsdl")) {
            res.writeHead(200, { "Content-Type": "text/xml; charset=utf-8" })
            return res.end(wsdl)
        }
        if (req.method === "POST") {
            let body = ""
            req.on("data", (chunk) => (body += chunk))
            req.on("end", () => {
                const action = (req.headers["soapaction"] || "").replace(/"/g, "")
                const op = operationMap[action]
                if (!op) {
                    res.writeHead(500, { "Content-Type": "text/xml;charset=utf-8" })
                    return res.end(buildSoapFault("soapend:Server", `Unknown operation: ${action}`))
                }
                if (!op.handler) {
                    res.writeHead(500, { "Content-Type": "text/xml; charset=utf-8" })
                    return res.end(buildSoapFault("soapenv:Server", `No handler for: ${action}`))
                }
                try {
                    const args = extractAllFields(body, op.inputFields)
                    const result = op.handler(args)
                    const xml = buildSoapResponse(namespace, action, result)
                    res.writeHead(200, { "Content-Type": "text/xml;charset=utf-8" })
                    res.end(xml)
                } catch (error) {
                    res.writeHead(500, { "Content-Type": "text/xml; charset=utf-8" })
                    res.end(buildSoapFault("soapenv:Server", error.message))
                }
            })
            return
        }
        res.writeHead(404, { "Content-Type": "text/plain" })
        res.end(`Not found. Try GET ${path}?wsdl or POST ${path}`)
    })
    server.listen(port, () => {
        console.log(`✅ SOAP server running`)
        console.log(`   WSDL : GET  http://localhost:${port}${path}?wsdl`)
        console.log(`   API  : POST http://localhost:${port}${path}`)
        console.log(`   Operations: ${operations.map(o => o.name).join(", ")}`)
    })
    return server
}
