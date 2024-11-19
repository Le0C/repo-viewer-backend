import { D3ForceTree } from "../types";
import * as fs from "fs";

export const writeToFile = (treeJson: D3ForceTree, filePath: string) => {
  fs.writeFileSync(filePath, JSON.stringify(treeJson));
};
