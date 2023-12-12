const { app } = require('electron');
var user = app.getPath('userData');

const path = require('path');

const { Level } = require('level');
const db = new Level(path.join(user, '/storage'), { valueEncoding: 'json' });

async function Get(key) {
    try {
        var value = await db.get(key);
        return value;
    } catch (e) {
        return null;
    }
}
async function Set(key, value) {
    await db.put(key, value);
}
async function Del(key) {
    await db.del(key);
}

(async function () {
    if (await Get("keys") === null)
        await Set("keys", []);
    if (await Get("accounts") === null)
        await Set("accounts", []);
})()

const storage = {};

storage.GetKeys = async function () {
    return await Get("keys");
}
storage.GetKey = async function (id) {
    return await Get(id + "@keys");
}
storage.AddKey = async function (id, object) {
    var keys = await Get("keys");
    if (keys.find(x => x == id))
        return "The key already exist";

    await Set(id + "@keys", object);
    if (await Get(id + "@keys") === null)
        return "There was a storage error";

    keys.push(id);
    await Set("keys", keys);
    return true;
}
storage.DeleteKey = async function (id) {
    if (await Get(id + "@keys") === null)
        return "They key doesn't exist";

    await Del(id + "@keys");
    if (await Get(id + "@keys") !== null)
        return "There was a storage error";

    var keys = await Get("keys");
    keys = keys.filter(x => x !== id);
    await Set("keys", keys);

    return true;
}

storage.GetAccounts = async function () {
    return await Get("accounts");
}
storage.GetAccount = async function (id) {
    return await Get(id + "@accounts");
}
storage.AddAccount = async function (id, object) {
    var accounts = await Get("accounts");
    if (accounts.find(x => x == id))
        return "The account already exist";

    await Set(id + "@accounts", object);
    if (await Get(id + "@accounts") === null)
        return "There was a storage error";

    accounts.push(id);
    await Set("accounts", accounts);
    return true;
}
storage.DeleteAccount = async function (id) {
    if (await Get(id + "@accounts") === null)
        return "They account doesn't exist";

    await Del(id + "@accounts");
    if (await Get(id + "@accounts") !== null)
        return "There was a storage error";

    var accounts = await Get("accounts");
    accounts = accounts.filter(x => x !== id);
    await Set("accounts", accounts);

    return true;
}

module.exports = storage;