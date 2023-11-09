function frmOpen(frmOpen) {
    const forms = document.querySelectorAll(`[id^="frm"]`);
    for (var frm of forms)
        frm.hidden = true;
    frmOpen.hidden = false;
}

function icon(name) {
    return `<svg class="bi" width="18" height="18"><use xlink:href="vendor/bootstrap-icons.svg#${name}"/></svg>`
}