/**
 * Netlify Function entry point.
 *
 * This creates a standalone Express app for the serverless context.
 * Routes are mounted at "/" here (not "/api") because Netlify's redirect
 *
 *   from = "/api/*"  →  to = "/.netlify/functions/api/:splat"
 *
 * strips the "/api" prefix before the function receives the request.
 * The Express router therefore sees paths like "/products", "/cart", etc.
 */
import serverless from "serverless-http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./routes/index.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount at "/" — the /api prefix has already been stripped by Netlify's redirect
app.use("/", router);

export const handler = serverless(app);
