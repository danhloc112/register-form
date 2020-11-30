function Validator(formSelector) {
    let formRules = {};

    function getParent(element, selector) {
        while(element.parentElement) {
            if(element.parentElement.matches(selector)) {
                return element.parentElement;
            }
            else {
                element = element.parentElement;
            }
        }
    }

    let validatorRules = {
        required: function(value) {
            return value ? undefined : 'Vui lòng nhập trường này!'
        },
        email: function(value) {
            let regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
            return regex.test(value) ? undefined : 'Vui  lòng nhập đúng định dạng email!'
        },
        match: function(value) {
            return value == document.querySelector('#password').value ? undefined : 'Vui lòng nhập đúng mật khẩu!'
        },
        min: function(min) {
            return function(value) {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự!`
            }
        },
        max: function(min) {
            return function(value) {
                return value.length <= max ? undefined : `Vui lòng nhập tối thiểu ${max} ký tự!`
            }
        }
     }



    let formElement = document.querySelector(formSelector);
    if (formElement) {
        let inputs = formElement.querySelectorAll('[name][rules]');
        for (let input of inputs) {
            let rules = input.getAttribute('rules').split('|');
            for (let rule of rules) {
                let ruleInfo;
                let ruleHasValue = rule.includes(':');
                if (ruleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                    // validatorRules[rule](ruleInfo[1])
                }
                let ruleFunc = validatorRules[rule];
                if (ruleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc)
                }
                else {
                    formRules[input.name] = [ruleFunc];
                }
            }
            //Duyệt qua các sự kiện

            input.onblur = blurValidate;
            input.oninput = clearValidate;
        }

        //Hàm kiểm tra nhập chưa
        function blurValidate(event) {
            let rules = formRules[event.target.name];
            let errorMessage;
            for (let rule of rules) {
                errorMessage = rule(event.target.value);
                if(errorMessage) break;
            }
            if (errorMessage) {
                let formGroup = getParent(event.target, '.form-group')
                if(formGroup) {
                    let formMessage = formGroup.querySelector('.form-message')
                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                        formGroup.classList.add('invalid')
                    }
                }
            }
        }

        //Hàm clear khi nhập input
        function clearValidate(event) {
            let formGroup = getParent(event.target, '.form-group');
            let formMessage = formGroup.querySelector('.form-message')
            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                formMessage.innerText = '';
            }
        }
        
    }

    // Hàm submit form
    formElement.onsubmit = function (event) {
        event.preventDefault();
        let inputs = formElement.querySelectorAll('[name][rules]');
        let isValid = true;
        for (let input of inputs) {
            if (blurValidate( { target: input } )) {
                isValid = false;
            }
        }
        if(isValid) {
            formElement.submit()
        }
    }


}