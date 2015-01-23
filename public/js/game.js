function Game() {
  this.QUOTES = [
    "Human beings, who are almost unique in having the ability to learn from the experience of others, are also remarkable for their apparent disinclination to do so.",
    "The story so far: In the beginning the Universe was created. This has made a lot of people very angry and been widely regarded as a bad move.",
    "For instance, on the planet Earth, man had always assumed that he was more intelligent than dolphins because he had achieved so much-the wheel, New York, wars and so on-whilst all the dolphins had ever done was muck about in the water having a good time. But conversely, the dolphins had always believed that they were far more intelligent than man-for precisely the same reasons.",
    "There is a theory which states that if ever anyone discovers exactly what the Universe is for and why it is here, it will instantly disappear and be replaced by something even more bizarre and inexplicable. There is another theory which states that this has already happened.",
    "This planet has - or rather had - a problem, which was this: most of the people living on it were unhappy for pretty much of the time. Many solutions were suggested for this problem, but most of these were largely concerned with the movement of small green pieces of paper, which was odd because on the whole it wasn't the small green pieces of paper that were unhappy."
  ];
  
  this.COUNTDOWN_SECONDS = 3;
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
  
  this.raceVisuals = new RaceVisuals();
  
  // Initiates race.
  this.init = function() {
    if(this.countdownStarted == false) {
      this.loadText();
      this.startInitListeners();
      this.startCountdown();
      this.raceVisuals.init();
    }
  };

  this.getRandomPlainTextQuote = function() {
    return this.QUOTES[Math.floor(Math.random() * this.QUOTES.length)];
  }
  
  // Loads text into box.
  this.loadText = function() {
    this.plainText = this.getRandomPlainTextQuote();
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
    $(this.wordInputBox).focus();
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
game.init();