async function frmAccount_Load(id) {
    accountID.value = id;

    var account = await GetAccount(id);
    var movements = await GetAccountMovements(id);
    var balance = await GetAccountBalance(id);

    accountReceive.hidden = false;
    accountReceive.hidden = false;
    transactionList.innerHTML = "";

    if (account.type == 'derived') {
        accountName.innerHTML = icon('digibyte', 40) + ' ' + account.name;
    } else if (account.type == 'mobile') {
        accountName.innerHTML = icon('phone', 40) + ' ' + account.name;
        accountReceive.hidden = true;
    }

    var lastDate = new Date(0).toDateString().substring(4, 15);
    for (var i = 0; i < 100 && i < movements.length; i++) {
        var movement = movements[i];
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
						<div class="col-5 text-end fw-bold" style="color: ${movement.isAsset || movement.change == 0 ? 'white' : (movement.change > 0 ? 'green' : 'red')}">
                            ${movement.isAsset ? icon('digiasset') + " DigiAsset" : ((movement.change > 0 ? '+ ' : movement.change < 0 ? '- ' : '') + coin(movement.change, 8))}
                        </div >
					</div >
                `;

        lastDate = date;
    }

    var balance = coin(balance.satoshis, 8, false);
    accountBalance.innerHTML = balance + " DGB";
    
    var exchange = await GetPrice();
    accountPrice.innerHTML = "$ " + (exchange.price * balance).toFixed(2);

    frmOpen(frmAccount);
}

async function frmAccount_Receive() {
    var address = await GenerateLastAddres(accountID.value);

    receiveDGB1Address.value = address;
    receiveDGB1QR.src = DigiQR.text(address, 200, 2);

    receiveDGB_Show(receiveDGB1);
}
async function receiveDGB_Show(screen) {
    receiveDGB1.hidden = true;

    screen.hidden = false;
}
async function receiveDGB_Clear() {
    receiveDGB1QR.src = "";
    receiveDGB1Address.value = "";
    receiveDGB1Copy.innerHTML = icon('clipboard');
}
async function receiveDGB_Copy() {
    var result = await CopyAddressClipboard(receiveDGB1Address.value);
    if (result) receiveDGB1Copy.innerHTML = icon('clipboard-check');
    else receiveDGB1Copy.innerHTML = icon('clipboard-x');
}

async function frmAccount_Send() {
    sendDGB_AddOutput();
    sendDGB_Show(sendDGB1);
}
async function sendDGB_Show(screen) {
    sendDGB1.hidden = true;

    screen.hidden = false;
}
async function sendDGB_Clear() {
    sendDGB1Outputs.amount = 0;
    sendDGB1Outputs.innerHTML = "";
}
async function sendDGB_AddOutput() {
    var n = sendDGB1Outputs.amount || 0;

    sendDGB1Outputs.innerHTML += `
    <div class="row mb-3">
        <div class="col-9 pe-0 small">
            Recipient ${n + 1}
        </div>
        <div class="col-3 px-1 small">
            Amount
        </div>
        <div class="col-9 pe-0">
            <input type="text" class="form-control form-control-sm font-monospace" id="sendDGB1Address${n}" placeholder="Address or DigiByte Domain" oninput="sendDGB_CheckAddress()">
        </div>
        <div class="col-3 ps-1">
            <input type="number" class="form-control form-control-sm font-monospace" id="sendDGB1Amount${n}" step="1.00000000" min="0" placeholder="Amount" oninput="sendDGB_CheckAddress()" disabled>
        </div>
        <div class="col-9 mt-1 px-0 small" id="sendDGB1Message${n}">
            
        </div>
        <div class="col-3 mt-1 px-0">
            <input class="form-check-input" type="radio" name="sendDGB1SubstractFee" id="sendDGB1SubstractFee${n}" disabled>
            <label class="form-check-label small" for="sendDGB1SubstractFee${n}">
                Substract fee
            </label>      
        </div>
    </div>`;

    sendDGB1Outputs.amount = n + 1;
}
async function sendDGB_CheckAddress() {
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
            console.log(parseFloat(sendDGB1Amount.value))
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