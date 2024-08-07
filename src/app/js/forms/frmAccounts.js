async function frmAccounts_Load() {
    accountID = null;
    var key = await GetKey(keyID);
    if (key == null) return;

    accountsName.innerHTML = key.name;

    var accounts = await GetAccounts();
    var exchange = await GetPrice();

    accountsList.innerHTML = "";
    for (var id of accounts) {
        var account = await GetAccount(id);
        if (account !== null && account.secret == keyID) {
            var balance = await GetAccountBalance(id);
            var usd = coin((100 * exchange.price * coin(balance.satoshis, 8)).toFixed(0).toString(), 2, false, true);

            accountsList.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmAccount_Load('${account.id}')">
                <div class="col-3">${account.name}</div>
                <div class="col-3">${account.type == 'derived' ? account.address : account.type}</div>
                <div class="col-3">${coin(balance.satoshis, 8, true, true)} DGB</div>
                <div class="col-3">${usd} USD</div>
            </div>`;
        }
    }


    if (accountsList.innerHTML == "")
        accountsList.innerHTML = `<div class="text-center">(No Accounts Found)</div>`;

    frmOpen(frmAccounts);
    topSettings.hidden = false;
    topKeys.hidden = false;
    topReturnToAccounts.hidden = true;
}

async function frmAccounts_Add() {
    var key = await GetKey(keyID);
    if (key.type == "mnemonic") {
        addAccount1Type.innerHTML += '<option value="derived">Derived Account</option>';
        if (key.words == 12 && key.passphrase == false)
            addAccount1Type.innerHTML += '<option value="mobile">DigiByte Mobile Account</option>';
    } else if (key.type == "ledger") {
        addAccount1Type.innerHTML += '<option value="derived">Derived Account</option>';
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
    addAccount6.hidden = true;

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

    ledgerOFF = true;
    addAccount3Status.innerHTML = "";

    addAccount4Found.innerHTML = "";
    addAccount4Spinner.hidden = true;
    addAccount4Message.innerHTML = "";

    addAccount5Found.innerHTML = "";
    addAccount5Spinner.hidden = true;

    addAccount6Message.innerHTML = "";
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

    var key = await GetKey(keyID);
    if (key.type == "ledger") {
        addAccount_Show(addAccount3);

        addAccount3Status.innerHTML = icon('usb-symbol') + " Checking device...";
        while (true) {
            if (ledgerOFF) break;

            var result = await LedgerIsReady();
            if (result == "DISCONECTED") addAccount3Status.innerHTML = icon('usb-symbol') + " Connect your device...";
            else if (result == "LOCKED") addAccount3Status.innerHTML = icon('lock') + " Unlock your device...";
            else if (result == "IN_MENU" || result == "OTHER_APP") addAccount3Status.innerHTML = icon('app-indicator') + " Open the DigiByte App...";
            else if (typeof result == 'string') addAccount3Status.innerHTML = icon('exclamation-circle') + " Error: " + result.toLocaleLowerCase() + "...";
            else if (result === true) {
                addAccount2_Continue()
                break;
            }
        }
    } else
        addAccount_Show(addAccount2);
}
async function addAccount2_Continue() {
    var key = await GetKey(keyID)
    if (key.type == "mnemonic" || key.type == "keys")
        if (await CheckPassword(keyID, addAccount2Password.value) == false)
            return addAccount2Message.innerHTML = icon('exclamation-circle') + " Incorrect password";

    if (addAccount1Type.value == 'derived' || addAccount1Type.value == 'mobile') {
        addAccount_Show(addAccount5);
        if (addAccount1Type.value == "derived") {
            var address = "null";
            address = addAccount1TypeLegacy.checked ? "legacy" : address;
            address = addAccount1TypeScript.checked ? "script" : address;
            address = addAccount1TypeSegwit.checked ? "segwit" : address;

            var xpubs = await GenerateXPUB(keyID, addAccount2Password.value, address);
            if (typeof xpubs == 'string') {
                addAccount6Message.innerHTML = icon("exclamation-circle") + " Error: " + xpubs;
                return addAccount_Show(addAccount6);
            }
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
        addAccount5Spinner.hidden = false;
        for (var n in xpubs) {
            var xpub = xpubs[n];
            if (oldXPUBs.indexOf(xpub) != -1)
                continue;

            var result = await NewXPUB(xpub, address);

            if (addAccount5Spinner.hidden == true)
                break;

            if (result === null)
                break;
            else if (result == true && unused == false) {
                unused = true;
                addAccount5Found.innerHTML += `
                    <div class="option row mx-1 p-3 mb-2" onclick="addAccount5_Account('${xpub}', ${n})">
                        <div class="col-6 text-start">DigiByte ${n}</div>
                        <div class="col-6 text-end">(Unused)</div>
                    </div>`;
            } else if (typeof result == 'string') {
                addAccount5Found.innerHTML += `
                    <div class="option row mx-1 p-3 mb-2" onclick="addAccount5_Account('${xpub}', ${n})">
                        <div class="col-6 text-start">DigiByte ${n}</div>
                        <div class="col-6 text-end">${coin(result, 8, true, true)}</div>
                    </div>`;
            }
        }
        addAccount5Spinner.hidden = true;
    } else if (addAccount1Type.value == 'single') {
        var addresses = await GenerateAddresses(keyID, addAccount2Password.value, 'livenet');
        addAccount_Show(addAccount4);
        addAccount4Spinner.hidden = false;
        for (var n of addresses) {
            for (var type of Object.keys(n)) {
                var result = await NewAddress(n[type]);
                if (addAccount4Spinner.hidden == true)
                    break;
                if (result === null)
                    break;
                addAccount4Found.innerHTML += `
                    <label class="option row mx-1 py-3 px-1 mb-2">
                        <div class="col-1 my-auto">
                            <input class="form-check-input" type="checkbox" id="addAccount4Check${n[type]}" value="${n[type]}">
                        </div>
                        <div class="col">
                                ${n[type]}
                                <br>
                                ${result === true ? 'Unused' : 'DGB ' + coin(result, 8, true, true)}
                        </div>
                    </label>`;
            }
        }
        addAccount4Spinner.hidden = true;
    }
}
async function addAccount4_Create() {
    addAccount4Spinner.hidden = true;
    var checks = document.querySelectorAll('[id^="addAccount4Check"]');
    var addresses = [];
    checks.forEach(check => { if (check.checked) addresses.push(check.value); });
    if (addresses.length == 0) return addAccount4Message.innerHTML = "Select at least one account";

    addAccount_Show(addAccount6);
    var result = await GenerateAccount(addAccount1Name.value, addAccount1Type.value, keyID, addresses);
    if (result == true) {
        frmAccounts_Load();
        addAccount6Message.innerHTML = icon('check-circle') + " Account created";
    } else {
        addAccount6Message.innerHTML = icon("exclamation-circle") + " " + result;
    }
}
async function addAccount5_StopLooking() {
    addAccount5Spinner.hidden = true;
}
async function addAccount5_Account(xpub, account) {
    addAccount_Show(addAccount6);
    addAccount5Spinner.hidden = true;

    var purpose = "null";
    if (addAccount1Type.value == 'derived') {
        purpose = addAccount1TypeLegacy.checked ? "legacy" : purpose;
        purpose = addAccount1TypeScript.checked ? "script" : purpose;
        purpose = addAccount1TypeSegwit.checked ? "segwit" : purpose;
    }

    var result = await GenerateAccount(addAccount1Name.value, addAccount1Type.value, keyID, xpub, purpose, account);

    if (result == true) {
        frmAccounts_Load();
        addAccount6Message.innerHTML = icon('check-circle') + " Account created";
    } else {
        addAccount6Message.innerHTML = icon("exclamation-circle") + " " + result;
    }
}