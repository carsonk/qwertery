function RaceVisuals() {
  this.init = function() {
    canvas1 = document.getElementById("graph-1");
    var graph1 = new Graph(canvas1);
    graph1.drawSegment();
    
    canvas2 = document.getElementById("graph-2");
    var graph2 = new Graph(canvas2);
    graph2.drawSegment();
    
    canvas3 = document.getElementById("graph-3");
    var graph3 = new Graph(canvas3);
    graph3.drawSegment();
    
    this.verticalAlign();
    this.startListeners();
  };
  
  this.startListeners = function() {
    var instance = this;
    
    $(window).resize(function() {
      instance.verticalAlign();
    });
  };
  
  this.verticalAlign = function() {
    console.debug("Performing veritcal align...");
    var upperPaneHeight = $(".race-upper-pane").height();
    var lowerPaneHeight = $(".race-lower-pane").height();
    
    var mainContentHeight = $(".main-content").height();
    var upperPaneTop = (mainContentHeight - upperPaneHeight - lowerPaneHeight) / 2;
    upperPaneTop = upperPaneTop - 5;
    var upperPaneTopStr = String(upperPaneTop) + "px";
    $(".race-upper-pane").css("top", upperPaneTopStr);
    
    var statusHeaderHeight = $(".race-status-header").height();
    var statusContentHeight = $(".race-status-content").height();
    
    var raceStatusTop = (lowerPaneHeight - statusHeaderHeight - statusContentHeight) / 2;
    var raceStatusTopStr = String(raceStatusTop) + "px";
    $(".race-status-content").css("top", raceStatusTopStr);
  };
}

function Graph(canvas) {
  this.canvas = canvas;
  this.context = canvas.getContext("2d");
  
  this.drawSegment = function() {
    this.context.save();
    var centerX = Math.floor(this.canvas.width / 2);
    var centerY = Math.floor(this.canvas.height / 2);
    var radius = Math.floor(this.canvas.width / 2);
    
    var startingAngle = degreesToRadians(270);
    var arcSize = degreesToRadians(340);
    var endingAngle = startingAngle + arcSize;
    
    this.context.beginPath();
    this.context.moveTo(centerX, centerY);
    this.context.arc(centerX, centerY, radius, startingAngle, endingAngle, false);
    this.context.closePath();
    
    this.context.fillStyle = "#CE583D";
    this.context.fill();
    
    this.context.restore();
  }
  
}

function degreesToRadians(degrees) {
  return (degrees * Math.PI)/180;
}