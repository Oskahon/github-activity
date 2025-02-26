//@ts-check

const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

/** @type {any} */
const electronReload = require('electron-reload');
const { getActivity, mapActivity } = require('./events');

// Reloads the app when files are updated
electronReload(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

// Creates the app window and opens index.html
const createWindow = () => {
    const win = new BrowserWindow({
        width: 700,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            sandbox: false,
        }
    });

    win.loadFile('index.html');

    // const content = win.webContents;
    // console.log(content);
};

// Waits until the app is loaded before creating the window
app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

// closes the app when all windows are closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

// Listen for requests from the render process
ipcMain.handle('get-activity', async (event, username) => {
    return await getActivity(username);
});

ipcMain.handle('map-activity', (event, activity) => {
    return mapActivity(activity);
});