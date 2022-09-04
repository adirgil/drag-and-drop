const { ipcRenderer, contextBridge } = require("electron");

const init = {
  cwd: process.cwd(),
};

const api = {
  getFiles: (path) => ipcRenderer.invoke("get-files", path),
  copyItem: (source, distention) =>
    ipcRenderer.invoke("copy-item", source, distention),
  getImages: () => ipcRenderer.invoke("get-images"),
  openImagesWindow: (image) => ipcRenderer.send("open-image-window", image),
};

contextBridge.exposeInMainWorld("init", init);
contextBridge.exposeInMainWorld("api", api);
