let noteQuill;
let currentDishId = null;
let originalNoteHtml = '';

document.addEventListener('DOMContentLoaded', () => {
    noteQuill = new Quill('#noteEditor', {
        theme: 'snow',
        modules: {
            toolbar: [
                ['bold', 'italic', 'underline'],
                [{ list: 'ordered' }, { list: 'bullet' }],
            ],
        },
    });
});

function openNoteModal(dishId) {
    currentDishId = dishId;

    fetch(`/api/dishes/${dishId}`)
        .then((res) => res.json())
        .then((dish) => {
            const note = dish.note ?? '';

            document.getElementById('noteModalTitle').textContent = dish.dishName;

            originalNoteHtml = note;

            // VIEW
            document.getElementById('noteViewContent').innerHTML = note.trim()
                ? note
                : '<span class="text-muted fst-italic">Chưa có ghi chú</span>';

            switchToView();

            new bootstrap.Modal(document.getElementById('noteModal')).show();
        });
}

function switchToEdit() {
    document.getElementById('noteView').classList.add('d-none');
    document.getElementById('noteEdit').classList.remove('d-none');

    document.getElementById('viewActions').classList.add('d-none');
    document.getElementById('editActions').classList.remove('d-none');

    noteQuill.root.innerHTML = originalNoteHtml;
}

function cancelEditNote() {
    noteQuill.root.innerHTML = originalNoteHtml;
    switchToView();
}

function switchToView() {
    document.getElementById('noteView').classList.remove('d-none');
    document.getElementById('noteEdit').classList.add('d-none');

    document.getElementById('viewActions').classList.remove('d-none');
    document.getElementById('editActions').classList.add('d-none');
}

function saveNote() {
    const noteHtml = noteQuill.root.innerHTML;

    fetch(`/api/dishes/${currentDishId}/note`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteHtml }),
    })
        .then((res) => {
            if (!res.ok) throw new Error();

            bootstrap.Modal.getInstance(document.getElementById('noteModal')).hide();

            showToast({
                message: 'Đã lưu ghi chú thành công',
                type: 'success',
            });
        })
        .catch((err) => {
            showToast({
                message: 'Lưu ghi chú thất bại',
                type: 'error',
            });
            console.error(err);
        });
}
