const DigiByte = require('./digibyte');
const storage = require('./storage');

const CONFIRMATIONS = 1;

/*
 * SYNC
 */

async function SyncPrice() {
    var exchange = await DigiByte.GetPrice();
    if (exchange != null) {
        storage.SetPrice(exchange);
        console.log("SyncPrice", "SUCCESS", "price:" + exchange.price, "change:" + exchange.change);
    }
}

function GetAddresses(account) {
    if (account.type == 'derived' || account.type == 'mobile') {
        var addresses0 = DigiByte.DeriveHDPublicKey(account.xpub, account.network, account.address, 0, account.external + 50);
        var addresses1 = DigiByte.DeriveHDPublicKey(account.xpub, account.network, account.address, 1, account.change + 50);
        return { ...addresses0, ...addresses1 };
    } else if (account.type == 'single') {
        return account.addresses.reduce((obj, currentValue) => {
            obj[currentValue] = true;
            return obj;
        }, {});
    }
}

async function SyncLastAddressUTXO(account) {
    var info = null;
    for (var n = 0; n < 10 && info == null; n++)
        var info = await DigiByte.explorer.xpub(account.xpub, account.address, { details: 'tokens', tokens: 'used' });
    if (info == null)
        return console.log("SyncLastAddressUTXO", "ERROR", account.id);

    info.tokens = info.tokens ? info.tokens : [];
    info.tokens.forEach(token => {
        var path = token.path.split('/');
        var n = parseInt(path.pop());
        var change = parseInt(path.pop());

        if (change === 0)
            account.external = account.external > n ? account.external : n + 1;

        if (change === 1)
            account.change = account.change > n ? account.change : n + 1;
    });
    await storage.UpdateAccount(account);
    console.log("SyncLastAddressUTXO", "SUCCESS", account.id, "external:" + account.external, "change:" + account.change);
}
async function SyncMovementsXPUB(account) {
    var addresses = GetAddresses(account);
    var movements = await storage.GetAccountMovements(account.id);

    var last = (movements[0] || { txid: '' }).txid;

    var newMovements = [];
    for (var page = 1; true; page++) {

        var info = null;
        for (var n = 0; n < 10 && info == null; n++)
            var info = await DigiByte.explorer.xpub(account.xpub, account.address, { details: 'txs', pageSize: 50, page });
        if (info == null)
            return console.log("SyncMovementsXPUB", "NETWORK ERROR", account.id);

        info.transactions = info.transactions ? info.transactions : [];
        for (var tx of info.transactions) {
            if (!(tx.confirmations > CONFIRMATIONS)) continue;
            if (last == tx.txid) { page = Number.MAX_SAFE_INTEGER; break; }

            var rawTX = DigiByte.ParseTransaction(tx.hex);

            var isAsset = false;
            var isAssetOP = false;

            var inSats = 0;
            var thirdIn = "";
            for (var vin of tx.vin) {
                vin.vout = rawTX.inputs.shift().outputIndex;
                if (vin.isAddress) {
                    for (var addr of vin.addresses)
                        if (addresses[addr]) {
                            isAsset = parseInt(vin.value) == 600 || isAsset;
                            inSats += parseInt(vin.value);
                            break;
                        } else if (thirdIn == "")
                            thirdIn = addr;
                }
            }

            var outSats = 0;
            var thirdOut = "";
            for (var vout of tx.vout) {
                if (vout.isAddress) {
                    for (var addr of vout.addresses)
                        if (addresses[addr]) {
                            isAsset = parseInt(vout.value) == 600 || isAsset;
                            outSats += parseInt(vout.value);
                            break;
                        } else if (thirdOut == "")
                            thirdOut = addr;
                } else {
                    var asm = vout.addresses[0].split(" ");
                    isAssetOP = (asm[0] == "OP_RETURN" && asm[1].startsWith("4441")) || isAsset
                }
            }

            await storage.SetTransaction(tx.txid, tx);
            newMovements.push({
                txid: tx.txid,
                note: thirdOut != "" ? thirdOut : (thirdIn != "" ? thirdIn : "Internal"),
                change: outSats - inSats,
                unix: tx.blockTime,
                height: tx.blockHeight,
                isAsset: isAsset && isAssetOP
            });
        }

        movements = newMovements.concat(movements);
        await storage.SetAccountMovements(account.id, movements);
        console.log("SyncMovementsXPUB", "SUCCESS", account.id, "txs:" + movements.length, "new:" + newMovements.length);

        if (page >= info.totalPages)
            break;
    }
}

