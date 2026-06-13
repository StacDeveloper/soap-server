export function withLogger(operationName, handler) {
    return async function (args) {
        const start =  Date.now()
        console.log(`→ [${new Date().toISOString()}] ${operationName}`, args)
        try {
            const result = await handler(args)
            const ms = Date.now() - start
            console.log(`← [${operationName}] ${result.success === "true" ? "✅" : "❌"} ${ms}ms`)
            return result
        } catch (error) {
            const ms = Date.now() - start
            console.error(error)
            return { sucess: "false", message: error.message }
        }   
    }
}