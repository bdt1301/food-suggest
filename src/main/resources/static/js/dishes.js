// Load DOM content
const API_BASE = '/api/dishes';
const pageSize = 12;

let currentPage = 0;
let currentKeyword = '';

let currentFilters = {
    dishTypeId: '',
    hasEaten: '',
    visibility: '',
};

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

    if (currentFilters.dishTypeId) params.append('dishTypeId', currentFilters.dishTypeId);
    if (currentFilters.hasEaten !== '') params.append('hasEaten', currentFilters.hasEaten);
    if (currentFilters.visibility) params.append('visibility', currentFilters.visibility);

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
                Chưa có món ăn nào
            </div>`;
        return;
    }

    dishes.forEach((dish) => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div class="dish-item d-flex justify-content-between align-items-start" data-id="${dish.id}">

                    <div class="d-flex align-items-center gap-3">
                        
                        ${
                            dish.visibility === 'PUBLIC'
                                ? `<i class="fa-solid fa-globe text-success" title="Công khai"></i>`
                                : `<i class="fa-solid fa-lock text-secondary" title="Riêng tư"></i>`
                        }

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
}

// Search
function onSearchInput() {
    currentKeyword = document.getElementById('searchName').value;
    loadDishes(0);
}

// Filter
function openFilterModal() {
    fetch('/api/dishes/filter')
        .then((res) => res.json())
        .then((data) => {
            renderFilterForm(data.dishTypes, data.visibilities);
            new bootstrap.Modal(document.getElementById('filterModal')).show();
        });
}

function renderFilterForm(dishTypes, visibilities) {
    document.getElementById('filterModalBody').innerHTML = `
        <form onsubmit="applyFilters(event)">

            <!-- Dish Type -->
            <div class="mb-3">
                <label class="form-label fw-semibold">Loại món</label>
                <select class="form-select form-select-lg" id="filterDishType">
                    <option value="">-- Tất cả --</option>
                    ${dishTypes
                        .map(
                            (t) => `
                        <option value="${t.id}"
                            ${currentFilters.dishTypeId == t.id ? 'selected' : ''}>
                            ${t.label}
                        </option>
                    `,
                        )
                        .join('')}
                </select>
            </div>

            <!-- Has Eaten -->
            <div class="mb-3">
                <label class="form-label fw-semibold">Trạng thái ăn</label>
                <select class="form-select form-select-lg" id="filterHasEaten">
                    <option value="">-- Tất cả --</option>
                    <option value="true" ${currentFilters.hasEaten === 'true' ? 'selected' : ''}>
                        Đã ăn
                    </option>
                    <option value="false" ${currentFilters.hasEaten === 'false' ? 'selected' : ''}>
                        Chưa ăn
                    </option>
                </select>
            </div>

            <!-- Visibility -->
            <div class="mb-4">
                <label class="form-label fw-semibold">Chia sẻ</label>
                <select class="form-select form-select-lg" id="filterVisibility">
                    <option value="">-- Tất cả --</option>
                    ${visibilities
                        .map(
                            (v) => `
                        <option value="${v}"
                            ${currentFilters.visibility === v ? 'selected' : ''}>
                            ${v === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                        </option>
                    `,
                        )
                        .join('')}
                </select>
            </div>

            <div class="d-flex justify-content-between">
                <button type="button"
                        class="btn btn-outline-danger"
                        onclick="resetFilters()">
                    Reset
                </button>
                <button type="submit" class="btn btn-primary">
                    Áp dụng
                </button>
            </div>
        </form>
    `;
}

function applyFilters(e) {
    e.preventDefault();

    currentFilters = {
        dishTypeId: document.getElementById('filterDishType').value,
        hasEaten: document.getElementById('filterHasEaten').value,
        visibility: document.getElementById('filterVisibility').value,
    };

    bootstrap.Modal.getInstance(document.getElementById('filterModal')).hide();
    loadDishes(0);
}

function resetFilters() {
    currentFilters = {
        dishTypeId: '',
        hasEaten: '',
        visibility: '',
    };

    document.getElementById('filterDishType').value = '';
    document.getElementById('filterHasEaten').value = '';
    document.getElementById('filterVisibility').value = '';

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
