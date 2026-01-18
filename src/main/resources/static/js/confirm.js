let confirmCallback = null;
let cancelCallback = null;

function openConfirmModal({
    title = 'Xác nhận',
    message = 'Bạn có chắc không?',
    confirmText = 'Xác nhận',
    confirmClass = 'btn-danger',
    onConfirm,
    onCancel,
}) {
    document.getElementById('confirmModalTitle').innerText = title;
    document.getElementById('confirmModalBody').innerHTML = message;

    const btn = document.getElementById('confirmModalAction');
    btn.innerText = confirmText;
    btn.className = `btn ${confirmClass}`;

    confirmCallback = onConfirm;
    cancelCallback = onCancel;

    new bootstrap.Modal(document.getElementById('confirmModal')).show();
}

const confirmModalEl = document.getElementById('confirmModal');

confirmModalEl.addEventListener('hidden.bs.modal', () => {
    if (confirmCallback && cancelCallback) {
        cancelCallback();
    }
    confirmCallback = null;
    cancelCallback = null;
});

document.getElementById('confirmModalAction').addEventListener('click', () => {
    if (confirmCallback) {
        const action = confirmCallback;
        confirmCallback = null;
        action();
    }
    bootstrap.Modal.getInstance(confirmModalEl).hide();
});
