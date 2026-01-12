class Validator {
    constructor(options) {
        this.formElement = document.querySelector(options.form);
        this.formGroupSelector = options.formGroupSelector;
        this.errorSelector = options.errorSelector;
        if (this.formElement) {
            this.setup();
        }
    }

    static getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            element = element.parentElement;
        }
    }

    validate(inputElement) {
        const errorElement = Validator.getParent(inputElement, this.formGroupSelector).querySelector(
            this.errorSelector,
        );
        let errorMessage;

        const rules = inputElement.dataset.rule?.split('|') || [];
        let inputValue = inputElement.value;

        if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
            const checkedElements = this.formElement.querySelectorAll(`input[name="${inputElement.name}"]:checked`);
            inputValue = checkedElements.length ? Array.from(checkedElements).map((el) => el.value) : '';
        } else if (inputElement.type === 'file') {
            inputValue = inputElement.files.length ? inputElement.files : '';
        }

        for (const rule of rules) {
            if (rule.startsWith('required')) {
                if (inputElement.type === 'checkbox' || inputElement.type === 'radio') {
                    errorMessage = inputValue.length ? undefined : 'Vui lòng chọn ít nhất một tùy chọn';
                } else {
                    errorMessage = inputValue ? undefined : 'Vui lòng nhập trường này';
                }
            } else if (rule.startsWith('email')) {
                const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
                errorMessage = regex.test(inputValue) ? undefined : 'Email không hợp lệ';
            } else if (rule.startsWith('min:')) {
                const minLength = parseInt(rule.split(':')[1], 10);
                errorMessage =
                    inputValue.length >= minLength ? undefined : `Vui lòng nhập tối thiểu ${minLength} ký tự`;
            } else if (rule.startsWith('match:')) {
                const targetSelector = rule.split(':')[1];
                const targetElement = this.formElement.querySelector(targetSelector);
                errorMessage = inputValue === targetElement.value ? undefined : 'Xác nhận mật khẩu không khớp';
            } else if (rule.startsWith('different:')) {
                const targetSelector = rule.split(':')[1];
                const targetElement = this.formElement.querySelector(targetSelector);
                errorMessage =
                    inputValue && inputValue !== targetElement.value
                        ? undefined
                        : 'Mật khẩu mới phải khác mật khẩu hiện tại';
            }
            if (errorMessage) break;
        }

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            Validator.getParent(inputElement, this.formGroupSelector).classList.add('invalid');
        } else {
            errorElement.innerText = '';
            Validator.getParent(inputElement, this.formGroupSelector).classList.remove('invalid');
        }

        return !errorMessage;
    }

    setup() {
        this.formElement.onsubmit = (e) => {
            e.preventDefault();
            let isFormValid = true;

            const inputElements = this.formElement.querySelectorAll('[data-rule]');
            inputElements.forEach((inputElement) => {
                if (!this.validate(inputElement)) {
                    isFormValid = false;
                }
            });

            if (isFormValid) {
                this.formElement.submit();
            }
        };

        const inputElements = this.formElement.querySelectorAll('[data-rule]');
        inputElements.forEach((inputElement) => {
            inputElement.onblur = () => this.validate(inputElement);
            inputElement.oninput = () => {
                const errorElement = Validator.getParent(inputElement, this.formGroupSelector).querySelector(
                    this.errorSelector,
                );
                errorElement.innerText = '';
                Validator.getParent(inputElement, this.formGroupSelector).classList.remove('invalid');
            };
        });
    }
}
