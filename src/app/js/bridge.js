const { ipcRenderer } = require('electron');

/*
 * KEY FILE MANAGEMENT
 */

function GetKeyFiles() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-key-files');
        ipcRenderer.once('get-key-files', (event, response) => {
            resolve(response);
        });
    });
}

function ReadKeyFile(path) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('read-key-file', path);
        ipcRenderer.once('read-key-file', (event, response) => {
            resolve(response);
        });
    });
}

function GenerateKeyFile(name, type, password) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-key-file', name, type, password);
        ipcRenderer.once('generate-key-file', (event, response) => {
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

function ImportKeyFile(file) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('import-key-file', file);
        ipcRenderer.once('import-key-file', (event, response) => {
            resolve(response);
        });
    });
}

function DeleteKeyFile(file) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('delete-key-file', file);
        ipcRenderer.once('delete-key-file', (event, response) => {
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