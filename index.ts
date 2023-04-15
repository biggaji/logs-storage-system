import * as dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

import express, { Request, Response, NextFunction } from "express";
import authRouter from "./routers/auth/auth.router";

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json);

app.use(authRouter);

const PORT = process.env.PORT! || 3000;

app.listen(PORT, () => {
  console.log('log storage API system running on port', PORT);
});