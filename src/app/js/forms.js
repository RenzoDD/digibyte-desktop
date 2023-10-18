function frmOpen(frmOpen) {
    const forms = document.querySelectorAll(`[id^="frm"]`);
    for (var frm of forms)
        frm.hidden = true;
    frmOpen.hidden = false;
}