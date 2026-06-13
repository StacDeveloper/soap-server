import { UserModel } from "../models/userModel.js"

export class UserController {
    async getUser() {
        const users = await UserModel.findAll()
        return {
            success: "true",
            count: String(users.length),
            data: JSON.stringify(users)
        }
    }
    async getUserById({ id }) {
        if (!id) return { success: "false", message: "id is required" }
        const user = await UserModel.findById(id)
        if (!user) return { success: "false", message: `User ${id} not found` }
        return {
            success: "true",
            data: JSON.stringify(user)
        }
    }
    async createUser({ name, email }) {
        if (!name || !email) {
            return { success: "false", message: "name and email are required" }
        }
        const existing = await UserModel.findByEmail(email)
        if (existing) {
            return { success: "false", message: `Email ${email} already exists` }
        }
        const user = await UserModel.create({ name, email })
        return {
            success: "true",
            message: "User created",
            data: JSON.stringify(user)
        }
    }
    async updateUser({ id, name, email }) {
        if (!id) return { success: "false", message: "id is required" }
        const existing = await UserModel.findById(id)
        if (!existing) return { success: "false", message: `User ${id} not found ` }
        const updated = await UserModel.update(id, { name, email })
        return {
            success: "true",
            message: "User Updated",
            data: JSON.stringify(updated)
        }
    }
    async deleteUser({ id }) {
        if (!id) return { success: "false", message: "id is required" }
        const deleted = await UserModel.delete(id)
        if (!deleted) return { success: "false", message: `User ${id} not found` }
        return {
            success: "true",
            message: `User ${id} deleted`
        }
    }
}



