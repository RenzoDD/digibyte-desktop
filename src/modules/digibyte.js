require('digibyte-js');
const Mnemonic = require('digibyte-js/lib/mnemonic/index');

function DigiByte() { }

DigiByte.GenerateMnemonic = function (words) {
    var mnemonic = new Mnemonic(words);
    var seed = mnemonic.toSeed();
    var phrase = mnemonic.toString();
    var list = phrase.split(" ");
    
    delete mnemonic;

    return { phrase, list, seed };
}

module.exports = DigiByte;