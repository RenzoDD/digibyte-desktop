async function frmKeys_Load() {
    topKeyName.innerHTML = "";
    keyID.value = null;
    var keys = await GetKeys();

    keysList.innerHTML = "";

    if (keys.length == 0)
        keysList.innerHTML = `<div class="text-center">(No Keys Found)</div>`;

    for (var id of keys) {
        var key = await ReadKey(id);
        if (key !== null) {
            keysList.innerHTML += `
            <div class="option row p-4 mb-3 ${ (keyID.value == key.id)  ? "active" : "" }" onclick="frmKeys_Select('${id}')">
                <div class="col-4 my-auto">${key.name}</div>
                <div class="col-4 text-center my-auto">${key.type}</div>
                <div class="col-4 text-center my-auto">${key.type == 'mnemonic' ? key.words + " words phrase" : key.secret.length + " key(s)" }</div>
            </div>`;
        }
    }

    frmOpen(frmKeys);
}


async function frmKeys_Select(id) {
    keyID.value = id;

    var key = await ReadKey(keyID.value);
    if (key == null) return;
    topKeyName.innerHTML = icon("key", 18) + ' ' + key.name;

    frmAccounts_Load();
}
async function frmKeys_Manage() {
    var key = await ReadKey(keyID.value);
    if (key == null) return;
    manageKeys1ID.value = key.id;
    manageKeys1Name.value = key.name;
    manageKey_Show(manageKeys1);
    modalToggle(manageKeys);
}
async function manageKey_Show(screen) {
    manageKeys1.hidden = true;
    manageKeys2.hidden = true;
    manageKeys3.hidden = true;

    screen.hidden = false;
}
async function manageKey_Close() {
    modalToggle(manageKeys);
    manageKeys1ID.value = "";
    manageKeys1Name.value = "";
    manageKeys3Status.innerHTML = "";
}
async function manageKeys1_Export() {
    var save = await ExportKeyFile(manageKeys1ID.value);
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
    var deleted = await DeleteKey(manageKeys1ID.value);
    if (deleted === true)
        manageKeys3Status.innerHTML = `${icon('check-circle')} Key file deleted successfully`;
    else
        manageKeys3Status.innerHTML = `${icon('exclamation-circle')} ${deleted}`;

    frmKeys_Load();
    manageKey_Show(manageKeys3);
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

        generateKeys3List.innerHTML = `<div class="mb-4">Please take note of this ${list.length} words. Anyone with access to them can move your funds. DO NOT SHARE OR LOSE YOUR RECOVERY PHRASE!!!</div>`
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
    importKeys1Name.value = "";
    importKeys1Error.innerHTML = "";

    importKeys2MnemonicPhrase.innerHTML = "";
    importKeys2MnemonicGuess.innerHTML = "";
    importKeys2MnemonicWord.value = "";
    importKeys2MnemonicBIP39Passphrase.value = "";
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