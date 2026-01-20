let lastToastTime = 0;
const STAGGER_DELAY = 200; // Khoảng cách giữa các toast

function showToast({ message, type = 'primary', delay = 4000 }) {
    const currentTime = Date.now();
    const waitTime = Math.max(0, lastToastTime + STAGGER_DELAY - currentTime);
    lastToastTime = currentTime + waitTime;

    return new Promise((resolve) => {
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

            requestAnimationFrame(() => {
                toastEl.classList.add('toast-show');
            });

            toast.show();

            toastEl.addEventListener('hide.bs.toast', () => {
                toastEl.classList.remove('toast-show');
                toastEl.classList.add('toast-hide');
            });

            toastEl.addEventListener('hidden.bs.toast', () => {
                toastEl.remove();
            });

            resolve(toast);
        }, waitTime);
    });
}
