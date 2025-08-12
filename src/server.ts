import path from "path";
import app from "./app";
import express, { Request, Response } from "express";
import { Project, SyntaxKind, VariableDeclaration, Symbol } from "ts-morph";
import { RequestBody } from "./types";
import { getExclusionCriteria, getFileExclusions, processor } from "./process";

import {
  insertFile,
  insertSymbol,
  insertVariableDeclaration,
  closeDatabase,
} from "./db";
import { filterSourceFiles } from "./process/filter";

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

app.post("/process", (req: Request, res: Response) => {
  try {
    const { tsConfigPath } = req.body;

    // Validate the provided tsconfig path
    if (!tsConfigPath) {
      res.status(400).send({ error: "tsConfigPath is required" });
    }

    const project = new Project({
      tsConfigFilePath: path.resolve(tsConfigPath), // resolve the full path
    });

    // Get all source files in the project
    let sourceFiles = project.getSourceFiles();

    console.log(`Filtering source files...`);
    const fileExclusions = getFileExclusions();
    const exclusionCriteria = getExclusionCriteria();

    console.log(
      `Excluding ${fileExclusions.length} extensions & ${exclusionCriteria.length} criteria`
    );
    sourceFiles = filterSourceFiles(
      fileExclusions,
      exclusionCriteria,
      sourceFiles
    );
    console.log(`Filtered to ${sourceFiles.length} files`);

    const fileIds = new Map<string, number>(); // Map for storing file IDs
    const symbolIds = new Map<string, number>(); // Map for storing symbol IDs

    // Process each source file
    sourceFiles.forEach((sourceFile) => {
      const filePath = sourceFile.getFilePath();
      const baseName = path.basename(filePath);

      // Insert the file into the database
      const fileId = insertFile(filePath, baseName);
      fileIds.set(filePath, fileId);

      // Process the symbols and their declarations in the source file
      const variables = sourceFile.getDescendantsOfKind(
        SyntaxKind.VariableDeclaration
      );
      variables.forEach((variable) => {
        processVariableDeclaration(variable, fileId, symbolIds);
      });
    });

    console.log(`Processed ${sourceFiles.length} files`);

    res.status(200).send({ message: "Project processed successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: "An error occurred while processing the project" });
  }
});

// Function to process a variable declaration and insert it into the database
const processVariableDeclaration = (
  variable: VariableDeclaration,
  fileId: number,
  symbolIds: Map<string, number>
): void => {
  const symbol: Symbol = variable.getSymbol();
  if (!symbol) return;
  const symbolName = symbol.getName();
  const symbolOrigin = symbol
    .getDeclarations()[0]
    .getSourceFile()
    .getFilePath();

  // Insert the symbol if it hasn't been inserted already
  if (!symbolIds.has(symbolName)) {
    const symbolId = insertSymbol(symbolName, symbolOrigin);
    symbolIds.set(symbolName, symbolId);
  }

  // Insert the variable declaration into the database
  const symbolId = symbolIds.get(symbolName)!; // Guaranteed to exist at this point
  const declarationText = variable.getText();
  const line = variable.getStartLineNumber();
  const column = variable.getStart();
  const declarationType = variable.getKindName();

  insertVariableDeclaration(
    symbolId,
    fileId,
    declarationText,
    line,
    column,
    declarationType
  );
};
process.on("SIGINT", () => {
  closeDatabase();
  process.exit(0);
});
