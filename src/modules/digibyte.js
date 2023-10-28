require('digibyte-js');
const Mnemonic = require('digibyte-js/lib/mnemonic/index');
const PrivateKey = require('digibyte-js/lib/privatekey');

function DigiByte() { }

DigiByte.GenerateSeed = function (words, passphrase) {
    var mnemonic = new Mnemonic(words);
    var seed = mnemonic.toSeed(passphrase);
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

module.exports = DigiByte;