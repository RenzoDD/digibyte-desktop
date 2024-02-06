const { ipcRenderer } = require('electron');

/*
 * SYNC
 */
function Sync() {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('sync');
        ipcRenderer.once('sync', (event, response) => {
            resolve(response);
        });
    });
}

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
 * ACCOUNTS MANAGEMENT
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
function CheckPassword(id, password) {
    console.log(id, password)
    return new Promise((resolve, reject) => {
        ipcRenderer.send('check-password', id, password);
        ipcRenderer.once('check-password', (event, response) => {
            resolve(response);
        });
    });
}

/*
 * ACCOUNT MANAGEMENT
 */

function GetAccountMovements(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-account-movements', id);
        ipcRenderer.once('get-account-movements', (event, response) => {
            resolve(response);
        });
    });
}
function GetAccountBalance(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-account-balance', id);
        ipcRenderer.once('get-account-balance', (event, response) => {
            resolve(response);
        });
    });
}
function GetPrice(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-price', id);
        ipcRenderer.once('get-price', (event, response) => {
            resolve(response);
        });
    });
}
function GenerateLastAddres(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-last-address', id);
        ipcRenderer.once('generate-last-address', (event, response) => {
            resolve(response);
        });
    });
}
function CopyAddressClipboard(text) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('copy-address-clipboard', text);
        ipcRenderer.once('copy-address-clipboard', (event, response) => {
            resolve(response);
        });
    });
}
function CheckAddress(address) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('check-address', address);
        ipcRenderer.once('check-address', (event, response) => {
            resolve(response);
        });
    });
}
function DGBtoSats(amount) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('dgb-to-sats', amount);
        ipcRenderer.once('dgb-to-sats', (event, response) => {
            resolve(response);
        });
    });
}
function CreateTransaction(id, password, options) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('create-tx', id, password, options);
        ipcRenderer.once('create-tx', (event, response) => {
            resolve(response);
        });
    });
}
function BroadcastTransaction(hex) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('broadcast-tx', hex);
        ipcRenderer.once('broadcast-tx', (event, response) => {
            resolve(response);
        });
    });
}