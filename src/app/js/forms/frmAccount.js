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
                    ${movement.isAsset ? icon('digiasset') + " DigiAsset" : ((movement.change > 0 ? '+' : '') + coin(movement.change, 8))}
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
                    ${movement.isAsset ? icon('digiasset') + " DigiAsset" : ((movement.change > 0 ? '+' : '') + coin(movement.change, 8))}
                </div >
            </div>`;
    }

    transactionList_Fill(0);

    var balance = coin(balance.satoshis, 8, false);
    accountBalance.innerHTML = balance + " DGB";

    var exchange = await GetPrice();
    accountPrice.innerHTML = "$ " + (exchange.price * balance).toFixed(2);

    frmOpen(frmAccount);
    topKeys.hidden = true;
    topReturnToAccounts.hidden = false;
}

async function frmAccount_Receive() {
    var address = await GenerateLastAddres(accountID);
    var account = await GetAccount(accountID);

    receiveDGB1Address.value = address;
    receiveDGB1Path.innerHTML = account.path ? account.path + "/0/" + account.external : "";
    receiveDGB1QR.src = DigiQR.text(address, 200, 2);

    receiveDGB_Show(receiveDGB1);
    modalToggle(receiveDGB);
}
async function receiveDGB_Show(screen) {
    receiveDGB1.hidden = true;

    screen.hidden = false;
}
async function receiveDGB_Close() {
    modalToggle(receiveDGB);
    receiveDGB1QR.src = "";
    receiveDGB1Path.innerHTML = "";
    receiveDGB1Address.value = "";
    receiveDGB1Copy.innerHTML = icon('clipboard');
}
async function receiveDGB_Copy() {
    var result = await CopyAddressClipboard(receiveDGB1Address.value);
    if (result) receiveDGB1Copy.innerHTML = icon('clipboard-check');
    else receiveDGB1Copy.innerHTML = icon('clipboard-x');
}

async function frmAccount_Send() {
    var account = await GetAccount(accountID);
    var keys = await ReadKey(account.secret);
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

    screen.hidden = false;
}
async function sendDGB_Close() {
    modalToggle(sendDGB);
    sendDGB1Outputs.amount = 0;
    sendDGB1Outputs.innerHTML = "";
    sendDGB1AdvancedOptions.checked = false;

    sendDGB2Memo.value = "";
    sendDGB2FeeIndicator.innerHTML = 'Low';
    sendDGB2FeeSelector.value = 1;
    sendDGB2FeePerByte.value = 1;
    sendDGB2NoneCheck.checked = true;
    sendDGB2BlockCheck.checked = false;
    sendDGB2DateTimeCheck.checked = false;
    sendDGB2Block.value = null;
    sendDGB2Date.value = null;
    sendDGB2Time.value = null;
    sendDGB2Change.value = "";
    sendDGB2Shuffle.checked = false;
    sendDGB2RBF.checked = false;
    sendDGB2Message.innerHTML = "";

    sendDGB3Password.value = "";
    sendDGB3Password.placeholder = "";
    sendDGB3Message.innerHTML = "";

    sendDGB4Spinner.hidden = false;
    sendDGB4Message.innerHTML = "";
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
}
async function sendDGB1_CheckAddress() {
    var valid = true;
    for (var n = 0; n < sendDGB1Outputs.amount; n++) {
        var sendDGB1Address = document.getElementById(`sendDGB1Address${n}`);
        var sendDGB1Amount = document.getElementById(`sendDGB1Amount${n}`);
        var sendDGB1Message = document.getElementById(`sendDGB1Message${n}`);
        var sendDGB1SubstractFee = document.getElementById(`sendDGB1SubstractFee${n}`);

        if (await CheckAddress(sendDGB1Address.value)) {
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
        sendDGB_Show(sendDGB2);
    else
        sendDGB_Show(sendDGB3);
}
async function sendDGB2_Continue() {
    // TODO: Check advanced options
    sendDGB_Show(sendDGB3);
}
async function sendDGB3_Sign() {
    if (await CheckPassword(accountID, sendDGB3Password.value) == false)
        return sendDGB3Message.innerHTML = icon("x-circle") + " Incorrect password";
    sendDGB3Message.innerHTML = "";

    sendDGB_Show(sendDGB4);

    var options = {
        outputs: [],
        advanced: {}
    };

    // OUTPUTS
    for (var n = 0; n < sendDGB1Outputs.amount; n++) {
        var sendDGB1Address = document.getElementById(`sendDGB1Address${n}`);
        var sendDGB1Amount = document.getElementById(`sendDGB1Amount${n}`);
        var sendDGB1SubstractFee = document.getElementById(`sendDGB1SubstractFee${n}`);

        options.outputs.push({
            address: sendDGB1Address.value,
            amount: sendDGB1Amount.value,
            fee: sendDGB1SubstractFee.checked
        });
    }

    // ADVANCED
    if (sendDGB2Memo.value != "")
        options.advanced.memo = sendDGB2Memo.value;

    options.advanced.feeperbyte = parseInt(sendDGB2FeePerByte.value);

    if (sendDGB2BlockCheck.checked && sendDGB2Block.value < 500000000)
        options.advanced.timelock = { block: sendDGB2Block.value };
    else if (sendDGB2DateTimeCheck.checked && sendDGB2Date.value != '' && sendDGB2Time.value != '')
        options.advanced.timelock = { time: ((new Date(sendDGB2Date.value + " " + sendDGB2Time.value)).getTime()) / 1000 };

    if (await CheckAddress(sendDGB2Change.value))
        options.advanced.change = sendDGB2Change.value;

    if (sendDGB2Shuffle.checked)
        options.advanced.shuffle = true;

    if (sendDGB2RBF.checked)
        options.advanced.rbf = true;

    options.advanced.coinControl = sendDGB2CoinControl.value;

    var hex = await CreateTransaction(accountID, sendDGB3Password.value, options);
    if (hex.error) {
        sendDGB4Spinner.hidden = true;
        return sendDGB4Message.innerHTML = icon("x-circle") + " " + hex.error;
    }

    var data = await BroadcastTransaction(hex.hex);
    if (data.error) {
        sendDGB4Spinner.hidden = true;
        return sendDGB4Message.innerHTML = icon("x-circle") + " " + data.error;
    }

    sendDGB4Spinner.hidden = true;
    return sendDGB4Message.innerHTML = "Transaction sent! <br> " + data.result;
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

    lookupMovement1Amount.innerHTML = (movement.change > 0 ? ' +' : ' ') + coin(movement.change, 8);

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