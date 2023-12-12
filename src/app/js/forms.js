function frmOpen(frmOpen) {
    const forms = document.querySelectorAll(`[id^="frm"]`);
    for (var frm of forms)
        frm.hidden = true;
    frmOpen.hidden = false;
}

function icon(name, size = 18) {
    return `<svg class="bi" width="${size}" height="${size}"><use xlink:href="vendor/bootstrap-icons.svg#${name}"/></svg>`
}