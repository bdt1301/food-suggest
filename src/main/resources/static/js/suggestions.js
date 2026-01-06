const API_BASE = '/api/suggestions';

document.addEventListener('DOMContentLoaded', () => {
    loadPageData();
});

// 1. Load toàn bộ dữ liệu từ API
function loadPageData() {
    fetch(API_BASE)
        .then((res) => res.json())
        .then((data) => {
            renderLayout(data.dishTypes, data.groups);
        })
        .catch((err) => {
            console.error(err);
            document.getElementById('dish-type-container').innerHTML = 'Lỗi load dữ liệu!';
        });
}

// 2. Hàm vẽ giao diện
function renderLayout(dishTypes, groups) {
    const container = document.getElementById('dish-type-container');
    container.innerHTML = ''; // Xóa chữ "Đang tải"

    dishTypes.forEach((type) => {
        const dishes = groups[type.id] || [];
        const card = `
            <div class="col-md-6 col-lg-4" id="dish-type-${type.id}">
                <div class="card shadow-sm h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-center gap-3 mb-3">
                            <div class="d-flex gap-2 align-items-center">
                                <h5 class="card-title mb-0" id="label-${type.id}">${type.label}</h5>
                                
                                <div id="btn-handle-type-${type.id}" class="btn-group btn-group-sm">
                                    <button class="btn btn-warning" onclick="enableEdit(${
                                        type.id
                                    })"><i class="fa-solid fa-pen"></i></button>
                                    <button class="btn btn-danger" onclick="deleteType(${
                                        type.id
                                    })"><i class="fa-solid fa-trash"></i></button>
                                </div>

                                <form class="d-none align-items-center gap-1" id="form-${
                                    type.id
                                }" onsubmit="return false;">
                                    <input type="text" id="input-${type.id}" value="${
            type.label
        }" class="form-control form-control-sm" required />
                                    <button type="button" class="btn btn-sm btn-success" onclick="saveEdit(${
                                        type.id
                                    })"><i class="fa-solid fa-floppy-disk"></i></button>
                                    <button type="button" class="btn btn-sm btn-secondary" onclick="cancelEdit(${
                                        type.id
                                    })"><i class="fa-solid fa-xmark"></i></button>
                                </form>
                            </div>
                            <button type="button" onclick="addDish(${
                                type.id
                            })" class="btn btn-sm btn-primary">Thêm gợi ý</button>
                        </div>

                        <ul class="list-group list-group-flush flex-grow-1" id="dish-group-${type.id}">
                            ${renderDishes(dishes, type.id)}
                        </ul>
                    </div>
                </div>
            </div>`;
        container.insertAdjacentHTML('beforeend', card);
    });
}

// 3. Hàm vẽ danh sách món ăn (li)
function renderDishes(dishes, typeId) {
    if (dishes.length === 0) {
        return `<li class="list-group-item text-muted text-center fst-italic" id="empty-msg-${typeId}">Chưa có món nào được chọn</li>`;
    }
    return dishes
        .map(
            (dish) => `
                <li class="list-group-item d-flex justify-content-between align-items-center" id="dish-item-${dish.id}">
                    <span class="dish-name">${dish.dishName}</span>
                    <div class="btn-group btn-group-sm">
                        <button type="button" onclick="eatDish(${dish.id}, ${typeId})" class="btn btn-success">Ăn</button>
                        <button type="button" onclick="randomDish(${dish.id}, ${typeId})" class="btn btn-warning">Đổi</button>
                        <button type="button" onclick="removeDish(${dish.id}, ${typeId})" class="btn btn-danger">Bỏ</button>
                    </div>
                </li>
            `,
        )
        .join('');
}

