require('digibyte-js');
const HDPrivateKey = require('digibyte-js/lib/hdprivatekey');
const Mnemonic = require('digibyte-js/lib/mnemonic/index');
const PrivateKey = require('digibyte-js/lib/privatekey');
const Blockbook = require('digibyte-js/lib/blockbook');
const HDPublicKey = require('digibyte-js/lib/hdpublickey');

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

DigiByte.DeriveHDPublicKey = function (xpub, network, change, amount) {
    var hdPublicKey = HDPublicKey.fromString(xpub);
    hdPublicKey = hdPublicKey.derive(change);

    var addresses = {};
    for (var n = 0; n <= amount; n++)
        addresses[hdPublicKey.derive(n).publicKey.toAddress(network).toString()] = `${change}/${n}`;

    return addresses;
}

/*
 * Explorer
 */

DigiByte.explorer = new Blockbook();

module.exports = DigiByte;