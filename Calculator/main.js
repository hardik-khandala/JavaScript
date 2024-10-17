    
        function isNumeric(value) {
            return !isNaN(value) && value.trim() !== '';
        }

        function calculate() {
            document.getElementById('firstnumber-error').innerText = '';
            document.getElementById('secondnumber-error').innerText = '';
            document.getElementById('operation-error').innerText = '';
            document.getElementById('result').innerText = '';

            const firstNumber = document.getElementById('firstnumber').value;
            const secondNumber = document.getElementById('secondnumber').value;
            const operation = document.querySelector('input[name="operation"]:checked');

            let hasError = false;

            if (!firstNumber) {
                document.getElementById('firstnumber-error').innerText = 'Please enter first number';
                hasError = true;
            } else if (!isNumeric(firstNumber)) {
                document.getElementById('firstnumber-error').innerText = 'Please enter valid number';
                hasError = true;
            }

            if (!secondNumber) {
                document.getElementById('secondnumber-error').innerText = 'Please enter second number';
                hasError = true;
            } else if (!isNumeric(secondNumber)) {
                document.getElementById('secondnumber-error').innerText = 'Please enter valid number';
                hasError = true;
            }

            if (!operation) {
                document.getElementById('operation-error').innerText = 'Select any of the operation';
                hasError = true;
            }

            if (!hasError) {
                const num1 = parseFloat(firstNumber);
                const num2 = parseFloat(secondNumber);
                let result = 0;

                switch (operation.value) {
                    case 'addition':
                        result = num1 + num2;
                        break;
                    case 'subtraction':
                        result = num1 - num2;
                        break;
                    case 'multiplication':
                        result = num1 * num2;
                        break;
                    case 'division':
                        if (num2 === 0) {
                            document.getElementById('result').innerText = 'Division by zero is not allowed';
                            return;
                        }
                        result = num1 / num2;
                        break;
                }

                document.getElementById('result').innerText = "Result is: "+result;
            }
        }

        function resetForm() {
            document.getElementById('firstnumber').value = '';
            document.getElementById('secondnumber').value = '';
            document.querySelectorAll('input[name="operation"]').forEach(el => el.checked = false);
            document.getElementById('result').innerText = '';
            document.getElementById('firstnumber-error').innerText = '';
            document.getElementById('secondnumber-error').innerText = '';
            document.getElementById('operation-error').innerText = '';
        }
    
