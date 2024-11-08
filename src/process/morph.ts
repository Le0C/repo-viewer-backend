import { Project, SourceFile, ts } from "ts-morph";
import { D3ForceTree, Link, Node } from "../types";

export const makeProject = (tsConfigPath: string): Project => {
  return new Project({
    tsConfigFilePath: tsConfigPath,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
};

export const createTree = (
  src: SourceFile[],
  importExclusions?: string[]
): D3ForceTree => {
  const nodes: Node[] = [];
  const links: Link[] = [];
  const processedFiles = new Set<string>(); // Track processed files
  const symbolNodes = new Map<string, string>(); // Store created symbol nodes to avoid duplication

  const addNode = (
    file: SourceFile,
    depth: number,
    isRoot: boolean = false,
    symbolName?: string
  ) => {
    let id = file.getBaseNameWithoutExtension() + "_" + depth;
    const filePath = file.getFilePath();
    if (symbolName) {
      id += "_" + symbolName; // Append symbol name for symbol nodes
    }

    if (symbolNodes.has(id)) {
      return id; // Return the existing node ID if symbol already exists
    }

    const node: Node = {
      id,
      name: symbolName || file.getBaseName(),
      depth,
      isRoot,
      filePath,
    };
    nodes.push(node);
    symbolNodes.set(id, id); // Store the symbol node ID
    return id;
  };

  const processFile = (file: SourceFile, depth: number, parentId?: string) => {
    const fileId = file.getFilePath(); // Use file path as a unique identifier

    // Skip file if already processed
    if (processedFiles.has(fileId)) {
      return;
    }

    // Mark this file as processed
    processedFiles.add(fileId);

    const nodeId = addNode(file, depth, !parentId); // mark root node if no parent
    if (parentId) {
      links.push({
        source: parentId,
        target: nodeId,
        sourceId: parentId,
        targetId: nodeId,
      });
    }

    const imports = file.getImportDeclarations();
    imports.forEach((importDeclaration) => {
      const moduleSpecifier = importDeclaration.getModuleSpecifierValue();
      if (importExclusions && importExclusions.includes(moduleSpecifier)) {
        return;
      }
      const importedFile = src.find((f) =>
        f.getFilePath().includes(moduleSpecifier)
      );
      if (importedFile) {
        // Process the imported file recursively
        processFile(importedFile, depth + 1, nodeId);

        // Handle symbol-level links for named imports
        const namedImports = importDeclaration.getNamedImports();
        namedImports.forEach((namedImport) => {
          const symbolName = namedImport.getName();

          // Add a node for the symbol in the imported file
          const symbolNodeId = addNode(
            importedFile,
            depth + 1,
            false,
            symbolName
          );

          // Create a link between the importing file and the imported symbol
          links.push({
            sourceId: nodeId, // Parent node (importing file)
            targetId: symbolNodeId, // Symbol in the imported file
            source: nodeId,
            target: symbolNodeId,
          });
        });
      }
    });
  };

  // Process all files, marking the root as "main.ts" if found
  src.forEach((file) => {
    const isRoot = file.getBaseName() === "main.ts";
    processFile(file, 0, isRoot ? undefined : undefined);
  });

  return { nodes, links };
};
