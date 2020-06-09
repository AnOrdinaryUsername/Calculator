const clearDisplay = () => document.querySelector('.results').textContent = "";

const deleteLastChar = () => {
    let number = document.querySelector('.results').textContent;
    document.querySelector('.results').textContent = number.slice(0, -1);
};

const topButtons = () => {
    document.querySelector('#clear').addEventListener('click', function (e) {
        clearDisplay();
    });

    document.querySelector('#delete').addEventListener('click', function (e) {
        deleteLastChar();
    });
};

const updateDisplay = (character) => {
    let existingChar = document.querySelector('.results').textContent;
    document.querySelector('.results').textContent = existingChar.concat("", character);
}

const pressButtonEvent = () => {
    document.querySelector('.buttons-wrapper').addEventListener('click',
        function (e) {
            let button = e.target.id;
            switch (button) {
                case "1":
                    updateDisplay(1);
                    break;
                case "2":
                    updateDisplay(2);
                    break;
                case "3":
                    updateDisplay(3);
                    break;
                case "4":
                    updateDisplay(4);
                    break;
                case "5":
                    updateDisplay(5);
                    break;
                case "6":
                    updateDisplay(6);
                    break;
                case "7":
                    updateDisplay(7);
                    break;
                case "8":
                    updateDisplay(8);
                    break;
                case "9":
                    updateDisplay(9);
                    break;
                case "0":
                    updateDisplay(0);
                    break;
                default:
                    break;
            }
        });
}

topButtons();
pressButtonEvent();