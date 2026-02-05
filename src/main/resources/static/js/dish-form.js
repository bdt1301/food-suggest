function openDishModal(id = null) {
    let url = '/api/dishes/modal';
    if (id) url += '?id=' + id;

    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            renderDishForm(data.dish, data.dishTypes);
            document.getElementById('dishModalTitle').innerText = id ? 'Chỉnh sửa món ăn' : 'Thêm món ăn';

            new bootstrap.Modal(document.getElementById('dishModal')).show();
        });
}

function renderDishForm(dish, dishTypes) {
    const body = document.getElementById('dishModalBody');
    const footer = document.getElementById('dishModalFooter');

    body.innerHTML = `
        <form id="dishForm" onsubmit="submitDish(event, ${dish.id ?? 'null'})">

            <div class="mb-3">
                <label class="form-label fw-semibold">Tên món</label>
                <input type="text"
                    class="form-control form-control-lg"
                    value="${dish.dishName ?? ''}"
                    placeholder="Ví dụ: Gà chiên nước mắm"
                    required
                    id="dishName"
                />
            </div>

            <div class="mb-3">
                <label class="form-label fw-semibold">Chọn loại món</label>
                <select id="dishTypeSelect"
                    class="form-select form-select-lg mb-2"
                    required>
                    <option value="" class="text-muted">-- Chọn loại --</option>
                    ${dishTypes
                        .map(
                            (t) => `
                                <option value="${t.id}"
                                    ${dish.dishType?.id === t.id ? 'selected' : ''}>
                                    ${t.label}
                                </option>
                            `,
                        )
                        .join('')}
                </select>
                <button
                    type="button"
                    class="btn btn-outline-secondary btn-sm"
                    onclick="toggleNewDishType()"
                >
                    Không có loại nào để chọn?
                </button>                            
            </div>

            <div class="mb-3 d-none" id="newDishTypeBox">
                <label class="form-label fw-semibold">Thêm loại mới</label>

                <div class="d-flex gap-2">
                    <input
                        type="text"
                        id="newDishTypeInput"
                        class="form-control form-control-lg"
                        placeholder="Ví dụ: Món xào"
                    />

                    <button
                        type="button"
                        class="btn btn-success"
                        onclick="addDishType()"
                    >
                        Thêm
                    </button>
                </div>

                <div class="form-text text-muted">
                    Loại món sẽ được thêm và tự động chọn
                </div>
            </div>

            <div class="d-flex justify-content-between">
                <div class="form-check form-switch clickable">
                    <input class="form-check-input"
                        type="checkbox"
                        id="hasEaten"
                        ${dish.hasEaten ? 'checked' : ''}
                        onchange="this.nextElementSibling.innerText = this.checked ? 'Đã ăn' : 'Chưa ăn'">
                    <label class="form-check-label fw-semibold" for="hasEaten">${dish.hasEaten ? 'Đã ăn' : 'Chưa ăn'}</label>
                </div>

                <div class="form-check clickable">
                    <input
                        class="form-check-input"
                        type="checkbox"
                        id="isPublic"
                        ${dish.visibility === 'PUBLIC' ? 'checked' : ''}
                    />
                    <label class="form-check-label fw-semibold" for="isPublic">
                        Chia sẻ lên Cộng đồng
                    </label>
                </div>
            </div>
        </form>
    `;

    footer.innerHTML = `
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
            Huỷ
        </button>

        <button type="submit" form="dishForm" class="btn ${dish.id ? 'btn-success' : 'btn-primary'}">
            ${dish.id ? 'Cập nhật' : 'Thêm mới'}
        </button>
    `;
}

function submitDish(event, id) {
    event.preventDefault();

    const dishModalEl = document.getElementById('dishModal');
    const dishModal = bootstrap.Modal.getInstance(dishModalEl);
    dishModal.hide();

    const dishName = document.getElementById('dishName').value;

    // Đợi dishModal đóng xong rồi mới mở confirmModal
    dishModalEl.addEventListener(
        'hidden.bs.modal',
        function handler() {
            dishModalEl.removeEventListener('hidden.bs.modal', handler);

            openConfirmModal({
                title: id ? 'Cập nhật món ăn' : 'Thêm món ăn',
                message: `Bạn có chắc muốn ${id ? 'cập nhật' : 'thêm'} món <b>"${dishName}"</b> không?`,
                confirmText: id ? 'Cập nhật' : 'Thêm',
                confirmClass: id ? 'btn-success' : 'btn-primary',
                onConfirm: () => submitDishConfirmed(id),
                onCancel: () => dishModal.show(),
            });
        },
        { once: true },
    );

}

function submitDishConfirmed(id) {
    const payload = {
        dishName: document.getElementById('dishName').value,
        hasEaten: document.getElementById('hasEaten').checked,
        visibility: document.getElementById('isPublic').checked ? 'PUBLIC' : 'PRIVATE',
        suggested: false,
        dishType: {
            id: document.getElementById('dishTypeSelect').value,
        },
    };

    const method = id ? 'PUT' : 'POST';
    const url = id ? `/api/dishes/${id}` : '/api/dishes';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(async (res) => {
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            return data;
        })
        .then((data) => {
            bootstrap.Modal.getInstance(document.getElementById('dishModal')).hide();

            loadDishes();

            showToast({
                message: id ? `Cập nhật món ăn thành công` : `Thêm món mới thành công`,
                type: 'success',
            });

            if (data.resetPerformed) {
                showToast({
                    message: 'Đã ăn hết món trong loại này',
                    type: 'info',
                });
            }
        })
        .catch((err) => {
            showToast({
                message: `Đã xảy ra lỗi khi ${id ? 'thêm' : 'cập nhật'} món ăn`,
                type: 'error',
            });
            console.error(err);
        });
}

// Add new dish type
function toggleNewDishType() {
    document.getElementById('newDishTypeBox').classList.toggle('d-none');
}

async function addDishType() {
    const input = document.getElementById('newDishTypeInput');
    const label = input.value.trim();

    if (!label) {
        showToast({
            message: 'Vui lòng nhập tên loại món',
            type: 'warning',
        });
        return;
    }

    try {
        const response = await fetch('/api/dish-types', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ label }),
        });

        if (!response.ok) throw new Error();

        const dishType = await response.json();
        const select = document.getElementById('dishTypeSelect');

        // Check option đã tồn tại chưa
        let existingOption = [...select.options].find((opt) => opt.value == dishType.id);

        if (existingOption) {
            // Có thì chọn
            existingOption.selected = true;

            showToast({
                message: 'Loại món này đã tồn tại',
                type: 'info',
            });
        } else {
            // Chưa có thì tạo mới
            const option = document.createElement('option');
            option.value = dishType.id;
            option.textContent = dishType.label;
            option.selected = true;

            select.appendChild(option);

            showToast({
                message: 'Loại món mới đã được tạo',
                type: 'success',
            });
        }

        input.value = '';
        document.getElementById('newDishTypeBox').classList.add('d-none');
    } catch (err) {
        showToast({
            message: 'Không thể tạo loại món',
            type: 'error',
        });
        console.error(err);
    }
}
