function openCloneModal(sourceDishId) {
    fetch(`/api/community/modal?id=${sourceDishId}`)
        .then((res) => res.json())
        .then((data) => {
            renderCloneDishForm(data.dish, data.dishTypes);

            document.getElementById('dishModalTitle').innerText = 'Sao chép món ăn';

            new bootstrap.Modal(document.getElementById('dishModal')).show();
        })
        .catch((err) => {
            showToast({
                message: 'Vui lòng đăng nhập để sao chép món ăn',
                type: 'error',
            });
            console.error(err);
        });
}

function renderCloneDishForm(dish, dishTypes) {
    const body = document.getElementById('dishModalBody');
    const footer = document.getElementById('dishModalFooter');

    body.innerHTML = `
        <form id="cloneDishForm" onsubmit="submitCloneDish(event, ${dish.id})">

            <div class="mb-3">
                <label class="form-label fw-semibold">Tên món</label>
                <input type="text"
                    class="form-control form-control-lg"
                    value="${dish.dishName} (${dish.ownerUsername})"
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

            <div class="form-text text-muted">
                Món ăn sẽ được lưu ở chế độ <strong>Riêng tư</strong>
            </div>
        </form>
    `;

    footer.innerHTML = `
        <div class="d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
            <button type="submit" form="cloneDishForm" class="btn btn-primary">Lưu</button>
        </div>
    `;
}

function submitCloneDish(event, sourceDishId) {
    event.preventDefault();

    // 1. Lấy instance của form hiện tại và ẩn nó đi
    const dishModalEl = document.getElementById('dishModal');
    const dishModal = bootstrap.Modal.getInstance(dishModalEl);
    dishModal.hide();

    // 2. Lấy dữ liệu từ form để chuẩn bị cho payload
    const payload = {
        sourceDishId,
        dishName: document.getElementById('dishName').value,
        dishTypeId: document.getElementById('dishTypeSelect').value,
    };

    // 3. Mở Modal xác nhận
    openConfirmModal({
        title: 'Sao chép món ăn',
        message: `Bạn có chắc muốn sao chép món <b>"${payload.dishName}"</b> vào danh sách của mình không?`,
        confirmText: 'Sao chép ngay',
        confirmClass: 'btn-primary',
        onConfirm: () => submitCloneDishConfirmed(payload),
        onCancel: () => dishModal.show(),
    });
}

// Hàm xử lý gọi API tách riêng
function submitCloneDishConfirmed(payload) {
    fetch('/api/community/clone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })
        .then(async (res) => {
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || 'Có lỗi xảy ra khi sao chép');
            }
            return res;
        })
        .then(() => {
            loadCommunityDishes();
            showToast({
                message: 'Đã thêm món ăn vào danh sách cá nhân',
                type: 'success',
            });
        })
        .catch((err) => {
            showToast({
                message: 'Đã xảy ra lỗi khi thêm món ăn',
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
            message: `Loại món mới đã được tạo`,
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
