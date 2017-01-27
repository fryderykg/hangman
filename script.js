/**
 * Created by frycek on 12.01.17.
 */

// HANGMAN OBJECT
var hangman = {
    alphabet : {
        pl: "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż",
        en: "abcdefghijklmnopqrstuvwxyz"
    },
    word: "",
    words: [],
    words_obj: {},
    categories: "",
    category: "",
    word_hidden: "",
    language: "",
    mistake_number: 0,
    remaining_chances: 0,
    score: 0,
    sound_yes: new Audio("sounds/yes.wav"),
    sound_no: new Audio("sounds/no.mp3"),

    // MISTAKE NUMBER METHOD
     /** Add 1 to mistake number */
    incrementMistakeNumber: function() {
        this.mistake_number++;
        this.remaining_chances --;
    },

    // REMAINING CHANCES METHOD
    displayRemainingChances: function() {
        document.getElementById("remainingChances").innerHTML = this.remaining_chances.toString();
    },

    // POINTS METHODS
    displayScore: function() {
        document.getElementById("score").innerHTML = this.score.toString();
    },

    incrementScore: function() {
        this.score += this.remaining_chances;
    },

    resetScore: function() {
        this.score = 0;
    },

    // WORD METHOD
    setCategory: function() {
        /** Category list */
        this.categories = Object.getOwnPropertyNames(this.words_obj);
        /** Pick one category from categories */
        this.category = this.categories[Math.floor(Math.random() * this.categories.length)];
    },

    displayCategory: function() {
        document.getElementById("category").innerHTML = '<p>' + this.category.toUpperCase() + '</p>';
    },

    setWord: function() {
        /** list of all words */
        this.words = this.words_obj[this.category];
        /** Pick ons word from words*/
        this.word = this.words[Math.floor(Math.random() * this.words.length)].toLowerCase();
        // this.word = this.words[Math.floor(Math.random() * this.words.length)].toLowerCase();
    },

    getWordLength: function() {
        return this.word.length;
    },

    /** Change letter in word to underscores */
    hideWord: function() {
        for(var i = 0; i < this.word.length; i++) {
            if (this.word.charAt(i) !== " ") {
                this.word_hidden += "_";
            } else {
                this.word_hidden += " ";
            }
        }
    },

    /** Display hidden word on screen*/
    displayHiddenWord: function() {
        document.getElementById("secretWord").innerHTML = '<p>' + this.word_hidden + '</p>';
    },

    /** Return letter at position number */
    getWordCharAt: function(number) {
        return this.word.charAt(number);
    },

    /** Make visible guessed letter in word_hidden  */
    showWordLetter: function(pos, letter_num) {
        var first = this.word_hidden.slice(0, pos);
        var letter = this.alphabet.charAt(letter_num);
        var last = this.word_hidden.slice(pos + 1);
        return first + letter + last;
    },

    /** Return word */
    getWord: function() {
        return this.word.toLowerCase();
    },

    /** Return word_hidden */
    getWordHidden: function() {
        return this.word_hidden;
    },

    /** Set new word_hidden */
    setWordHidden: function(newWordHidden) {
        this.word_hidden = newWordHidden;
    },

    // PICTURE METHOD
    /** Display hangman picture on the screen according to mistake number*/
    displayNextPicture: function() {
        var picture_id = "pic" + this.mistake_number;
        if (this.mistake_number >= 9) {
            this.resetScore();
            // Remove hidden class from picture
            document.getElementById(picture_id).className = "";
            // Hide alphabet on the end of the game
            document.getElementById("alphabet").className += "hidden";
            // Remove hidden class from message_lost
            document.getElementById("message_lost").className = "";
            // When player lost display correct word
            this.setWordHidden(this.getWord());
            // this.displayHiddenWord()
        } else {
            document.getElementById(picture_id).className = "";
            if (this.mistake_number === 4) {
                document.getElementById("pic3").className = "opacity-zero";
            }
        }
    },

    hidePictures: function() {
      for (var i = 1; i < 10; i++){
          document.getElementById("pic" + i).className = "opacity-zero";
      }
    },

    // ALPHABET METHOD
    /** Display alphabet buttons on the screen*/
    displayAlphabet: function(lang) {
        var alphabetContent = "";

        for (var i = 0; i < this.alphabet[lang].length; i++) {
            var idName = "letter" + i;
            alphabetContent += '<div class="letter" id="' + idName + '">' + this.alphabet[lang].charAt(i).toUpperCase() + '</div>';
        }
        document.getElementById("alphabet").innerHTML = alphabetContent;
    },

    /** Return letter in alphabet at position "number" */
    getAlphabetLetter: function(number) {
        return this.alphabet.charAt(number);
    },

    // SOUNDS METHOD
    /** Play sound */
    playSound: function(sound) {
        if (sound === "yes"){
            this.sound_yes.play();
        } else if (sound === "no") {
            this.sound_no.play();
        } else {
            window.console.log("Wrong audio file");
        }
    },

    reset: function() {
        this.hidePictures();
        this.word_hidden = "";
        this.mistake_number = 0;
        this.remaining_chances = 9;
        document.getElementById("alphabet").className = "";
        document.getElementById("message_lost").className = "hidden";
        document.getElementById("message_win").className = "hidden";
    }
};

