import { PostController } from "../controllers/postController.js";
import { withLogger } from "../middleware/logger.js";

const post = new PostController()

export const postOperations = [
    {
        name: "GetPosts",
        input: {},
        output: { success: "string", count: "string", data: "string" }
    },
    {
        name: "GetPostById",
        input: { id: "string" },
        output: { success: "string", data: "string", message: "string" }
    },
    {
        name: "GetPostByUser",
        input: { userId: "string" },
        output: { success: "string", data: "string", count: "string", message: "string" }
    },
    {
        name: "SearchPost",
        input: { keyword: "string" },
        output: { success: "string", count: "string", data: "string", message: "string" }
    },
    {
        name: "CreatePost",
        input: { userId: "string", title: "string", body: "string" },
        output: { success: "string", message: "string", data: "string" }
    },
    {
        name: "UpdatePost",
        input: { id: "string", title: "string", body: "string" },
        output: { success: "string", message: "string" }

    }
]

export const postHandlers = {
    GetPosts: withLogger("GetPosts", (args) => post.getPosts(args)),
    GetPostById: withLogger("GetPostById", (args) => post.getPostById(args)),
    GetPostByUser: withLogger("GetPostByUser", (args) => post.getPostsByUserId(args)),
    SearchPost: withLogger("SearchPosts", (args) => post.searchPost(args)),
    CreatePost: withLogger("CreatePost", (args) => post.createPost(args)),
    UpdatePost: withLogger("UpdatePost", (args) => post.updatePost(args)),
    DeletePost: withLogger("DeletePost", (args) => post.delete(args))
}
