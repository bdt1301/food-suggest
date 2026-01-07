let lastToastTime = 0;
const STAGGER_DELAY = 200; // Khoảng cách giữa các toast

function showToast({ message, type = 'primary', delay = 4000 }) {
    const currentTime = Date.now();

    // Tính toán thời gian cần chờ
    const waitTime = Math.max(0, lastToastTime + STAGGER_DELAY - currentTime);
    lastToastTime = currentTime + waitTime;

    setTimeout(() => {
        const container = document.getElementById('toastContainer');
        const template = document.getElementById('toastTemplate');
        const toastEl = template.content.firstElementChild.cloneNode(true);

        const bodyEl = toastEl.querySelector('.toast-body');
        bodyEl.textContent = message;

        const typeMap = {
            success: 'text-bg-success',
            error: 'text-bg-danger',
            warning: 'text-bg-warning',
            info: 'text-bg-info',
            primary: 'text-bg-primary',
        };

        toastEl.classList.add(typeMap[type] || 'text-bg-primary');
        container.appendChild(toastEl);

        const toast = new bootstrap.Toast(toastEl, { delay });

        // show animation
        requestAnimationFrame(() => {
            toastEl.classList.add('toast-show');
        });

        toast.show();

        // trước khi hide → gắn animation out
        toastEl.addEventListener('hide.bs.toast', () => {
            toastEl.classList.remove('toast-show');
            toastEl.classList.add('toast-hide');
        });

        toastEl.addEventListener('hidden.bs.toast', () => {
            toastEl.remove();
        });
    }, waitTime);
}
