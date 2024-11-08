import { SourceFile } from "ts-morph";

export const filterSourceFiles = (
  fileExcludes: string[],
  exclusionCriteria: string[],
  sourceFiles: SourceFile[]
): SourceFile[] => {
  return sourceFiles.filter((sourceFile) => {
    // exclude files based on extension
    if (fileExcludes.includes(sourceFile.getExtension())) {
      return false;
    }
    // exclude if the file name contains any of the exclusion criteria
    if (
      exclusionCriteria.some((criteria) =>
        sourceFile.getFilePath().includes(criteria)
      )
    ) {
      return false;
    }
    return true;
  });
};
