const DigiByte = require('./digibyte');
const Ledger = require('./ledger');
const { SHA256, EncryptAES256, DecryptAES256 } = require('./crypto');

const storage = require('./storage');
const { GetAddresses, TxToMovement, StartSyncInterval } = require('./sync');

const { ipcMain } = require('electron');
const { dialog } = require('electron');
const { clipboard } = require('electron');

const fs = require('fs');
const path = require('path');

/*
 * SYNC
 */

ipcMain.on('sync', async function (event) {
    StartSyncInterval();
    return event.reply('sync', true);
});

/*
 * KEY MANAGEMENT
 */

ipcMain.on('get-keys', async function (event) {
    var keys = await storage.GetKeys();
    return event.reply('get-keys', keys);
});
ipcMain.on('get-key', async function (event, id) {
    var key = await storage.GetKey(id);
    return event.reply('get-key', key);
});
ipcMain.on('generate-key', async function (event, name, type, password) {
    console.log("generate-key", "STARTED");
    var words = { "24-words": 24, "12-words": 12 }[type] || 0;

    if (words == 0) {
        console.log("generate-key", "ERROR", "incorrect word number");
        return event.reply('generate-key', "Invalid word type");
    }

    var mnemonic = DigiByte.GenerateSeed(words);

    var keys = {};
    keys.file = "key";
    keys.id = "";
    keys.name = name;
    keys.type = "mnemonic";
    keys.words = words;
    keys.passphrase = false;
    keys.secret = EncryptAES256(mnemonic.seed, password);

    keys.id = SHA256(JSON.stringify(keys));

    var result = await storage.AddKey(keys.id, keys);

    if (result === true) {
        var { list } = mnemonic;
        delete mnemonic;
        console.log("generate-key", "SUCCESS", "generated mnemonic key");
        return event.reply('generate-key', list);
    }

    console.log("generate-key", "ERROR", result);
    return event.reply('generate-key', result);
});
ipcMain.on('export-key-file', async function (event, id) {
    console.log("export-key-file", "STARTED");
    var keys = await storage.GetKey(id);
    if (keys === null) {
        console.log("export-key-file", "ERROR", "key not found");
        return event.reply('export-key-file', "This keys doesn't exist");
    }

    var save = await dialog.showSaveDialog({
        title: 'Export Key File',
        defaultPath: keys.name,
        buttonLabel: 'Export'
    });

    if (save.canceled == true) {
        console.log("export-key-file", "ERROR", "canceled");
        return event.reply('export-key-file', "Operation canceled");
    }

    if (fs.existsSync(save.filePath) == true) {
        console.log("export-key-file", "ERROR", "canceled");
        return event.reply('export-key-file', "This file already exist");
    }

    if (!save.filePath.endsWith('.dgb'))
        save.filePath += ".dgb";

    var original = JSON.stringify(keys, null, 2);
    fs.writeFileSync(save.filePath, original);

    if (!fs.existsSync(save.filePath)) {
        console.log("export-key-file", "ERROR", "file not saved");
        return event.reply('export-key-file', "The file wasn't saved, please try again");
    }

    var content = fs.readFileSync(save.filePath);

    if (original != content.toString()) {
        console.log("export-key-file", "ERROR", "file content mismatch");
        return event.reply('export-key-file', "There was an error while saving, please try again");
    }

    console.log("export-key-file", "FINISHED", "file created");
    return event.reply('export-key-file', true);
});
ipcMain.on('import-key-file', async function (event) {
    console.log("import-key-file", "STARTED");
    var selected = await dialog.showOpenDialog({
        title: 'Import Key File',
        buttonLabel: 'Import',
        filters: [{ name: 'DigiByte Keys', extensions: ['dgb'] }],
        properties: ['openFile']
    });

    if (selected.canceled == true || selected.filePaths.length != 1) {
        console.log("import-key-file", "ERROR", "canceled");
        return event.reply('import-key-file', "Operation canceled");
    }

    try {
        var key = JSON.parse(fs.readFileSync(selected.filePaths[0]));

        var id = key.id;
        key.id = "";

        var integrity = SHA256(JSON.stringify(key));
        if (integrity !== id) {
            console.log("import-key-file", "ERROR", "checksum mismatch");
            return event.reply('import-key-file', "The integrity check failed");
        }

        key.id = id;
    } catch {
        console.log("import-key-file", "ERROR", "corrupted");
        return event.reply('import-key-file', "The file is corrupted");
    }

    var result = await storage.AddKey(key.id, key)
    console.log("import-key-file", "FINISHED", result);
    return event.reply('import-key-file', result);
});
ipcMain.on('delete-key', async function (event, id) {
    console.log("delete-key", "STARTED");
    var result = await storage.DeleteKey(id);
    console.log("delete-key", "FINISHED", result);
    return event.reply('delete-key', result);
});
ipcMain.on('guess-word', async function (event, guess) {
    console.log("guess-word", "CALLED");
    var word = DigiByte.GetMnemonicWord(guess.toLowerCase());
    return event.reply('guess-word', word || "");
});
ipcMain.on('check-mnemonic', async function (event, mnemonic) {
    console.log("check-mnemonic", "STARTED");
    var valid = DigiByte.CheckMnemonic(mnemonic);
    console.log("check-mnemonic", "FINISHED", valid);
    return event.reply('check-mnemonic', valid);
});
ipcMain.on('import-keys', async function (event, type, name, password, secret, passphrase) {
    console.log("import-keys", "STARTED");
    var keys = {};
    keys.file = "key";
    keys.id = "";
    keys.name = name;

    if (type === "mnemonic") {
        var mnemonic = DigiByte.GenerateSeed(secret, passphrase);
        keys.type = "mnemonic";
        keys.words = secret.split(" ").length;
        keys.passphrase = passphrase != "";
        keys.secret = EncryptAES256(mnemonic.seed, password);

        delete secret;
        delete mnemonic;
    } else if (type === "keys") {
        keys.type = "keys";
        keys.secret = secret.map(x => EncryptAES256(x, password));

        delete secret;
    } else if (type === "ledger") {
        keys.type = "ledger";
    }
    keys.id = SHA256(JSON.stringify(keys));

    var result = await storage.AddKey(keys.id, keys);
    delete keys;

    console.log("import-keys", "FINISHED", result);
    return event.reply('import-keys', result);
});
ipcMain.on('check-wif', async function (event, WIF) {
    console.log("check-wif", "CALLED");
    var valid = DigiByte.CheckWIF(WIF);
    return event.reply('check-wif', valid);
});

