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