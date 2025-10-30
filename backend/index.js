import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import documents from "./Routes/documents.js";
import authenticate from "./Routes/authenticate.js";
import refreshRoute from "./Routes/refresh.js"; 

(async function () {
  dotenv.config();

  const {PORT} = process.env;
  const app = express();
  app.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store"); 
    next();
  });
  app.use(express.json());
  app.use(cookieParser());
  app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true,
  }));

  app.use("/refresh", refreshRoute); 
  app.use("/documents", authenticate, documents);
  const server = app.listen(PORT, () => 
    console.log(`Backend started on port ${PORT}`)
  );
})();
