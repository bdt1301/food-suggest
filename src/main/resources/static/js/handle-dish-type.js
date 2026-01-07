// Edit dish type
function saveType(id) {
    const input = document.getElementById(`input-${id}`);
    const newLabel = input.value.trim();

    if (!newLabel) {
        showToast({
            message: 'Tên loại món không được để trống',
            type: 'warning',
        });
        return;
    }

    fetch(`/api/dish-types/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ label: newLabel }),
    })
        .then((res) => res.json())
        .then((data) => {
            document.getElementById(`label-${id}`).innerText = data.label;
            cancelEditType(id);
        })
        .catch((err) => {
            showToast({
                message: 'Cập nhật loại món thất bại',
                type: 'error',
            });
            console.error(err);
        });
}

function enableEditType(id) {
    document.getElementById('btn-handle-type-' + id).classList.add('d-none');
    document.getElementById('label-' + id).classList.add('d-none');
    document.getElementById('form-' + id).classList.remove('d-none');
}

function cancelEditType(id) {
    document.getElementById('form-' + id).classList.add('d-none');
    document.getElementById('btn-handle-type-' + id).classList.remove('d-none');
    document.getElementById('label-' + id).classList.remove('d-none');
}

// Delete dish type
function deleteType(id) {
    if (!confirm('Việc này sẽ xoá luôn tất cả món ăn bên trong. Hãy suy nghĩ kỹ!')) return;

    fetch(`/api/dish-types/${id}`, {
        method: 'DELETE',
    })
        .then((res) => {
            if (!res.ok) throw new Error('Delete failed');

            const element = document.getElementById(`dish-type-${id}`);
            if (element) {
                element.remove();
            }

            showToast({
                message: 'Loại món và các món liên quan đã bị xoá',
                type: 'success',
            });
        })
        .catch((err) => {
            showToast({
                message: 'Xoá loại món thất bại',
                type: 'error',
            });
            console.error(err);
        });
}