// 1. Thêm gợi ý
function addDish(typeId) {
    fetch(`${API_BASE}/add/${typeId}`, { method: 'POST' })
        .then((response) => {
            if (response.ok) return response.json(); // Nhận về đối tượng Dish JSON
            throw new Error('Lỗi khi thêm món');
        })
        .then((dish) => {
            // 1. Ẩn thông báo "Chưa có món nào"
            const emptyMsg = document.getElementById(`empty-msg-${typeId}`);
            if (emptyMsg) emptyMsg.remove();

            // 2. Tạo HTML cho dòng mới
            const ul = document.getElementById(`dish-group-${typeId}`);
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.id = `dish-item-${dish.id}`;
            li.innerHTML = `
                <span class="dish-name">${dish.dishName}</span>
                <div class="btn-group btn-group-sm">
                    <button type="button" onclick="eatDish(${dish.id}, ${typeId})" class="btn btn-success">Ăn</button>
                    <button type="button" onclick="randomDish(${dish.id}, ${typeId})" class="btn btn-warning">Đổi</button>
                    <button type="button" onclick="removeDish(${dish.id}, ${typeId})" class="btn btn-danger">Bỏ</button>
                </div>
            `;
            ul.appendChild(li);
        })
        .catch((err) => {
            showToast({ message: 'Không còn món nào để gợi ý', type: 'error' });
            console.error(err);
        });
}

// 2. Đổi món
function randomDish(dishId, typeId) {
    fetch(`${API_BASE}/${dishId}/random`, { method: 'POST' })
        .then((response) => {
            if (response.ok) return response.json();
            throw new Error('Lỗi khi đổi món');
        })
        .then((newDish) => {
            const row = document.getElementById(`dish-item-${dishId}`);
            if (row) {
                row.id = `dish-item-${newDish.id}`; // Cập nhật ID dòng
                row.querySelector('.dish-name').textContent = newDish.dishName;

                // Cập nhật lại các nút bấm với ID mới
                const btns = row.querySelectorAll('button');
                btns[0].setAttribute('onclick', `eatDish(${newDish.id}, ${typeId})`);
                btns[1].setAttribute('onclick', `randomDish(${newDish.id}, ${typeId})`);
                btns[2].setAttribute('onclick', `removeDish(${newDish.id}, ${typeId})`);
            }
        })
        .catch((err) => {
            showToast({ message: 'Không còn món nào để đổi', type: 'error' });
            console.error(err);
        });
}

// 3. Bỏ món
function removeDish(dishId, typeId) {
    fetch(`${API_BASE}/${dishId}/remove`, { method: 'DELETE' }).then((response) => {
        if (response.ok) {
            const row = document.getElementById(`dish-item-${dishId}`);
            if (row) row.remove();
            checkEmpty(typeId);
        }
    });
}

// 4. Ăn món
function eatDish(dishId, typeId) {
    fetch(`${API_BASE}/${dishId}/eat`, { method: 'POST' })
        .then((response) => {
            if (!response.ok) throw new Error();
            return response.json();
        })
        .then((data) => {
            const row = document.getElementById(`dish-item-${dishId}`);
            if (row) {
                row.style.opacity = '0.5';
                row.style.textDecoration = 'line-through';

                setTimeout(() => {
                    row.remove();
                    checkEmpty(typeId);
                }, 500);
            }

            // Toast reset
            if (data.resetPerformed) {
                showToast({
                    message: 'Đã reset tất cả món trong loại này',
                    type: 'warning',
                });
            }
        })
        .catch((err) => {
            console.error(err);
            showToast({
                message: 'Ăn món không thành công',
                type: 'error',
            });
        });
}

// Check danh sách có rỗng không
function checkEmpty(typeId) {
    const ul = document.getElementById(`dish-group-${typeId}`);
    if (!ul) return;

    const currentItems = ul.getElementsByTagName('li');
    if (currentItems.length === 0) {
        const emptyHtml = `
            <li class="list-group-item text-muted text-center fst-italic" 
                id="empty-msg-${typeId}">
                Chưa có món nào được chọn
            </li>`;
        ul.innerHTML = emptyHtml;
    }
}