async function SyncMovementsAddresses(account) {
    var addresses = GetAddresses(account);
    for (var address of Object.keys(addresses)) {
        var movements = await storage.GetAccountMovements(account.id + "-" + address);

        var last = (movements[0] || { txid: '' }).txid;

        var newMovements = [];
        for (var page = 1; true; page++) {

            var info = null;
            for (var n = 0; n < 10 && info == null; n++)
                var info = await DigiByte.explorer.address(address, { details: 'txs', pageSize: 50, page });
            if (info == null)
                return console.log("SyncMovementsAddresses", "NETWORK ERROR", account.id);

            info.transactions = info.transactions ? info.transactions : [];
            for (var tx of info.transactions) {
                if (!(tx.confirmations > CONFIRMATIONS)) continue;
                if (last == tx.txid) { page = Number.MAX_SAFE_INTEGER; break; }

                var rawTX = DigiByte.ParseTransaction(tx.hex);

                var isAsset = false;
                var isAssetOP = false;

                var inSats = 0;
                var thirdIn = "";
                for (var vin of tx.vin) {
                    vin.vout = rawTX.inputs.shift().outputIndex;
                    if (vin.isAddress) {
                        for (var addr of vin.addresses)
                            if (addresses[addr]) {
                                isAsset = parseInt(vin.value) == 600 || isAsset;
                                inSats += parseInt(vin.value);
                                break;
                            } else if (thirdIn == "")
                                thirdIn = addr;
                    }
                }

                var outSats = 0;
                var thirdOut = "";
                for (var vout of tx.vout) {
                    if (vout.isAddress) {
                        for (var addr of vout.addresses)
                            if (addresses[addr]) {
                                isAsset = parseInt(vout.value) == 600 || isAsset;
                                outSats += parseInt(vout.value);
                                break;
                            } else if (thirdOut == "")
                                thirdOut = addr;
                    } else {
                        var asm = vout.addresses[0].split(" ");
                        isAssetOP = (asm[0] == "OP_RETURN" && asm[1].startsWith("4441")) || isAsset
                    }
                }

                await storage.SetTransaction(tx.txid, tx);
                newMovements.push({
                    txid: tx.txid,
                    note: thirdOut != "" ? thirdOut : (thirdIn != "" ? thirdIn : "Internal"),
                    change: outSats - inSats,
                    unix: tx.blockTime,
                    height: tx.blockHeight,
                    isAsset: isAsset && isAssetOP
                });
            }

            movements = newMovements.concat(movements);
            await storage.SetAccountMovements(account.id + "-" + address, movements);
            console.log("SyncMovementsAddresses", "SUCCESS", account.id + "-" + address, "txs:" + movements.length, "new:" + newMovements.length);

            if (page >= info.totalPages)
                break;
        }
    }
}

