async function frmKeys_Load() {
    keyID = null;
    var keys = await GetKeys();

    keysList.innerHTML = "";

    if (keys.length == 0)
        keysList.innerHTML = `<div class="text-center">(No Keys Found)</div>`;

    for (var id of keys) {
        var key = await ReadKey(id);
        if (key !== null) {
            keysList.innerHTML += `
            <div class="option row p-4 mb-3 ${(keyID == key.id) ? "active" : ""}" onclick="frmKeys_Select('${id}')">
                <div class="col-4 my-auto">${key.name}</div>
                <div class="col-4 text-center my-auto">${key.type}</div>
                <div class="col-4 text-center my-auto">${key.type == 'mnemonic' ? key.words + " words phrase" : key.type == 'keys' ? key.secret.length + " key(s)" : "device"}</div>
            </div>`;
        }
    }

    topSettings.hidden = true;
    topKeys.hidden = true;
    frmOpen(frmKeys);
}


async function frmKeys_Select(id) {
    keyID = id;
    frmAccounts_Load();
}
async function frmKeys_Manage() {
    if (!keyID || accountID) return;
    var key = await ReadKey(keyID);
    if (key == null) return;
    manageKey1Name.value = key.name;
    manageKey_Show(manageKey1);
    modalToggle(manageKey);
}
async function manageKey_Show(screen) {
    manageKey1.hidden = true;
    manageKey2.hidden = true;
    manageKey3.hidden = true;

    screen.hidden = false;
}
async function manageKey_Close() {
    modalToggle(manageKey);
    manageKey1Name.value = "";
    manageKey3Status.innerHTML = "";
}
async function manageKey1_Export() {
    var save = await ExportKeyFile(keyID);
    if (save === true)
        manageKey3Status.innerHTML = `${icon('check-circle')} Key file exported successfully`;
    else
        manageKey3Status.innerHTML = `${icon('exclamation-circle')} ${save}`;

    manageKey_Show(manageKey3);
}
async function manageKey1_Delete() {
    manageKey_Show(manageKey2);
}
async function manageKey2_Delete() {
    var deleted = await DeleteKey(keyID);
    if (deleted === true)
        manageKey3Status.innerHTML = `${icon('check-circle')} Key file deleted successfully`;
    else
        manageKey3Status.innerHTML = `${icon('exclamation-circle')} ${deleted}`;

    frmKeys_Load();
    manageKey_Show(manageKey3);
}

async function frmKeys_Generate() {
    generateKeys_Show(generateKeys1);
    modalToggle(generateKeys)
}
async function generateKeys_Show(screen) {
    generateKeys1.hidden = true;
    generateKeys2.hidden = true;
    generateKeys3.hidden = true;

    screen.hidden = false;
}
async function generateKeys_Close() {
    modalToggle(generateKeys);
    generateKeys1Type.value = "null";
    generateKeys1Name.value = "";
    generateKeys1Message.innerHTML = "";

    generateKeys2Password1.value = "";
    generateKeys2Password2.value = "";
    generateKeys2Message.innerHTML = "";

    generateKeys3List.innerHTML = "";
}
async function generateKeys1_Continue() {
    if (generateKeys1Type.value != "24-words" && generateKeys1Type.value != "12-words")
        return generateKeys1Message.innerHTML = `${icon('exclamation-circle')} Select Key's type`;

    if (generateKeys1Name.value == "")
        return generateKeys1Message.innerHTML = `${icon('exclamation-circle')} Enter Key's name`;

    generateKeys_Show(generateKeys2);
}
async function generateKeys2_Generate() {
    if (generateKeys2Password1.value !== generateKeys2Password2.value)
        return generateKeys2Message.innerHTML = `${icon('exclamation-circle')} The passwords doesn't match`;


    var list = await GenerateKey(generateKeys1Name.value, generateKeys1Type.value, generateKeys2Password1.value);

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

        generateKeys3List.innerHTML = `<div class="mb-4">Please take note of this ${list.length} words in the order they appear. Anyone with access to them can move your funds. DO NOT SHARE OR LOSE YOUR RECOVERY PHRASE!!!</div>`
        generateKeys3List.innerHTML += `<div class="row">${data}</div>`
        delete list;
        delete data;
    }

    generateKeys_Show(generateKeys3);
    frmKeys_Load();
}

