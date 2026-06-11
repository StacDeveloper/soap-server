import { createSoapServer } from "../Soap-Server/src/server.js"

createSoapServer({
    serviceName: "HelloWorldService",
    namespace: "http://example.com/hello",
    port: 5000,
    path: "/soap",
    operations: [
        {
            name: "SayHello",
            input: { name: "string" },
            output: { message: "string" }
        },
        {
            name: "SayGoodBye",
            input: { name: "string" },
            output: { message: "string" }
        },
        {
            name: "GetFullGreeting",
            input: { name: "string", time: "string" },
            output: { message: "string" }
        },
        {
            name: "AddNumbers",
            input: { a: "integer", b: "integer" },
            output: { result: "integer" }
        }
    ],
    handlers: {
        SayHello({ name }) {
            return { message: `Hello, ${name || "World!"}` }
        },
        SayGoodBye({ name }) {
            return { message: `Goodbye ${name || "World"}` }
        },
        GetFullGreeting({ name, time }) {
            return { message: `Good ${time || "day"}, ${name || "World"}! Welcome.` }
        },
        AddNumbers({ a, b }) {
            return { result: Number(a) + Number(b) }
        }
    }
})


