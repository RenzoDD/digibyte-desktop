const TransportNodeHid = require('@ledgerhq/hw-transport-node-hid').default;
const BTC = require("@ledgerhq/hw-app-btc").default;

const Ledger = {};

Ledger.GetTransport = async function () {
    var transportPromise = TransportNodeHid.create(1500, 1500);
    var timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error('Transport creation timed out'));
        }, 1000);
    });

    try {
        var transport = await Promise.race([transportPromise, timeoutPromise]);
        return transport;
    } catch (error) {
        return false;
    }
}

Ledger.IsReady = async function () {
    var transport = await Ledger.GetTransport();
    if (!transport) return "DISCONECTED";

    try {
        var response = await transport.send(0xb0, 0x01, 0x00, 0x00);
        var menu = response.includes('BOLOS');
        var result = response.includes('Digibyte');
        return menu ? 'IN_MENU' : result ? true : 'OTHER_APP';
    } catch (e) {
        return e.statusText == 'LOCKED_DEVICE' ? 'LOCKED' : e.statusText;
    } finally {
        transport.close();
    }
}
Ledger.CloseApp = async function () {
    var transport = await Ledger.GetTransport();
    if (!transport) return "DISCONECTED";

    try {
        await transport.send(0xb0, 0xa7, 0x00, 0x00);
    } catch { }
    finally {
        transport.close();
    }
}
Ledger.OppenDigiByteApp = async function () {
    var transport = await Ledger.GetTransport();
    if (!transport) return "DISCONECTED";

    try {
        await transport.send(0xe0, 0xd8, 0x00, 0x00, Buffer.from('Digibyte', "ascii"));
    } catch { }
    finally {
        transport.close();
    }
}

Ledger.GetXPUBs = async function (n, type) {
    var purpose = { 'legacy': 44, 'script': 49, 'segwit': 84 }[type];

    var transport = await Ledger.GetTransport();
    if (!transport) return "DISCONECTED";
    var btc = new BTC({ transport });

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

Ledger.GetAddress = async function (path, type) {
    var transport = await Ledger.GetTransport();
    if (!transport) return { error: "The device was disconected" };
    const btc = new BTC({ transport });

    try {
        type = type == 'legacy' ? 'legacy' : type;
        type = type == 'script' ? 'p2sh' : type;
        type = type == 'segwit' ? 'bech32' : type;

        var address = await btc.getWalletPublicKey(path, { verify: true, format: type });
        return address.bitcoinAddress;
    } catch (e) {
        if (e.statusCode == 27013) return { error: "Address rejected by the user" }
        return { error: e.statusText || "Unknown error" }
    } finally {
        transport.close();
    }
}

Ledger.SignTransaction = async function (options) {
    var transport = await Ledger.GetTransport();
    if (!transport) return { error: "The device was disconected" };
    const btc = new BTC({ transport });

    var inputs = [];
    var segwit = false;
    var additionals = [];
    for (var input of options.inputs) {
        if (input.path.startsWith('m/84') || input.path.startsWith('m/49'))
            segwit = true;
        if (input.path.startsWith('m/84') && additionals.length == 0) {
            additionals.push('bech32');
            segwit = true;
        }
        inputs.push([btc.splitTransaction(input.tx, true), input.vout, null, 0xffffffff]);
    }

    if (options.advanced.rbf) inputs[0][3] -= 2;
    else if (options.advanced.locktime) inputs[0][3] -= 1;

    var associatedKeysets = options.inputs.map(utxo => utxo.path);
    var outputScriptHex = btc.serializeTransactionOutputs(btc.splitTransaction(options.hex)).toString('hex');

    try {
        options.hex = await btc.createPaymentTransaction({
            inputs,
            associatedKeysets,
            changePath: options.advanced.change.path || null,
            outputScriptHex,
            lockTime: options.advanced.locktime,
            segwit,
            additionals
        });

        return options;
    } catch (e) {
        if (e.statusCode == 27013) return { error: "Action canceled by the user" }
        return { error: e.statusText || "Unknown error" }
    } finally {
        transport.close();
    }
}

module.exports = Ledger;