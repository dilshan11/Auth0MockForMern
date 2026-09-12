import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { UnauthorizedError } from "express-oauth2-jwt-bearer";
import productsRouter from "./routes/products";
import { checkJwt } from "./middleware/auth";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use("/api/products", checkJwt, productsRouter);

app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (err instanceof UnauthorizedError) {
    return res.status(err.status).json({ message: "Invalid or missing token" });
  }
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
