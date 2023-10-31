const { ipcRenderer } = require('electron');

/*
 * WALLET MANAGEMENT
 */

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

function CreateWallet(name, type, password) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('create-wallet', name, type, password);
        ipcRenderer.once('create-wallet', (event, response) => {
            resolve(response);
        });
    });
}

function DeleteWallet(file) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('delete-wallet', file);
        ipcRenderer.once('delete-wallet', (event, response) => {
            resolve(response);
        });
    });
}

/*
 * MNEMONIC IMPORT
 */

function GuessMnemonicWord(guess) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('guess-word', guess);
        ipcRenderer.once('guess-word', (event, response) => {
            resolve(response);
        });
    });
}
function CheckMnemonic(mnemonic) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('check-mnemonic', mnemonic);
        ipcRenderer.once('check-mnemonic', (event, response) => {
            resolve(response);
        });
    });
}

function ImportWallet(name, password, mnemonic, passphrase) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('import-wallet', name, password, mnemonic, passphrase);
        ipcRenderer.once('import-wallet', (event, response) => {
            resolve(response);
        });
    });
}

/*
 * WIF IMPORT
 */

function CheckWIF(WIF) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('check-wif', WIF);
        ipcRenderer.once('check-wif', (event, response) => {
            resolve(response);
        });
    });
}