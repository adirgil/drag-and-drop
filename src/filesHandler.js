const { ipcMain } = require("electron");
const fs = require("fs-extra");
const path = require("path");

ipcMain.handle("get-files", (e, currentPath) => {
  const files = fs.readdirSync(currentPath);
  let orderedFiles = [];
  files.forEach((file) => {
    const isFile = fs.lstatSync(path.join(currentPath, file)).isFile();
    let obj = { fileName: file, type: isFile ? "file" : "folder" };
    orderedFiles.push(obj);
  });
  return orderedFiles;
});

ipcMain.handle("copy-item", (e, source, distention) => {
  try {
    const copyfileName = path.basename(source);
    fs.copySync(source, path.join(distention, copyfileName), {
      overwrite: false,
      errorOnExist: true,
    });
    return "success";
  } catch (error) {
    return error.message;
  }
});
