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
})()

const storage = {};

storage.GetKeys = async function () {
    return await Get("keys");
}
storage.GetKey = async function (name) {
    return await Get(name + "@keys");
}
storage.AddKey = async function (name, object) {
    var keys = await Get("keys");
    if (keys.find(x => x == name))
        return "The key already exist";

    await Set(name + "@keys", object);
    if (await Get(name + "@keys") === null)
        return "There was a storage error";

    keys.push(name);
    await Set("keys", keys);
    return true;
}
storage.DeleteKey = async function (name) {
    if (await Get(name + "@keys") === null)
        return "They key doesn't exist";

    await Del(name + "@keys");
    if (await Get(name + "@keys") !== null)
        return "There was a storage error";

    var keys = await Get("keys");
    keys = keys.filter(x => x !== name);
    await Set("keys", keys);

    return true;
}

module.exports = storage;