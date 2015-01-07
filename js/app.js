function Game() {
  this.COUNTDOWN_SECONDS = 5;
  this.WORD_LENGTH = 5;
  this.countdownRemaining = this.COUNTDOWN_SECONDS;
  
  this.countdownStarted = false;
  this.raceStarted = false;
  this.raceEnded = false;
  
  this.countdownTimer = null;
  this.runningTimer = null;
  
  this.startTime = null;
  this.endTime = null;
  
  this.plainText = '';
  this.splitText = '';
  
  this.currentWord = null;
  this.currentWordIndex = 0;
  this.currentChar = null;
  this.currentCharIndex = 0;
  this.onSpace = false;
  this.correctStrokes = 0;
  
  this.wrongInputStatus = false;
  this.wrongCharacterIndex = null;
  this.wrongCharacter = null;
  this.awayFromWrongCharacter = 0;
  
  this.wordInputBox = $("#current-word-input");
  
  // Initiates race.
  this.init = function() {
    if(this.countdownStarted == false) {
      this.loadText();
      this.startInitListeners();
      $(".race-container").slideDown();
      $(".init-button").slideUp();
      this.startCountdown();
    }
  };

  // Loads text into box.
  this.loadText = function() {
    this.plainText = "Two roads diverged in a yellow wood, And sorry I could not travel both, And be one traveler, long I stood, And looked down one as far as I could, To where it bent in the undergrowth.";
    this.splitText = this.plainText.split(' ');
    var htmlText = '';
    
    for(i=0;i<this.splitText.length;i++) {
      htmlText += '<span class="race-word" id="word_' + i + '">' + this.splitText[i] + '</span> ';
    }
    
    // Gets first word and first character.
    this.currentWord = this.splitText[0];
    this.currentChar = this.currentWord.charAt(0);
    $(".race-text").html(htmlText);
  };
  
  this.startInitListeners = function() {
    instance = this;
    
    // Keypress Listener -- handles usual alphanumeric characters
    $(this.wordInputBox).keypress(function(event) {
      if(event.keycode != 8) { // Keycode for backspace.
        instance.handleCharacterEntered(event);
      }
    });
    
    // Keyup listener, handles backspace and stuff
    $(this.wordInputBox).keydown(function(event) {
      if(event.keyCode == 8) { // Keycode for backspace.
        instance.handleCharacterEntered(event);
      }
    });
  };
  
  this.startCountdown = function() {
    this.countdownStarted = true;
    $(".countdown-seconds").html(this.COUNTDOWN_SECONDS);
    $(".countdown-text").show();
    thisInstance = this;
    this.countdownTimer = setInterval(function() { thisInstance.countdownCallback(thisInstance) }, 1000);
    this.wordInputBox.focus();
  };
  
  this.countdownCallback = function(gameInstance) {
    if(gameInstance.countdownRemaining == 1) {
      clearInterval(gameInstance.countdownTimer);
      gameInstance.startRace();
    } else {
      gameInstance.countdownRemaining--;
      $(".countdown-seconds").html(gameInstance.countdownRemaining);
    };
  };
  
  this.startRace = function() {
    this.raceStarted = true;
    $(".countdown-text").html("Go!");
    this.startTimer();
  };
  
  this.endRace = function() {
    this.stopTimer();
    this.updateWordClasses(this.currentWordIndex, "correct-word");
    this.raceEnded = true;
  };
  
  this.startTimer = function() {
    this.startTime = Date.now();
    instance = this;
    setInterval(function() {
      instance.displayCurrentStats();
    }, 2000);
  };
  
  this.stopTimer = function() {
    this.endTime = Date.now();
  };
  
  this.handleCharacterEntered = function(event) {
    if(this.raceStarted && !this.raceEnded) {
      if(event.keyCode == 16) {
        event.preventDefault();
        return;
      }

      if(this.wrongInputStatus == false) {
        // All characters before this are verified correct..
        if(event.keyCode == 8) {
          this.backspace();
        } else if(this.checkCharacter(event)) {
          this.advanceIndices(true);
        } else {
          this.wrongInputStatus = true;
          this.wrongCharacterIndex = this.currentCharIndex;
          this.awayFromWrongCharacter = 1;
          this.updateWordClasses(this.currentWordIndex, "wrong-word");
        }
      } else {
        // Some character before this is wrong and uncorrected.
        if(event.keyCode == 8) {
          if(this.awayFromWrongCharacter > 0) {
            this.awayFromWrongCharacter--; 
          } else {
            console.log("preventing default");
            
            event.stopPropagation();
            event.preventDefault();
          }
        } else {
          var charIsCorrect = this.checkCharacter(event);
          if(this.awayFromWrongCharacter == 0 && charIsCorrect) {
            this.wrongInputStatus = false;
            this.updateWordClasses(this.currentWordIndex, "current-word");
            this.advanceIndices(true);
          } else {
            this.awayFromWrongCharacter++;
          }
        }
      }
    } else {
      event.preventDefault();
    }
  };
  
  this.checkCharacter = function(event) {
    var character = String.fromCharCode(event.keyCode);
    if(event.shiftKey == 1) {
      character = character.toUpperCase();
    }
    return (character == this.currentChar);
  };
  
  this.advanceIndices = function(correctStatus) {
    // If on last character or character after, move into first condition.
    // Will either move into space or next word, depending on if on space.
    this.correctStrokes++;
    if(this.currentCharIndex >= (this.currentWord.length - 1)) {
      if(this.onSpace === true) {
        // Advance to next word.
        var previousWordClass = (!this.wrongInputStatus) ? "correct-word" : "wrong-word";
        var currentWordClass = (!this.wrongInputStatus) ? "current-word" : "wrong-word";
        this.updateWordClasses(this.currentWordIndex, previousWordClass);
        this.currentWordIndex++;
        this.updateWordClasses(this.currentWordIndex, currentWordClass);
        this.currentCharIndex = 0;
        this.currentWord = this.splitText[this.currentWordIndex];
        this.currentChar = this.currentWord[0];
        if(this.wrongInputStatus === false) {
          this.wordInputBox.val("");
        }
        this.onSpace = false;
      } else {
        if(!this.doesNextWordExist()) {
          // If next word doesn't exist.
          this.endRace();
          return; //stop
        }
        
        // Advance to space character.
        this.currentCharIndex++;
        this.onSpace = true;
        this.currentChar = " ";
      }
    } else {
      // Otherwise, advance to next character in word.
      this.currentCharIndex++; 
      this.currentChar = this.currentWord[this.currentCharIndex];
    }
  };
  
  this.backspace = function() {
    if(this.currentCharIndex == 0) {
      if(this.currentWordIndex == 0 || this.wrongInputStatus === false) {
        return;
      }

      // Move back to space after previous word.
      this.onSpace = true;
      this.currentWordIndex--;
      this.currentWord = this.splitText[this.currentWordIndex];
      this.currentCharIndex = this.currentWord.length;
      this.currentChar = this.currentWord.charAt(this.currentCharIndex);
    } else {
      // Move back a character in word.
      this.onSpace = false;
      this.currentCharIndex--;
      this.currentChar = this.currentWord.charAt(this.currentCharIndex);
    }
  };
  
  this.updateWordClasses = function(wordIndex, newClass) {
    var wordDom = $("#word_" + wordIndex);
    wordDom.removeClass().addClass("race-word");
    wordDom.addClass(newClass);
  };
  
  this.doesNextWordExist = function() {
    return this.currentWordIndex < (this.splitText.length - 1);
  };
  
  this.calculateWPM = function() {
    var startTimeInSeconds = Math.floor(this.startTime / 1000);
    var statusTime = (this.endTime > 0) ? this.endTime : Date.now();
    var statusTimeInSeconds = Math.floor(statusTime / 1000);
    var difference = statusTimeInSeconds - startTimeInSeconds;
    if(difference < 1) return 0;
    var correctWords = (this.correctStrokes / this.WORD_LENGTH); // word = characters / word length
    var wordsPerSecond = correctWords / difference; // wps = words / second
    var wordsPerMinute = wordsPerSecond * 60;
    return Math.round(wordsPerMinute);
  };
  
  this.calculatePercentage = function() {
    return Math.floor((this.correctStrokes / this.plainText.length) * 100);
  };
  
  this.displayCurrentStats = function() {
    var currentWPM = this.calculateWPM();
    $(".current-speed").html(currentWPM.toString());
    var currentPercentage = this.calculatePercentage();
    $(".percent-complete-value").html(currentPercentage);
  };
}

var game = new Game();