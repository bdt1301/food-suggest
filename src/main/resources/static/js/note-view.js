function openNoteViewModal(dishId) {
    fetch(`/api/community/${dishId}`)
        .then((res) => res.json())
        .then((dish) => {
            const modalEl = document.getElementById('noteViewModal');
            const cloneBtn = document.getElementById('noteViewCloneBtn');

            modalEl.dataset.dishId = dish.id;

            document.getElementById('noteViewModalTitle').textContent = dish.dishName;

            document.getElementById('noteViewContent').innerHTML = dish.note?.trim()
                ? dish.note
                : '<span class="text-muted">Chưa có ghi chú</span>';

            if (!dish.authenticated || dish.owner) {
                cloneBtn.classList.add('d-none');
            } else {
                cloneBtn.classList.remove('d-none');
            }

            new bootstrap.Modal(modalEl).show();
        });
}

document.getElementById('noteViewCloneBtn').addEventListener('click', () => {
    const modalEl = document.getElementById('noteViewModal');
    const dishId = modalEl.dataset.dishId;

    if (!dishId) return;

    bootstrap.Modal.getInstance(modalEl).hide();

    openCloneModal(dishId);
});
