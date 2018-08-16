const DECK_MARGIN = 20;
const DECK_COLUMNS = 4;
const DECK_ROWS = 4;
const NUMBER_OF_CARDS = DECK_COLUMNS * DECK_ROWS;
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const FRAME_LEFT = Math.ceil((window.innerWidth / 2) - (FRAME_WIDTH / 2));
const FRAME_RIGHT = FRAME_LEFT + FRAME_WIDTH;
const FRAME_TOP = 100;
const CARD_CONTENT = ["🍌","🍉","🍇","🍓","🍒","🍑","🍍","🥥","🥝","🍆","🥑","🥦","🌽","🥕","🍠"];
const MAXIMUM_CARDS = CARD_CONTENT.length * 2;
const REQUIRED_CONTENT = CARD_CONTENT.slice(0,(NUMBER_OF_CARDS/2));
const DECK = REQUIRED_CONTENT.reduce(function (res, current, index, array) {
  return res.concat([current, current]);
}, []);

if(isOdd(DECK_COLUMNS) && isOdd(DECK_ROWS)) {
  throw new Error("Deck must be even, therefore rows and columns cannot both be odd.");
}

if(NUMBER_OF_CARDS > MAXIMUM_CARDS) {
  throw new Error("Not enough icons.");
}

// initialisation
window.onload = load;

// system functions
function load() {
    initialise();
}

function calculateCard(options) {
  let cardWidth =
    (
      options.width -
        (
          (options.columns * options.margin) + options.margin
        )
    )
    / options.columns;

    let cardHeight =
      (
        options.height -
          (
            (options.rows * options.margin) + options.margin
          )
      )
      / options.rows;

      return {
        width: cardWidth,
        height: cardHeight
      }
}

function createCard(top,left,width,height,back) {
  let card = document.createElement('div');
  card.className = 'flip-container';
  card.style.height = height;
  card.style.left = left;
  card.style.position = 'absolute';
  card.style.top = top;
  card.style.width = width;
  card.addEventListener('click', cardClick);

  card.innerHTML = `
    <div class="flipper">
      <div class="front"></div>
      <div class="back">${back}</div>
    </div>
  `;

  return card;
}

function cardClick() {
  this.classList.toggle("flip");
}

function prepareDeck(options) {
  let pointer = {
    left: options.left + options.margin,
    top: options.top + options.margin
  }

  let deck = [];
  let deckContent = _.shuffle(DECK);

  for (row = 0; row < options.rows; row++) {
    deck[row] = [];

    for (col = 0; col < options.columns; col++) {
      deck[row][col] = createCard(pointer.top,pointer.left,options.cardWidth,options.cardHeight,deckContent.pop());

      pointer.left = pointer.left + options.cardWidth + options.margin;
    }

    pointer.left = options.left + options.margin;
    pointer.top = pointer.top + options.cardHeight + options.margin;
  }

  return deck;
}

function renderDeck(container,deck) {
  deck.forEach(function(row) {
    row.forEach(function(column) {
      container.appendChild(column);
    });
  });
}

function initialise() {
    let card = calculateCard({
      width: FRAME_WIDTH,
      height: FRAME_HEIGHT,
      margin: DECK_MARGIN,
      columns: DECK_COLUMNS,
      rows: DECK_ROWS
    });

    let deck = prepareDeck({
      left: 0,
      top: 0,
      columns: DECK_COLUMNS,
      rows: DECK_ROWS,
      cardWidth: card.width,
      cardHeight: card.height,
      margin: DECK_MARGIN
    });

    let frame = document.createElement('div');
    frame.style.position = 'absolute';
    frame.style.top = FRAME_TOP;
    frame.style.left = FRAME_LEFT;
    frame.style.height = FRAME_HEIGHT;
    frame.style.width = FRAME_WIDTH;
    frame.style.backgroundColor = '#eee';
    frame.style.zIndex = 0;
    document.body.appendChild(frame);

    renderDeck(frame,deck);
}

/* third-party code */

// source: https://stackoverflow.com/questions/5016313/how-to-determine-if-a-number-is-odd-in-javascript
function isOdd(num) { return num % 2; }