/*
 * ACCOUNTS MANAGEMENT
 */

ipcMain.on('get-accounts', async function (event) {
    var accounts = await storage.GetAccounts();
    return event.reply('get-accounts', accounts);
});
ipcMain.on('get-account', async function (event, id) {
    var account = await storage.GetAccount(id);
    return event.reply('get-account', account);
});
ipcMain.on('generate-xpub', async function (event, key, password, type) {
    console.log("generate-xpub", "STARTED");
    var key = await storage.GetKey(key);

    if (key.type == 'ledger') {
        var xpubs = await Ledger.GetXPUBs(10, type);
    } else {
        var seed = DecryptAES256(key.secret, password);
        if (seed == null) {
            console.log("generate-xpub", "ERROR", "bad password");
            return event.reply('generate-xpub', "Wrong password");
        }

        var xpubs = DigiByte.GetXPUBs(seed, type);
        seed = "";
    }

    console.log("generate-xpub", "FINISHED", "xpubs:" + xpubs.length);
    return event.reply('generate-xpub', xpubs);
});
ipcMain.on('generate-addresses', async function (event, key, password, network) {
    console.log("generate-addresses", "STARTED");
    var key = await storage.GetKey(key);

    var wifs = key.secret.map(wif => { return DecryptAES256(wif, password); });
    if (wifs.indexOf(x => x == null) != -1) {
        console.log("generate-addresses", "ERROR", "bad password");
        return event.reply('generate-addresses', "Wrong password");
    }

    var addresses = wifs.map(wif => { return DigiByte.WifToAddress(wif, network) });
    console.log("generate-addresses", "FINISHED", "addr:" + addresses.length);
    return event.reply('generate-addresses', addresses);
});
ipcMain.on('new-xpub', async function (event, xpub, type) {
    console.log("new-xpub", "STARTED");
    DigiByte.explorer.retry = 3;
    var data = await DigiByte.explorer.xpub(xpub, type, { details: 'basic' });

    if (data.error)
        var result = null;
    else if (data.txs > 0)
        var result = data.balance;
    else if (data.txs == 0)
        var result = true;

    console.log("new-xpub", "FINISHED", result);
    return event.reply('new-xpub', result);
});

