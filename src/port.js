const fs = require('fs');
const path = require('path');
const { app, ipcMain } = require('electron');

let wallet = null;
let account = null;

var user = app.getPath('userData');
let paths = {
    user,
    wallets: path.join(user, '/wallets'),
    accounts: path.join(user, '/accounts'),
};
if (!fs.existsSync(paths.wallets))
    fs.mkdirSync(paths.wallets);
if (!fs.existsSync(paths.accounts))
    fs.mkdirSync(paths.accounts);

ipcMain.on('get-wallets', async function (event) {
    var files = fs.readdirSync(paths.wallets);
    var wallets = files.filter(file => path.extname(file) === '.dgb').map(file => path.join(paths.wallets, file).replaceAll('\\', '/'));

    event.reply('get-wallets', wallets);
});

ipcMain.on('read-wallet', async function (event, file) {
    var data = fs.readFileSync(file);
    var wallet = JSON.parse(data);
    wallet.file = path.basename(file);

    event.reply('read-wallet', wallet);
});