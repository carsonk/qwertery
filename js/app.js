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
  
  this.wrongInputStatus = false;
  
  this.wordInputBox = $("#current-word-input");
  
  // Initiates race.
  this.init = function() {
    if(this.countdownStarted == false) {
      this.loadText();
      this.startInitListeners();
      $(".race-container").slideDown();
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
    this.currentWord = splitText[0];
    this.currentChar = currentWord.charAt(0);
    $(".race-text").html(htmlText);
  };
  
  this.startInitListeners = function() {
    instance = this;
    
    $(this.wordInputBox).keypress(function(event) {
      if(instance.raceStarted) {
        instance.checkCharacter(event);
      } else {
        event.preventDefault();
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
  };
  
  this.startTimer = function() {
    
  };
  
  this.checkCharacter = function(event) {
    if(event.keyCode == 8) {
      this.backspace();
    } else {
      var character = String.fromCharCode(event.keyCode);
      if(event.shiftKey == 1) {
        character = character.toUpperCase();
      }
      
      if(this.currentChar == character) {
        this.advanceIndices(true);
      } else {
        this.updateWrongInputStatus(false, character);
        this.advanceIndices(false);
      }
    }
  };
  
  this.backspace = function() {
    
  };
  
  this.updateWrongInputStatus = function(newWrongInputStatus, wrongCharacter) {
    this.updateWrongInputStatus = newWrongInputStatus;
    
    if(newWrongInputStatus == false) {
      
    } else {
      
    }
  };
  
  this.advanceIndices = function(correctStatus) {
    if(this.currentCharIndex >= currentWord.length) {
      this.currentWordIndex++;
      this.currentCharIndex = 0;
    } else {
      this.currentCharIndex++; 
    }
  };
  
  this.stopTimer = function() {
    
  };
  
  this.calculateWPM = function() {
    
  };
}

var game = new Game();