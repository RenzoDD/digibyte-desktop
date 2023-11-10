async function frmWallets_Load() {
    var files = await GetWallets();

    plWallets.innerHTML = "";

    if (files.length == 0)
        plWallets.innerHTML = `<div class="text-center">(No Keys Found)</div>`;

    for (var file of files) {
        var wallet = await ReadWallet(file);
        if (file !== false)
            plWallets.innerHTML += `
            <div class="option row p-4 mb-3" data-bs-toggle="modal" data-bs-target="#manageKeys" onclick="frmWallets_Manage('${file}')">
                <div class="col-4">
                    ${wallet.file}
                </div>
                <div class="col-4">
                    ${wallet.type}
                </div>
                <div class="col-4">
                    ${wallet.integrity ? (wallet.compatibility ? "Verified" : "Keys for v" + wallet.version ) : "Failed"}
                </div>
            </div>`;
    }

    frmOpen(frmWallets);
}

async function frmWallets_Manage(file) {
    manageKey_Show(manageKeys1);
    manageKeys1Wallet.value = file;
}
async function manageKey_Show(screen) {
    manageKeys1.hidden = true;
    manageKeys2.hidden = true;
    manageKeys3.hidden = true;

    screen.hidden = false;
}
async function manageKey_Clear() {
    manageKeys1Wallet.value = "";
    manageKeys3Status.innerHTML = "";
}
async function manageKeys1_Export() {
    var save = await ExportWallet(manageKeys1Wallet.value);
    if (save === true)
        manageKeys3Status.innerHTML = `${icon('check-circle')} Key file exported successfully`;
    else
        manageKeys3Status.innerHTML = `${icon('exclamation-circle')} ${save}`;

    manageKey_Show(manageKeys3);
}
async function manageKeys1_Delete() {
    manageKey_Show(manageKeys2);
}
async function manageKeys2_Delete() {
    var deleted = await DeleteWallet(manageKeys1Wallet.value);
    if (deleted === true)
        manageKeys3Status.innerHTML = `${icon('check-circle')} Key file deleted successfully`;
    else
        manageKeys3Status.innerHTML = `${icon('exclamation-circle')} ${deleted}`;

    frmWallets_Load();
    manageKey_Show(manageKeys3);
}

async function frmWallets_Generate() {
    generateKeys_Show(generateKeys1);
    generateKeys_Clear();
}
async function generateKeys_Show(screen) {
    generateKeys1.hidden = true;
    generateKeys2.hidden = true;
    generateKeys3.hidden = true;

    screen.hidden = false;
}
async function generateKeys_Clear() {
    generateKeys1Type.value = "null";
    generateKeys1Name.value = "";
    generateKeys1Error.innerHTML = "";

    generateKeys2Password1.value = "";
    generateKeys2Password2.value = "";
    generateKeys2Error.innerHTML = "";

    generateKeys3List.innerHTML = "";
}
async function generateKeys1_Continue() {
    if (generateKeys1Type.value != "24-words" && generateKeys1Type.value != "12-words")
        return generateKeys1Error.innerHTML = `${icon('exclamation-circle')} Select Key's type`;

    if (generateKeys1Name.value == "")
        return generateKeys1Error.innerHTML = `${icon('exclamation-circle')} Enter Key's name`;

    generateKeys_Show(generateKeys2);
}
async function generateKeys2_Generate() {
    if (generateKeys2Password1.value !== generateKeys2Password2.value)
        return generateKeys2Error.innerHTML = `${icon('exclamation-circle')} The passwords doesn't match`;


    var list = await CreateWallet(generateKeys1Name.value, generateKeys1Type.value, generateKeys2Password1.value);

    if (typeof list == 'string')
        generateKeys3List.innerHTML = `${icon('exclamation-circle')} ${list}`;
    else {
        var data = ""
        for (var n in list)
            data += `<div class="col-3 text-center mb-3">
                        <div class="mb-0 font-monospace">${list[n]}</div>
                        <hr class="my-0">
                        <div class="mt-0"><small>${parseInt(n) + 1}</small></div>
                    </div>`;

        generateKeys3List.innerHTML = `<div class="mb-4">Please take note of this ${list.length} words. Anyone with access to them can move your funds. DO NOT SHARE OR LOSE YOUR RECOVERY PHRASE!!!</div>`
        generateKeys3List.innerHTML += `<div class="row">${data}</div>`
        delete list;
        delete data;
    }

    generateKeys_Show(generateKeys3);
    frmWallets_Load();
}

