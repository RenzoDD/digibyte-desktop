async function frmWallets_Load() {
    var files = await GetWallets();

    plWallets.innerHTML = "";

    for (var file of files) {
        try {
            var wallet = await ReadWallet(file);
            plWallets.innerHTML += `
            <div class="option row p-4 mb-3" onclick="frmWallets_OpenWallet('${file}')">
                <div class="col-4">
                    ${wallet.name}
                </div>
                <div class="col-4">
                    ${wallet.file}
                </div>
                <div class="col-4">
                    ${wallet.type}
                </div>
            </div>`;
        } catch (e) { console.log(e) }
    }

    frmOpen(frmWallets);
}

async function frmWallets_OpenWallet(path) {

}