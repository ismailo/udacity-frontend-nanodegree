/*
 * App's JavaScript code
 */


 /*
 * Create a list that holds all of your cards
 */
const cardList = ["fa-diamond", "fa-paper-plane-o", "fa-anchor", "fa-bolt", "fa-cube", "fa-leaf", "fa-bicycle", "fa-bomb"];

// to store number of moves, time count and when time stops 
var moves = 0;
let timeCount = 0;
let stopTime;

// check when first card is opened
var gameStarted = false;

/*
* Display the cards on the page
*   - shuffle the list of cards using the provided "shuffle" method below
*   - loop through each card and create its HTML
*   - add each card's HTML to the page
*/

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// get cards DOM
function getCards(card){
    return card[0].firstChild.className;
}

// Array to keep track of open cards
let openCards = [];

// check for open cards 
let finalCount = 0;
function checkOpenCards(){
    if (getCards(openCards[0]) === getCards(openCards[1])){
        finalCount++;
        openCards.forEach(function(card){
            card.animateCss('pulse', function(){
                card.toggleClass("open show match");
            });
        });
    } else {
        openCards.forEach(function(card){
            card.animateCss('flipInY', function(){
                card.toggleClass("open show");
             
            });
        });
    }
    openCards = [];
    addMove();
    if (finalCount === 8){
        isOver();
    }
}

// starts the timer at the begining of clicking the first two cards
function startTimer(){
    timeCount += 1;
    $("#timer").html(timeCount);
    stopTime = setTimeout(startTimer, 1000);
}

// add move count by 1 when everytie the user click on two cards
function addMove(){
    moves += 1;
    $("#moves").html(moves);
    if (moves === 14 || moves === 20){
        finalRating();
    }
}

// Card click even handler 
function cardEvenClick(event){
    // check both opened or matched card
    let classes = $(this).attr("class");
    if (classes.search('open') * classes.search('match') !== 1){
        // both should be -1
        return;
    }
    // start the game 
    if (!gameStarted) {
        gameStarted = true;
        timeCount = 0;
        stopTime = setTimeout(startTimer, 1000);
    }
    // flipping to show the cards 
    if (openCards.length < 2){
        $(this).toggleClass("open show");
        openCards.push($(this));
    }
    // check openCards if they match or not
    if (openCards.length === 2){
        checkOpenCards();
    }
}

// create individual card element dynamically 
function createCard(cardClass){
    $("ul.deck").append(`<li class="card"><i class="fa ${cardClass}"></i></li>`);
}

// generate random cards on the deck
function generateCards(){
    shuffle(cardList.concat(cardList)).forEach(createCard);
}

// reset the game if needed
function startGame(){
    $("ul.deck").html("");
    $(".stars").html("");
    moves = -1;
    addMove();

    gameStarted = false;
    openCards = [];
    timeCount = 0;
    finalCount = 0;
    clearTimeout(stopTime);
    $("#timer").html(0);
    // re-setup game
    initGame();
}

// Pop up dialog will populate when all cards are matched 
function isOver(){
    // stop the timer
    clearTimeout(stopTime);
    // show dialog message 
    let stars = $(".fa-star").length;
    vex.dialog.confirm({
        message: `Congratulations!!! You matched all the cards in ${timeCount} seconds and earned ${stars}/3 star rating. Would you like to play again?`,
        callback: function(value){
            if (value){
                startGame();
            }
        }
    });
}

// assign the stars rating 
function initalRating(){
    for (let i=0; i<3; i++){
        $(".stars").append(`<li><i class="fa fa-star"></i></li>`);
    }
}

// penelize the user by reducing star rating if missed 
function finalRating(){
    let stars = $(".fa-star");
    $(stars[stars.length-1]).toggleClass("fa-star fa-star-o");
}

// initialize the game
function initGame(){
    generateCards();
    initalRating();
    $(".card").click(cardEvenClick);
}

// action taken after the DOM is loaded for the first time
$(document).ready(function(){
    initGame();
    $("#restart").click(startGame);
    vex.defaultOptions.className = 'vex-theme-os';
    vex.dialog.buttons.YES.text = 'Yes!';
    vex.dialog.buttons.NO.text = 'No';
});

// load the animateCss
// taken from https://github.com/daneden/animate.css/#usage
$.fn.extend({
    animateCss: function(animationName, callback) {
      var animationEnd = (function(el) {
        var animations = {
          animation: 'animationend',
          OAnimation: 'oAnimationEnd',
          MozAnimation: 'mozAnimationEnd',
          WebkitAnimation: 'webkitAnimationEnd',
        };
  
        for (var t in animations) {
          if (el.style[t] !== undefined) {
            return animations[t];
          }
        }
      })(document.createElement('div'));
  
      this.addClass('animated ' + animationName).one(animationEnd, function() {
        $(this).removeClass('animated ' + animationName);
  
        if (typeof callback === 'function') callback();
      });
  
      return this;
    },
  });






/*
* set up the event listener for a card. If a card is clicked:
*  - display the card's symbol (put this functionality in another function that you call from this one)
*  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
*  - if the list already has another card, check to see if the two cards match
*    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
*    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
*    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
*    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
*/