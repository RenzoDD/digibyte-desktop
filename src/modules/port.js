const DigiByte = require('./digibyte');
const { SHA256, EncryptAES256, DecryptAES256 } = require('./crypto');

const storage = require('./storage');

const { ipcMain } = require('electron');
const { dialog } = require('electron');

const fs = require('fs');
const path = require('path');

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
    keys.id = SHA256(Math.random().toString());
    keys.name = name;
    keys.type = "mnemonic";
    keys.words = words;
    keys.passphrase = false;
    keys.secret = EncryptAES256(mnemonic.seed, password);

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
        var object = JSON.parse(fs.readFileSync(selected.filePaths[0]));
    } catch (e) {
        return event.reply('import-key-file', "The file is corrupted");
    }

    var result = await storage.AddKey(object.id, object)
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
    keys.id = SHA256(Math.random().toString());
    keys.name = name;

    if (type === "mnemonic") {
        var mnemonic = DigiByte.GenerateSeed(secret, passphrase);
        keys.type = "mnemonic";
        keys.words = secret.split(" ").length;
        keys.passphrase = passphrase != "";
        console.log(passphrase)
        console.log(passphrase != "")
        keys.secret = EncryptAES256(mnemonic.seed, password);

        delete secret;
        delete mnemonic;
    } else if (type === "keys") {
        keys.type = "keys";
        keys.secret = secret.map(x => EncryptAES256(x, password));

        delete secret;
    }

    var result = await storage.AddKey(keys.id, keys);
    delete keys;

    return event.reply('import-keys', result);
});
ipcMain.on('check-wif', async function (event, WIF) {
    var valid = DigiByte.CheckWIF(WIF);

    return event.reply('check-wif', valid);
});

/*
 * ACCOUNT MANAGEMENT
 */

ipcMain.on('generate-xpub', async function (event, key, password, type) {
    var key = await storage.GetKey(key);
    try { var seed = DecryptAES256(key.secret, password); }
    catch { return event.reply('generate-xpub', "Wrong password"); }

    var xpubs = DigiByte.GetXPUBs(seed, type);
    seed = "";

    return event.reply('generate-xpub', xpubs);
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
ipcMain.on('generate-account', async function (event, name, type, secret, public, purpose, nAccount) {
    var account = {};
    account.id = SHA256(Math.random().toString());
    account.name = name;
    account.type = type;
    account.secret = secret;

    if (type == "derived") {
        account.xpub = public;
        account.chain = "main";
        account.purpose = { "legacy": 44, "compatibility": 49, "segwit": 84 }[purpose];
        account.account = nAccount;
        account.change = 0;
        account.external = 0;
    } else if (type == "mobile") {
        account.xpub = public;
        account.change = 0;
        account.external = 0;
    }

    console.log(account);
    var result = await storage.AddAccount(account.id, account);

    return event.reply('generate-account', result);
});