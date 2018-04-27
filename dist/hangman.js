"use strict";

var ordboka = "SYKKEL \nFISK \nL\xD8K \nMOTORSAG \nBELTE \nBLENDER \nDONAU \nFOSSEFALL \nK\xC5L \nBR\xD8D \n\xD8RKEN \nVELTEPETTER \nRASPEBALLER \nMOZZARELLA \nMILLENIUM \nMATPAKKE \nJAZZ \nHANGMAN \nGULROT \nBANAN \nSLALOM \nL\xD8PER \nMISSISSIPPI \nINDIANER \nZORO \nBIE \nKAMELON \nURTER \nBJ\xD8RN \nVEGGLUS \nSAU \nBIBEL \nKOMLA \nJOLLE \nBUTIKK \nVEGGFLIS \nBMW \nHOGGORM \nSAGFLIS \nLADBARMOTORVOGN \nHOSTE \nMONOKKELVERK \nBIL \nSTOL \nKAVIAR \nK\xC5LROT \nHAGEM\xD8BLER \nVEGG \nGALH\xD8PIGGEN \nBANAN \nVINDM\xD8LLE \nMOTORSAG \nOST \nBARBERH\xD8VEL \nMINNESMERKE \nKULL \nVINKEL \nCURLING \nVISESANG \nP\xC5SKE \nP\xC5SKEHARE \nMIDDAG \nYNGLE \nQUIZ \nRISLAPPER \n\xC5PNE \nP\xC6RE \nEPLEPAI \nJULEPRESANG \nKRITT \nBAMSEMUMS \nHANEKAM \nBUKKERITT \nVILLSVIN \nSN\xD8STORM \nKLIPPFISK \nGR\xD8TRIS \nSYKKELSTATIV \nN\xD8KKELHULL \nFOLKEMUSIKK \nBRUSKASSE \nVUGGESANG \nRASTEPLASS \nFRITEKNIKK \nBURSDAG \nFISKEGRATENG";

var chosenLetters = void 0;

var guessedLetters = [],
    wrongLetters = [],
    allLetters = [];

var ordBok = [];

initializeWords();

var fullforteOrd = [];

var input = document.querySelector("[name='guess']");
var ordbok = document.querySelector("[name='ordbok']");
var submit = document.querySelector("[name='submit']");

var file = document.querySelector("#file");

var nickForm = document.querySelector("[name='nickForm']");
var nickin = document.querySelector("[name='nick']");
var nicknameHeader = document.querySelector("#nickname");
var added = document.querySelector("#added");
var scoreBoard = [];

var nickname = nickin.value;

var right = document.querySelector("#guessed");
var wrong = document.querySelector("#wrong");
var message = document.querySelector("#message");
var scoreUL = document.querySelector("#scores");

var scoreSystem = 0.6;
var score = 0;

var possibleScore = 0;

var topScore = 1000;
var scorePunishment = topScore * 0.1;
var thisScore = 0;

var storage = JSON.parse(localStorage.getItem('storage')) || ordBok;
var scoreBoardStorage = JSON.parse(localStorage.getItem('scoreBoard')) || scoreBoard;

ordBok = storage;

scoreBoard = scoreBoardStorage;

getPossibleScore();
writeScores(scoreBoard);

function isEmpty() {
    return chosenLetters == undefined;
}

var setScore = function setScore() {
    thisScore = Math.round(chosenLetters.length * scoreSystem * 100);
    scorePunishment = Math.floor(chosenLetters.length * scoreSystem * 100 * 0.1);
};

function reset() {
    ordBok = JSON.parse(localStorage.getItem('storage'));
}

var regex = /[a-zA-ZæøåÆØÅ]/gi;

function guessLetter(aLetter) {
    input.value = "";
    if (aLetter.match(regex)) {
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
                for (var i = 0; i < chosenLetters.length; i++) {
                    if (chosenLetters[i] == aLetter) {
                        guessedLetters[i] = aLetter;
                    }
                }
            } else {
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
                right.innerHTML = "" + guessedLetters;
                wrong.innerHTML = "" + wrongLetters;
                allLetters.push(aLetter);
            }

            if (isDone(guessedLetters, chosenLetters)) {
                score += thisScore;
                message.classList.add("hurrah");
                message.innerHTML = "GRATULERER!!! <br/> Gjett igjen! <br/> Score: " + score + " - Av: " + topScore;
                fullforteOrd.push(guessedLetters);
                clearArray();
                addToArray(scoreBoard, score, numComparator);
                writeScores(scoreBoard);
                localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));
            }
        } else {
            missedTheWord();
            clearArray();
        }
    } else {
        message.classList.add("error");
        message.innerHTML = "Skriv ein bokstav fra det norske alfabetet.";
    }
}

