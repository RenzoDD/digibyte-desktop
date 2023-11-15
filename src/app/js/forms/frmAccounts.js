async function frmAccounts_Load() {
    frmOpen(frmAccounts);
}

async function frmAccounts_Add() {
    addAccount_Clear();
    manageKey_Show(addAccount1)
}
async function manageKey_Show(screen) {
    addAccount1.hidden = true;

    screen.hidden = false;
}
async function addAccount_Clear() {
    // addAccount1Key <- Fill with keys
    addAccount1Key.value = "null";
    addAccount1Name.value = "";
    addAccount1Error.innerHTML  = "";
}
async function addAccount1_Continue() {

}