async function frmWallets_Import() {
    importKeys_Show(importKeys1);
    importKeys_Clear();
}
async function importKeys_Show(screen) {
    importKeys1.hidden = true;
    importKeys2Mnemonic.hidden = true;
    importKeys2Keys.hidden = true;
    importKeys3.hidden = true;
    importKeys4.hidden = true;

    screen.hidden = false;
}
async function importKeys_Clear() {
    importKeys1Type.value = "null";
    importKeys1Name.value = "";
    importKeys1Error.innerHTML = "";

    importKeys2MnemonicPhrase.innerHTML = "";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicWord.value = "";
    importKeys2MnemonicBIP39Passphrase.innerHTML = "";
    importKeys2MnemonicError.innerHTML = "";

    importKeys2KeysKey.value = "";
    importKeys2KeysList.innerHTML = "";
    importKeys2KeysError.innerHTML = "";

    importKeys3Password1.value = "";
    importKeys3Password2.value = "";
    importKeys3Error.innerHTML = "";

    importKeys4Message.innerHTML = "";
}
async function importKeys1_Continue() {
    if (importKeys1Type.value != "mnemonic" && importKeys1Type.value != "keys" && importKeys1Type.value != "file")
        return importKeys1Error.innerHTML = `${icon('exclamation-circle')} Select Key's type`;

    if (importKeys1Name.value == "" && importKeys1Type.value != "file")
        return importKeys1Error.innerHTML = `${icon('exclamation-circle')} Enter Key's name`;

    if (importKeys1Type.value == "file") {
        var save = await ImportFile();
        if (save === true)
            importKeys4Message.innerHTML = `${icon('check-circle')} Key imported successfully`;
        else
            importKeys4Message.innerHTML = `${icon('exclamation-circle')} ${save}`;

        frmWallets_Load();
    }

    if (importKeys1Type.value == "mnemonic")
        importKeys_Show(importKeys2Mnemonic);
    if (importKeys1Type.value == "keys")
        importKeys_Show(importKeys2Keys);
    if (importKeys1Type.value == "file")
        importKeys_Show(importKeys4);
}
async function importKeys2Mnemonic_Continue() {
    if (!(await CheckMnemonic(importKeys2MnemonicPhrase.innerHTML.trim())))
        return importKeys2MnemonicError.innerHTML = `${icon('exclamation-circle')} Invalid mnemonic phrase`;

    importKeys_Show(importKeys3);
}
async function importKeys2Mnemonic_keyboardAccept() {
    if (importKeys2MnemonicWord.value != "")
        importKeys2MnemonicPhrase.innerHTML += importKeys2MnemonicWord.value + " ";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicWord.value = "";
}
async function importKeys2Mnemonic_keyboardDelete() {
    importKeys2MnemonicGuess.innerHTML = importKeys2MnemonicGuess.innerHTML.substr(0, importKeys2MnemonicGuess.innerHTML.length - 1);
    importKeys2MnemonicWord.value = await GuessMnemonicWord(importKeys2MnemonicGuess.innerHTML);
}
async function importKeys2Mnemonic_keyboardClick(btn) {
    importKeys2MnemonicGuess.innerHTML += btn.innerHTML;
    importKeys2MnemonicWord.value = await GuessMnemonicWord(importKeys2MnemonicGuess.innerHTML);
}
async function importKeys2Keys_Continue() {
    if (importKeys2KeysList.children.length == 0)
        return importKeys2KeysError.innerHTML = `${icon('exclamation-circle')} Missing private key`;

    importKeys_Show(importKeys3);
}
async function importKeys2Keys_AddPrivateKey() {
    importKeys2KeysError.innerHTML = "";
    if (await CheckWIF(importKeys2KeysKey.value)) {
        importKeys2KeysList.innerHTML += `<li>${importKeys2KeysKey.value}</li>`;
        importKeys2KeysKey.value = "";
    } else {
        return importKeys2KeysError.innerHTML = `${icon('exclamation-circle')} Invalid WIF`;
    }
}
async function importKeys3_Save() {
    if (importKeys3Password1.value !== importKeys3Password2.value)
        return importKeys3Error.innerHTML = `${icon('exclamation-circle')} The passwords doesn't match`;

    if (importKeys1Type.value == "mnemonic") {
        var done = await ImportWallet("mnemonic", importKeys1Name.value, importKeys3Password1.value, importKeys2MnemonicPhrase.innerHTML.trim(), importKeys2MnemonicBIP39Passphrase.innerHTML);
        importKeys2MnemonicPhrase.innerHTML = "";
    } else if (importKeys1Type.value == "keys") {
        var keys = ([...importKeys2KeysList.children]).map(child => child.innerHTML).join("-");
        var done = await ImportWallet("keys", importKeys1Name.value, importKeys3Password1.value, keys, false);
        importKeys2KeysList.innerHTML = "";
    }

    if (done)
        importKeys4Message.innerHTML = `${icon('check-circle')} Keys saved`;
    else
        importKeys4Message.innerHTML = `${icon('exclamation-circle')} There was an error, please try again`;

    importKeys_Show(importKeys4);
    frmWallets_Load();
}