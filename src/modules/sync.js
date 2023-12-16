const DigiByte = require('./digibyte');
const storage = require('./storage');

const CONFIRMATIONS = 1;
/*
 * SYNC
 */

async function SyncXPUB(account) {
    if (account.type == 'derived')
        var type = { 44: 'legacy', 49: 'compatibility', 84: 'segwit' }[account.purpose];
    else if (account.type == 'mobile')
        var type = 'legacy';

    // Get Max N for
    var info = await DigiByte.explorer.xpub(account.xpub, type, { details: 'tokens', tokens: 'used' });
    for (var tk of info.tokens) {
        var path = tk.path.split('/');
        var n = parseInt(path.pop());
        var change = parseInt(path.pop());

        if (change === 0)
            account.external = account.external > n ? account.external : n + 1;

        if (change === 1)
            account.change = account.change > n ? account.change : n + 1;
    }
    await storage.UpdateAccount(account);

    var addresses0 = DigiByte.DeriveHDPublicKey(account.xpub, account.chain, 0, account.external + 50);
    var addresses1 = DigiByte.DeriveHDPublicKey(account.xpub, account.chain, 1, account.change + 50);
    var addresses = { ...addresses0, ...addresses1 };

    var data = await storage.GetAccountData(account.id);
    if (data == null)
        data = [];

    var last = (data[0] || { txid: '' }).txid;

    var newData = [];
    for (var page = 1; true; page++) {
        var info = await DigiByte.explorer.xpub(account.xpub, type, { details: 'txs', pageSize: 50, page });

        for (var tx of info.transactions) {
            if (!(tx.confirmations > CONFIRMATIONS)) continue;
            if (last == tx.txid) { page = Number.MAX_SAFE_INTEGER; break; }

            var inSats = 0;
            var thirdIn = "";
            for (var vin of tx.vin) {
                if (vin.isAddress) {
                    for (var addr of vin.addresses)
                        if (addresses[addr]) {
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
                            outSats += parseInt(vout.value);
                            break;
                        } else if (thirdOut == "")
                            thirdOut = addr;
                }
            }

            var movement = {
                txid: tx.txid,
                note: thirdOut != "" ? thirdOut : (thirdIn != "" ? thirdIn : "Internal"),
                change: outSats - inSats,
                unix: tx.blockTime,
                height: tx.blockHeight
            };
            newData.push(movement);
        }

        data = newData.concat(data);
        await storage.SetAccountData(account.id, data);
        console.log("Sync", newData.length, "txs");

        if (page >= info.totalPages)
            break;

    }
}




async function Sync() {
    var accounts = await storage.GetAccounts();
    for (var id of accounts) {
        var account = await storage.GetAccount(id);

        if (account.type == 'derived' || account.type == 'mobile') {
            SyncXPUB(account);
            return;
        }


    }
}

Sync();
setInterval(Sync, 10 * 60 * 1000);