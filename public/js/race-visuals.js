function RaceVisuals() {
  this.init = function() {
    canvas = document.getElementById("graph-1");
    var graph = new Graph(canvas);
    graph.drawSegment();
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
    
    console.log(centerX + ", " + centerY); 
    
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

var raceVisuals = new RaceVisuals();
raceVisuals.init();