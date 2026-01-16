function openNoteViewModal(dishId) {
    fetch(`/api/community/${dishId}`)
        .then((res) => res.json())
        .then((dish) => {
            document.getElementById('noteViewModalTitle').textContent = dish.dishName;

            document.getElementById('noteViewContent').innerHTML = dish.note?.trim()
                ? dish.note
                : '<span class="text-muted">Chưa có ghi chú</span>';

            new bootstrap.Modal(document.getElementById('noteViewModal')).show();
        });
}
