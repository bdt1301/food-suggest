// Edit dish type
function saveEdit(id) {
    const input = document.getElementById(`input-${id}`);
    const newLabel = input.value.trim();

    if (!newLabel) return;

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
            cancelEdit(id);
        })
        .catch((err) => {
            alert('Lỗi khi cập nhật loại món!');
            console.error(err);
        });
}

function enableEdit(id) {
    document.getElementById('btn-handle-type-' + id).classList.add('d-none');
    document.getElementById('label-' + id).classList.add('d-none');
    document.getElementById('form-' + id).classList.remove('d-none');
    document.getElementById('form-' + id).classList.add('d-flex');
}

function cancelEdit(id) {
    document.getElementById('form-' + id).classList.add('d-none');
    document.getElementById('form-' + id).classList.remove('d-flex');
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
        })
        .catch((err) => {
            alert('Không thể xoá loại món!');
            console.error(err);
        });
}