ipcMain.on('new-address', async function (event, address) {
    console.log("new-address", "STARTED");
    DigiByte.explorer.retry = 3;
    var data = await DigiByte.explorer.address(address, { details: 'basic' });

    if (data.error)
        var result = null;
    else if (data.txs > 0)
        var result = data.balance;
    else if (data.txs == 0)
        var result = true;

    console.log("new-address", "FINISHED", result);
    return event.reply('new-address', result);
});
ipcMain.on('generate-account', async function (event, name, type, secret, public, purpose, nAccount) {
    console.log("generate-account", "STARTED");
    var account = {};
    account.file = "account";
    account.id = SHA256(Math.random().toString());
    account.name = name;
    account.type = type;
    account.network = "livenet";
    account.secret = secret;

    if (type == "derived") {
        account.xpub = public;
        account.purpose = { "legacy": 44, "script": 49, "segwit": 84 }[purpose];
        account.address = purpose;
        account.path = `m/${account.purpose}'/20'/${nAccount}'`;
        account.account = nAccount;
        account.change = 0;
        account.external = 0;
    } else if (type == "mobile") {
        account.network = "livenet";
        account.xpub = public;
        account.address = "legacy";
        account.path = "m/0'";
        account.change = 0;
        account.external = 0;
    } else if (type == "single") {
        account.addresses = public;
    }

    var result = await storage.AddAccount(account.id, account);

    console.log("generate-account", "FINISHED", result);
    return event.reply('generate-account', result);
});
ipcMain.on('check-password', async function (event, id, password) {
    console.log("check-password", "STARTED");
    var account = await storage.GetAccount(id);
    var key = await storage.GetKey(account !== null ? account.secret : id);

    if (typeof key.secret != 'string')
        key.secret = key.secret[0];

    var result = DecryptAES256(key.secret, password) != null;
    console.log("check-password", "FINISHED", result);
    return event.reply('check-password', result);
});
ipcMain.on('delete-account', async function (event, id, password) {
    console.log("delete-account", "STARTED");
    var result = await storage.DeleteAccount(id);
    console.log("delete-account", "FINISHED", result);
    return event.reply('delete-account', result);
});

/*
 * ACCOUNT MANAGEMENT
 */

