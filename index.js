import "dotenv/config";
import express from "express";
import authRoutes from "./routes/authRoute.js";
import productRoutes from "./routes/productRoute.js";
import { requestLogger , timeStampLogger } from "./middlewares/logger.js";
import errorHandler from "./middlewares/errorHandler.js";
import cors from "cors"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is missing from .env");
}

const app = express();
const port = Number(process.argv[2]) || 4000;

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(timeStampLogger);

app.use("/auth", authRoutes);
app.use("/products", productRoutes);

app.use((req, res,next) => {
  const error = new Error(`Route ${req.originalUrl} not found`)
  error.statusCode = 404
  next(error)
});

app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
