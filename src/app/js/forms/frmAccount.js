let mempool = [];
let movements = [];
async function transactionList_Fill(start, instance = null) {
    if (instance != null) {
        instance.parentElement.removeChild(instance);
    }
    var lastDate = new Date(0).toDateString().substring(4, 15);
    for (var i = start; i < start + 50; i++) {
        if (i >= movements.length) break;

        var movement = movements[i];
        var date = new Date(movement.unix * 1000).toDateString().substring(4, 15);
        var time = new Date(movement.unix * 1000).toTimeString().substring(0, 8);

        if (date != lastDate)
            transactionList.innerHTML += `
                <div class="mb-3">
                    ${date}
                </div>`;

        transactionList.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmAccount_TX('movement', '${i}')">
				<div class="col-1 icn-green">
				    ${icon(movement.type == 'received' ? 'box-arrow-in-down' : movement.type == 'sent' ? 'box-arrow-up' : 'dash-square', 24)}
				</div>
				<div class="col-1">
					${time}
				</div>
				<div class="col-5">${movement.type == 'received' ? movement.from[0] : movement.type == 'sent' ? movement.to[0] : movement.to[0]}</div>
				<div class="col-5 text-end fw-bold" style="color: ${movement.isAsset || movement.change == 0 ? 'white' : (movement.change > 0 ? 'green' : 'red')}">
                    ${movement.isAsset ? icon('digiasset') + " DigiAsset" : ((movement.change > 0 ? '+' : '') + coin(movement.change, 8, true, true))}
                </div >
			</div>`;

        lastDate = date;
    }
    if (i < movements.length) {
        transactionList.innerHTML += `
        <div class="option row p-4 mb-3" onclick="transactionList_Fill(${i}, this)">
            <div class="text-center">
                ${icon('plus-circle')} Show more...
            </div>
        </div>`;
    }
}
async function frmAccount_Load(id) {
    accountID = id;

    var account = await GetAccount(id);
    var balance = await GetAccountBalance(id);

    mempool = await GetAccountMempool(id);
    movements = await GetAccountMovements(id);

    accountReceive.hidden = false;
    transactionList.innerHTML = "";

    if (account.type == 'derived') {
        accountName.innerHTML = icon('digibyte', 40) + ' ' + account.name;
    } else if (account.type == 'mobile') {
        accountName.innerHTML = icon('phone', 40) + ' ' + account.name;
        accountReceive.hidden = true;
    } else if (account.type == 'single') {
        accountName.innerHTML = icon('paperclip', 40) + ' ' + account.name;
    }


    for (var i = 0; i < mempool.length; i++) {
        if (transactionList.innerHTML == "")
            transactionList.innerHTML = "Unconfirmed";
        var movement = mempool[i];
        var time = new Date(movement.unix * 1000).toTimeString().substring(0, 8);
        transactionList.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmAccount_TX('mempool', '${i}')">
                <div class="col-1 icn-green">
                    ${icon(movement.type == 'received' ? 'box-arrow-in-down' : movement.type == 'sent' ? 'box-arrow-up' : 'dash-square', 24)}
                </div>
                <div class="col-1">
                    ${time}
                </div>
                <div class="col-5">${movement.type == 'received' ? movement.from[0] : movement.type == 'sent' ? movement.to[0] : movement.to[0]}</div>
                <div class="col-5 text-end fw-bold" style="color: ${movement.isAsset || movement.change == 0 ? 'white' : (movement.change > 0 ? 'green' : 'red')}">
                    ${movement.isAsset ? icon('digiasset') + " DigiAsset" : ((movement.change > 0 ? '+' : '') + coin(movement.change, 8, true, true))}
                </div >
            </div>`;
    }

    transactionList_Fill(0);

    accountBalance.innerHTML = coin(balance.satoshis, 8, false, true) + " DGB";

    var exchange = await GetPrice();
    var usd = coin((100 * exchange.price * coin(balance.satoshis, 8)).toFixed(0).toString(), 2, true, true);
    accountPrice.innerHTML = "$ " + usd;

    frmOpen(frmAccount);
    topKeys.hidden = true;
    topReturnToAccounts.hidden = false;
}