async function SyncBalance(account) {
    var addresses = GetAddresses(account);
    var balance = await storage.GetAccountBalance(account.id);

    if (account.type == 'derived' || account.type == 'mobile') {
        var movements = await storage.GetAccountMovements(account.id);
        movements = movements.filter(x => x.height > balance.height);
    } else if (account.type == 'single') {
        var movements = [];
        for (var address of Object.keys(addresses)) {
            var m = await storage.GetAccountMovements(account.id + "-" + address);
            movements = movements.concat(m.filter(x => x.height > balance.height));
        }
        movements.sort((a, b) => a.txid.localeCompare(b.txid));
        // Delete duplicate txs
        movements = movements.filter((obj, index) => {
            if (index === movements.length - 1) return true;
            return obj.txid !== movements[index + 1].txid;
        });
        movements.sort((a, b) => b.height - a.height);

        var oldMove = await storage.GetAccountMovements(account.id);
        await storage.SetAccountMovements(account.id, movements.concat(oldMove));
    }


    var height = balance.height;
    for (var i = movements.length - 1; i >= 0; i--) {
        var movement = movements[i];

        if (movement.height <= balance.height)
            continue;

        var tx = await storage.GetTransaction(movement.txid);
        if (tx == null) {
            for (var n = 0; n < 10 && tx == null; n++)
                var tx = await DigiByte.explorer.transaction(movement.txid);
            if (tx == null)
                return console.log("SyncLastAddressUTXO", "ERROR", account.id);
            await storage.SetTransaction(movement.txid, tx);
        }

        var toRemove = [];
        var toAdd = [];

        var isAsset = false;
        var isAssetOP = false;

        for (var vin of tx.vin) {
            if (vin.isAddress) {
                for (var addr of vin.addresses)
                    if (addresses[addr])
                        toRemove.push(vin);
            }
        }

        for (var vout of tx.vout) {
            if (vout.isAddress) {
                for (var addr of vout.addresses)
                    if (addresses[addr]) {
                        isAsset = parseInt(vout.value) == 600 || isAsset;
                        vout.path = addresses[addr];
                        toAdd.push(vout);
                    }
            } else {
                var asm = vout.addresses[0].split(" ");
                isAssetOP = (asm[0] == "OP_RETURN" && asm[1].startsWith("4441")) || isAsset
            }
        }

        height = tx.blockHeight;

        toRemove.forEach(vin => {
            var utxo = balance.DigiByteUTXO[`${vin.txid}:${vin.vout}`];
            if (utxo) {
                delete balance.DigiByteUTXO[`${vin.txid}:${vin.vout}`];
            }

            var utxo = balance.DigiAssetUTXO[`${vin.txid}:${vin.vout}`];
            if (utxo) {
                delete balance.DigiAssetUTXO[`${vin.txid}:${vin.vout}`];
            }
        });
        toAdd.forEach(vout => {
            if (isAsset && isAssetOP) {
                balance.DigiAssetUTXO[`${tx.txid}:${vout.n}`] = {
                    txid: tx.txid,
                    vout: vout.n,
                    script: vout.hex,
                    satoshis: parseInt(vout.value),
                    path: account.path + '/' + vout.path,
                    assetId: "",
                    metadata: "",
                    quantity: ""
                };
            } else {
                balance.DigiByteUTXO[`${tx.txid}:${vout.n}`] = {
                    txid: tx.txid,
                    vout: vout.n,
                    script: vout.hex,
                    satoshis: parseInt(vout.value),
                    path: account.path + '/' + vout.path
                };
            }
        });
    }

    balance.height = height;

    balance.satoshis = 0n;
    Object.values(balance.DigiByteUTXO).forEach(utxo => balance.satoshis += BigInt(utxo.satoshis));
    balance.satoshis = balance.satoshis.toString();

    await storage.SetAccountBalance(account.id, balance);
    console.log("SyncBalanceXPUB", "SUCCESS", account.id, "sats:" + balance.satoshis);
}

async function Sync() {
    await SyncPrice();

    var accounts = await storage.GetAccounts();
    for (var id of accounts) {
        var account = await storage.GetAccount(id);

        if (account.type == 'derived' || account.type == 'mobile') {
            await SyncLastAddressUTXO(account);
            await SyncMovementsXPUB(account);
        } else if (account.type == 'single') {
            await SyncMovementsAddresses(account);
        }
        await SyncBalance(account);
    }
}

async function StartSyncInterval() {
    if (global.SyncID) {
        console.log("Stoping sync...");
        clearInterval(global.SyncID);
    }

    await storage.Initialize();

    console.log("Starting sync...");
    global.SyncID = setInterval(Sync, 10 * 60 * 1000);
    await Sync();
}
StartSyncInterval();

module.exports = StartSyncInterval;


