const { ipcRenderer } = require('electron');

/*
 * KEY MANAGEMENT
 */

function GetKeys() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-keys');
        ipcRenderer.once('get-keys', (event, response) => {
            resolve(response);
        });
    });
}
function ReadKey(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('read-key', id);
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
function ExportKeyFile(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('export-key-file', id);
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
function DeleteKey(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('delete-key', id);
        ipcRenderer.once('delete-key', (event, response) => {
            resolve(response);
        });
    });
}
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
function CheckWIF(WIF) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('check-wif', WIF);
        ipcRenderer.once('check-wif', (event, response) => {
            resolve(response);
        });
    });
}

/*
 * ACCOUNT MANAGEMENT
 */

function GetAccounts() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-accounts');
        ipcRenderer.once('get-accounts', (event, response) => {
            resolve(response);
        });
    });
}
function GetAccount(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-account', id);
        ipcRenderer.once('get-account', (event, response) => {
            resolve(response);
        });
    });
}
function GeneateXPUB(key, password, type) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-xpub', key, password, type);
        ipcRenderer.once('generate-xpub', (event, response) => {
            resolve(response);
        });
    });
}
function NewXPUB(xpub) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('new-xpub', xpub);
        ipcRenderer.once('new-xpub', (event, response) => {
            resolve(response);
        });
    });
}
function GenerateAccount(name, type, secret, public, purpose, nAccount) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-account', name, type, secret, public, purpose, nAccount);
        ipcRenderer.once('generate-account', (event, response) => {
            resolve(response);
        });
    });
}
function GetAccountData(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-account-data', id);
        ipcRenderer.once('get-account-data', (event, response) => {
            resolve(response);
        });
    });
}