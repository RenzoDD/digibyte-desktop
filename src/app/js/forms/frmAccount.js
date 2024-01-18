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

    document.getElementById('accountBalance').innerHTML = coin(balance.satoshis, 8, false) + " DGB";

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
}