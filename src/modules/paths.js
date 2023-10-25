const fs = require('fs');
const path = require('path');

const { app } = require('electron');

var user = app.getPath('userData');
let paths = {
    user,
    keys: path.join(user, '/keys'),
    accounts: path.join(user, '/accounts'),
};

if (!fs.existsSync(paths.keys))
    fs.mkdirSync(paths.keys);
if (!fs.existsSync(paths.accounts))
    fs.mkdirSync(paths.accounts);

module.exports = paths;