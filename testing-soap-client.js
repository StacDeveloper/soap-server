import { createSoapClient } from "../Soap-Server/src/client.js"

const client = createSoapClient({
    url: "http://localhost:5000/soap",
    namespace: "http://example.com/hello"
})

async function run() {
    console.log("-".repeat(40))
    const hello = await client.call("SayHello", { name: "Soham" })
    console.log("Say Hello" + hello.message)
    const bye = await client.call("SayGoodBye", { name: "Soham" })
    console.log("SayGoodBye" + bye.message)
    const greet = await client.call("GetFullGreeting", { name: "Soham", time: "Morning" })
    console.log("Night Owl" + greet.message)
    const sum = await client.call("AddNumbers", { a: 10, b: 25 })
    console.log("add numbers", sum.result)
    console.log("-".repeat(40))
}
run().catch((error)=>{
    console.log(error)
})