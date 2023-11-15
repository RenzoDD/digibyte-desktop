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

module.exports = storage;