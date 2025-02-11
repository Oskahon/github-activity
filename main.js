//@ts-check

const { app, BrowserWindow } = require('electron');
const path = require('path');

/** @type {any} */
const electronReload = require('electron-reload');

electronReload(__dirname, {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron')
});

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('index.html');
};

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});