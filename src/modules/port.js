const DigiByte = require('./digibyte');
const { SHA256, EncryptAES256 } = require('./crypto');
const paths = require('./paths');

const { ipcMain } = require('electron');
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
    var data = fs.readFileSync(path.join(paths.keys, file).replaceAll('\\', '/'));
    var wallet = JSON.parse(data);

    var { integrity } = wallet;
    delete wallet.integrity;

    var check = SHA256(JSON.stringify(wallet));
    wallet.integrity = integrity === check;

    wallet.file = path.basename(file);

    return event.reply('read-wallet', wallet);
});

ipcMain.on('create-wallet', async function (event, name, type, password) {
    var words = type == "24-words" ? 24 : type == "12-words" ? 12 : 0;

    if (words == 0)
        return event.reply('create-wallet', false);

    var mnemonic = DigiByte.GenerateSeed(words);

    var keys = {};
    keys.type = "seed";
    keys.secret = EncryptAES256(mnemonic.seed, password);

    var integrity = SHA256(JSON.stringify(keys));
    keys.integrity = integrity;

    var fullPath = path.join(paths.keys, name + ".dgb").replaceAll('\\', '/');
    fs.writeFileSync(fullPath, JSON.stringify(keys, null, 2));
    delete keys;

    if (fs.existsSync(fullPath))
        var { list } = mnemonic;
    else
        var list = null;

    delete mnemonic;

    return event.reply('create-wallet', list);
});

ipcMain.on('delete-wallet', async function (event, file) {
    var fullPath = path.join(paths.keys, file).replaceAll('\\', '/');
    fs.unlinkSync(fullPath);
    return event.reply('create-wallet', fs.existsSync(fullPath) === false);
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

ipcMain.on('import-wallet', async function (event, name, password, secret, passphrase) {
    var keys = {};

    if (passphrase !== false) {
        var mnemonic = DigiByte.GenerateSeed(secret, passphrase);
        keys.type = "seed";
        keys.secret = EncryptAES256(mnemonic.seed, password);
        delete secret;
        delete mnemonic;
    } else {
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