const ordboka = `SYKKEL 
FISK 
LØK 
MOTORSAG 
BELTE 
BLENDER 
DONAU 
FOSSEFALL 
KÅL 
BRØD 
ØRKEN 
VELTEPETTER 
RASPEBALLER 
MOZZARELLA 
MILLENIUM 
MATPAKKE 
JAZZ 
HANGMAN 
GULROT 
BANAN 
SLALOM 
LØPER 
MISSISSIPPI 
INDIANER 
ZORO 
BIE 
KAMELON 
URTER 
BJØRN 
VEGGLUS 
SAU 
BIBEL 
KOMLA 
JOLLE 
BUTIKK 
VEGGFLIS 
BMW 
HOGGORM 
SAGFLIS 
LADBARMOTORVOGN 
HOSTE 
MONOKKELVERK 
BIL 
STOL 
KAVIAR 
KÅLROT 
HAGEMØBLER 
VEGG 
GALHØPIGGEN 
BANAN 
VINDMØLLE 
MOTORSAG 
OST 
BARBERHØVEL 
MINNESMERKE 
KULL 
VINKEL 
CURLING 
VISESANG 
PÅSKE 
PÅSKEHARE 
MIDDAG 
YNGLE 
QUIZ 
RISLAPPER 
ÅPNE 
PÆRE 
EPLEPAI 
JULEPRESANG 
KRITT 
BAMSEMUMS 
HANEKAM 
BUKKERITT 
VILLSVIN 
SNØSTORM 
KLIPPFISK 
GRØTRIS 
SYKKELSTATIV 
NØKKELHULL 
FOLKEMUSIKK 
BRUSKASSE 
VUGGESANG 
RASTEPLASS 
FRITEKNIKK 
BURSDAG`;

let chosenLetters;

let guessedLetters = [], wrongLetters = [], allLetters = [];

let ordBok = [];

initializeWords();

let fullforteOrd = [];

const input = document.querySelector("[name=guess]");
const ordbok = document.querySelector("[name=ordbok]");
const submit = document.querySelector("[name=submit]");

const file = document.querySelector("#file");

const nickForm = document.querySelector("[name=nickForm]");
const nickin = document.querySelector("[name=nick");
const nicknameHeader = document.querySelector("#nickname");
const added = document.querySelector("#added");
let scoreBoard = [];

let nickname = nickin.value;

const right = document.querySelector("#guessed");
const wrong = document.querySelector("#wrong");
const message = document.querySelector("#message");
const scoreUL = document.querySelector("#scores");

let scoreSystem = 0.6;
let score = 0;

let possibleScore = 0;

let topScore = 1000;
let scorePunishment = topScore*0.1;
let thisScore = 0;


const storage = JSON.parse(localStorage.getItem('storage')) || ordBok;
const scoreBoardStorage = JSON.parse(localStorage.getItem('scoreBoard')) || scoreBoard;

ordBok = storage;

scoreBoard = scoreBoardStorage;

getPossibleScore();
writeScores(scoreBoard);

function isEmpty() {
    return chosenLetters == undefined;
}

const setScore = () => {
    thisScore = Math.round((chosenLetters.length * scoreSystem)*100);
    scorePunishment = Math.floor(((chosenLetters.length * scoreSystem)*100)*0.1);
};

function reset(){
    ordBok = JSON.parse(localStorage.getItem('storage'));
}

const regex = /[a-zA-ZæøåÆØÅ]/gi;

function guessLetter(aLetter){
    input.value = "";
    if(aLetter.match(regex)) {
        message.classList = "";
        added.innerHTML = "";
        added.classList.remove("error");
        if (isEmpty()) {
            message.classList.remove("hurrah");
            message.innerHTML = "";
            chosenLetters = chooseWord(ordBok);
            if (!(ordBok == undefined)) {
                fillGuessedLetters();
                setScore();
            } else {
                reset();
                return;
            }
        }

        aLetter = aLetter.toUpperCase();

        if (thisScore > 0) {
            if (chosenLetters.includes(aLetter)) {
                for (let i = 0; i < chosenLetters.length; i++) {
                    if (chosenLetters[i] == aLetter) {
                        guessedLetters[i] = aLetter;
                    }
                }
            }
            else {
                if (!allLetters.includes(aLetter)) {
                    wrongLetters.push(aLetter);
                    thisScore -= scorePunishment;
                    if (thisScore <= 0) {
                        missedTheWord();
                        clearArray();
                        return;
                    }
                }
            }
            if (allLetters.includes(aLetter)) {
                message.classList.add("error");
                message.innerHTML = "Den har du allerede prøvd. Prøv igjen";
            } else {
                message.innerHTML = "";
                right.innerHTML = `${guessedLetters}`;
                wrong.innerHTML = `${wrongLetters}`;
                allLetters.push(aLetter);
            }

            if (isDone(guessedLetters, chosenLetters)) {
                score += thisScore;
                message.classList.add("hurrah");
                message.innerHTML = `GRATULERER!!! <br/> Gjett igjen! <br/> Score: ${score} - Av: ${possibleScore}`;
                fullforteOrd.push(guessedLetters);
                clearArray();
                addToArray(scoreBoard, score, numComparator);
                writeScores(scoreBoard);
                localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));
            }
        }
        else {
            missedTheWord();
            clearArray();
        }
    }
    else {
        message.classList.add("error");
        message.innerHTML = "Skriv ein bokstav fra det norske alfabetet.";
    }
}

