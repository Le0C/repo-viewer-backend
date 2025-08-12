import { D3ForceTree } from "../types";
import { writeToFile } from "./file";
import { filterSourceFiles } from "./filter";
import { createTree, makeProject } from "./morph";

const treeWriteLocation =
  process.env.TREE_WRITE_LOCATION || "../data/tree.json";

const criteriaSplitter = (criteria: string | string[]): string[] => {
  if (typeof criteria === "string") {
    criteria = criteria.split(",");
  }
  return criteria;
};

export const getFileExclusions = (): string[] => {
  let fileExclusions = process.env.FILE_EXCLUSIONS || [".js", ".mjs", ".json"];
  return criteriaSplitter(fileExclusions);
};

export const getExclusionCriteria = (): string[] => {
  let exclusionCriteria = process.env.EXCLUSION_CRITERIA || [
    ".test.",
    ".spec.",
    "/mocks/",
    ".stories.",
    ".cy.",
    ".d.",
    ".storybook",
    "__mocks__",
  ];
  return criteriaSplitter(exclusionCriteria);
};

export const getImportExclusions = (): string[] => {
  let importExclusions = process.env.IMPORT_EXCLUSIONS || [
    "node_modules",
    "kea",
    "react",
  ];
  return criteriaSplitter(importExclusions);
};

export const processor = async (tsConfigPath: string): Promise<D3ForceTree> => {
  console.log(`------------------------------------`);
  console.log(`Starting new processing task with: ${tsConfigPath}`);

  const project = makeProject(tsConfigPath);
  let srcFiles = project.getSourceFiles();
  console.log(`Project created with ${srcFiles.length} files`);

  console.log(`Filtering source files...`);
  const fileExclusions = getFileExclusions();
  const exclusionCriteria = getExclusionCriteria();

  console.log(
    `Excluding ${fileExclusions.length} extensions & ${exclusionCriteria.length} criteria`
  );
  srcFiles = filterSourceFiles(fileExclusions, exclusionCriteria, srcFiles);
  console.log(`Filtered to ${srcFiles.length} files`);

  console.log(`Creating tree...`);
  const dataTree = createTree(srcFiles, getImportExclusions());
  console.log(
    `Tree created with ${dataTree.nodes.length} nodes & ${dataTree.links.length} links`
  );

  console.log(`Writing tree to file: ${treeWriteLocation}`);
  writeToFile(dataTree, treeWriteLocation);
  console.log(`Writing complete...`);
  console.log(`------------------------------------`);
  return dataTree;
};
