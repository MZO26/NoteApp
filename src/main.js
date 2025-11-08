import { app, BrowserWindow, Menu } from "electron";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 700,
    maxWidth: 1200,
    maxHeight: 1000,
    minWidth: 350,
    minHeight: 700,
  });
  mainWindow.loadFile("index.html");
  Menu.setApplicationMenu(null);
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
