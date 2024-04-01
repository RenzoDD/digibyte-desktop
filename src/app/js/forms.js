let keyID = null;
let accountID = null;
let lastForm = null;

function frmOpen(frmOpen) {
    const forms = document.querySelectorAll(`[id^="frm"]`);
    for (var frm of forms)
        frm.classList.add('d-none');
    frmOpen.classList.remove('d-none');
    lastForm = frmOpen.id;
}
const modals = {};
function modalToggle(modal) {
    if (!modals[modal.id])
        modals[modal.id] = new bootstrap.Modal(modal);

    modals[modal.id].toggle();
}

function icon(name, size = 18, isBTN) {
    return `<svg class="bi ${isBTN ? "bi-btn" : ""}" width="${size}" height="${size}"><use xlink:href="vendor/bootstrap-icons.svg#${name}"/></svg>`
}
/**
 * @param {number} satoshis - Integer, can be represented in a string. Minimun unit to be trated
 * @param {number} decimals - Decimals of the final number, 
 * @param {bool} trail - Show trailing '0'
 * @param {bool} thousands Show thousands separator
 * @returns {string}
 */
function coin(satoshis, decimals = 8, trail = true, thousands = false) {
    var stringlify = satoshis.toString();
    var negative = stringlify[0] == '-' ? '-' : '';
    var long = stringlify.replaceAll('-', '').replaceAll('0', ' ').padStart(50, ' ');

    var integer = long.substring(0, long.length - decimals);
    var decimal = (decimals > 0) ? long.slice(-decimals) : "";

    integer = integer.trimStart();
    if (integer == '') integer = ' ';
    if (!trail) decimal = decimal.trimEnd();

    var result = integer.replaceAll(' ', '0');
    if (thousands)
        result = BigInt(result).toLocaleString();
    if (decimal.length != 0)
        result += '.' + decimal.replaceAll(' ', '0');

    return negative + result;
}