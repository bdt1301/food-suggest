// Load DOM content
const API_BASE = '/api/dishes';
document.addEventListener('DOMContentLoaded', () => {
    loadDishes();
});

function loadDishes() {
    fetch(API_BASE)
        .then((res) => res.json())
        .then((dishes) => renderDishes(dishes));
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

// Search bar
function removeVietnameseTones(str) {
    return str
        .normalize('NFD') // tách dấu
        .replace(/[\u0300-\u036f]/g, '') // xoá dấu
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
}

function searchName() {
    const input = document.getElementById('search-name');
    const keyword = removeVietnameseTones(input.value.toLowerCase());

    const table = document.getElementById('dishesTableBody');
    const trs = table.getElementsByTagName('tr');

    for (let i = 0; i < trs.length; i++) {
        const td = trs[i].getElementsByTagName('td')[0];
        if (!td) continue;

        const text = removeVietnameseTones((td.textContent || td.innerText).toLowerCase());

        if (text.includes(keyword)) {
            trs[i].style.display = '';
        } else {
            trs[i].style.display = 'none';
        }
    }
}

// Sort table
document.addEventListener('DOMContentLoaded', () => {
    const table = document.querySelector('table');
    const headers = table.querySelectorAll('th.sortable');
    const tbody = table.querySelector('tbody');
    const sortState = {};

    headers.forEach((header, colIndex) => {
        sortState[colIndex] = 'asc';

        header.addEventListener('click', () => {
            const rows = Array.from(tbody.querySelectorAll('tr')).filter((row) => row.children.length > 1);

            rows.sort((a, b) => {
                const textA = a.children[colIndex].innerText.trim();
                const textB = b.children[colIndex].innerText.trim();
                return sortState[colIndex] === 'asc'
                    ? textA.localeCompare(textB, 'vi')
                    : textB.localeCompare(textA, 'vi');
            });

            // Đặt mũi tên cho header đang click
            headers.forEach((h, i) => {
                const arrow = h.querySelector('.th-arrow');
                if (i === colIndex) {
                    arrow.innerHTML =
                        sortState[colIndex] === 'asc'
                            ? '<i class="fa-solid fa-arrow-up-short-wide"></i>'
                            : '<i class="fa-solid fa-arrow-down-wide-short"></i>';
                } else {
                    arrow.innerHTML = ''; // xóa mũi tên cột khác
                }
            });

            sortState[colIndex] = sortState[colIndex] === 'asc' ? 'desc' : 'asc';

            rows.forEach((row) => tbody.appendChild(row));
        });
    });
});
