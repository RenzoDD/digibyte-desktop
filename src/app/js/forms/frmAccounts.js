async function frmAccounts_Load() {
    accountID = null;
    var key = await ReadKey(keyID);
    if (key == null) return;

    accountsName.innerHTML = key.name;

    var accounts = await GetAccounts();

    accountsList.innerHTML = "";

    if (accounts.length == 0)
        accountsList.innerHTML = `<div class="text-center">(No Accounts Found)</div>`;

    var exchange = await GetPrice();

    for (var id of accounts) {
        var account = await GetAccount(id);
        if (account !== null && account.secret == keyID) {
            var balance = await GetAccountBalance(id);
            balance = coin(balance.satoshis, 8, false);
            var usd = (exchange.price * balance).toFixed(2);

            accountsList.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmAccount_Load('${account.id}')">
                <div class="col-3">${account.name}</div>
                <div class="col-3">${account.type == 'derived' ? account.address : account.type}</div>
                <div class="col-3">${balance} DGB</div>
                <div class="col-3">${usd} USD</div>
            </div>`;
        }
    }

    frmOpen(frmAccounts);
    topKeys.hidden = false;
    topReturnToAccounts.hidden = true;
}

async function frmAccounts_Manage() {
    if (!accountID) return;
    var account = await GetAccount(accountID);
    if (account == null) return;
    manageAccount1Name.value = account.name;
    if (account.type != 'single') {
        manageAccount1xpub.parentElement.hidden = false;
        manageAccount1Path.parentElement.hidden = false;
        manageAccount1xpub.value = account.xpub;
        manageAccount1Path.value = account.path;
    } else {
        manageAccount1xpub.parentElement.hidden = true;
        manageAccount1Path.parentElement.hidden = true;
    }
    manageAccount_Show(manageAccount1);
    modalToggle(manageAccount);
}
async function manageAccount_Show(screen) {
    manageAccount1.hidden = true;
    manageAccount2.hidden = true;
    manageAccount3.hidden = true;

    screen.hidden = false;
}
async function manageAccount_Close() {
    modalToggle(manageAccount);
    manageAccount1Name.value = "";
    manageAccount1xpub.value = "";
    manageAccount1Path.value = "";

    manageAccount3Status.innerHTML = "";
}
async function manageAccount1_Delete() {
    manageAccount_Show(manageAccount2);
}
async function manageAccount2_Delete() {
    var deleted = await DeleteAccount(accountID);
    if (deleted === true)
        manageAccount3Status.innerHTML = `${icon('check-circle')} Account file deleted successfully`;
    else
        manageAccount3Status.innerHTML = `${icon('exclamation-circle')} ${deleted}`;

    frmAccounts_Load();
    manageAccount_Show(manageAccount3);
}

async function frmAccounts_Add() {
    var key = await ReadKey(keyID);
    if (key.type == "mnemonic") {
        addAccount1Type.innerHTML += '<option value="derived">Derived Account</option>';
        if (key.words == 12 && key.passphrase == false)
            addAccount1Type.innerHTML += '<option value="mobile">DigiByte Mobile Account</option>';
    } else {
        addAccount1Type.innerHTML += '<option value="single">Single Account</option>';
    }
    addAccount2Password.placeholder = "Password of " + key.name;

    addAccount_Show(addAccount1);
    modalToggle(addAccount);
}
async function addAccount_Show(screen) {
    addAccount1.hidden = true;
    addAccount2.hidden = true;
    addAccount3.hidden = true;
    addAccount4.hidden = true;
    addAccount5.hidden = true;

    screen.hidden = false;
}
async function addAccount_Close() {
    modalToggle(addAccount);
    addAccount1Name.value = "";
    addAccount1Message.innerHTML = "";

    addAccount1Type.innerHTML = '<option value="null" selected disabled>Select account</option>';
    addAccount1TypeAddress.hidden = true;
    addAccount1TypeLegacy.checked = false;
    addAccount1TypeScript.checked = false;
    addAccount1TypeSegwit.checked = false;

    addAccount2Password.value = "";
    addAccount2Password.placeholder = "";
    addAccount2Message.innerHTML = "";

    addAccount3Found.innerHTML = "";
    addAccount3Spinner.hidden = true;
    addAccount3Message.innerHTML = "";

    addAccount4Found.innerHTML = "";
    addAccount4Spinner.hidden = true;

    addAccount5Message.innerHTML = "";
}
async function addAccount1_Continue() {
    if (addAccount1Name.value == "")
        return addAccount1Message.innerHTML = icon("exclamation-circle") + " Enter a name";
    if (addAccount1Type.value == "null")
        return addAccount1Message.innerHTML = icon("exclamation-circle") + " Select an account type";
    if (addAccount1Type.value == "derived") {
        var address = "null";
        address = addAccount1TypeLegacy.checked ? "legacy" : address;
        address = addAccount1TypeScript.checked ? "script" : address;
        address = addAccount1TypeSegwit.checked ? "segwit" : address;

        if (address == "null")
            return addAccount1Message.innerHTML = icon("exclamation-circle") + " Select an address type";
    }
    addAccount_Show(addAccount2);
}
async function addAccount2_Continue() {
    if (await CheckPassword(keyID, addAccount2Password.value) == false)
        return addAccount2Message.innerHTML = icon('exclamation-circle') + " Incorrect password";

    if (addAccount1Type.value == 'derived' || addAccount1Type.value == 'mobile') {
        addAccount_Show(addAccount4);
        if (addAccount1Type.value == "derived") {
            var address = "null";
            address = addAccount1TypeLegacy.checked ? "legacy" : address;
            address = addAccount1TypeScript.checked ? "script" : address;
            address = addAccount1TypeSegwit.checked ? "segwit" : address;

            var xpubs = await GenerateXPUB(keyID, addAccount2Password.value, address);
        } if (addAccount1Type.value == "mobile") {
            var address = "legacy";
            var xpubs = await GenerateXPUB(keyID, addAccount2Password.value, 'mobile');
        }

        addAccount2Password.value = "";

        var accounts = await GetAccounts();
        var oldXPUBs = [];
        for (var id of accounts) {
            var account = await GetAccount(id);
            if (account.xpub) oldXPUBs.push(account.xpub)
        }

        var unused = false;
        addAccount4Spinner.hidden = false;
        for (var n in xpubs) {
            var xpub = xpubs[n];
            if (oldXPUBs.indexOf(xpub) != -1)
                continue;

            var result = await NewXPUB(xpub, address);

            if (addAccount4Spinner.hidden == true)
                break;

            if (result === null)
                break;
            else if (result == true && unused == false) {
                unused = true;
                addAccount4Found.innerHTML += `
                    <div class="option row mx-1 p-3 mb-2" onclick="addAccount4_Account('${xpub}', ${n})">
                        <div class="col-6 text-start">DigiByte ${n}</div>
                        <div class="col-6 text-end">(Unused)</div>
                    </div>`;
            } else if (typeof result == 'string') {
                addAccount4Found.innerHTML += `
                    <div class="option row mx-1 p-3 mb-2" onclick="addAccount4_Account('${xpub}', ${n})">
                        <div class="col-6 text-start">DigiByte ${n}</div>
                        <div class="col-6 text-end">${coin(result, 8)}</div>
                    </div>`;
            }
        }
        addAccount4Spinner.hidden = true;
    } else if (addAccount1Type.value == 'single') {
        var addresses = await GenerateAddresses(keyID, addAccount2Password.value, 'livenet');
        addAccount_Show(addAccount3);
        addAccount3Spinner.hidden = false;
        for (var n of addresses) {
            for (var type of Object.keys(n)) {
                var result = await NewAddress(n[type]);
                if (addAccount3Spinner.hidden == true)
                    break;
                if (result === null)
                    break;
                addAccount3Found.innerHTML += `
                    <label class="option row mx-1 py-3 px-1 mb-2">
                        <div class="col-1 my-auto">
                            <input class="form-check-input" type="checkbox" id="addAccount3Check${n[type]}" value="${n[type]}">
                        </div>
                        <div class="col">
                                ${n[type]}
                                <br>
                                ${result === true ? 'Unused' : 'DGB ' + coin(result, 8)}
                        </div>
                    </label>`;
            }
        }
        addAccount3Spinner.hidden = true;
    }
}
async function addAccount3_Create() {
    addAccount3Spinner.hidden = true;
    var checks = document.querySelectorAll('[id^="addAccount3Check"]');
    var addresses = [];
    checks.forEach(check => { if (check.checked) addresses.push(check.value); });
    if (addresses.length == 0) return addAccount3Message.innerHTML = "Select at least one account";

    addAccount_Show(addAccount5);
    var result = await GenerateAccount(addAccount1Name.value, addAccount1Type.value, keyID, addresses);
    if (result == true) {
        frmAccounts_Load();
        addAccount5Message.innerHTML = "Account created";
    } else {
        addAccount5Message.innerHTML = icon("exclamation-circle") + " " + result;
    }
}
async function addAccount4_StopLooking() {
    addAccount4Spinner.hidden = true;
}
async function addAccount4_Account(xpub, account) {
    addAccount_Show(addAccount5);
    addAccount4Spinner.hidden = true;

    var purpose = "null";
    if (addAccount1Type.value == 'derived') {
        purpose = addAccount1TypeLegacy.checked ? "legacy" : purpose;
        purpose = addAccount1TypeScript.checked ? "script" : purpose;
        purpose = addAccount1TypeSegwit.checked ? "segwit" : purpose;
    }

    var result = await GenerateAccount(addAccount1Name.value, addAccount1Type.value, keyID, xpub, purpose, account);

    if (result == true) {
        frmAccounts_Load();
        addAccount5Message.innerHTML = "Account created";
    } else {
        addAccount5Message.innerHTML = icon("exclamation-circle") + " " + result;
    }
}