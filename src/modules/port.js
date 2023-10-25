const DigiByte = require('./digibyte');
const { SHA256, EncryptAES256 } = require('./crypto');
const paths = require('./paths');

const { ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

ipcMain.on('get-wallets', async function (event) {
    var files = fs.readdirSync(paths.keys);
    var wallets = files.filter(file => path.extname(file) === '.dgb').map(file => path.join(paths.keys, file).replaceAll('\\', '/'));

    return event.reply('get-wallets', wallets);
});

ipcMain.on('read-wallet', async function (event, file) {
    var data = fs.readFileSync(file);
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

    var mnemonic = DigiByte.GenerateMnemonic(words);

    var keys = {};
    keys.name = name;
    keys.type = "seed";
    keys.secret = EncryptAES256(mnemonic.seed, password);

    var integrity = SHA256(JSON.stringify(keys));
    keys.integrity = integrity;

    fs.writeFileSync(paths.keys + "/" + name + ".dgb", JSON.stringify(keys, null, 2));
    delete keys;

    var { list } = mnemonic;
    delete mnemonic;

    return event.reply('create-wallet', list);
});