export const config = {
    port:process.env.PORT || 5000,
    namespace:process.env.NAMESPACE || "http://example.com/soapapp",
    dburl:process.env.DATABASE_URL || "DB is not configured"
}