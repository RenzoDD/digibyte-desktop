const DigiByte = require('./digibyte');
const { SHA256, EncryptAES256, DecryptAES256 } = require('./crypto');

const storage = require('./storage');
const StartSyncInterval = require('./sync');

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
ipcMain.on('read-key', async function (event, id) {
    var key = await storage.GetKey(id);
    return event.reply('read-key', key);
});
ipcMain.on('generate-key', async function (event, name, type, password) {
    var words = { "24-words": 24, "12-words": 12 }[type] || 0;

    if (words == 0)
        return event.reply('generate-key', "Invalid word type");

    var mnemonic = DigiByte.GenerateSeed(words);

    var keys = {};
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
        return event.reply('generate-key', list);
    }

    return event.reply('generate-key', result);
});
ipcMain.on('export-key-file', async function (event, id) {
    var keys = await storage.GetKey(id);
    if (keys === null)
        return event.reply('export-key-file', "This keys doesn't exist");

    var save = await dialog.showSaveDialog({
        title: 'Export Key File',
        defaultPath: keys.name,
        buttonLabel: 'Export'
    });

    if (save.canceled == true)
        return event.reply('export-key-file', "Operation canceled");

    if (fs.existsSync(save.filePath) == true)
        return event.reply('export-key-file', "This file already exist");


    if (!save.filePath.endsWith('.dgb'))
        save.filePath += ".dgb";

    fs.writeFileSync(save.filePath, JSON.stringify(keys, null, 2));
    if (!fs.existsSync(save.filePath))
        return event.reply('export-key-file', "There was an error, please try again");

    return event.reply('export-key-file', true);
});
ipcMain.on('import-key-file', async function (event) {
    var selected = await dialog.showOpenDialog({
        title: 'Import Key File',
        buttonLabel: 'Import',
        filters: [{ name: 'DigiByte Keys', extensions: ['dgb'] }],
        properties: ['openFile']
    });

    if (selected.canceled == true || selected.filePaths.length != 1)
        return event.reply('import-key-file', "Operation canceled");

    try {
        var key = fs.readFileSync(selected.filePaths[0]);
        var id = key.id;
        key.id = "";

        var integrity = SHA256(JSON.stringify(key));

        if (integrity !== id)
            return event.reply('import-key-file', "The integrity check failed");
    } catch (e) {
        return event.reply('import-key-file', "The file is corrupted");
    }

    var result = await storage.AddKey(key.id, key)
    return event.reply('import-key-file', result);
});
ipcMain.on('delete-key', async function (event, id) {
    var result = await storage.DeleteKey(id);
    return event.reply('delete-key', result);
});
ipcMain.on('guess-word', async function (event, guess) {
    var word = DigiByte.GetMnemonicWord(guess.toLowerCase());

    return event.reply('guess-word', word || "");
});
ipcMain.on('check-mnemonic', async function (event, mnemonic) {
    var valid = DigiByte.CheckMnemonic(mnemonic);

    return event.reply('check-mnemonic', valid);
});
ipcMain.on('import-keys', async function (event, type, name, password, secret, passphrase) {
    var keys = {};
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
    }
    keys.id = SHA256(JSON.stringify(keys));

    var result = await storage.AddKey(keys.id, keys);
    delete keys;

    return event.reply('import-keys', result);
});
ipcMain.on('check-wif', async function (event, WIF) {
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
    var key = await storage.GetKey(key);

    var seed = DecryptAES256(key.secret, password);
    if (seed == null)
        return event.reply('generate-xpub', "Wrong password");

    var xpubs = DigiByte.GetXPUBs(seed, type);
    seed = "";

    return event.reply('generate-xpub', xpubs);
});
ipcMain.on('generate-addresses', async function (event, key, password, network) {
    var key = await storage.GetKey(key);

    var wifs = key.secret.map(wif => { return DecryptAES256(wif, password); });
    if (wifs.indexOf(x => x == null) != -1)
        return event.reply('generate-addresses', "Wrong password");

    var addresses = wifs.map(wif => { return DigiByte.WifToAddress(wif, network) });
    return event.reply('generate-addresses', addresses);
});
ipcMain.on('new-xpub', async function (event, xpub, type) {
    var data = await DigiByte.explorer.xpub(xpub, type, { details: 'basic' });
    if (data == null)
        var data = await DigiByte.explorer.xpub(xpub, type, { details: 'basic' });
    if (data == null)
        var data = await DigiByte.explorer.xpub(xpub, type, { details: 'basic' });

    if (data == null)
        var result = null;
    else if (data.txs > 0)
        var result = data.balance;
    else if (data.txs == 0)
        var result = true;

    return event.reply('new-xpub', result);
});

