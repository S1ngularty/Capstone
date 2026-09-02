import express from "express";
import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());

app.get("/ping", async (req, res): Promise<void> => {
  res.send("SIPAT server is alive!");
});

export default app;
