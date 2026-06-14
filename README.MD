# easy-soap

Create SOAP servers and clients in plain JavaScript — no XML writing required.

WSDL is generated automatically from a simple JS description of your operations. Built on Node's native `http` module — zero dependencies for the core package.

---

## Why

SOAP normally requires hand-writing WSDL (XML service contracts) and SOAP envelopes. This package lets you describe operations as plain JS objects and handle requests as plain JS functions — `easy-soap` generates the XML for you on both the server and client side.

---

## Installation

```bash
npm install easy-soap
```

---

## Quick Start — Server

```js
import { createSoapServer } from "easy-soap"

createSoapServer({
    serviceName: "HelloWorldService",
    namespace:   "http://example.com/hello",
    port:        5000,
    path:        "/soap",

    operations: [
        {
            name:   "SayHello",
            input:  { name: "string" },
            output: { message: "string" }
        }
    ],

    handlers: {
        SayHello({ name }) {
            return { message: `Hello, ${name || "World"}!` }
        }
    }
})
```

Run it:
```bash
node server.js
```

- WSDL available at `GET http://localhost:5000/soap?wsdl`
- API available at `POST http://localhost:5000/soap`

---

## Quick Start — Client

```js
import { createSoapClient } from "easy-soap"

const client = createSoapClient({
    url:       "http://localhost:5000/soap",
    namespace: "http://example.com/hello"
})

const result = await client.call("SayHello", { name: "Soham" })
console.log(result.message)  // "Hello, Soham!"
```

---

## Supported Types

```
string | integer | boolean | float | double | date | dateTime
```

---

## API Reference

### `createSoapServer(options)`

| Option | Type | Description |
|---|---|---|
| `serviceName` | string | Name of the SOAP service |
| `namespace` | string | Unique namespace URI for the WSDL |
| `port` | number | Port to listen on |
| `path` | string | Endpoint path, default `/soap` |
| `operations` | array | List of `{ name, input, output }` |
| `handlers` | object | `{ OperationName: (args) => result }` — can be `async` |

### `createSoapClient(options)`

| Option | Type | Description |
|---|---|---|
| `url` | string | Full URL to the SOAP endpoint |
| `namespace` | string | Same namespace as the server |

`client.call(operationName, args)` → returns a Promise resolving to the response fields as a plain object. Throws on SOAP Fault.

---

## Example App

A full example — Users + Posts CRUD backed by a Postgres (Neon) database — is included in `example-app/`. It demonstrates:

- Clean architecture: `routes/`, `controllers/`, `models/`, `middleware/`
- OOP controllers
- Path-param and query-param style operations (`GetUserById`, `SearchPosts`)
- Logging middleware wrapping every handler

### Running the example app

```bash
# from project root
npm install

# copy env template and add your database URL
cp example-app/.env.example example-app/.env
```

Edit `example-app/.env`:
```
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
PORT=5000
NAMESPACE=http://example.com/soapapp
```

Start the server:
```bash
npm start
```

Tables are created automatically on first run.

### Testing with curl (PowerShell)

```powershell
curl.exe -X POST http://localhost:5000/soap -H "Content-Type: text/xml" -H "SOAPAction: ""CreateUser""" -d "<?xml version='1.0'?><soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:tns='http://example.com/soapapp'><soapenv:Body><tns:CreateUserRequest><name>Soham</name><email>soham@test.com</email></tns:CreateUserRequest></soapenv:Body></soapenv:Envelope>"
```

### Example App Operations

| Operation | Input | Description |
|---|---|---|
| `GetUsers` | – | List all users |
| `GetUserById` | `id` | Get one user |
| `CreateUser` | `name, email` | Create a user |
| `UpdateUser` | `id, name, email` | Update a user |
| `DeleteUser` | `id` | Delete a user |
| `GetPosts` | – | List all posts |
| `GetPostById` | `id` | Get one post |
| `GetPostsByUser` | `userId` | Posts by a user |
| `SearchPosts` | `keyword` | Search posts by title/body |
| `CreatePost` | `userId, title, body` | Create a post |
| `UpdatePost` | `id, title, body` | Update a post |
| `DeletePost` | `id` | Delete a post |

---

## Project Structure

```
easy-soap/
├── src/                    ← core package
│   ├── index.js
│   ├── server.js
│   ├── client.js
│   └── wsdl-generator.js
├── examples/                ← minimal usage example
│   ├── example-server.js
│   └── example-client.js
└── example-app/             ← full CRUD app with database
    ├── index.js
    ├── config.js
    ├── db.js
    ├── routes/
    ├── controllers/
    ├── models/
    └── middleware/
```

---

## Notes

- This package focuses on `document/literal` style SOAP — the most common style.
- WS-Security, WS-ReliableMessaging and other WS-* extensions are not implemented.
- For consuming complex third-party SOAP APIs with full WS-* support, consider `node-soap`.

---

## License

MIT