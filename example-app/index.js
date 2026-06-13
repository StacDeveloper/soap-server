import { createSoapServer } from "../src/index.js";
import { config } from "./config.js";
import { PostModel } from "./models/postModel.js";
import { UserModel } from "./models/userModel.js";
import { postHandlers, postOperations } from "./routes/postRoutes.js";
import { userHandlers, userOperation } from "./routes/userRoutes.js";
import dotenv from "dotenv"
dotenv.config()

async function migrate() {
    await UserModel.migrate()
    await PostModel.migrate()
    console.log("Tables ready")
}

const allOperations = [
    ...userOperation,
    ...postOperations
]
const allHandlers = {
    ...userHandlers,
    ...postHandlers
}

migrate().then(() => {
    createSoapServer({
        serviceName: "SoapAppService",
        namespace: config.namespace,
        port: config.port,
        path: "/soap",
        operations: allOperations,
        handlers: allHandlers
    })
}).catch((err) => {
    console.log(err)
    process.exit(1)
})