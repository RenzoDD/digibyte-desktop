const { app } = require('electron');
const user = app.getPath('userData');

const path = require('path');
const folder = path.join(user, 'logs');

const fs = require('fs');

console.logger = console.log;
console.log = function () {
    if (!fs.existsSync(folder))
        fs.mkdirSync(folder)

    var yourDate = new Date();
    var date = yourDate.toISOString().split('T')[0]
    var time = yourDate.toISOString().split('T')[1]

    var file = path.join(folder, date + ".log");

    var data = time + " | ";
    for (var arg of arguments) {
        if (typeof arg !== 'string')
            arg = JSON.stringify(arg);
        data += arg + " ";
    }
    data = data.substring(0, data.length - 1) + "\n";

    fs.appendFileSync(file, data);
    console.logger(...arguments);
}