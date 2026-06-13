import { PostModel } from "../models/postModel.js";
import { UserModel } from "../models/userModel.js";


export class PostController {
    async getPosts() {
        const posts = await PostModel.findAll()
        if (!posts) return { success: "false", message: "Post not found" }
        return {
            success: "true",
            count: String(posts.length),
            data: JSON.stringify(posts)
        }
    }
    async getPostById({ id }) {
        if (!id) return { success: "false", message: "Please provide id to find post" }
        const post = await PostModel.findById(id)
        if (!post) return { success: "false", message: `Post not found ${id}` }
        return {
            success: "true",
            data: JSON.stringify(post)
        }
    }
    async getPostsByUserId({ userId }) {
        if (!userId) return { success: "false", message: "userId is required" }
        const posts = await PostModel.findByUserId(userId)
        if (!posts) return { success: "false", message: `posts not found ${userId}` }
        return {
            success: "true",
            count: String(posts.length),
            data: JSON.stringify(posts)
        }
    }
    async createPost({ userId, title, body }) {
        if (!userId || !title || !body) {
            return { success: "false", message: "userid title body is required" }
        }
        const user = await UserModel.findById(userId)
        if (!user) return { success: "false", message: "user not found" }
        const post = await PostModel.create({ userId, title, body })
        return {
            success: "true",
            message: "Post created",
            data: JSON.stringify(post)
        }
    }
    async updatePost({ id, title, body }) {
        if (!id || !title || !body) return { success: "false", message: !id ? "id is required" : !title ? "title is required" : "body is required" }
        const existing = await PostModel.findById(id)
        if (!existing) return { success: "false", message: "Post not found" }
        const update = await PostModel.update(id, { title, body })
        return {
            success: "true",
            message: "Post Updated",
            data: JSON.stringify(update)
        }
    }
    async delete({ id }) {
        if (!id) return { success: "false", message: "id is required to delete post" }
        const deletepost = await PostModel.delete(id)
        if (deletepost) {
            return {
                success: "true",
                message: `Post deleted ${id} `
            }
        }
        return {
            success: "false",
            message: "error while deleting post"
        }
    }
    async searchPost({ keyword }) {
        if (!keyword) return { success: "false", message: "Please provide keyword to search" }
        const result = await PostModel.search(keyword)
        if (result) {
            return {
                success: "true",
                data: JSON.stringify(result),
                count: result.length
            }
        }
        return {
            success: "false",
            message: "keyword not found",
            count: String(0)
        }
    }
}