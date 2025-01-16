import express from 'express'
import { errorHandler } from './middleware/errorHandler.middleware.js'
import { userRouter } from './Routes/user.routes.js'
import cors from 'cors'

const app = express()
app.use(express.json({ limit: "16kb", }))

const corsOptions = {
    origin: ['*'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    credentials: true, // Allow cookies or credentials
};
app.use(cors(corsOptions))
app.get("/", (req, res) => {
    res.send("Hello From Santosh's Api")
})
app.use("/api/v1/user", userRouter)
app.use(errorHandler);


export { app }