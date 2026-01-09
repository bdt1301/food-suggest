// Load DOM content
const API_BASE = '/api/dishes';
const pageSize = 8;

let currentPage = 0;
let currentKeyword = '';
let currentSort = 'dishName';
let currentDirection = 'asc';

document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
});

function loadDishes(page = 0) {
    currentPage = page;

    const params = new URLSearchParams({
        page,
        size: pageSize,
        keyword: currentKeyword,
        sort: currentSort,
        direction: currentDirection,
    });

    fetch(`${API_BASE}?${params}`)
        .then((res) => res.json())
        .then((data) => {
            renderDishes(data.content);
            renderPagination(data.totalPages);
        });
}

function renderDishes(dishes) {
    const tbody = document.getElementById('dishesTableBody');
    tbody.innerHTML = '';

    if (dishes.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted fst-italic py-4">
                    Chưa có món ăn nào!
                </td>
            </tr>`;
        return;
    }

    dishes.forEach((dish) => {
        tbody.innerHTML += `
            <tr>
                <td>
                    <span class="dish-name clickable" onclick="openNoteModal(${dish.id})">${dish.dishName}</span>
                </td>
                <td class="d-none d-md-table-cell">
                    <span class="badge bg-secondary">${dish.dishType?.label ?? ''}</span>
                </td>
                <td>
                    <span class="badge ${dish.hasEaten ? 'bg-success' : 'bg-danger'}">
                        ${dish.hasEaten ? 'Đã ăn' : 'Chưa ăn'}
                    </span>
                </td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-warning" onclick="openDishModal(${dish.id})">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-danger" onclick="deleteDish(${dish.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
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
        <li class="page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}">
            <button class="page-link" onclick="loadDishes(${totalPages - 1})">Last</button>
        </li>
    `;
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

// Search
function onSearchInput() {
    currentKeyword = document.getElementById('search-name').value;
    loadDishes(0);
}

// Sort
document.querySelectorAll('th.sortable').forEach((header) => {
    header.addEventListener('click', () => {
        const field = header.dataset.field;

        if (currentSort === field) {
            currentDirection = currentDirection === 'asc' ? 'desc' : 'asc';
        } else {
            currentSort = field;
            currentDirection = 'asc';
        }

        loadDishes(0);
        updateSortIcons();
    });
});

function updateSortIcons() {
    document.querySelectorAll('th.sortable').forEach((th) => {
        const arrow = th.querySelector('.th-arrow');
        if (!arrow) return;

        if (th.dataset.field === currentSort) {
            arrow.innerHTML =
                currentDirection === 'asc'
                    ? '<i class="fa-solid fa-arrow-up-short-wide"></i>'
                    : '<i class="fa-solid fa-arrow-down-wide-short"></i>';
        } else {
            arrow.innerHTML = '';
        }
    });
}
