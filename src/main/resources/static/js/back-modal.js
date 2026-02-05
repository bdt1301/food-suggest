const modalStack = [];

document.addEventListener('shown.bs.modal', function (event) {
    const modalEl = event.target;
    const modalId = modalEl.id;

    modalStack.push(modalId);

    // Chỉ push history nếu chưa có hoặc khác modal hiện tại
    if (!history.state || history.state.modal !== modalId) {
        history.pushState({ modal: modalId }, '', '#' + modalId);
    }
});

document.addEventListener('hidden.bs.modal', function (event) {
    const modalEl = event.target;
    const modalId = modalEl.id;

    // Pop đúng modal vừa đóng
    if (modalStack[modalStack.length - 1] === modalId) {
        modalStack.pop();
    }

    // Chỉ back khi modal bị đóng bằng UI (không phải popstate)
    if (history.state && history.state.modal === modalId) {
        history.back();
    }
});

window.addEventListener('popstate', () => {
    if (!modalStack.length) return;

    const lastModalId = modalStack.pop();
    const modalEl = document.getElementById(lastModalId);
    const modalInstance = bootstrap.Modal.getInstance(modalEl);

    if (modalInstance) {
        modalInstance.hide();
    }
});
