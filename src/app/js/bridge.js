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

ipcRenderer.on('sync-price', async (event) => {
    var exchange = await GetPrice();
    topPrice.innerHTML = icon('cash-coin', 18) + " " + exchange.price + " USD";

    if (exchange.change > 0)
        topRate.innerHTML = icon('graph-up-arrow', 18) + " +" + exchange.change + " %";
    else if (exchange.change < 0)
        topRate.innerHTML = icon('graph-down-arrow', 18) + " " + exchange.change + " %";
    else
        topRate.innerHTML = icon('radar', 18) + " " + exchange.change + " %";
});
ipcRenderer.on('sync-account', async (event, id) => {
    if (lastForm == 'frmAccounts')
        frmAccounts_Load()
    else if (lastForm == 'frmAccount' && id == accountID)
        frmAccount_Load(id);
});
ipcRenderer.on('sync-percentage', async (event, percentage) => {
    if (percentage == 100) topSync.innerHTML = icon('arrow-repeat', 18, true);
    else topSync.innerHTML = percentage + " %";
});

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
function GenerateXPUB(key, password, type) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-xpub', key, password, type);
        ipcRenderer.once('generate-xpub', (event, response) => {
            resolve(response);
        });
    });
}
function GenerateAddresses(key, password, network) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('generate-addresses', key, password, network);
        ipcRenderer.once('generate-addresses', (event, response) => {
            resolve(response);
        });
    });
}
function NewXPUB(xpub, type) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('new-xpub', xpub, type);
        ipcRenderer.once('new-xpub', (event, response) => {
            resolve(response);
        });
    });
}
function NewAddress(address) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('new-address', address);
        ipcRenderer.once('new-address', (event, response) => {
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
    return new Promise((resolve, reject) => {
        ipcRenderer.send('check-password', id, password);
        ipcRenderer.once('check-password', (event, response) => {
            resolve(response);
        });
    });
}
function DeleteAccount(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('delete-account', id);
        ipcRenderer.once('delete-account', (event, response) => {
            resolve(response);
        });
    });
}

/*
 * ACCOUNT MANAGEMENT
 */

function GetAccountMempool(id) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('get-account-mempool', id);
        ipcRenderer.once('get-account-mempool', (event, response) => {
            resolve(response);
        });
    });
}
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
function CopyClipboard(text) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('copy-clipboard', text);
        ipcRenderer.once('copy-clipboard', (event, response) => {
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
function AddToMempool(id, txid) {
    return new Promise((resolve, reject) => {
        ipcRenderer.send('add-to-mempool', id, txid);
        ipcRenderer.once('add-to-mempool', (event, response) => {
            resolve(response);
        });
    });
}