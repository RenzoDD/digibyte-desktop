const { ipcRenderer } = require('electron');

function GetWallets() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-wallets');
        ipcRenderer.once('get-wallets', (event, response) => {
            resolve(response);
        });
    });
}

function ReadWallet(path) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('read-wallet', path);
        ipcRenderer.once('read-wallet', (event, response) => {
            resolve(response);
        });
    });
}