// EVENT LISTENERS
function addListeners() {
    for (var i = 0; i < hangman.alphabet.length; i++){
        var object = document.getElementById(("letter" + i));
        object.addEventListener("click", check);
    }
}
// ADD EventListeners at script start
document.getElementById("flag_pl").addEventListener("click", languageSelect);
document.getElementById("flag_gb").addEventListener("click", languageSelect);
document.getElementById("button_lost").addEventListener("click", start);
document.getElementById("button_win").addEventListener("click", start);

// CHECK IF LETTER IS IN THE WORD
function check() {
    var letter_number = parseInt(this.id.slice(6));
    var letterInMessage = false;

    this.removeEventListener("click", check);
    // Check if clicked letter is in word
    for(var i = 0; i < hangman.getWordLength(); i++) {
        //  Compare word letter at position "i" to alphabet letter at position "letter_number"
        if (hangman.getWordCharAt(i) === hangman.getAlphabetLetter(letter_number)) {
            letterInMessage = true;
            // Put revealed letter into word_hidden
            hangman.setWordHidden(hangman.showWordLetter(i, letter_number));
        }
    }

    if (letterInMessage) {
        hangman.playSound("yes");
        //Change color to green
        document.getElementById("letter" + letter_number).className += " correct";

        // Check if player find the answer
        if (hangman.getWord() === hangman.getWordHidden()) {
            hangman.incrementScore();
            hangman.displayScore();
            /** hide alphabet*/
            document.getElementById("alphabet").className += "hidden";
            /** show message win */
            document.getElementById("message_win").className = "";
        }

    } else {
        hangman.playSound("no");
        // Change color to red
        document.getElementById("letter" + letter_number).className += " wrong";
        // Add one to mistake number
        hangman.incrementMistakeNumber();
        // Refresh picture
        hangman.displayNextPicture();
    }

    // Refresh word
    hangman.displayHiddenWord();
    hangman.displayRemainingChances();


}

// LOAD WORDS LIST FROM JSON
function loadJSON(file, callback) {
    var raw = new XMLHttpRequest();
    raw.overrideMimeType('application/json');
    raw.open('GET', file, true);
    raw.onreadystatechange = function() {
        if (raw.readyState === 4 && raw.status === 200) {
            callback(raw.responseText);
        }
    };
    raw.send(null);
}

// LANGUAGE SELECTION
function changeClassesName(elements, addOrRemove, newClassName) {
    var i;
    if (addOrRemove === "add") {
        for (i = 0; i < elements.length; i++) {
            elements[i].classList.add(newClassName);
        }
    } else if (addOrRemove === "remove") {
        for (i = 0; i < elements.length; i++) {
            elements[i].classList.remove(newClassName);
        }
    }
}

function languageSelect() {
    document.getElementById("header").className = "hide";
    document.getElementById("board").className = "";
    var elements_en = document.getElementsByClassName("en_gb");
    var elements_pl = document.getElementsByClassName("pl_pl");

    if (this.id === "flag_pl") {
        hangman.language = "pl";
        // HIDE ELEMENTS IN ENGLISH
        changeClassesName(elements_en, "add", "hidden");
        changeClassesName(elements_pl, "remove", "hidden");
        document.getElementById("slash").className = "hidden";
        // LOAD POLISH WORDS
        loadJSON("./words.json", function(text){
            hangman.words_obj = JSON.parse(text).words.pl;
            // START THE GAME
            start("pl");
        });

    } else if (this.id === "flag_gb") {
        hangman.language = "en";
        // HIDE ELEMENTS IN POLISH
        changeClassesName(elements_en, "remove", "hidden");
        changeClassesName(elements_pl, "add", "hidden");
        document.getElementById("slash").className = "hidden";
        // LOAD ENGLISH WORDS
        loadJSON("./words.json", function(text){
            hangman.words_obj = JSON.parse(text).words.en;
            // START THE GAME
            start("en");
        });
    }
    // Reset score when change language
    hangman.score = 0;
}

// MAIN FUNCTION
function start(lang) {
    hangman.reset();
    hangman.setCategory();
    hangman.setWord();
    hangman.hideWord();
    // CREATE BOARD
    hangman.displayAlphabet(lang);
    hangman.displayHiddenWord();
    hangman.displayCategory();
    hangman.displayRemainingChances();
    hangman.displayScore();
    // EVENT LISTENERS
    addListeners();
}