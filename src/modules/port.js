const DigiByte = require('./digibyte');
const { SHA256, EncryptAES256 } = require('./crypto');
const paths = require('./paths');

const { app, ipcMain } = require('electron');
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');

/*
 * WALLET MANAGEMENT
 */

ipcMain.on('get-wallets', async function (event) {
    var files = fs.readdirSync(paths.keys);
    var wallets = files.filter(file => path.extname(file) === '.dgb');

    return event.reply('get-wallets', wallets);
});

ipcMain.on('read-wallet', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');
    if (!fs.existsSync(fullPath))
        return event.reply('read-wallet', false);

    try {
        var data = fs.readFileSync(fullPath);
        var wallet = JSON.parse(data);
    } catch (e) {
        return event.reply('read-wallet', false);
    }

    if (!wallet.type)
        return event.reply('read-wallet', false);
    if (!wallet.secret)
        return event.reply('read-wallet', false);
    if (!wallet.integrity)
        return event.reply('read-wallet', false);

    var { integrity } = wallet;
    delete wallet.integrity;

    var check = SHA256(JSON.stringify(wallet));
    wallet.integrity = integrity === check;
    wallet.compatibility = wallet.version == app.getVersion();   
    wallet.file = file;

    return event.reply('read-wallet', wallet);
});

ipcMain.on('create-wallet', async function (event, name, type, password) {
    var words = type == "24-words" ? 24 : type == "12-words" ? 12 : 0;

    if (words == 0)
        return event.reply('create-wallet', "Invalid word type");

    var fullPath = path.join(paths.keys, name + ".dgb").replaceAll('\\', '/');
    if (fs.existsSync(fullPath))
        return event.reply('create-wallet', "The wallet alrady exist. Please use a diferent name");

    var mnemonic = DigiByte.GenerateSeed(words);

    var keys = {};
    keys.version = app.getVersion();
    keys.type = "seed";
    keys.secret = EncryptAES256(mnemonic.seed, password);

    var integrity = SHA256(JSON.stringify(keys));
    keys.integrity = integrity;

    fs.writeFileSync(fullPath, JSON.stringify(keys, null, 2));
    delete keys;

    if (fs.existsSync(fullPath)) {
        var { list } = mnemonic;
        delete mnemonic;
        return event.reply('create-wallet', list);
    }

    return event.reply('create-wallet', "There was an error, please try again");
});

ipcMain.on('export-wallet', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');

    var save = await dialog.showSaveDialog({
        title: 'Export Key File',
        defaultPath: file,
        buttonLabel: 'Export'
    });

    if (save.canceled == true)
        return event.reply('export-wallet', "Operation canceled");

    if (fs.existsSync(save.filePath) == true)
        return event.reply('export-wallet', "This file already exist");

    fs.copyFileSync(fullPath, save.filePath);
    if (!fs.existsSync(fullPath))
        return event.reply('export-wallet', "There was an error, please try again");

    return event.reply('export-wallet', true);
});

ipcMain.on('import-file', async function (event, file) {
    var selected = await dialog.showOpenDialog({
        title: 'Import Key File',
        buttonLabel: 'Import',
        filters: [{ name: 'DigiByte Keys', extensions: ['dgb'] }],
        properties: ['openFile']
    });

    if (selected.canceled == true || selected.filePaths.length != 1)
        return event.reply('import-file', "Operation canceled");

    var name = path.basename(selected.filePaths[0]);
    var finalPath = path.join(paths.keys, name).replaceAll('\\', '/');

    if (fs.existsSync(finalPath) == true)
        return event.reply('import-file', "This file already exist, please choose a diferent file");

    fs.copyFileSync(selected.filePaths[0], finalPath);
    if (!fs.existsSync(finalPath))
        return event.reply('import-file', "There was an error, please try again");

    return event.reply('import-file', true);
});

ipcMain.on('delete-wallet', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');
    fs.unlinkSync(fullPath);
    if (fs.existsSync(fullPath))
        return event.reply('delete-wallet', "There was an error, please try again");

    return event.reply('delete-wallet', true);
});

/*
 * MNEMONIC IMPORT
 */

ipcMain.on('guess-word', async function (event, guess) {
    var word = DigiByte.GetMnemonicWord(guess.toLowerCase());

    return event.reply('guess-word', word || "");
});

ipcMain.on('check-mnemonic', async function (event, mnemonic) {
    var valid = DigiByte.CheckMnemonic(mnemonic);

    return event.reply('check-mnemonic', valid);
});

ipcMain.on('import-wallet', async function (event, type, name, password, secret, passphrase) {
    var keys = {};
    keys.version = app.getVersion();

    if (type === "mnemonic") {
        var mnemonic = DigiByte.GenerateSeed(secret, passphrase);
        keys.type = "seed";
        keys.secret = EncryptAES256(mnemonic.seed, password);

        delete secret;
        delete mnemonic;
    } else if (type === "keys") {
        keys.type = "keys";
        keys.secret = EncryptAES256(secret, password);
        
        delete secret;
    }

    var integrity = SHA256(JSON.stringify(keys));
    keys.integrity = integrity;

    var fullPath = path.join(paths.keys, name + ".dgb").replaceAll('\\', '/');
    fs.writeFileSync(fullPath, JSON.stringify(keys, null, 2));
    delete keys;

    return event.reply('import-wallet', fs.existsSync(fullPath));
});

/*
 * WIF IMPORT
 */

ipcMain.on('check-wif', async function (event, WIF) {
    var valid = DigiByte.CheckWIF(WIF);

    return event.reply('check-wif', valid);
});