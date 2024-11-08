import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(bodyParser.json());

app.use((_, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

export default app;
