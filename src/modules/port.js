const DigiByte = require('./digibyte');
const { SHA256, EncryptAES256 } = require('./crypto');
const paths = require('./paths');

const { app, ipcMain } = require('electron');
const { dialog } = require('electron');
const fs = require('fs');
const path = require('path');

/*
 * KEY FILE MANAGEMENT
 */

ipcMain.on('get-key-files', async function (event) {
    var files = fs.readdirSync(paths.keys);
    var keys = files.filter(file => path.extname(file) === '.dgb');

    return event.reply('get-key-files', keys);
});

ipcMain.on('read-key-file', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');
    if (!fs.existsSync(fullPath))
        return event.reply('read-key-file', false);

    try {
        var data = fs.readFileSync(fullPath);
        var keys = JSON.parse(data);
    } catch (e) {
        return event.reply('read-key-file', false);
    }

    if (!keys.type)
        return event.reply('read-key-file', false);
    if (!keys.secret)
        return event.reply('read-key-file', false);
    if (!keys.integrity)
        return event.reply('read-key-file', false);

    var { integrity } = keys;
    delete keys.integrity;

    var check = SHA256(JSON.stringify(keys));
    keys.integrity = integrity === check;
    keys.compatibility = keys.version == app.getVersion();   
    keys.file = file;

    return event.reply('read-key-file', keys);
});

ipcMain.on('generate-key-file', async function (event, name, type, password) {
    var words = type == "24-words" ? 24 : type == "12-words" ? 12 : 0;

    if (words == 0)
        return event.reply('generate-key-file', "Invalid word type");

    var fullPath = path.join(paths.keys, name + ".dgb").replaceAll('\\', '/');
    if (fs.existsSync(fullPath))
        return event.reply('generate-key-file', "The file alrady exist. Please use a diferent name");

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
        return event.reply('generate-key-file', list);
    }

    return event.reply('generate-key-file', "There was an error, please try again");
});

ipcMain.on('export-key-file', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');

    var save = await dialog.showSaveDialog({
        title: 'Export Key File',
        defaultPath: file,
        buttonLabel: 'Export'
    });

    if (save.canceled == true)
        return event.reply('export-key-file', "Operation canceled");

    if (fs.existsSync(save.filePath) == true)
        return event.reply('export-key-file', "This file already exist");

    fs.copyFileSync(fullPath, save.filePath);
    if (!fs.existsSync(fullPath))
        return event.reply('export-key-file', "There was an error, please try again");

    return event.reply('export-key-file', true);
});

ipcMain.on('import-key-file', async function (event, file) {
    var selected = await dialog.showOpenDialog({
        title: 'Import Key File',
        buttonLabel: 'Import',
        filters: [{ name: 'DigiByte Keys', extensions: ['dgb'] }],
        properties: ['openFile']
    });

    if (selected.canceled == true || selected.filePaths.length != 1)
        return event.reply('import-key-file', "Operation canceled");

    var name = path.basename(selected.filePaths[0]);
    var finalPath = path.join(paths.keys, name).replaceAll('\\', '/');

    if (fs.existsSync(finalPath) == true)
        return event.reply('import-key-file', "This file already exist, please choose a diferent file");

    fs.copyFileSync(selected.filePaths[0], finalPath);
    if (!fs.existsSync(finalPath))
        return event.reply('import-key-file', "There was an error, please try again");

    return event.reply('import-key-file', true);
});

ipcMain.on('delete-key-file', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');
    fs.unlinkSync(fullPath);
    if (fs.existsSync(fullPath))
        return event.reply('delete-key-file', "There was an error, please try again");

    return event.reply('delete-key-file', true);
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

ipcMain.on('import-keys', async function (event, type, name, password, secret, passphrase) {
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

    return event.reply('import-keys', fs.existsSync(fullPath));
});

/*
 * WIF IMPORT
 */

ipcMain.on('check-wif', async function (event, WIF) {
    var valid = DigiByte.CheckWIF(WIF);

    return event.reply('check-wif', valid);
});