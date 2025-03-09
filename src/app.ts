import express from "express"
import AuthRoutes from "./routes/AuthRoute"
import morgan from "morgan"
import cookieParser from "cookie-parser"
import helmet from "helmet"
import compression from "compression"

const app = express()

app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use(express.json())

app.use("/auth", AuthRoutes)

export default app
