module.exports = {
    apps: [
        {
            name: "chess",
            script: "./app.js",
            instances: 3,
            exec_mode : "cluster",
            env: {
                "NODE_ENV": "development",
                "MONO_URI": process.env.MONGO_URI,
                "X_API_KEY": process.env.X_API_KEY,
                "PORT": process.env.PORT
            }
        }
    ]
}
