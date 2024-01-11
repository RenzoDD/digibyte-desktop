const DigiByte = require('./digibyte');
const storage = require('./storage');

const CONFIRMATIONS = 1;

/*
 * SYNC
 */

async function SyncLastAddressUTXO(account) {
    if (account.type == 'derived')
        var type = { 44: 'legacy', 49: 'compatibility', 84: 'segwit' }[account.purpose];
    else if (account.type == 'mobile')
        var type = 'legacy';

    var info = null;
    for (var n = 0; n < 10 && info == null; n++)
        var info = await DigiByte.explorer.xpub(account.xpub, type, { details: 'tokens', tokens: 'used' });
    if (info == null)
        return console.log("SyncLastAddressUTXO", "ERROR", account.id);

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
    if (account.type == 'derived')
        var type = { 44: 'legacy', 49: 'compatibility', 84: 'segwit' }[account.purpose];
    else if (account.type == 'mobile')
        var type = 'legacy';

    var addresses0 = DigiByte.DeriveHDPublicKey(account.xpub, account.network, 0, account.external + 50);
    var addresses1 = DigiByte.DeriveHDPublicKey(account.xpub, account.network, 1, account.change + 50);
    var addresses = { ...addresses0, ...addresses1 };

    var movements = await storage.GetAccountMovements(account.id);

    var last = (movements[0] || { txid: '' }).txid;

    var newMovements = [];
    for (var page = 1; true; page++) {

        var info = null;
        for (var n = 0; n < 10 && info == null; n++)
            var info = await DigiByte.explorer.xpub(account.xpub, type, { details: 'txs', pageSize: 50, page });
        if (info == null)
            return console.log("SyncMovementsXPUB", "NETWORK ERROR", account.id);

        for (var tx of info.transactions) {
            if (!(tx.confirmations > CONFIRMATIONS)) continue;
            if (last == tx.txid) { page = Number.MAX_SAFE_INTEGER; break; }

            await storage.SetTransaction(tx.txid, tx);

            var isAsset = false;
            var isAssetOP = false;

            var inSats = 0;
            var thirdIn = "";
            for (var vin of tx.vin) {
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
async function SyncBalanceXPUB(account) {
    if (account.type == 'derived')
        var type = { 44: 'legacy', 49: 'compatibility', 84: 'segwit' }[account.purpose];
    else if (account.type == 'mobile')
        var type = 'legacy';


    var addresses0 = DigiByte.DeriveHDPublicKey(account.xpub, account.network, 0, account.external + 50);
    var addresses1 = DigiByte.DeriveHDPublicKey(account.xpub, account.network, 1, account.change + 50);
    var addresses = { ...addresses0, ...addresses1 };

    var movements = await storage.GetAccountMovements(account.id);
    var balance = await storage.GetAccountBalance(account.id);

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
                        toAdd.push(vout);
                    }
            } else {
                var asm = vout.addresses[0].split(" ");
                isAssetOP = (asm[0] == "OP_RETURN" && asm[1].startsWith("4441")) || isAsset
            }
        }
        
        height = tx.blockHeight;
        balance.satoshis = BigInt(balance.satoshis);

        toRemove.forEach(vin => {
            var utxo = balance.DigiByteUTXO[`${tx.txid}:${vin.n}`];
            if (utxo) {
                balance.satoshis -= BigInt(utxo.satoshis);
                delete balance.DigiByteUTXO[`${tx.txid}:${vin.n}`];
            }

            var utxo = balance.DigiAssetUTXO[`${tx.txid}:${vin.n}`];
            if (utxo) {
                balance.satoshis -= BigInt(utxo.satoshis);
                delete balance.DigiAssetUTXO[`${tx.txid}:${vin.n}`];
            }
        });
        toAdd.forEach(vout => {
            if (isAsset && isAssetOP) {
                balance.DigiAssetUTXO[`${tx.txid}:${vin.n}`] = {
                    txid: tx.txid,
                    vout: vout.n,
                    script: vout.hex,
                    satoshis: parseInt(vout.value),
                    assetId: "",
                    metadata: "",
                    quantity: ""
                };
            } else {
                balance.satoshis += BigInt(vout.value);
                balance.DigiByteUTXO[`${tx.txid}:${vin.n}`] = {
                    txid: tx.txid,
                    vout: vout.n,
                    script: vout.hex,
                    satoshis: parseInt(vout.value)
                };
            }
        });

    }
    
    balance.height = height;
    balance.satoshis = balance.satoshis.toString();

    await storage.SetAccountBalance(account.id, balance);
    console.log("SyncBalanceXPUB", "SUCCESS", account.id, "sats:" + balance.satoshis);
}

async function Sync() {
    var accounts = await storage.GetAccounts();
    for (var id of accounts) {
        var account = await storage.GetAccount(id);

        if (account.type == 'derived' || account.type == 'mobile') {
            (async function () {
                await SyncLastAddressUTXO(account);
                await SyncMovementsXPUB(account);
                await SyncBalanceXPUB(account);
            })()
        }
    }
}

async function StartSyncInterval() {
    if (global.SyncID) {
        console.log("Stoping sync...");
        clearInterval(global.SyncID);
    }

    await storage.Initialize();
    await Sync();

    console.log("Starting sync...");
    global.SyncID = setInterval(Sync, 10 * 60 * 1000);
}
StartSyncInterval();

module.exports = StartSyncInterval;


