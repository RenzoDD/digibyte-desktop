require('digibyte-js');
const HDPrivateKey = require('digibyte-js/lib/hdprivatekey');
const Mnemonic = require('digibyte-js/lib/mnemonic/index');
const PrivateKey = require('digibyte-js/lib/privatekey');
const Blockbook = require('digibyte-js/lib/blockbook');
const HDPublicKey = require('digibyte-js/lib/hdpublickey');
const Address = require('digibyte-js/lib/address');
const Price = require('digibyte-js/lib/price');
const Unit = require('digibyte-js/lib/unit');
const Transaction = require('digibyte-js/lib/transaction/transaction');

const DigiByte = {}

DigiByte.GenerateSeed = function (words, passphrase) {
    var mnemonic = new Mnemonic(words);
    var seed = mnemonic.toSeed(passphrase).toString('hex');
    var phrase = mnemonic.toString();
    var list = phrase.split(" ");

    delete mnemonic;

    return { phrase, list, seed };
}

DigiByte.GetMnemonicWord = function (guess) {
    return Mnemonic.Words.ENGLISH.find(x => x.startsWith(guess));
}

DigiByte.CheckMnemonic = function (mnemonic) {
    var valid = false;
    try { valid = Mnemonic.isValid(mnemonic) }
    catch { }
    return valid;
}

DigiByte.CheckWIF = function (WIF) {
    return PrivateKey.isValid(WIF);
}

DigiByte.GetXPUBs = function (seed, type) {
    var hdprivatekey = HDPrivateKey.fromSeed(Buffer.from(seed, 'hex'), null, type == 'mobile');
    var purpose = { 'legacy': 44, 'compatibility': 49, 'segwit': 84 }[type];

    if (type == 'mobile') {
        var xpub = hdprivatekey.deriveChild("m/0'").hdPublicKey.toString();
        return [xpub];
    }

    var xpubs = [];
    for (var i = 0; i < 100; i++) {
        var xpub = hdprivatekey.deriveChild(`m/${purpose}'/20'/${i}'`).hdPublicKey.toString();
        xpubs.push(xpub);
    }
    return xpubs;
}

DigiByte.DeriveHDPublicKey = function (xpub, network, type, change, amount) {
    var hdPublicKey = HDPublicKey.fromString(xpub);
    hdPublicKey = hdPublicKey.deriveChild(change);

    var addresses = {};
    for (var n = 0; n <= amount; n++)
        addresses[hdPublicKey.deriveChild(n).publicKey.toAddress(network, type).toString()] = `${change}/${n}`;

    return addresses;
}

DigiByte.DeriveOneHDPublicKey = function (xpub, network, type, change, external) {
    var hdPublicKey = HDPublicKey.fromString(xpub);
    return hdPublicKey.deriveChild(`m/${change}/${external}`).publicKey.toAddress(network, type).toString();
}

DigiByte.DeriveHDPrivateKey = function (xprv, path) {
    var hdprivatekey = HDPrivateKey.fromSeed(xprv);
    return hdprivatekey.deriveChild(path).privateKey.toWIF();
}

DigiByte.CheckAddress = function (address) {
    return Address.isValid(address);
}

DigiByte.DGBtoSats = function (amount) {
    return Unit.fromDGB(amount).toSatoshis();
}

DigiByte.ParseTransaction = function (hex) {
    return new Transaction(hex);
}

DigiByte.Transaction = function (options) {
    var tx = new Transaction()
        .from(options.inputs)
        .to(options.outputs)
        .change(options.advanced.change);

    if (options.advanced.memo)
        tx.addData(options.advanced.memo);
    if (options.advanced.timelock) {
        if (options.advanced.timelock.block)
            tx.lockUntilBlockHeight(options.advanced.timelock.block);
        if (options.advanced.timelock.time)
            tx.lockUntilDate(options.advanced.timelock.time);
    }
    if (options.advanced.rbf)
        tx.enableRBF();

    var chargedRecipient = options.outputs.find(x => x.fee);
    if (chargedRecipient) {
        chargedRecipient.satoshis -= tx._estimateSize() * options.advanced.feeperbyte;
        if (chargedRecipient.satoshis < 600)
            return { error: 'Insuficient output balance to substract fee' };
        tx.clearOutputs();
        tx.to(options.outputs);
    }

    tx.sign(options.keys);

    var error = tx.getSerializationError();
    if (error) return { error };

    return { hex: tx.serialize() }
}

/*
 * Explorer
 */

DigiByte.GetPrice = async function () {
    return (await Price.Binance());
}

DigiByte.explorer = new Blockbook();
DigiByte.explorerV1 = new Blockbook(null, 'v1');

module.exports = DigiByte;