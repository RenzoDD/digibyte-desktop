function frmOpen(frmOpen) {
    const forms = document.querySelectorAll(`[id^="frm"]`);
    for (var frm of forms)
        frm.classList.add('d-none');
    frmOpen.classList.remove('d-none');
}
const modals = {};
function modalToggle(modal) {
    if (!modals[modal.id])
        modals[modal.id] = new bootstrap.Modal(modal);

    modals[modal.id].toggle();
}

function icon(name, size = 18) {
    return `<svg class="bi" width="${size}" height="${size}"><use xlink:href="vendor/bootstrap-icons.svg#${name}"/></svg>`
}
/**
 * 
 * @param {number} value - Integer or float
 * @param {number} decimals - Number of decimals
 * @param {boolean} significant - Show right '0' after last significant digit 
 * @returns 
 */
function coin(value, decimals, significant) {
    value = value || 0;
    decimals = decimals || 0;

    value = "" + value;

    if (decimals <= 0)
        return value;

    var negative = false;
    if (value[0] == '-') {
        negative = true;
        value = value.replace('-', '');
    }

    var number = "         " + value;
    var int = number.substr(0, number.length - decimals);
    var dec = number.substr(number.length - decimals);
    value = (int + '.' + dec).trim().replaceAll(' ', '0');

    if (significant) {
        value = value.replaceAll('0', ' ').trimEnd().replaceAll(' ', '0');
        if (value[value.length - 1] == '.')
            value = value.replaceAll('.', '');
    }

    if (value[0] == '.')
        value = '0' + value;

    return negative ? "-" + value : value;
}