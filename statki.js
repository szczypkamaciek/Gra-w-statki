var randomLoc = Math.floor(Math.random()*5);
var location1 = randomLoc;
var location2 = location1 + 1;
var location3 = location2 + 1;
var guess;
var hits = 0;
var guesses = 0;

var model = {
  boardSize: 7,
  numShips: 3,
  shipLength: 3,
  shipsSunk: 0,

  ships: [{ locations: ["06", "16","26"], hits: ["", "", ""]},
          { locations: ["24", "34","44"], hits: ["", "", ""]},
          { locations: ["10", "11","12"], hits: ["", "", ""]}],

  fire: function(guess){
    for (var i = 0; i < this.numShips; i++){
      var ship = this.ships[i];
      var locations = ship.locations;         // ta i następna linijke mozna skrocic jako: var index = ship.locations.indexOf(guess)
      var index = locations.indexOf(guess);
      if (index >= 0){
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("Trafiony!");
        if (this.isSunk(ship)){
          view.displayMessage("Zatopiłeś okręt!");
          this.shipsSunk++;
        }
        return true;
      }
    }
    view.displayMiss(guess);
    view.displayMessage("Spudłowałeś.");
    return false;
  },
  isSunk: function(ship){
    for (var i = 0; i < this.shipLength; i++){
      if (ship.hits[i] !== "hit"){
        return false;
      }
      return true;
    }
  }
};

var view = {
  displayMessage: function(msg){
    var messageArea = document.getElementById("messageArea");
    messageArea.innerHTML = msg;
  },
  displayHit: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location){
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};

var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location){
      this.guesses++;
      var hit = model.fire(location);
      if ( hit && model.shipsSunk === model.numShips){
        view.displayMessage("Zatopiłeś wszystkie okręty, w " + this.guesses + " próbach.");
      }
    }
  }
};

function parseGuess(guess){
  var alfabet = ["A", "B", "C", "D", "E", "F", "G"];
  if (guess === null || guess.length !== 2){
    alert("Proszę wpisac literę i cyfrę.");
  } else {
    firstChar = guess.charAt(0);
    var row = alfabet.indexOf(firstChar);
    var column = guess.charAt(1);

    if (isNaN(row) || isNaN(column)){
      alert("To nie są współrzędne.");
    } else if (row < 0 || row >= model.borderSize || column < 0 || column >= model.boardSize) {
      alert("Wskazane pole znajduje sie poza planszą.");
    } else {
      return row + column;
    }
  }
  return null;
}

function init(){
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
}

function handleFireButton(){
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);

  guessInput.value = "";
}
window.onload = init;
