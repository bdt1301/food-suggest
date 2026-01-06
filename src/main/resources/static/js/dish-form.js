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

    body.innerHTML = `
        <form onsubmit="submitDish(event, ${dish.id ?? 'null'})">

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
                    <option value="">-- Chọn loại --</option>
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
                    class="btn btn-outline-primary btn-sm"
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

            <div class="form-check form-switch mb-4">
                <input class="form-check-input"
                    type="checkbox"
                    id="hasEaten"
                    ${dish.hasEaten ? 'checked' : ''}>
                <label class="form-check-label fw-semibold">Đã ăn rồi</label>
            </div>

            <div class="d-flex justify-content-end gap-2">
                <button type="button"
                    class="btn btn-outline-secondary"
                    data-bs-dismiss="modal">Huỷ</button>

                <button type="submit"
                    class="btn ${dish.id ? 'btn-success' : 'btn-primary'}">
                    ${dish.id ? 'Cập nhật' : 'Thêm mới'}
                </button>
            </div>
        </form>
    `;
}

function submitDish(event, id) {
    event.preventDefault();

    const payload = {
        dishName: document.getElementById('dishName').value,
        hasEaten: document.getElementById('hasEaten').checked,
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
        .then((res) => {
            if (!res.ok) throw new Error();
            return res.json();
        })
        .then((data) => {
            bootstrap.Modal.getInstance(document.getElementById('dishModal')).hide();

            loadDishes();

            // Toast chính
            showToast({
                message: id ? 'Cập nhật món ăn thành công' : 'Thêm món ăn thành công',
                type: 'success',
            });

            // Toast reset
            if (data.resetPerformed) {
                showToast({
                    message: 'Đã reset tất cả món trong loại này',
                    type: 'warning',
                });
            }
        })
        .catch((err) => {
            showToast({
                message: 'Lưu món ăn không thành công',
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

        const option = document.createElement('option');
        option.value = dishType.id;
        option.textContent = dishType.label;
        option.selected = true;

        select.appendChild(option);

        input.value = '';
        document.getElementById('newDishTypeBox').classList.add('d-none');

        showToast({
            message: `Loại món "${dishType.label}" đã được tạo`,
            type: 'success',
        });
    } catch (err) {
        showToast({
            message: 'Không thể tạo loại món',
            type: 'error',
        });
        console.error(err);
    }
}
