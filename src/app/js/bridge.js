const { ipcRenderer } = require('electron');

/*
 * KEY FILE MANAGEMENT
 */

function GetKeys() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-keys');
        ipcRenderer.once('get-keys', (event, response) => {
            resolve(response);
        });
    });
}

function ReadKey(name) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('read-key', name);
        ipcRenderer.once('read-key', (event, response) => {
            resolve(response);
        });
    });
}

function GenerateKey(name, type, password) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-key', name, type, password);
        ipcRenderer.once('generate-key', (event, response) => {
            resolve(response);
        });
    });
}

function ExportKeyFile(file) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('export-key-file', file);
        ipcRenderer.once('export-key-file', (event, response) => {
            resolve(response);
        });
    });
}

function ImportKeyFile() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('import-key-file');
        ipcRenderer.once('import-key-file', (event, response) => {
            resolve(response);
        });
    });
}

function DeleteKey(name) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('delete-key', name);
        ipcRenderer.once('delete-key', (event, response) => {
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

function ImportKeys(type, name, password, mnemonic, passphrase) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('import-keys', type, name, password, mnemonic, passphrase);
        ipcRenderer.once('import-keys', (event, response) => {
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