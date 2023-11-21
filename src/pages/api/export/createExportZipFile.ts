import fs from "fs";
import JSZip from "jszip";

function addFileToTarget(target: JSZip, parentPath: string, fileName: string) {
  const fileData = fs.readFileSync(`${parentPath}/${fileName}`);
  target.file(fileName, fileData);
}

function addDirectoryWithFilesToTarget(
  target: JSZip,
  parentPath: string,
  directory: string
) {
  const dir = target.folder(directory);
  const dirPath = `${parentPath}/${directory}`;
  const dirContent = fs.readdirSync(dirPath);
  const dirFiles = dirContent.filter(el => el.includes("."));
  const dirDirectories = dirContent.filter(el => !el.includes("."));

  if (dir) {
    for (const file of dirFiles) {
      addFileToTarget(dir, dirPath, file);
    }
    for (const dirDirectory of dirDirectories) {
      addDirectoryWithFilesToTarget(dir, dirPath, dirDirectory);
    }
  }
}

export default async function createExportZipFile(path: string) {
  const zip = new JSZip();

  const agentConent = fs.readdirSync(path).filter(el => !el.includes(".zip"));
  const files = agentConent.filter(el => el.includes("."));
  const directories = agentConent.filter(el => !el.includes("."));

  for (const file of files) {
    addFileToTarget(zip, path, file);
  }

  for (const directory of directories) {
    addDirectoryWithFilesToTarget(zip, path, directory);
  }

  await zip.generateAsync({ type: "nodebuffer" }).then(function (content) {
    fs.writeFileSync(`${path}/export.zip`, content);
  });
  return `${path}/export.zip`;
}
