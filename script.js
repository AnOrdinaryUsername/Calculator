class Operations {
    constructor(count) {
        this.count = count;
    }

    incrementCount() {
        return this.count += 1;
    }

    decrementCount() {
        return this.count -= 1;
    }

    resetCount() {
        this.count = 0;
    }

    maxChars() {
        return (this.count === 9);
    }

}

const clearDisplay = (object) =>  {
    document.querySelector('.results').textContent = "";
    object.resetCount();
};

const deleteLastChar = (object) => {
    let number = document.querySelector('.results').textContent;
    document.querySelector('.results').textContent = number.slice(0, -1);
    object.decrementCount();
};

const deletion = (object) => {
    document.querySelector('#clear').addEventListener('click', function (e) {
        clearDisplay(object);
    });

    document.querySelector('#delete').addEventListener('click', function (e) {
        deleteLastChar(object);
    });
};

const denkoIsPresent = () => { 
    return (document.querySelector('.results').textContent === '(´・ω・`)'); 
};

const adjustText = () => { 
    let display = document.querySelector('.results');
    display.style.textAlign = 'end';
    display.style.fontSize = '6rem';
    display.style.padding = '1rem'; 
};

const updateDisplay = (object, character) => {
    if (object.maxChars()) return;

    let existingChar = document.querySelector('.results').textContent;
    document.querySelector('.results').textContent = existingChar.concat("", character);
    object.incrementCount();
};

const pressButtonEvent = (object) => {
    document.querySelector('.buttons-wrapper').addEventListener('click',
        function (e) {
            if (e.target.tagName == "DIV") return;
            if (denkoIsPresent()) clearDisplay(object);

            adjustText();
            let button = e.target.id;
    
            if (!isNaN(button)) {
                const numberButton = Array.from({length: 10}, (v, i) => i);

                let index = parseInt(button);
                updateDisplay(object, numberButton[index]);
            } 
            else if (isNaN(button)) {
                /* TODO
                const symbolButton = ['decimal', 'parentheses', 'squared', 
                        'reciprocal', 'exponent', 'sq-rt', 'division', 
                        'multiplication', 'subtraction', 'addition', 'compute'];
                let id = (element) => element === button;

                let index = symbolButton.findIndex(id); */
                
            }
        });
};

function main() {
    let displayScreen = new Operations(0);

    deletion(displayScreen);
    pressButtonEvent(displayScreen);
}

main();