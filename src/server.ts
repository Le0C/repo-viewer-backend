import app from "./app";
import { Request, Response } from "express";
import { RequestBody } from "./types";
import { processor } from "./process";

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.post("/", async (req: Request, res: Response): Promise<void> => {
  const body: RequestBody = req.body;
  const filePath = body.filePath;
  const dataTree = await processor(filePath);
  res.send(dataTree);
});