function missedTheWord() {
    fullforteOrd.push(chosenLetters);
    message.classList.add("error");
    message.innerHTML = "Du klarte ikkje gjette ordet! Pr\xF8v \xE5 gjett p\xE5 eit nytt ord";
}

nickForm.addEventListener('submit', addNick);

function chooseWord(ordBo) {
    var bok = createDiffeneceArray(ordBo, fullforteOrd);
    if (bok.length == 0) {
        message.classList.add("hurrah");
        message.innerHTML = "Gratulerer!! <br/> Du har fullf\xF8rt ordboka. <br/> Legg til nye ord\n                             eller tast en ny bokstav for \xE5 starte spillet p\xE5 nytt.\n                             ";
        fullforteOrd = [];
        score = 0;
        reset();
    }
    var randNum = Math.floor(Math.random() * bok.length);
    return bok[randNum];
}

function clearArray() {
    allLetters = [];
    chosenLetters = undefined;
    guessedLetters = [];
    wrongLetters = [];
}

function fillGuessedLetters() {
    if (!isEmpty()) chosenLetters.forEach(function (elem) {
        return guessedLetters.push("_");
    });
}

function addWordsToOrdBok(e) {
    added.classList.remove("error");
    e.preventDefault();
    ordbok.value = ordbok.value.toUpperCase();
    if (wordExists(ordbok.value)) {
        added.classList.add("error");
        added.innerHTML = ordbok.value + " finnes fra f\xF8r";
        ordbok.value = "";
        return;
    }
    var letters = ordbok.value.split("");
    ordBok.push(letters);
    added.innerHTML = "Ordet ble lagt til";
    localStorage.setItem('storage', JSON.stringify(ordBok.concat(fullforteOrd)));
    possibleScore = 0;
    getPossibleScore();
    writeScores(scoreBoard);
    ordbok.value = "";
}

function initializeWords() {
    var words = ordboka.split(" \n");
    words.forEach(function (word) {
        return ordBok.push(word.split(""));
    });
    localStorage.setItem('storage', JSON.stringify(ordBok));
}

function addNick(e) {
    e.preventDefault();
    nickname = nickin.value;
    nickin.value = "";
    nicknameHeader.innerHTML = nickname == "" ? "Brukernavn:" : "Velkommen <span style='color: #f1452d;'> " + nickname + "</span>";
    input.focus();
    fullforteOrd = [];
    score = 0;
}

function wordExists(word) {
    return ordBok.some(function (elem) {
        return elem.join(elem) === word;
    });
}

function isDone(array1, array2) {
    return array1.length == array2.length && array2.every(function (element, index) {
        return element === array1[index];
    });
}

function writeScores(scoreBoard) {
    scoreUL.innerHTML = "";
    // let filtered = scoreBoard.map(el => console.log(el.nick))
    scoreBoard.forEach(function (score) {
        return scoreUL.innerHTML += "<li class=\"scores\">" + (score.nick == "" ? "Ukjent:" : score.nick + ":") + " " + score.num + " - " + Math.round(score.num / possibleScore * 100) + "%</li>";
    });
}

function addToArray(array, number, comparator) {
    var low = 0,
        high = array.length;
    var mid = -1,
        c = 0;
    while (low < high) {
        mid = parseInt((low + high) / 2);
        c = comparator(array[mid].num, number);
        if (c > 0) {
            low = mid + 1;
        } else if (c < 0) {
            high = mid;
        } else {
            low = mid;
            break;
        }
    }
    var score = { nick: nickname, num: number };
    if (array.length == 0) {
        array.splice(low, 0, score);
    } else {
        var found = false;
        array.forEach(function (scor, i) {
            if (scor.nick.toLowerCase() === nickname.toLowerCase()) {
                found = true;
                if (scor.num <= number) {
                    array.splice(i, 1);
                    return array.splice(low, 0, score);
                }
            }
        });
        if (!found) {
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

function createDiffeneceArray(array1, array2) {
    var diff = array1;
    if (!(array1.length == 0)) {
        for (var i = 0; i < array2.length; i++) {
            for (var j = 0; j < array1.length; j++) {
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
    scoreBoard.find(function (e, i) {
        return e.nick == value ? scoreBoard.splice(i, 1) : "";
    });
    writeScores(scoreBoard);
    localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));
}

function getPossibleScore() {
    ordBok.forEach(function (e) {
        return possibleScore += Math.round(e.length * scoreSystem * 100);
    });
}
//# sourceMappingURL=hangman.js.map
