async function frmAccounts_Load() {
    var accounts = await GetAccounts();

    accountsList.innerHTML = "";

    if (accounts.length == 0)
        accountsList.innerHTML = `<div class="text-center">(No Accounts Found)</div>`;

    for (var id of accounts) {
        var account = await GetAccount(id);
        if (account !== null) {
            accountsList.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmAccounts_Manage('${account.id}')">
                <div class="col-3">${account.name}</div>
                <div class="col-3">${account.type == 'derived' ? ({ 44: "legacy", 49: "compatibility", 84: "segwit" }[account.purpose]) : account.type}</div>
                <div class="col-3">DGB</div>
                <div class="col-3">USD</div>
            </div>`;
        }
    }

    frmOpen(frmAccounts);
}

async function frmAccounts_Add() {
    addAccount_Clear();
    addAccount_Show(addAccount1)
}
async function addAccount_Show(screen) {
    addAccount1.hidden = true;
    addAccount2.hidden = true;
    addAccount3.hidden = true;
    addAccount4.hidden = true;

    screen.hidden = false;
}
async function addAccount_Clear() {
    addAccount1Keys.innerHTML = `<option value="null" selected disabled>Select keys</option>`;
    var keys = await GetKeys();
    for (var id of keys) {
        var key = await ReadKey(id);
        addAccount1Keys.innerHTML += `<option value="${id}">${key.name} (${key.type})</option>`;
    }
    addAccount1Keys.value = "null";
    addAccount1Name.value = "";
    addAccount1Error.innerHTML = "";

    addAccount2Type.innerHTML = '<option value="null" selected disabled>Select account</option>';
    addAccount2TypeAddress.hidden = true;
    addAccount2TypeLegacy.checked = false;
    addAccount2TypeCompatibility.checked = false;
    addAccount2TypeSegwit.checked = false;
    addAccount2Password.value = "";
    addAccount2Password.placeholder = "";

    addAccount3Found.innerHTML = "";
    addAccount3Spinner.hidden = true;
}
async function addAccount1_Continue() {
    if (addAccount1Keys.value == "null")
        return addAccount1Error.innerHTML = icon("exclamation-circle") + " Select a key";

    if (addAccount1Name.value == "")
        return addAccount1Error.innerHTML = icon("exclamation-circle") + " Enter a name";

    var key = await ReadKey(addAccount1Keys.value);
    if (key.type == "mnemonic") {
        addAccount2Type.innerHTML += '<option value="derived">Derived Account</option>';
        if (key.words == 12 && key.passphrase == false)
            addAccount2Type.innerHTML += '<option value="mobile">DigiByte Mobile Account</option>';
    } else {
        addAccount2Type.innerHTML += '<option value="mobile">Single Account</option>';
    }
    addAccount2Password.placeholder = "Password of " + key.name;
    addAccount_Show(addAccount2);
}
async function addAccount2_Continue() {
    if (addAccount2Type.value == "null")
        return addAccount2Error.innerHTML = icon("exclamation-circle") + " Select an account type";

    if (addAccount2Type.value == "derived") {
        var address = "null";
        address = addAccount2TypeLegacy.checked ? "legacy" : address;
        address = addAccount2TypeCompatibility.checked ? "compatibility" : address;
        address = addAccount2TypeSegwit.checked ? "segwit" : address;

        if (address == "null")
            return addAccount2Error.innerHTML = icon("exclamation-circle") + " Select an address type";
    } if (addAccount2Type.value == "mobile") {
        var address = "legacy";
    }

    if (addAccount2Type.value == 'derived')
        var xpubs = await GeneateXPUB(addAccount1Keys.value, addAccount2Password.value, address);
    else if (addAccount2Type.value == 'mobile')
        var xpubs = await GeneateXPUB(addAccount1Keys.value, addAccount2Password.value, 'mobile');

    addAccount2Password.value = "";

    addAccount_Show(addAccount3);

    var unused = false;
    addAccount3Spinner.hidden = false;
    for (var n in xpubs) {
        var xpub = xpubs[n];
        var result = await NewXPUB(xpub, address);

        if (addAccount3Spinner.hidden == true)
            break;

        if (result === null)
            break;
        else if (result == true && unused == false) {
            unused = true;
            addAccount3Found.innerHTML += `
            <div class="option row mx-1 p-3 mb-2" onclick="addAccount3_Account('${xpub}', ${n})">
				<div class="col-6 text-start">DigiByte ${n}</div>
				<div class="col-6 text-end">(Unused)</div>
			</div>`;
        } else if (typeof result == 'string') {
            addAccount3Found.innerHTML += `
            <div class="option row mx-1 p-3 mb-2" onclick="addAccount3_Account('${xpub}', ${n})">
				<div class="col-6 text-start">DigiByte ${n}</div>
				<div class="col-6 text-end">${result}</div>
			</div>`;
        }
    }

    addAccount3Spinner.hidden = true;
}
async function addAccount3_StopLooking() {
    addAccount3Spinner.hidden = true;
}
async function addAccount3_Account(xpub, account) {
    addAccount_Show(addAccount4);
    addAccount3Spinner.hidden = true;

    var purpose = "null";
    if (addAccount2Type.value == 'derived') {
        purpose = addAccount2TypeLegacy.checked ? "legacy" : purpose;
        purpose = addAccount2TypeCompatibility.checked ? "compatibility" : purpose;
        purpose = addAccount2TypeSegwit.checked ? "segwit" : purpose;
    }

    var result = await GenerateAccount(addAccount1Name.value, addAccount2Type.value, addAccount1Keys.value, xpub, purpose, account);

    if (result == true) {
        frmAccounts_Load();
        addAccount4Message.innerHTML = "Account created";
    } else {
        addAccount4Message.innerHTML = icon("exclamation-circle") + " " + result;
    }
}

async function frmAccounts_Manage(id) {
    var account = await GetAccount(id);
    var data = await GetAccountData(id);
    if (account.type == 'derived') {
        accountName.innerHTML = icon('digibyte', 40) + ' ' + account.name;
        transactionList.innerHTML = "";

        var lastDate = new Date(0).toDateString().substring(4, 15);
        for (var i = 0; i < 100 && i < data.length; i++) {
            var movement = data[i];
            var date = new Date(movement.unix * 1000).toDateString().substring(4, 15);
            var time = new Date(movement.unix * 1000).toTimeString().substring(0, 8);

            if (date != lastDate)
                transactionList.innerHTML += `
                    <div class="mb-3">
                        ${date}
                    </div>`;

            transactionList.innerHTML += `
                    <div class="option row p-4 mb-3" data-bs-toggle="modal" data-bs-target="#" onclick="">
						<div class="col-1 icn-green">
						    ${icon(movement.change > 0 ? 'box-arrow-in-down' : (movement.change < 0 ? 'box-arrow-up' : 'dash-square'), 24)}
						</div>
						<div class="col-1">
							${time}
						</div>
						<div class="col-5">${movement.note}</div>
						<div class="col-5 text-end fw-bold" style="color: ${movement.change > 0 ? 'green' : (movement.change < 0 ? 'red' : 'white')}">
                            ${movement.change > 0 ? '+' : (movement.change < 0 ? '-' : '')}
                            ${coin(movement.change, 8)}
                        </div >
					</div >
                `;

            lastDate = date;
        }

        frmOpen(frmAccount);
    }
}