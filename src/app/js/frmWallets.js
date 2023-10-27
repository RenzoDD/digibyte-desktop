async function frmWallets_Load() {
    var files = await GetWallets();

    plWallets.innerHTML = "";

    for (var file of files) {
        try {
            var wallet = await ReadWallet(file);
            plWallets.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmWallets_OpenWallet('${file}')">
                <div class="col-4">
                    ${wallet.file}
                </div>
                <div class="col-4">
                    ${wallet.type}
                </div>
                <div class="col-4">
                    ${wallet.integrity ? "Correct" : "Failed"}
                </div>
            </div>`;
        } catch (e) { console.log(e) }
    }

    frmOpen(frmWallets);
}

async function frmWallets_OpenWallet(path) {

}

async function frmWallets_Generate() {
    generateKeys1.hidden = false;
    generateKeys1Type.value = "null";
    generateKeys1Name.value = "";
    generateKeys1Error.innerHTML = "";

    generateKeys2.hidden = true;
    generateKeys2Error.innerHTML = "";
    generateKeys2Password1.value = "";
    generateKeys2Password2.value = "";

    generateKeys3.hidden = true;
    generateKeys3List.innerHTML = "";
}
async function frmWallets_Generate1() {
    if (generateKeys1Type.value != "24-words" && generateKeys1Type.value != "12-words")
        return generateKeys1Error.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Select Key's type`;

    if (generateKeys1Name.value == "")
        return generateKeys1Error.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Enter Key's name`;

    generateKeys1.hidden = true;
    generateKeys2.hidden = false;
    generateKeys3.hidden = true;
}
async function frmWallets_Generate2() {
    if (generateKeys2Password1.value !== generateKeys2Password2.value)
        return generateKeys2Error.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> The passwords doesn't match`;


    var list = await CreateWallet(generateKeys1Name.value, generateKeys1Type.value, generateKeys2Password1.value);

    if (list === false)
        generateKeys3List.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Error, please try again`;
    else {
        generateKeys3List.innerHTML = list.join(" ");
        delete list;
    }

    generateKeys1.hidden = true;
    generateKeys2.hidden = true;
    generateKeys3.hidden = false;
}
async function frmWallets_Generate3() {
    generateKeys3List.innerHTML = "";
    frmWallets_Load();
}

async function frmWallets_Import() {
    importKeys1.hidden = false;
    importKeys1Type.value = "null";
    importKeys1Name.value = "";
    importKeys1Error.innerHTML = "";

    importKeys2Mnemonic.hidden = true;
    importKeys2MnemonicPhrase.innerHTML = "";
    importKeys2MnemonicWord.value = "";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicError.innerHTML = "";
    importKeys2MnemonicBIP39Passphrase.innerHTML = "";

    importKeys3.hidden = true;
    importKeys3Password1.value = "";
    importKeys3Password2.value = "";
    importKeys3Error.innerHTML = "";

    importKeys4.hidden = true;
    importKeys4Message.innerHTML = "";

}
async function frmWallets_Import1() {
    if (importKeys1Type.value != "mnemonic" && importKeys1Type.value != "keys")
        return importKeys1Error.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Select Key's type`;

    if (importKeys1Name.value == "")
        return importKeys1Error.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Enter Key's name`;

    importKeys1.hidden = true;
    importKeys2Mnemonic.hidden = true;
    importKeys2Keys.hidden = true;
    importKeys3.hidden = true;
    importKeys4.hidden = true;

    if (importKeys1Type.value == "mnemonic")
        importKeys2Mnemonic.hidden = false;
    if (importKeys1Type.value == "keys")
        importKeys2Keys.hidden = false;
}
async function frmWallets_Import2Mnemonic() {
    if (!(await CheckMnemonic(importKeys2MnemonicPhrase.innerHTML.trim())))
        return importKeys2MnemonicError.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Invalid mnemonic phrase`;

    importKeys1.hidden = true;
    importKeys2Mnemonic.hidden = true;
    importKeys2Keys.hidden = true;
    importKeys3.hidden = false;
    importKeys4.hidden = true;
}
async function frmWallets_Import3() {
    if (importKeys3Password1.value !== importKeys3Password2.value)
        return importKeys3Error.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> The passwords doesn't match`;

    var done = await ImportWallet(importKeys1Name.value, importKeys3Password1.value, importKeys2MnemonicPhrase.innerHTML.trim(), importKeys2MnemonicBIP39Passphrase.innerHTML);

    if (done)
        importKeys4Message.innerHTML = "Keys saved";
    else
        importKeys4Message.innerHTML = `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#exclamation-circle"/></svg> Error, please try again`;

        
    importKeys2MnemonicPhrase.innerHTML = "";
    importKeys2MnemonicWord.value = "";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicError.innerHTML = "";
    importKeys2MnemonicBIP39Passphrase.innerHTML = "";

    importKeys1.hidden = true;
    importKeys2Mnemonic.hidden = true;
    importKeys2Keys.hidden = true;
    importKeys3.hidden = true;
    importKeys4.hidden = false;
}
async function frmWallets_Import4() {
    frmWallets_Load();
}


async function keyboardAccept() {
    if (importKeys2MnemonicWord.value != "")
        importKeys2MnemonicPhrase.innerHTML += importKeys2MnemonicWord.value + " ";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicWord.value = "";
}
async function keyboardDelete() {
    importKeys2MnemonicGuess.innerHTML = importKeys2MnemonicGuess.innerHTML.substr(0, importKeys2MnemonicGuess.innerHTML.length - 1);
    importKeys2MnemonicWord.value = await GuessMnemonicWord(importKeys2MnemonicGuess.innerHTML);
}
async function keyboardClick(btn) {
    importKeys2MnemonicGuess.innerHTML += btn.innerHTML;
    importKeys2MnemonicWord.value = await GuessMnemonicWord(importKeys2MnemonicGuess.innerHTML);
}