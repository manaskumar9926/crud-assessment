const corsConfig = {
    origin: process.env.CLIENT,
    credentials: true
}

console.log("Using CORS origin:", corsConfig.origin);

export default corsConfig