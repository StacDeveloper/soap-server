import { UserController } from "../controllers/userController.js";
import { withLogger } from "../middleware/logger.js";

const user = new UserController()

export const userOperation = [
    {
        name: "GetUsers",
        input: {},
        output: { success: "string", count: "string", data: "string" }
    },
    {
        name: "GetUserById",
        input: { id: "string" },
        output: { success: "string", message: "string", data: "string" }
    },
    {
        name: "CreateUser",
        input: { name: "string", email: "string" },
        output: { success: "string", message: "string", data: "string" }
    },
    {
        name: "UpdateUser",
        input: { id: "string", email: "string" },
        output: { success: "string", message: "string", data: "string" }
    },
    {
        name: "DeleteUser",
        input: { id: "string" },
        output: { success: "string", message: "string" }
    },
]

export const userHandlers = {
    GetUsers: withLogger("GetUsers", () => user.getUser()),
    GetUserById: withLogger("GetUserById", (args) => user.getUserById(args)),
    CreateUser: withLogger("CreateUser", (args) => user.createUser(args)),
    UpdateUser: withLogger("UpdateUser", (args) => user.updateUser(args)),
    DeleteUser: withLogger("DeleteUser", (args) => user.deleteUser(args))
}