function missedTheWord(){
    fullforteOrd.push(chosenLetters);
    message.classList.add("error");
    message.innerHTML = `Du klarte ikkje gjette ordet! Prøv å gjett på eit nytt ord`;
}

nickForm.addEventListener('submit', addNick);


function chooseWord(ordBo) {
    let bok = createDiffeneceArray(ordBo, fullforteOrd);
    if(bok.length == 0){
        message.classList.add("hurrah");
        message.innerHTML = `Gratulerer!! <br/> Du har fullført ordboka. <br/> Legg til nye ord
                             eller tast en ny bokstav for å starte spillet på nytt.
                             `;
        fullforteOrd = [];
        score = 0;
        reset();
    }
    const randNum = Math.floor(Math.random() * bok.length);
    return bok[randNum];
}


function clearArray() {
    allLetters = [];
    chosenLetters = undefined;
    guessedLetters = [];
    wrongLetters = [];
}

function fillGuessedLetters() {
    if(!isEmpty()) chosenLetters.forEach(elem => guessedLetters.push("_"));
}

function addWordsToOrdBok(e){
    added.classList.remove("error");
    e.preventDefault();
    ordbok.value = ordbok.value.toUpperCase();
    if(wordExists(ordbok.value)){
        added.classList.add("error");
        added.innerHTML = `${ordbok.value} finnes fra før`;
        ordbok.value = "";
        return;
    }
    const letters = ordbok.value.split("");
    ordBok.push(letters);
    added.innerHTML = `Ordet ble lagt til`;
    localStorage.setItem('storage', JSON.stringify(ordBok.concat(fullforteOrd)));
    possibleScore = 0;
    getPossibleScore();
    writeScores(scoreBoard);
    ordbok.value = "";
}

function initializeWords(){
    let words = ordboka.split(" \n");
    words.forEach(word => ordBok.push(word.split("")));
}

function addNick(e) {
    e.preventDefault();
    nickname = nickin.value;
    nickin.value = "";
    nicknameHeader.innerHTML = (nickname == "") ? "Brukernavn:" : `Velkommen <span style='color: #f1452d;'> ${nickname}</span>`;
    input.focus();
    fullforteOrd = [];
    score = 0;
}

function wordExists(word){
    return ordBok.some(elem => elem.join(elem) === word);
}

function isDone(array1, array2){
   return array1.length == array2.length && array2.every((element, index) => element === array1[index]);
}

function writeScores(scoreBoard){
    scoreUL.innerHTML = "";
    // let filtered = scoreBoard.map(el => console.log(el.nick))
    scoreBoard.forEach(score => scoreUL.innerHTML += `<li class="scores">${(score.nick == "") ? "Ukjent:" : score.nick + ":"} ${score.num} - ${Math.round((score.num/possibleScore)*100)}%</li>`);
}

function addToArray(array, number, comparator) {
    let low = 0, high = array.length;
    let mid = -1, c = 0;
    while (low < high){
        mid = parseInt((low + high) / 2);
        c = comparator(array[mid].num, number);
        if(c > 0){
            low = mid + 1;
        }
        else if(c < 0) {
            high = mid;
        }
        else {
            low = mid;
            break;
        }
    }
    let score = {nick: nickname, num: number};
    if(array.length == 0) {
        array.splice(low, 0, score);
    }else {
        let found = false;
        array.forEach((scor, i) => {
            if (scor.nick.toLowerCase() === nickname.toLowerCase()) {
                found = true;
                if (scor.num <= number) {
                    array.splice(i, 1);
                    return array.splice(low, 0, score);
                }

            }
        });
        if(!found) {
            array.splice(low, 0, score);
        }

    }

}

function numComparator(val1, val2) {
    return val1 - val2;
}

submit.addEventListener('click', addWordsToOrdBok);

function resetScoreboard() {
    scoreBoard.splice(0, scoreBoard.length);
    writeScores(scoreBoard);
    localStorage.removeItem('scoreBoard');

}

function createDiffeneceArray(array1, array2){
    let diff = array1;
    if(!(array1.length == 0)) {
        for (let i = 0; i < array2.length; i++) {
            for (let j = 0; j < array1.length; j++) {
                if (array2[i].join(array2[i]) == array1[j].join(array1[j])) {
                    diff.splice(j, 1);
                    break;
                }
            }
        }
    }
    return diff;
}

function removeItemFromScoreBoard(value) {
    scoreBoard.find((e,i) => (e.nick == value) ? scoreBoard.splice(i,1) : "");
    writeScores(scoreBoard);
    localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));
}

function getPossibleScore() {
    ordBok.forEach(e => possibleScore += Math.round((e.length*scoreSystem)*100))
}