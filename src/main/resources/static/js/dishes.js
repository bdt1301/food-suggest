// Load DOM content
const API_BASE = '/api/dishes';
const pageSize = 12;

let currentPage = 0;
let currentKeyword = '';

document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
});

function loadDishes(page = 0) {
    currentPage = page;

    const params = new URLSearchParams({
        page,
        size: pageSize,
        keyword: currentKeyword,
        sort: 'dishName',
        direction: 'asc',
    });

    fetch(`${API_BASE}?${params}`)
        .then((res) => res.json())
        .then((data) => {
            renderDishes(data.content);
            renderPagination(data.totalPages);
        });
}

function renderDishes(dishes) {
    const container = document.getElementById('dishesList');
    container.innerHTML = '';

    if (dishes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-4">
                Chưa có món ăn nào!
            </div>`;
        return;
    }

    dishes.forEach((dish) => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="dish-item d-flex justify-content-between align-items-start" data-id="${dish.id}">

                    <div>
                        <div class="d-flex align-items-center gap-1">
                            <div class="dish-name">
                                ${dish.dishName}
                            </div>
                            <i class="fa-solid fa-check 
                                ${dish.hasEaten ? 'text-success' : 'd-none'}">
                            </i>
                        </div>
                        <span class="badge bg-secondary dish-type">
                            ${dish.dishType?.label ?? ''}
                        </span>
                    </div>

                    <div class="dropdown dish-actions">
                        <button class="btn btn-sm" data-bs-toggle="dropdown">
                            <i class="fa-solid fa-ellipsis-vertical"></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li>
                                <button class="dropdown-item" onclick="openDishModal(${dish.id})">
                                    <i class="fa-solid fa-pen me-2"></i>Sửa
                                </button>
                            </li>
                            <li>
                                <button class="dropdown-item text-danger" onclick="deleteDish(${dish.id})">
                                    <i class="fa-solid fa-trash me-2"></i>Xoá
                                </button>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        `;
    });
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    // First
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 0 ? 'disabled' : ''}">
            <button class="page-link" onclick="loadDishes(0)">First</button>
        </li>
    `;

    // Page numbers
    for (let i = 0; i < totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" onclick="loadDishes(${i})">
                    ${i + 1}
                </button>
            </li>
        `;
    }

    // Last
    pagination.innerHTML += `
        <li class="page-item ${currentPage === 0 || currentPage === totalPages - 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="loadDishes(${totalPages - 1})">Last</button>
        </li>
    `;
}

// Search
function onSearchInput() {
    currentKeyword = document.getElementById('searchName').value;
    loadDishes(0);
}

function deleteDish(id) {
    if (!confirm('Bạn có chắc muốn xoá món này?')) return;

    fetch(`${API_BASE}/${id}`, { method: 'DELETE' })
        .then((res) => {
            if (!res.ok) throw new Error();

            loadDishes();

            showToast({
                message: 'Món ăn đã được xoá thành công',
                type: 'success',
            });
        })
        .catch(() => {
            showToast({
                message: 'Không thể xoá món ăn',
                type: 'error',
            });
        });
}

function markAllUneaten() {
    fetch(`${API_BASE}/mark-all-uneaten`, { method: 'PUT' })
        .then((res) => {
            if (!res.ok) throw new Error();

            loadDishes();

            showToast({
                message: 'Tất cả món ăn đã được đánh dấu là chưa ăn',
                type: 'info',
            });
        })
        .catch(() => {
            showToast({
                message: 'Không thể cập nhật trạng thái món ăn',
                type: 'error',
            });
        });
}

// Chặn hành vi cha khi click dish-actions
document.addEventListener('click', function (e) {
    const dishItem = e.target.closest('.dish-item');
    if (!dishItem) return;

    if (e.target.closest('.dish-actions')) return;

    const dishId = dishItem.dataset.id;
    openNoteModal(dishId);
});