async function frmAccount_Manage() {
    if (!accountID) return;
    var account = await GetAccount(accountID);
    if (account == null) return;
    manageAccount1Name.value = account.name;
    if (account.type != 'single') {
        manageAccount1xpub.parentElement.parentElement.hidden = false;
        manageAccount1Path.parentElement.parentElement.hidden = false;
        manageAccount1xpub.value = account.xpub;
        manageAccount1Path.value = account.path;
    } else {
        manageAccount1xpub.parentElement.parentElement.hidden = true;
        manageAccount1Path.parentElement.parentElement.hidden = true;
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
async function manageAccount1xpub_Copy() {
    var result = await CopyClipboard(manageAccount1xpub.value);
    if (result) manageAccount1xpubCopy.innerHTML = icon('clipboard-check', 15);
    else manageAccount1xpubCopy.innerHTML = icon('clipboard-x', 15);
}
async function manageAccount1Path_Copy() {
    var result = await CopyClipboard(manageAccount1Path.value);
    if (result) manageAccount1PathCopy.innerHTML = icon('clipboard-check', 15);
    else manageAccount1PathCopy.innerHTML = icon('clipboard-x', 15);
}

async function frmAccount_Receive() {
    modalToggle(receiveDGB);

    var key = await GetKey(keyID);
    var account = await GetAccount(accountID);

    if (key.type == "ledger") {
        receiveDGB_Show(receiveDGB2);
        ledgerOFF = false;
        receiveDGB2Status.innerHTML = icon('usb-symbol') + " Checking device...";
        while (true) {
            if (ledgerOFF) {
                receiveDGB2Status.innerHTML = icon('exclamation-circle') + " " + address.error;
                return;
            }
            var result = await LedgerIsReady();
            if (result == "DISCONECTED") receiveDGB2Status.innerHTML = icon('usb-symbol') + " Connect your device...";
            else if (result == "LOCKED") receiveDGB2Status.innerHTML = icon('lock') + " Unlock your device...";
            else if (result == "IN_MENU" || result == "OTHER_APP") receiveDGB2Status.innerHTML = icon('app-indicator') + " Open the DigiByte App...";
            else if (typeof result == 'string') receiveDGB2Status.innerHTML = icon('exclamation-circle') + " Error: " + result.toLocaleLowerCase() + "...";
            else if (result === true) {
                var addressUnsafe = await GenerateLastAddres(accountID);
                receiveDGB2Status.innerHTML = icon('check-circle') + " Aprove this address on your device...<br>" + addressUnsafe;
                var address = await LedgerGenerateAddress(account.path + "/0/" + account.external, account.address);
                break;
            }
        }
    } else {
        var address = await GenerateLastAddres(accountID);
    }

    receiveDGB1Address.value = address;
    receiveDGB1Path.innerHTML = account.path ? account.path + "/0/" + account.external : "";
    receiveDGB1QR.src = DigiQR.text(address, 200, 2);

    receiveDGB_Show(receiveDGB1);
}
async function receiveDGB_Show(screen) {
    receiveDGB1.hidden = true;
    receiveDGB2.hidden = true;

    screen.hidden = false;
}
async function receiveDGB_Close() {
    modalToggle(receiveDGB);
    receiveDGB1QR.src = "";
    receiveDGB1Path.innerHTML = "";
    receiveDGB1Address.value = "";
    receiveDGB1Copy.innerHTML = icon('clipboard');

    ledgerOFF = true;
    receiveDGB2Status.innerHTML = "";
}
async function receiveDGB1_Copy() {
    var result = await CopyClipboard(receiveDGB1Address.value);
    if (result) receiveDGB1Copy.innerHTML = icon('clipboard-check', 15);
    else receiveDGB1Copy.innerHTML = icon('clipboard-x');
}
async function receiveDGB2_LedgerManual() {
    var account = await GetAccount(accountID);
    var address = await GenerateLastAddres(accountID);

    ledgerOFF = true;
    receiveDGB2Status.innerHTML = "";
    receiveDGB1Address.value = address;
    receiveDGB1Path.innerHTML = account.path ? account.path + "/0/" + account.external : "";
    receiveDGB1QR.src = DigiQR.text(address, 200, 2);

    receiveDGB_Show(receiveDGB1);
}


async function frmAccount_Send() {
    var account = await GetAccount(accountID);
    var keys = await GetKey(account.secret);
    sendDGB3Password.placeholder = keys.name;

    sendDGB1_AddOutput();
    sendDGB_Show(sendDGB1);
    modalToggle(sendDGB);
}
async function sendDGB_Show(screen) {
    sendDGB1.hidden = true;
    sendDGB2.hidden = true;
    sendDGB3.hidden = true;
    sendDGB4.hidden = true;
    sendDGB5.hidden = true;

    screen.hidden = false;
}
async function sendDGB_Close() {
    modalToggle(sendDGB);
    sendDGB1Outputs.amount = 0;
    sendDGB1Outputs.innerHTML = "";
    sendDGB1AdvancedOptions.checked = false;
    sendDGB1Continue.disabled = true;

    sendDGB2Memo.value = "";
    sendDGB2FeeIndicator.innerHTML = 'Low';
    sendDGB2FeeSelector.value = 1;
    sendDGB2FeePerByte.value = 1;
    sendDGB2NoneCheck.checked = true;
    sendDGB2BlockCheck.checked = false;
    sendDGB2DateTimeCheck.checked = false;
    sendDGB2BlockOption.hidden = true;
    sendDGB2Block.value = null;
    sendDGB2DateOption.hidden = true;
    sendDGB2Date.value = null;
    sendDGB2Time.value = null;
    sendDGB2Change.value = "";
    sendDGB2Shuffle.checked = false;
    sendDGB2RBF.checked = false;
    sendDGB2Message.innerHTML = "";

    sendDGB3Password.value = "";
    sendDGB3Password.placeholder = "";
    sendDGB3Message.innerHTML = "";

    ledgerOFF = true;
    sendDGB4Status.innerHTML = "";

    sendDGB5Message.innerHTML = "";
}
async function sendDGB1_AddOutput() {
    var n = sendDGB1Outputs.amount || 0;

    sendDGB1Outputs.innerHTML += `
    <div class="row mb-2">
        <div class="col-9 pe-0 small">
            Recipient ${n + 1}
        </div>
        <div class="col-3 px-1 small">
            Amount
        </div>
        <div class="col-9 pe-0">
            <input type="text" class="form-control form-control-sm font-monospace" id="sendDGB1Address${n}" placeholder="Address or DigiByte Domain" oninput="sendDGB1_CheckAddress()">
        </div>
        <div class="col-3 ps-1">
            <input type="number" class="form-control form-control-sm font-monospace" id="sendDGB1Amount${n}" step="1.00000000" min="0" placeholder="Amount" oninput="sendDGB1_CheckAddress()" disabled>
        </div>
        <div class="col-9 mt-1 pe-0 small" id="sendDGB1Message${n}">
            
        </div>
        <div class="col-3 mt-1 px-0" id="sendDGB1SubstractFeeContainer${n}" ${sendDGB1AdvancedOptions.checked ? '' : 'hidden'}>
            <input class="form-check-input" type="radio" name="sendDGB1SubstractFee" id="sendDGB1SubstractFee${n}" disabled>
            <label class="form-check-label small" for="sendDGB1SubstractFee${n}">
                Substract fee
            </label>      
        </div>
    </div>`;

    sendDGB1Outputs.amount = n + 1;

    for (var n = 0; n < sendDGB1Outputs.amount; n++) {
        var sendDGB1Message = document.getElementById(`sendDGB1Message${n}`);
        sendDGB1Message.innerHTML = "";
    }
    sendDGB1Continue.disabled = true;
}
async function sendDGB1_CheckAddress() {
    var valid = true;
    for (var n = 0; n < sendDGB1Outputs.amount; n++) {
        var sendDGB1Address = document.getElementById(`sendDGB1Address${n}`);
        var sendDGB1Amount = document.getElementById(`sendDGB1Amount${n}`);
        var sendDGB1Message = document.getElementById(`sendDGB1Message${n}`);
        var sendDGB1SubstractFee = document.getElementById(`sendDGB1SubstractFee${n}`);

        var address = sendDGB1Address.value;
        if (address.toLocaleLowerCase().endsWith('.dgb') || await CheckAddress(address)) {
            sendDGB1Message.innerHTML = "";
            sendDGB1Amount.disabled = false;
            sendDGB1SubstractFee.disabled = false;
            valid = valid && ((await DGBtoSats(sendDGB1Amount.value)) >= 600);
        } else {
            sendDGB1Message.innerHTML = sendDGB1Address.value == "" ? "" : "Invalid address";
            sendDGB1Amount.disabled = true;
            sendDGB1SubstractFee.checked = false;
            sendDGB1SubstractFee.disabled = true;
            valid = valid && false;
        }

        sendDGB1Continue.disabled = !valid;
    }
}
async function sendDGB1_AdvancedOptions() {
    for (var n = 0; n < sendDGB1Outputs.amount; n++) {
        var sendDGB1SubstractFee = document.getElementById(`sendDGB1SubstractFeeContainer${n}`);
        sendDGB1SubstractFee.checked = false;
        sendDGB1SubstractFee.hidden = !sendDGB1AdvancedOptions.checked;
    }
}
async function sendDGB1_Continue() {
    if (sendDGB1AdvancedOptions.checked)
        return sendDGB_Show(sendDGB2);

    var key = await GetKey(keyID);
    if (key.type == "ledger") {
        sendDGB4_Execute();
        return sendDGB_Show(sendDGB4);
    }

    sendDGB_Show(sendDGB3);
}
async function sendDGB2_Continue() {
    var key = await GetKey(keyID);
    if (key.type == "ledger") {
        sendDGB4_Execute();
        return sendDGB_Show(sendDGB4);
    }

    sendDGB_Show(sendDGB3);
}
async function sendDGB3_Sign() {
    if (await CheckPassword(accountID, sendDGB3Password.value) == false)
        return sendDGB3Message.innerHTML = icon("x-circle") + " Incorrect password";
    sendDGB3Message.innerHTML = "";

    sendDGB_Show(sendDGB4);
    sendDGB4_Execute();
}
async function sendDGB4_Execute() {
    sendDGB4Status.innerHTML = icon('info-circle') + " Building transaction...";
    var options = {
        inputs: [],
        outputs: [],
        fee: 0,
        advanced: {},
        hex: ""
    };

    // OUTPUTS
    sendDGB4Status.innerHTML = icon('info-circle') + " Creating outputs...";
    for (var n = 0; n < sendDGB1Outputs.amount; n++) {
        var sendDGB1Address = document.getElementById(`sendDGB1Address${n}`);
        var sendDGB1Amount = document.getElementById(`sendDGB1Amount${n}`);
        var sendDGB1SubstractFee = document.getElementById(`sendDGB1SubstractFee${n}`);

        var address = sendDGB1Address.value;
        if (address.toLocaleLowerCase().endsWith('.dgb')) {
            sendDGB4Status.innerHTML = icon('info-circle') + ` Fetching domain (${address})...`;
            var result = await DomainToAddress(address);
            if (result.address) address = result.address;
            else {
                sendDGB5Message.innerHTML = icon("x-circle") + ` ${(result.error || "Unknown domain error")} (${address})`;
                return sendDGB_Show(sendDGB5);
            }
        }

        options.outputs.push({
            address,
            amount: sendDGB1Amount.value,
            fee: sendDGB1SubstractFee.checked
        });
    }

    // ADVANCED
    sendDGB4Status.innerHTML = icon('info-circle') + " Adding advance options...";
    if (sendDGB2Memo.value != "")
        options.advanced.memo = sendDGB2Memo.value;

    options.advanced.feeperbyte = parseInt(sendDGB2FeePerByte.value);

    if (sendDGB2BlockCheck.checked && sendDGB2Block.value < 500000000)
        options.advanced.locktime = { block: parseInt(sendDGB2Block.value) || 0 };
    else if (sendDGB2DateTimeCheck.checked && sendDGB2Date.value != '' && sendDGB2Time.value != '')
        options.advanced.locktime = { time: ((new Date(sendDGB2Date.value + " " + sendDGB2Time.value)).getTime()) / 1000 };

    if (await CheckAddress(sendDGB2Change.value))
        options.advanced.change = sendDGB2Change.value;

    if (sendDGB2Shuffle.checked)
        options.advanced.shuffle = true;

    if (sendDGB2RBF.checked)
        options.advanced.rbf = true;

    options.advanced.coinControl = sendDGB2CoinControl.value;

    sendDGB4Status.innerHTML = icon('info-circle') + " Building transaction...";
    var key = await GetKey(keyID);
    if (key.type == "ledger") {
        var options = await CreateTransaction(options, accountID);
    } else
        var options = await CreateTransaction(options, accountID, sendDGB3Password.value);

    if (options.error) {
        sendDGB5Message.innerHTML = icon("x-circle") + " " + options.error;
        return sendDGB_Show(sendDGB5);
    }

    if (key.type == "ledger") {
        ledgerOFF = false;
        sendDGB4Status.innerHTML = icon('usb-symbol') + " Checking device...";
        while (true) {
            if (ledgerOFF) {
                var options = { error: "Process canceled" };
                break;
            }
            var result = await LedgerIsReady();
            if (result == "DISCONECTED") sendDGB4Status.innerHTML = icon('usb-symbol') + " Connect your device...";
            else if (result == "LOCKED") sendDGB4Status.innerHTML = icon('lock') + " Unlock your device...";
            else if (result == "IN_MENU" || result == "OTHER_APP") sendDGB4Status.innerHTML = icon('app-indicator') + " Open the DigiByte App...";
            else if (typeof result == 'string') sendDGB4Status.innerHTML = icon('exclamation-circle') + " Error: " + result.toLocaleLowerCase() + "...";
            else if (result === true) {
                sendDGB4Status.innerHTML = icon('pen') + " Sign the transaction on your device...";
                var options = await LedgerSignTransaction(options);
                break;
            }
        }
    }

    if (options.error) {
        sendDGB5Message.innerHTML = icon("x-circle") + " " + options.error;
        return sendDGB_Show(sendDGB5);
    }

    if (options.advanced.locktime) {
        sendDGB_Show(sendDGB5);
        return sendDGB5Message.innerHTML = `
            <div class="text-center">${icon('check-circle', 40)}</div>
            <div class="text-center">Transaction Created</div>
            <div class="text-break text-start">
                <label>
                    Serialized Transaction: 
                    <button class="btn btn-sm" type="button" id="sendDGB3Copy" onclick="sendDGB5_Copy('${options.hex}')">
                        <svg class="bi" width="15" height="15">
                            <use xlink:href="vendor/bootstrap-icons.svg#clipboard" />
                        </svg>
                    </button>
                </label>
                <textarea class="form-control form-control-sm font-monospace" rows="8" readonly>${options.hex}</textarea>
            </div>
            <small>This transaction have a timelock, broadcast it when its reached</small>`;
    }

    sendDGB4Status.innerHTML = icon('info-circle') + " Broadcasting transaction...";
    var data = await BroadcastTransaction(options.hex);
    if (data.error) {
        sendDGB_Show(sendDGB5);
        return sendDGB5Message.innerHTML = icon("x-circle") + " " + data.error;
    }

    await AddToMempool(accountID, data.result);
    await frmAccount_Load(accountID);

    sendDGB_Show(sendDGB5);
    return sendDGB5Message.innerHTML = `
        <div class="text-center">${icon('check-circle', 40)}</div>
        <div class="text-center">Transaction Broadcasted</div>
        <div class="text-break text-start">
            <label>
                TXID:
                <button class="btn btn-sm" type="button" id="sendDGB3Copy" onclick="sendDGB5_Copy('${data.result}')">
                    <svg class="bi" width="15" height="15">
                        <use xlink:href="vendor/bootstrap-icons.svg#clipboard" />
                    </svg>
                </button>
            </label>
            <input type="text" class="form-control form-control-sm monospace" value="${data.result}" readonly>           
        </div>`;
}
async function sendDGB5_Copy(txid) {
    var result = await CopyClipboard(txid);
    if (result) sendDGB3Copy.innerHTML = icon('clipboard-check', 15);
    else sendDGB3Copy.innerHTML = icon('clipboard-x');
}

async function frmAccount_TX(type, position) {
    lookupMovement_Show(lookupMovement1);

    if (type == "movement")
        var movement = movements[position];
    if (type == "mempool")
        var movement = mempool[position];

    if (movement.type == 'sent') {
        lookupMovement1Action.innerHTML = "Sent";
        lookupMovement1Icon.innerHTML = icon('box-arrow-up', 28);
    } else if (movement.type == 'received') {
        lookupMovement1Action.innerHTML = "Received";
        lookupMovement1Icon.innerHTML = icon('box-arrow-in-down', 28);
    } else {
        lookupMovement1Action.innerHTML = "Internal";
        lookupMovement1Icon.innerHTML = icon('dash-square', 28);
    }

    lookupMovement1Amount.innerHTML = (movement.change > 0 ? ' +' : ' ') + coin(movement.change, 8, true, true) + " DGB";

    var date = new Date(movement.unix * 1000).toDateString().substring(4, 15);
    var time = new Date(movement.unix * 1000).toTimeString().substring(0, 8);

    lookupMovement1Time.innerHTML = date + " " + time;

    lookupMovement1TXID.innerHTML = movement.txid;

    movement.from.forEach(address => lookupMovement1From.innerHTML += address + "<br>");
    movement.to.forEach(address => lookupMovement1To.innerHTML += address + "<br>");

    lookupMovement1Explorer.href = "https://digiexplorer.info/tx/" + movement.txid;
    modalToggle(lookupMovement);
}
async function lookupMovement_Show(screen) {
    lookupMovement1.hidden = true;

    screen.hidden = false;
}
async function lookupMovement_Close() {
    modalToggle(lookupMovement);
    lookupMovement1Action.innerHTML = "";
    lookupMovement1Icon.innerHTML = "";
    lookupMovement1Amount.innerHTML = "";
    lookupMovement1Time.innerHTML = "";
    lookupMovement1TXID.innerHTML = "";
    lookupMovement1From.innerHTML = "";
    lookupMovement1To.innerHTML = "";
    lookupMovement1Explorer.href = "";
}