import { D3ForceTree } from "../types";
import * as fs from "fs";

export const writeToFile = (treeJson: D3ForceTree, filePath: string) => {
  fs.writeFileSync(filePath, JSON.stringify(treeJson));
};

export const treeFromData = (filePath: string): D3ForceTree => {
  const fileRead = fs.readFileSync(filePath, "utf8");
  console.log(`Read from ${filePath}, string length = ${fileRead.length}`);
  const dataTree = JSON.parse(fileRead);
  console.log(
    `Parsed tree with ${dataTree.nodes.length} nodes & ${dataTree.links.length} links`
  );
  return dataTree;
};
