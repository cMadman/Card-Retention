const DECK_MARGIN = 20;
const DECK_COLUMNS = 4;
const DECK_ROWS = 4;
const NUMBER_OF_CARDS = DECK_COLUMNS * DECK_ROWS;
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const FRAME_LEFT = Math.ceil((window.innerWidth / 2) - (FRAME_WIDTH / 2));
const FRAME_RIGHT = FRAME_LEFT + FRAME_WIDTH;
const FRAME_TOP = 100;
const CARD_CONTENT = ['🍌','🍉','🍇','🍓','🍒','🍑','🍍','🥥','🥝','🍆','🥑','🥦','🌽','🥕','🍠'];
const MAXIMUM_CARDS = CARD_CONTENT.length * 2;

if(isOdd(DECK_COLUMNS) && isOdd(DECK_ROWS)) {
  exit("Exit: Deck must be even, therefore rows and columns cannot both be odd.");
}

if(NUMBER_OF_CARDS > MAXIMUM_CARDS) {
  exit("Exit: Not enough icons.");
}

// initialisation
window.onload = load;

// system functions
function load() {
    initialise();
}

function isOdd(num) { return num % 2; }

function calculateCard(i) {
  let cardWidth =
    (
      i.width -
        (
          (i.columns * i.margin) + i.margin
        )
    )
    / i.columns;

    let cardHeight =
      (
        i.height -
          (
            (i.rows * i.margin) + i.margin
          )
      )
      / i.rows;

      return {
        width: cardWidth,
        height: cardHeight
      }
}

function createCard(top,left,width,height) {
  let card = document.createElement('div');
  card.className = 'flip-container';
  card.style.height = height;
  card.style.left = left;
  card.style.position = 'absolute';
  card.style.top = top;
  card.style.width = width;

  card.innerHTML = `
    <div class="flipper">
      <div class="front">front</div>
      <div class="back">back</div>
    </div>
  `;

  return card;
}

function prepareDeck(i) {
  let pointer = {
    left: i.left + i.margin,
    top: i.top + i.margin
  }

  let deck = [];

  for (row = 0; row < i.rows; row++) {
    deck[row] = [];

    for (col = 0; col < i.columns; col++) {
      deck[row][col] = createCard(pointer.top,pointer.left,i.cardWidth,i.cardHeight);

      pointer.left = pointer.left + i.cardWidth + i.margin;
    }

    pointer.left = i.left + i.margin;
    pointer.top = pointer.top + i.cardHeight + i.margin;
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

function exit( status ) {
    // source: https://stackoverflow.com/questions/550574/how-to-terminate-the-script-in-javascript
    // http://kevin.vanzonneveld.net
    // +   original by: Brett Zamir (http://brettz9.blogspot.com)
    // +      input by: Paul
    // +   bugfixed by: Hyam Singer (http://www.impact-computing.com/)
    // +   improved by: Philip Peterson
    // +   bugfixed by: Brett Zamir (http://brettz9.blogspot.com)
    // %        note 1: Should be considered expirimental. Please comment on this function.
    // *     example 1: exit();
    // *     returns 1: null

    var i;

    if (typeof status === 'string') {
        alert(status);
    }

    window.addEventListener('error', function (e) {e.preventDefault();e.stopPropagation();}, false);

    var handlers = [
        'copy', 'cut', 'paste',
        'beforeunload', 'blur', 'change', 'click', 'contextmenu', 'dblclick', 'focus', 'keydown', 'keypress', 'keyup', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'resize', 'scroll',
        'DOMNodeInserted', 'DOMNodeRemoved', 'DOMNodeRemovedFromDocument', 'DOMNodeInsertedIntoDocument', 'DOMAttrModified', 'DOMCharacterDataModified', 'DOMElementNameChanged', 'DOMAttributeNameChanged', 'DOMActivate', 'DOMFocusIn', 'DOMFocusOut', 'online', 'offline', 'textInput',
        'abort', 'close', 'dragdrop', 'load', 'paint', 'reset', 'select', 'submit', 'unload'
    ];

    function stopPropagation (e) {
        e.stopPropagation();
        // e.preventDefault(); // Stop for the form controls, etc., too?
    }
    for (i=0; i < handlers.length; i++) {
        window.addEventListener(handlers[i], function (e) {stopPropagation(e);}, true);
    }

    if (window.stop) {
        window.stop();
    }

    throw '';
}