ipcMain.on('new-address', async function (event, address) {
    var data = await DigiByte.explorer.address(address, { details: 'basic' });
    if (data == null)
        var data = await DigiByte.explorer.xpub(address, { details: 'basic' });
    if (data == null)
        var data = await DigiByte.explorer.xpub(address, { details: 'basic' });

    if (data == null)
        var result = null;
    else if (data.txs > 0)
        var result = data.balance;
    else if (data.txs == 0)
        var result = true;

    return event.reply('new-address', result);
});
ipcMain.on('generate-account', async function (event, name, type, secret, public, purpose, nAccount) {
    var account = {};
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

    return event.reply('generate-account', result);
});
ipcMain.on('check-password', async function (event, id, password) {
    var account = await storage.GetAccount(id);
    var key = await storage.GetKey(account.secret);

    if (typeof key.secret != 'string')
        key.secret = key.secret[0];

    var result = DecryptAES256(key.secret, password);
    return event.reply('check-password', result != null);
});

/*
 * ACCOUNT MANAGEMENT
 */

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
ipcMain.on('copy-address-clipboard', async function (event, text) {
    clipboard.writeText(text);
    return event.reply('copy-address-clipboard', true);
});
ipcMain.on('check-address', async function (event, address) {
    var result = DigiByte.CheckAddress(address);
    return event.reply('check-address', result);
});
ipcMain.on('dgb-to-sats', async function (event, amount) {
    var result = DigiByte.DGBtoSats(amount);
    return event.reply('dgb-to-sats', result);
});
ipcMain.on('create-tx', async function (event, id, password, options) {
    var account = await storage.GetAccount(id);
    var balance = await storage.GetAccountBalance(id);
    var key = await storage.GetKey(account.secret);

    // Parse outputs
    for (var n in options.outputs) {
        var output = options.outputs[n]
        output.satoshis = DigiByte.DGBtoSats(output.amount);
        delete output.amount;

        if (isNaN(output.satoshis)) return event.reply('create-tx', { error: `Invalid satoshis on output ${n}` });
        if (output.satoshis < 0) return event.reply('create-tx', { error: `Negative satoshis on output ${n}` });
        if (output.satoshis < 600) return event.reply('create-tx', { error: `Dust satoshis on output ${n}` });
    }

    // Parse inputs
    options.inputs = Object.values(balance.DigiByteUTXO);

    var keys = {}
    if (account.type == 'derived') {
        var xprv = DecryptAES256(key.secret, password);
        for (var input of options.inputs)
            if (!keys[input.path])
                keys[input.path] = DigiByte.DeriveHDPrivateKey(xprv, input.path);
    } else if (account.type == 'mobile') {
        var xprv = DecryptAES256(key.secret, password);
        for (var input of options.inputs)
            if (!keys[input.path])
                keys[input.path] = DigiByte.DeriveHDPrivateKey(xprv, input.path, true);
    } else if (account.type == 'single') {
        for (var key of key.secret)
            keys[key] = DecryptAES256(key, password);
    }

    options.keys = Object.values(keys);

    if (!options.advanced.change) {
        if (account.type == 'derived' || account.type == 'mobile')
            options.advanced.change = DigiByte.DeriveOneHDPublicKey(account.xpub, account.network, account.address, 1, account.change);
        else if (account.type == 'single')
            options.advanced.change = account.addresses[0];
    }

    var result = DigiByte.SignTransaction(options);
    return event.reply('create-tx', result);
});
ipcMain.on('broadcast-tx', async function (event, hex) {
    for (var i = 0; i < 10; i++) {
        var result = await DigiByte.explorer.sendtx(hex);
        if (result != null) break;
    }
    if (result == null)
        result = { error: "Broadcast error" };
    return event.reply('broadcast-tx', result);
});