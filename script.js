let gameName = "Guess The Word";

document.title = gameName;
document.querySelector('h1').innerHTML = gameName;

let footer = document.querySelector('footer');
footer.innerHTML = `<span>' ${gameName} '</span> Game Was Created By Mr.Nomad.`;

let numberOfTries = 6;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;



//manage word

let wordToguess = "";
const words = ["Create", "Update", "Branch", "Delete", "Mainly", "School", "master", "Pirate"];
wordToguess = words[Math.floor(Math.random() * words.length)].toLowerCase();
let message = document.querySelector(".message");

//manage hint
document.querySelector(".hint span").innerHTML = numberOfHints;
const getHintBtn = document.querySelector(".hint");
getHintBtn.addEventListener("click", getHit)

//play again
const playAgainBtn = document.querySelector(".play-again");


function genrateInputs() {
    let inputContainer = document.querySelector('.inputs');

    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement('div');

        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`

        if (i !== 1) tryDiv.classList.add('disabled-input');

        for (let j = 1; j <= numberOfLetters; j++) {
            let input = document.createElement('input');
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute('maxlength', '1');
            input.setAttribute("autocomplete", "off");
            tryDiv.appendChild(input);
        }

        inputContainer.appendChild(tryDiv);
    }
    inputContainer.children[0].children[1].focus()

    let disabledInputs = document.querySelectorAll('.disabled-input input');
    disabledInputs.forEach( (e)=> {e.disabled = true})

    const inputs = document.querySelectorAll('input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', function() {
            if (this.value !== "") {
                this.value = this.value.toUpperCase()
                let nextInput = inputs[index + 1];
                if (nextInput) nextInput.focus()
            }

        })
        input.addEventListener("keydown", (event) => {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            
            if (event.key == "ArrowRight"){
                let nextIndex = currentIndex + 1;
                if (nextIndex < inputs.length) inputs[nextIndex].focus()
            }else if (event.key == "ArrowLeft") {
                let previousIndex = currentIndex - 1;
                if (currentIndex > 0) inputs[previousIndex].focus()
                
            }else if (event.key == "Backspace") {
                if (event.target.value == "" && currentIndex > 0) {
                    inputs[currentIndex - 1].focus()
                }
            }
            
        })
    })
}

const guessBtn = document.querySelector(".check");

guessBtn.addEventListener("click", handleGuess);


function handleGuess() {
    let success = true;
    
    for (let i = 1; i <= numberOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`)
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToguess[i - 1];
        
            if (letter === actualLetter && letter != "") {
                inputField.classList.add("in-place");
            }else if (wordToguess.includes(letter) && letter != "") {
                inputField.classList.add("not-in-place")
                success = false;
            }else {
                inputField.classList.add("no")
                success = false;
            }
        
        
    }
    if (success) {
        message.innerHTML = `You win, The word is <span>${wordToguess}</span>`;

        let alltries = document.querySelectorAll('.inputs > div');

        alltries.forEach((e)=> {e.classList.add('disabled-input')});
        guessBtn.disabled = true;
        getHintBtn.disabled = true;

        playAgainBtn.style.display = "block";

    }else {
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-input");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input)=> {input.disabled = true;})

        currentTry++;
        
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input)=> {input.disabled = false});
        
        let el = document.querySelector(`.try-${currentTry}`);
        if (el) {
            el.classList.remove("disabled-input");
            el.children[1].focus()
        }else {
            guessBtn.disabled = true;
            getHintBtn.disabled = true;
            message.innerHTML = `You lose, The word was <span>${wordToguess}</span>`
            playAgainBtn.style.display = "block";
        }

    }
}


function getHit() {
    if (numberOfHints > 0) {
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = numberOfHints;
    }
    if (numberOfHints === 0) {
        getHintBtn.disabled = true;
    }

    const enabledInputs = document.querySelectorAll("input:not([disabled])");
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input)=> input.value === "")

    if (emptyEnabledInputs.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        let randomInput = emptyEnabledInputs[randomIndex];
        
        let indexFill = Array.from(enabledInputs).indexOf(randomInput);
        
        if (indexFill !== -1) {
            randomInput.value = wordToguess[indexFill].toUpperCase()
        }
    }
}


playAgainBtn.addEventListener("click", playAgain);

function playAgain() {
    playAgainBtn.style.display = "none";
    message.innerHTML = ""
    let inputsDiv = document.querySelector(".inputs");
    inputsDiv.innerHTML = "";
    wordToguess = words[Math.floor(Math.random() * words.length)].toLowerCase();
    
    currentTry = 1;
    numberOfHints = 2;
    document.querySelector(".hint span").innerHTML = numberOfHints;

    guessBtn.disabled = false;
    getHintBtn.disabled = false;
    genrateInputs()
}

window.onload = function () {
    genrateInputs()
}



window.addEventListener("keydown", (e)=> {
    if (e.key == "Enter") {
        if (guessBtn.disabled) {
            playAgain()
        }else {
            handleGuess()
        }
       
    }
})