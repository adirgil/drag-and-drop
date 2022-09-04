const { ipcMain, BrowserWindow } = require("electron");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

ipcMain.handle("get-images", async (e) => {
  const numberOfImages = 10;
  const imagesArray = [];
  for (let i = 0; i < numberOfImages; i++) {
    // i*10 is becuase i want the pics to be different, just for nice view
    const singleCall = fetch(`https://picsum.photos/id/${i * 10}/info`).then(
      (res) => {
        return res.json();
      }
    );
    imagesArray.push(singleCall);
  }
  return await Promise.all(imagesArray);
});

ipcMain.on("open-image-window", (e, image) => {
  const { id, width, height } = image;
  const win = new BrowserWindow({ simpleFullscreen: true });
  win.loadURL(`https://picsum.photos/id/${id}/${width}/${height}`);
});
