let noteQuill;
let currentDishId = null;
let originalNoteHtml = '';

document.addEventListener('DOMContentLoaded', () => {
    const Size = Quill.import('attributors/style/size');
    Size.whitelist = ['0.75rem', '0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem', '1.75rem', '2rem', '2.25rem'];
    Quill.register(Size, true);

    noteQuill = new Quill('#noteEditor', {
        theme: 'snow',
        modules: {
            toolbar: {
                container: [
                    [{ size: Size.whitelist }],
                    ['bold', 'italic', 'underline'],
                    [{ color: [] }, { background: [] }],
                    [{ align: [] }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    ['link', 'image'],
                    ['clean'],
                ],
                handlers: {
                    image: imageHandler,
                },
            },
        },
    });
});

async function uploadImageToServer(file) {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
    });
    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Upload ảnh thất bại');
    }
    return await res.text();
}

function imageHandler() {
    const MAX_SIZE = 2 * 1024 * 1024;
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showToast({
                message: 'Chỉ cho phép upload ảnh',
                type: 'warning',
            });
            return;
        }

        if (file.size > MAX_SIZE) {
            showToast({
                message: 'Chỉ cho phép ảnh tối đa 2MB',
                type: 'warning',
            });
            return;
        }

        const uploadingToast = await showToast({
            message: 'Đang upload ảnh, vui lòng đợi…',
            type: 'info',
            delay: 9999,
        });

        try {
            const imageUrl = await uploadImageToServer(file);

            const range = noteQuill.getSelection(true);
            noteQuill.insertEmbed(range.index, 'image', imageUrl);

            uploadingToast.hide();

            showToast({
                message: 'Upload ảnh thành công',
                type: 'success',
            });
        } catch (e) {
            uploadingToast.hide();

            showToast({
                message: e.message || 'Upload ảnh thất bại',
                type: 'error',
            });
        }
    };
}

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
                : '<span class="text-muted">Chưa có ghi chú</span>';

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

            originalNoteHtml = noteHtml;

            // cập nhật VIEW
            document.getElementById('noteViewContent').innerHTML = noteHtml.trim()
                ? noteHtml
                : '<span class="text-muted">Chưa có ghi chú</span>';

            switchToView();

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
