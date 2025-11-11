import { app, BrowserWindow, Menu } from "electron";

function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 700,
    maxWidth: 1200,
    maxHeight: 1000,
    minWidth: 350,
    minHeight: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
    },
  });
  mainWindow.loadFile("index.html");
  Menu.setApplicationMenu(null);
}

app.on("ready", () => {
  createWindow();
});

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