ipcMain.on('get-account-mempool', async function (event, id) {
    var data = await storage.GetAccountMempool(id);
    return event.reply('get-account-mempool', data);
});
ipcMain.on('get-account-movements', async function (event, id) {
    var data = await storage.GetAccountMovements(id);
    return event.reply('get-account-movements', data);
});
ipcMain.on('get-account-balance', async function (event, id) {
    var data = await storage.GetAccountBalance(id);
    return event.reply('get-account-balance', data);
});
ipcMain.on('get-price', async function (event, id) {
    var data = await storage.GetPrice();
    return event.reply('get-price', data);
});
ipcMain.on('generate-last-address', async function (event, id) {
    console.log("generate-last-address", "CALLED");
    var account = await storage.GetAccount(id);
    if (account.type == 'derived' || account.type == 'mobile')
        var address = DigiByte.DeriveOneHDPublicKey(account.xpub, account.network, account.address, 0, account.external);
    else if (account.type == 'single') {
        var address = account.addresses.shift();
        account.addresses.push(address);
        await storage.UpdateAccount(account);
    }

    return event.reply('generate-last-address', address);
});
ipcMain.on('copy-clipboard', async function (event, text) {
    clipboard.writeText(text);
    return event.reply('copy-clipboard', true);
});
ipcMain.on('check-address', async function (event, address) {
    console.log("check-address", "CALLED");
    var result = DigiByte.CheckAddress(address);
    return event.reply('check-address', result);
});
ipcMain.on('domain-to-address', async function (event, domain) {
    console.log("domain-to-address", "CALLED");
    var result = await DigiByte.DomainToAddress(domain);
    console.log(domain, result);
    return event.reply('domain-to-address', result);
});
ipcMain.on('dgb-to-sats', async function (event, amount) {
    var result = DigiByte.DGBtoSats(amount);
    return event.reply('dgb-to-sats', result);
});
ipcMain.on('create-tx', async function (event, options, id, password) {
    console.log("create-tx", "STARTED");
    var balance = await storage.GetAccountBalance(id);

    // Parse outputs
    for (var n in options.outputs) {
        var output = options.outputs[n]
        output.satoshis = DigiByte.DGBtoSats(output.amount);
        delete output.amount;

        console.log("create-tx", "ONGOING", "output:" + n, "sats:" + output.satoshis);
        if (isNaN(output.satoshis)) return event.reply('create-tx', { error: `Invalid satoshis on output ${n}` });
        if (output.satoshis < 0) return event.reply('create-tx', { error: `Negative satoshis on output ${n}` });
        if (output.satoshis < 600) return event.reply('create-tx', { error: `Dust satoshis on output ${n}` });
    }

    var outSats = 0;
    options.outputs.forEach(utxo => outSats += utxo.satoshis);
    var chargedRecipient = options.outputs.find(x => x.fee);
    console.log("create-tx", "ONGOING", "chargedrecipient:" + chargedRecipient ? true : false);

    // Parse inputs
    var inputs = Object.values(balance.DigiByteUTXO);
    options.inputs = [];

    if (options.advanced.coinControl == 'max-save') {
        options.inputs = inputs;
        inputs = [];
    } else if (options.advanced.coinControl == 'short-save') { // Less fees on short term
        inputs.sort((a, b) => a.height - b.height);
        inputs.sort((a, b) => b.satoshis - a.satoshis);
    } else if (options.advanced.coinControl == 'long-save') { // Less fees on long term
        inputs.sort((a, b) => a.height - b.height);
        inputs.sort((a, b) => a.satoshis - b.satoshis);
    } else if (options.advanced.coinControl == 'privacy') { // More privacy
        inputs.sort((a, b) => a.satoshis - b.satoshis);
        inputs.sort((a, b) => a.script.localeCompare(b.script));
    }

    do {
        if (inputs.length == 0) break;
        options.inputs.push(inputs.shift());

        var inSats = 0;
        options.inputs.forEach(utxo => inSats += utxo.satoshis);

        options.fee = DigiByte.CalculateTxFee(options);
        var outWithFee = outSats + (chargedRecipient ? 0 : options.fee);
    } while (inSats < outWithFee);
    console.log("create-tx", "ONGOING", "fee:" + options.fee);

    if (options.advanced.coinControl == 'privacy') {
        var last = options.inputs[options.inputs.length - 1].script;

        while (inputs.length != 0) {
            if (inputs[0].script == last)
                options.inputs.push(inputs.shift());
            else break;
        }
    }
    console.log("create-tx", "ONGOING", "inputs:" + options.inputs.length);

    if (chargedRecipient) {
        chargedRecipient.satoshis -= options.fee;
        if (chargedRecipient.satoshis < 600) {
            console.log("create-tx", "ONGOING", "charged recipient cant handle fee");
            return event.reply('create-tx', { error: 'Insuficient output balance to substract fee' });
        }
    }
    
    var account = await storage.GetAccount(id);
    var key = await storage.GetKey(account.secret);

    if (!options.advanced.change) {
        if (account.type == 'derived' || account.type == 'mobile') {
            options.advanced.change = {
                address: DigiByte.DeriveOneHDPublicKey(account.xpub, account.network, account.address, 1, account.change),
                path: account.path + `/1/${account.change}`
            }
        } else if (account.type == 'single')
            options.advanced.change = account.addresses[0];
    }

    if (password) {
        var paths = {};
        options.inputs.forEach(utxo => paths[utxo.path] = true);
        paths = Object.keys(paths);

        if (account.type == 'derived') {
            var xprv = DecryptAES256(key.secret, password);
            var keys = paths.map(path => DigiByte.DeriveHDPrivateKey(xprv, path));
        } else if (account.type == 'mobile') {
            var xprv = DecryptAES256(key.secret, password);
            var keys = paths.map(path => DigiByte.DeriveHDPrivateKey(xprv, path));
        } else if (account.type == 'single') {
            var keys = key.secret.map(key => DecryptAES256(key, password))
        }
        var options = DigiByte.BuildTransaction(options, keys);
        console.log("create-tx", "ONGOING", "keys:" + keys.length);
    } else {
        for (var utxo of options.inputs) {
            var tx = await storage.GetTransaction(utxo.txid);
            utxo.tx = tx.hex;
        }
        var options = DigiByte.BuildTransaction(options);
    }

    console.log("create-tx", "FINISHED");
    return event.reply('create-tx', options);
});
ipcMain.on('broadcast-tx', async function (event, hex) {
    console.log("broadcast-tx", "STARTED");
    DigiByte.explorer.retry = 10;
    var result = await DigiByte.explorer.sendtx(hex);
    console.log("broadcast-tx", "FINISHED", result);
    return event.reply('broadcast-tx', result);
});
ipcMain.on('add-to-mempool', async function (event, id, txid) {
    console.log("add-to-mempool", "STARTED");
    do { var result = await DigiByte.explorer.transaction(txid); }
    while (result.error);

    var account = await storage.GetAccount(id);
    var addresses = GetAddresses(account);
    var movement = TxToMovement(result, addresses)

    var mempool = await storage.GetAccountMempool(id);
    mempool.push(movement);
    await storage.SetAccountMempool(id, mempool);
    console.log("add-to-mempool", "FINISHED");
    return event.reply('add-to-mempool', true);
});

/*
 * LEDGER
 */

ipcMain.on('ledger-is-ready', async function (event) {
    console.log("ledger-is-ready", "CALLED");
    var result = await Ledger.IsReady();
    if (result == 'IN_MENU') await Ledger.OppenDigiByteApp();
    if (result == 'OTHER_APP') await Ledger.CloseApp();
    return event.reply('ledger-is-ready', result);
})
ipcMain.on('ledger-generate-address', async function (event, path, type) {
    console.log("ledger-generate-address", "STARTED");
    var address = await Ledger.GetAddress(path, type);
    console.log("ledger-generate-address", "FINISHED", address.error || "");
    return event.reply('ledger-generate-address', address);
})
ipcMain.on('ledger-sign-transaction', async function (event, options) {
    console.log("ledger-sign-transaction", "STARTED");
    var options = await Ledger.SignTransaction(options);
    console.log("ledger-sign-transaction", "FINISHED", options.error || "");
    return event.reply('ledger-sign-transaction', options);
})