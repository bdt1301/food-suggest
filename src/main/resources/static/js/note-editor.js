let noteQuill;
let currentDishId = null;
let originalNoteHtml = '';
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

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

    setupPasteHandler(noteQuill);
});

function setupPasteHandler(quill) {
    quill.root.addEventListener(
        'paste',
        async (e) => {
            const clipboardItems = e.clipboardData?.items;
            if (!clipboardItems) return;

            // Biến để kiểm tra xem trong đống paste có ảnh không
            let hasImage = false;
            for (const item of clipboardItems) {
                if (item.type.startsWith('image/')) {
                    hasImage = true;
                    break;
                }
            }

            // NẾU CÓ ẢNH, CHẶN NGAY LẬP TỨC TRƯỚC VÒNG LẶP
            if (hasImage) {
                e.preventDefault();
                e.stopPropagation(); // Ngăn Quill can thiệp vào
            } else {
                return; // Nếu không có ảnh thì để Quill xử lý text bình thường
            }

            // Xử lý upload ảnh
            for (const item of clipboardItems) {
                if (item.type.startsWith('image/')) {
                    const blob = item.getAsFile();
                    if (!blob) continue;

                    if (blob.size > MAX_IMAGE_SIZE) {
                        showToast({ message: 'Chỉ cho phép ảnh tối đa 2MB', type: 'warning' });
                        continue;
                    }

                    const uploadingToast = await showToast({
                        message: 'Đang upload ảnh từ clipboard, vui lòng đợi...',
                        type: 'info',
                        delay: 999999,
                    });

                    try {
                        // Truyền blob trực tiếp vào hàm upload như đã thảo luận
                        const imageUrl = await uploadImageToServer(blob);

                        // Chèn ảnh từ Cloudinary vào đúng vị trí con trỏ
                        const range = quill.getSelection(true);
                        quill.insertEmbed(range.index, 'image', imageUrl);
                        quill.setSelection(range.index + 1);

                        uploadingToast.hide();
                        showToast({
                            message: 'Upload ảnh thành công từ clipboard',
                            type: 'success',
                        });
                    } catch (err) {
                        uploadingToast.hide();
                        showToast({ message: 'Upload ảnh thất bại từ clipboard', type: 'error' });
                        console.error(err);
                    }
                }
            }
        },
        true,
    ); // Sử dụng useCapture = true để ưu tiên xử lý trước Quill
}

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

        if (file.size > MAX_IMAGE_SIZE) {
            showToast({
                message: 'Chỉ cho phép ảnh tối đa 2MB',
                type: 'warning',
            });
            return;
        }

        const uploadingToast = await showToast({
            message: 'Đang upload ảnh, vui lòng đợi…',
            type: 'info',
            delay: 999999,
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
        } catch (err) {
            uploadingToast.hide();
            showToast({
                message: err.message || 'Upload ảnh thất bại',
                type: 'error',
            });
            console.error(err);
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
