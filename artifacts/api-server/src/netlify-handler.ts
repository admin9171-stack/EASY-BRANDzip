/**
 * Netlify Function entry point.
 *
 * Wraps the Express router with serverless-http so it can run as a
 * Netlify Function. The netlify.toml redirect rule is:
 *
 *   from = "/api/*"  →  to = "/.netlify/functions/api/:splat"
 *
 * Netlify forwards the original request path to the function
 * (e.g. event.path = "/api/products"), so we strip the "/api"
 * prefix in a middleware before handing off to the router whose
 * handlers are registered without that prefix ("/products", "/cart", …).
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

// Normalize path: strip the /api prefix when Netlify forwards the full
// original URL path, and also handle the case where Netlify passes
// just the splat (no prefix). Either way the router sees /products, etc.
app.use((req, _res, next) => {
  if (req.url.startsWith("/api")) {
    req.url = req.url.slice(4) || "/";
  }
  next();
});

app.use("/", router);

export const handler = serverless(app);
