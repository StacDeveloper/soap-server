import http from "http"

function buildEnvelope(namespace, operationName, args) {
    const fields = Object.entries(args).map(([key, val]) => `<${key}>${val}</${key}>`)
        .join("\n            ")
    return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope
    xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
    xmlns:tns="${namespace}">
    <soapenv:Header/>
    <soapenv:Body>
        <tns:${operationName}Request>
            ${fields}
        </tns:${operationName}Request>
    </soapenv:Body>
</soapenv:Envelope>`
}

function extractTag(xml, tag) {
    const newTag = xml.match(
        new RegExp(`<(?:[^:>]+:)?${tag}[^>]*>([\\s\\S]*?)<\\/(?:[^:>]+:)?${tag}>`)
    )
    return newTag ? newTag[1].trim() : null
}
function extractAllTags(xml) {
    const result = {}
    const matches = [...xml.matchAll(/<(?:[^:>\s]+:)?([a-zA-Z][a-zA-Z0-9_]*)[^>]*>([^<]+)<\/(?:[^:>]+:)?[a-zA-Z][a-zA-Z0-9_]*>/g)]
    for (const match of matches) {
        result[match[1]] = match[2].trim()
    }
    return result
}

function postRequest(url, soapAction, body) {
    return new Promise((resolve, reject) => {
        const parsed = new URL(url)
        const bodyBytes = Buffer.from(body, "utf-8")
        const options = {
            hostname: parsed.hostname,
            port: parsed.port || 80,
            method: "POST",
            headers: {
                "Content-Type": "text/xml; charset=utf-8",
                "Content-Length": bodyBytes.length,
                "SOAPaction": `${soapAction}`
            }
        }
        const req = http.request(options, res => {
            let data = ""
            res.on("data", (chunk) => body += chunk)
            res.on("end"), () => resolve({ statusCode: res.statusCode, body: data })
        })
        req.on("error", reject)
        req.write(bodyBytes)
        req.end()
    })
}

export function createSoapClient({ url, namespace }) {
    return {
        async call(operationName, args = {}) {
            const envelope = buildEnvelope(namespace, operationName, args)
            const { statusCode, body } = await postRequest(url, operationName, envelope)
            const fault = extractTag(body, "faultsString")
            if (fault) throw new Error(`Soap Fault:${fault}`)
            const responseTag = extractTag(body, `${operationName}Response`)
            if (!responseTag) return extractAllTags(body)
            return extractAllTags(responseTag)
        }
    }
}