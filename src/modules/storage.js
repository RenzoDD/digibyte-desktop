const { app } = require('electron');
const user = app.getPath('userData');

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

const storage = {};

storage.Initialize = async function () {
    if (await Get("keys") === null)
        await Set("keys", []);
    if (await Get("accounts") === null)
        await Set("accounts", []);
}

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

    var accounts = await storage.GetAccounts();
    for (var account of accounts) {
        var account = await storage.GetAccount(account);
        if (account.secret !== id) continue;
        await storage.DeleteAccount(account.id);
    }
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
storage.UpdateAccount = async function (object) {
    var accounts = await Get("accounts");
    if (!accounts.find(x => x == object.id))
        return "The account doesn't exist";

    var original = await Get(object.id + "@accounts");

    if (JSON.stringify(original) === JSON.stringify(object))
        return "The account hasn't been modified";

    await Set(object.id + "@accounts", object);

    var account = await Get(object.id + "@accounts");
    if (account === null)
        return "There was a storage error";

    if (JSON.stringify(object) !== JSON.stringify(account)) {
        await Set(original.id + "@accounts", original);
        return "There was an error";
    }

    return true;
}
storage.DeleteAccount = async function (id) {
    var account = await Get(id + "@accounts");
    if (account === null)
        return "They account doesn't exist";

    await Del(id + "@accounts");
    if (await Get(id + "@accounts") !== null)
        return "There was a storage error";

    var accounts = await Get("accounts");
    accounts = accounts.filter(x => x !== id);
    await Set("accounts", accounts);

    await storage.DeleteAccount(id);
    await storage.DeleteAccountMovements(id);
    await storage.DeleteAccountMempool(id);
    await storage.DeleteAccountBalance(id)
    if (account.addresses)
        for (var address of account.addresses) {
            await storage.DeleteAccountMovements(account.id + "-" + address);
            await storage.DeleteAccountMempool(account.id + "-" + address);
        }

    return true;
}

storage.GetAccountMovements = async function (id) {
    var movements = await Get(id + "@account-movements");
    if (movements == null)
        movements = [];
    return movements;
}
storage.SetAccountMovements = async function (id, object) {
    await Set(id + "@account-movements", object);
    if (await Get(id + "@account-movements") === null)
        return "There was a storage error";
    return true;
}
storage.DeleteAccountMovements = async function (id) {
    await Del(id + "@account-movements");
    if (await Get(id + "@account-movements") !== null)
        return "There was a storage error";
    return true;
}

storage.GetAccountMempool = async function (id) {
    var movements = await Get(id + "@account-mempool");
    if (movements == null)
        movements = [];
    return movements;
}
storage.SetAccountMempool = async function (id, object) {
    await Set(id + "@account-mempool", object);
    if (await Get(id + "@account-mempool") === null)
        return "There was a storage error";
    return true;
}
storage.AddTxAccountMempool = async function (id, object) {
    var movements = await Get(id + "@account-mempool");
    movements.push(object);
    await Set(id + "@account-mempool", movements);
    return true;
}
storage.ClearAccountMempool = async function (id) {
    await Set(id + "@account-mempool", []);
    if (await Get(id + "@account-mempool") === null)
        return "There was a storage error";
    return true;
}
storage.DeleteAccountMempool = async function (id) {
    await Del(id + "@account-mempool");
    if (await Get(id + "@account-mempool") !== null)
        return "There was a storage error";
    return true;
}

storage.GetAccountBalance = async function (id) {
    var balance = await Get(id + "@account-balance");
    if (balance == null)
        var balance = {
            height: 0,
            satoshis: 0n,
            DigiByteUTXO: {},
            DigiAssetUTXO: {}
        }
    return balance;
}
storage.SetAccountBalance = async function (id, object) {
    await Set(id + "@account-balance", object);
    if (await Get(id + "@account-balance") === null)
        return "There was a storage error";
    return true;
}
storage.DeleteAccountBalance = async function (id) {
    await Del(id + "@account-balance");
    if (await Get(id + "@account-balance") !== null)
        return "There was a storage error";
    return true;
}

storage.GetTransaction = async function (id) {
    return await Get(id + "@tx-data");
}
storage.SetTransaction = async function (id, object) {
    await Set(id + "@tx-data", object);
    if (await Get(id + "@tx-data") === null)
        return "There was a storage error";
    return true;
}

storage.GetPrice = async function () {
    var exchange = await Get("exchange");
    if (exchange == null)
        exchange = { change: 0, price: 0 };
    return exchange;
}
storage.SetPrice = async function (value) {
    await Set("exchange", value);
}

module.exports = storage;