require('digibyte-js');
const HDPrivateKey = require('digibyte-js/lib/hdprivatekey');
const Mnemonic = require('digibyte-js/lib/mnemonic/index');
const PrivateKey = require('digibyte-js/lib/privatekey');
const Blockbook = require('digibyte-js/lib/blockbook');
const HDPublicKey = require('digibyte-js/lib/hdpublickey');
const Address = require('digibyte-js/lib/address');
const Price = require('digibyte-js/lib/price');
const Unit = require('digibyte-js/lib/unit');
const DigiByteDomain = require('digibyte-js/lib/domain');
const Transaction = require('digibyte-js/lib/transaction/transaction');

const DigiByte = {}

DigiByte.GenerateSeed = function (words, passphrase) {
    var mnemonic = new Mnemonic(words);
    var seed = mnemonic.toSeed(passphrase).toString('hex');
    var phrase = mnemonic.toString();
    var list = phrase.split(" ");

    return { phrase, list, seed };
}

DigiByte.GetMnemonicWord = function (guess) {
    return Mnemonic.Words.ENGLISH.find(x => x.startsWith(guess));
}

DigiByte.CheckMnemonic = function (mnemonic) {
    return Mnemonic.isValid(mnemonic);
}

DigiByte.CheckWIF = function (WIF) {
    return PrivateKey.isValid(WIF);
}

DigiByte.GetXPUBs = function (seed, type) {
    var hdprivatekey = HDPrivateKey.fromSeed(Buffer.from(seed, 'hex'), null, type == 'mobile');
    var purpose = { 'legacy': 44, 'script': 49, 'segwit': 84 }[type];

    if (type == 'mobile') {
        var xpub = hdprivatekey.deriveChild("m/0'").hdPublicKey.toString();
        return [xpub];
    }

    var xpubs = [];
    for (var i = 0; i < 300; i++) {
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

DigiByte.DeriveHDPrivateKey = function (xprv, path, mobile) {
    var hdprivatekey = HDPrivateKey.fromSeed(xprv, null, mobile);
    return hdprivatekey.deriveChild(path).privateKey.toWIF();
}

DigiByte.WifToAddress = function (wif, network) {
    var privateKey = new PrivateKey(wif);
    var legacy = privateKey.toAddress(network, 'legacy').toString();
    if (privateKey.compressed == false)
        return { legacy };
    var script = privateKey.toAddress(network, 'script').toString();
    var segwit = privateKey.toAddress(network, 'segwit').toString();
    return { legacy, script, segwit };
}

DigiByte.CheckAddress = function (address) {
    return Address.isValid(address);
}

DigiByte.DomainToAddress = async function (domain) {
    return await DigiByteDomain.DomainToAddress(domain);
}

DigiByte.DGBtoSats = function (amount) {
    return Unit.fromDGB(amount).toSatoshis();
}

DigiByte.ParseTransaction = function (hex) {
    return new Transaction(hex);
}

DigiByte.CalculateTxFee = function (options) {
    var inputs = options.inputs.length;
    var outputs = options.outputs.length;
    var data = (options.advanced.memo || "").length;

    if (data != 0) outputs++;
    return (10 + inputs + (inputs * 180) + (outputs * 34) + data) * 2;
}

DigiByte.BuildTransaction = function (options, keys) {
    var inSats = 0;
    options.inputs.forEach(utxo => inSats += utxo.satoshis);
    var outSats = 0;
    options.outputs.forEach(utxo => outSats += utxo.satoshis);

    if (outSats + options.fee > inSats) return { error: `Input amount is less than output amount ${outSats + options.fee} < ${inSats}` };

    var tx = new Transaction()
        .from(options.inputs)
        .to(options.outputs)
        .change(options.advanced.change.address || options.advanced.change)
        .fee(options.fee);

    if (options.advanced.memo)
        tx.addData(options.advanced.memo);
    if (options.advanced.locktime) {
        if (options.advanced.locktime.block)
            tx.lockUntilBlockHeight(options.advanced.locktime.block);
        if (options.advanced.locktime.time)
            tx.lockUntilDate(options.advanced.locktime.time);
    }
    options.advanced.locktime = tx.nLockTime;
    if (options.advanced.rbf)
        tx.enableRBF();
    
    if (keys) tx.sign(keys);

    var error = tx.getSerializationError({ disableIsFullySigned: true });
    if (error) return { error: error.toString() };

    options.hex = tx.serialize({ disableIsFullySigned: true });
    return options;
}

/*
 * Explorer
 */

DigiByte.GetPrice = async function () {
    return (await Price.GetFromBinance('us'));
}

DigiByte.explorer = new Blockbook();

module.exports = DigiByte;