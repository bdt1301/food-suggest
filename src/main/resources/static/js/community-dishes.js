const API_BASE = '/api/community';
const pageSize = 12;

let currentPage = 0;
let currentKeyword = '';

document.addEventListener('DOMContentLoaded', () => {
    loadCommunityDishes();
});

function loadCommunityDishes(page = 0) {
    currentPage = page;

    const params = new URLSearchParams({
        page,
        size: pageSize,
        keyword: currentKeyword,
    });

    fetch(`${API_BASE}?${params}`)
        .then((res) => res.json())
        .then((data) => {
            renderCommunityDishes(data.content);
            renderPagination(data.totalPages);
        });
}

function renderCommunityDishes(dishes) {
    const container = document.getElementById('communityDishesList');
    container.innerHTML = '';

    if (dishes.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted py-4">
                Chưa có món ăn nào được chia sẻ
            </div>`;
        return;
    }

    dishes.forEach((dish) => {
        container.innerHTML += `
            <div class="col-lg-3 col-md-4 col-sm-6">
                <div 
                    class="dish-item d-flex justify-content-between h-100"
                    data-id="${dish.id}"
                >

                    <div class="d-flex align-items-center gap-3">
                        <i class="fa-solid fa-globe text-success"></i>

                        <div>
                            <div class="dish-name mb-1">
                                ${dish.dishName}
                            </div>

                            <div class="text-muted small">
                                Chia sẻ bởi <strong>${dish.ownerUsername}</strong>
                            </div>
                        </div>
                    </div>

                    ${
                        dish.authenticated && !dish.owner
                            ? `
                            <div class="mt-2 text-end prevent-open">
                                <button
                                    class="btn btn-sm btn-outline-primary"
                                    onclick="openCloneModal(${dish.id})"
                                >
                                    <i class="fa-solid fa-copy me-1"></i>
                                </button>
                            </div>
                            `
                            : ''
                    }

                </div>
            </div>
        `;
    });
}

function renderPagination(totalPages) {
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    for (let i = 0; i < totalPages; i++) {
        pagination.innerHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <button class="page-link" onclick="loadCommunityDishes(${i})">
                    ${i + 1}
                </button>
            </li>
        `;
    }
}

function onSearchInput() {
    currentKeyword = document.getElementById('searchName').value;
    loadCommunityDishes(0);
}

document.addEventListener('click', function (e) {
    const dishItem = e.target.closest('.dish-item');
    if (!dishItem) return;

    if (e.target.closest('.prevent-open')) return;

    const dishId = dishItem.dataset.id;
    openNoteViewModal(dishId);
});
