let inputNumbers = document.querySelectorAll('.card__input-number');
let cardNumbers = document.querySelectorAll('.card__number');

for(let i = 0; i < inputNumbers.length; i++){
    inputNumbers[i].oninput = () => {
        cardNumbers[i].innerHTML = inputNumbers[i].value;
    };
}

document.querySelector('.card__input-name').oninput = () =>{


    const nameInput = document.querySelector('.card__input-name');
    const nameOutput = document.querySelector('.card__name-input');
    const nameValue = nameInput.value

    if(/^[a-zA-Zа-яА-я\s]+$/.test(nameValue)){
       nameOutput.innerHTML = nameValue
    }else{
     nameInput.innerHTML = '';   
     nameOutput.innerHTML = 'Invalid name';
    }
}

document.querySelector('.card__input-month').oninput = () =>{
    document.querySelector('.card__exp-month').innerHTML = document.querySelector('.card__input-month').value;
}

const expirationSelect = document.querySelector("[data-expiration-year]");
const logo = document.querySelector('[data-logo]');

const currentYear = new Date().getFullYear();
for(let i = currentYear; i < currentYear + 10; i++){
    const option = document.createElement('option');
    option.value = i;
    option.innerHTML = i;
    expirationSelect.append(option);
}

document.querySelector('.card__input-year').oninput = () =>{
    document.querySelector('.card__exp-year').innerHTML = document.querySelector('.card__input-year').value;
}

document.querySelector('.card__input-cvv').onmouseenter = () =>{
    document.querySelector('.card__front').style.transform = 'perspective(1000px) rotateY(-180deg)';
    document.querySelector('.card__back').style.transform = 'perspective(1000px) rotateY(0deg) scaleX(-1)';
}

document.querySelector('.card__input-cvv').onmouseleave = () =>{
    document.querySelector('.card__front').style.transform = 'perspective(1000px) rotateY(0deg)';
    document.querySelector('.card__back').style.transform = 'perspective(1000px) rotateY(180deg) scaleX(-1)';
}

document.querySelector('.card__input-cvv').oninput = () =>{
    document.querySelector('.card__box-cvv').innerHTML = document.querySelector('.card__input-cvv').value;
    let cardInputCvv = document.querySelector('.card__input-cvv').value;
    let cardCvv = document.querySelector('.card__box-cvv');

    if(!(/^[^0-9]+$/.test(cardInputCvv))){
        cardCvv.innerHTML = cardInputCvv;
     }else{
      cardInputCvv.innerHTML = '';   
      cardCvv.innerHTML = '';
     }
}


document.addEventListener('keydown', e => { 
    const input = e.target;
    const key = e.key;
    if(!isConnectedInput(input)) return;

    switch (key){
        case "ArrowLeft": {
            if(input.selectionStart === 0 && input.selectionEnd === 0){
               const prev = input.previousElementSibling;
               if(!prev) break;
               prev.focus();
               prev.selectionStart = prev.value.length - 1;
               prev.selectionEnd = prev.value.length - 1;
               e.preventDefault()
            }
            break
        }  
        case "ArrowRight": {
            if(input.selectionStart === input.value.length && input.selectionEnd === input.value.length){
               const next = input.nextElementSibling;
               if(!next) break;
               next.focus();
               next.selectionStart = 1;
               next.selectionEnd = 1;
               e.preventDefault();
            }
            break
        } 
        case "Delete": {
            if(input.selectionStart === input.value.length && input.selectionEnd === input.value.length){
                const next = input.nextElementSibling;
                next.value = next.value.substring(1, next.value.length);
                next.focus();
                next.selectionStart = 0;
                next.selectionEnd = 0;
                e.preventDefault();
             }
             break 
        } 
        case "Backspace": {
            if(input.selectionStart === 0 && input.selectionEnd === 0){
                const prev = input.previousElementSibling;
                prev.value = prev.value.substring(0, prev.value.length - 1);
                prev.focus();
                prev.selectionStart = prev.value.length;
                prev.selectionEnd = prev.value.length;
                e.preventDefault();
             }
             break
        }
        default: { 
          if (key.match(/\d/)) onInputChange(input, key);
          e.preventDefault();

          updateCardNumbers();        
    }
}
});

function updateCardNumbers(){
    cardNumbers.forEach((card, index) => (card.innerHTML = inputNumbers[index].value.padEnd(4, '#')));
}

function onInputChange(input, newValue){
  const start = input.selectionStart;
  const end = input.selectionEnd;  
  updateInputValue(input, newValue, start, end);
  focusInput(input, newValue.length + start);
  const firstFourDigits = input.closest('[data-connected-inputs]').querySelector('input').value;

  if(firstFourDigits.startsWith('4')){
    logo.src = 'img/visa.png';
  } else if (firstFourDigits.startsWith('5')){
    logo.src = 'img/mastercard.png';
  } else if(firstFourDigits.startsWith('6')){
    logo.src = 'img/unionPay.png';
  }
}

function updateInputValue(input, extraValue, start = 0, end = 0){
    const newValue = `${input.value.substring(0, start)}${extraValue}${input.value.substring(end, input.value.length)}`
    input.value = newValue.substring(0, 4);
    if(newValue > 4){
        const next = input.nextElementSibling;
        if(next == null) return;
        updateInputValue(next, newValue.substring(4));
    }
}

function focusInput(input, dataLength){
    let addedCharacters = dataLength;
    let currentInput = input;
    while (addedCharacters > 4 && currentInput.nextElementSibling != null){
        addedCharacters -= 4;
        currentInput = currentInput.nextElementSibling;
    }
    if(addedCharacters > 4) addedCharacters = 4;

    currentInput.focus()
    currentInput.selectionStart = addedCharacters;
    currentInput.selectionEnd = addedCharacters;
}

function isConnectedInput(input){
    const parent = input.closest('[data-connected-inputs]');
    return input.matches('input') && parent != null;
}