async function frmKeys_Import() {
    importKeys_Show(importKeys1);
    modalToggle(importKeys);
}
async function importKeys_Show(screen) {
    importKeys1.hidden = true;
    importKeys2Mnemonic.hidden = true;
    importKeys2Keys.hidden = true;
    importKeys3.hidden = true;
    importKeys4.hidden = true;

    screen.hidden = false;
}
async function importKeys_Close() {
    modalToggle(importKeys);
    importKeys1Type.value = "null";
    importName.hidden = true;
    importKeys1Name.value = "";
    importKeys1Message.innerHTML = "";

    importKeys2MnemonicPhrase.innerHTML = "";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicWord.value = "";
    importKeys2MnemonicBIP39Passphrase.value = "";
    importKeys2MnemonicMessage.innerHTML = "";

    importKeys2KeysKey.value = "";
    importKeys2KeysList.innerHTML = "";
    importKeys2KeysMessage.innerHTML = "";

    importKeys3Password1.value = "";
    importKeys3Password2.value = "";
    importKeys3Message.innerHTML = "";

    importKeys4Message.innerHTML = "";
}
async function importKeys1_Continue() {
    if (importKeys1Type.value != "mnemonic" && importKeys1Type.value != "keys" && importKeys1Type.value != "file" && importKeys1Type.value != "ledger")
        return importKeys1Message.innerHTML = `${icon('exclamation-circle')} Select Key's type`;

    if (importKeys1Name.value == "" && importKeys1Type.value != "file" && importKeys1Type.value != "ledger")
        return importKeys1Message.innerHTML = `${icon('exclamation-circle')} Enter Key's name`;

    if (importKeys1Type.value == "file") {
        var save = await ImportKeyFile();
        if (save === true)
            importKeys4Message.innerHTML = `${icon('check-circle')} Key imported successfully`;
        else
            importKeys4Message.innerHTML = `${icon('exclamation-circle')} ${save}`;

        frmKeys_Load();
    }

    if (importKeys1Type.value == "mnemonic")
        importKeys_Show(importKeys2Mnemonic);
    if (importKeys1Type.value == "keys")
        importKeys_Show(importKeys2Keys);
    if (importKeys1Type.value == "file")
        importKeys_Show(importKeys4);
    if (importKeys1Type.value == "ledger") {
        var done = await ImportKeys("ledger", "Ledger Hardware Wallet", "", "", false);

        if (done === true)
            importKeys4Message.innerHTML = `${icon('check-circle')} Keys saved`;
        else
            importKeys4Message.innerHTML = `${icon('exclamation-circle')} ${done}`;

        importKeys_Show(importKeys4);
        frmKeys_Load();
    }
}
async function importKeys2Mnemonic_Continue() {
    if (!(await CheckMnemonic(importKeys2MnemonicPhrase.innerHTML.trim())))
        return importKeys2MnemonicMessage.innerHTML = `${icon('exclamation-circle')} Invalid mnemonic phrase`;

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
        return importKeys2KeysMessage.innerHTML = `${icon('exclamation-circle')} Missing private key`;

    importKeys_Show(importKeys3);
}
async function importKeys2Keys_AddPrivateKey() {
    importKeys2KeysMessage.innerHTML = "";
    if (await CheckWIF(importKeys2KeysKey.value)) {
        importKeys2KeysList.innerHTML += `<li>${importKeys2KeysKey.value}</li>`;
        importKeys2KeysKey.value = "";
    } else {
        return importKeys2KeysMessage.innerHTML = `${icon('exclamation-circle')} Invalid WIF`;
    }
}
async function importKeys3_Save() {
    if (importKeys3Password1.value !== importKeys3Password2.value)
        return importKeys3Message.innerHTML = `${icon('exclamation-circle')} The passwords doesn't match`;

    if (importKeys1Type.value == "mnemonic") {
        var done = await ImportKeys("mnemonic", importKeys1Name.value, importKeys3Password1.value, importKeys2MnemonicPhrase.innerHTML.trim(), importKeys2MnemonicBIP39Passphrase.value);
        importKeys2MnemonicPhrase.innerHTML = "";
    } else if (importKeys1Type.value == "keys") {
        var keys = ([...importKeys2KeysList.children]).map(child => child.innerHTML);
        var done = await ImportKeys("keys", importKeys1Name.value, importKeys3Password1.value, keys, false);
        importKeys2KeysList.innerHTML = "";
    }

    if (done === true)
        importKeys4Message.innerHTML = `${icon('check-circle')} Keys saved`;
    else
        importKeys4Message.innerHTML = `${icon('exclamation-circle')} ${done}`;

    importKeys_Show(importKeys4);
    frmKeys_Load();
}