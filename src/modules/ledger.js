const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default;
const BTC = require("@ledgerhq/hw-app-btc").default;

const Ledger = {};

Ledger.GetTransport = async function () {
    const transportPromise = TransportNodeHid.create();

    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Transport creation timed out'));
        }, 1000);
    });

    try {
        const transport = await Promise.race([transportPromise, timeoutPromise]);
        return transport;
    } catch (error) {
        return false;
    }
}
Ledger.IsReady = async function () {
    try {
        var transport = await Ledger.GetTransport();
        if (!transport) return "DISCONECTED";

        const btc = new BTC({ transport });
        await btc.getWalletXpub({ path: "44'/20'/0'" });
        return true;
    } catch (e) {
        return e.statusText == 'LOCKED_DEVICE' ? 'LOCKED' : e.statusText == 'UNKNOWN_DEVICE' ? 'CLOSED' : e.statusText;
    }

}

Ledger.GetXPUBs = async function (n, type) {
    var purpose = { 'legacy': 44, 'script': 49, 'segwit': 84 }[type];

    var transport = await Ledger.GetTransport();
    if (!transport) return "DISCONECTED";
    const btc = new BTC({ transport });

    var xpubs = [];
    for (var i = 0; i < n; i++) {
        try {
            var xpub = await btc.getWalletXpub({ path: `${purpose}'/20'/${i}'`, xpubVersion: 0x0488b21e });
            xpubs.push(xpub);
        } catch (e) {
            return e.statusText == 'LOCKED_DEVICE' ? 'LOCKED' : e.statusText == 'UNKNOWN_DEVICE' ? 'CLOSED' : 'UNKNOWN';
        }
    }
    return xpubs;
}

module.exports = Ledger;