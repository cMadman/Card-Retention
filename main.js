// object definitions
let tick;
let deck = [];
let deckMargin = 20;
let deckColumns = 5;
let deckRows = 5;

// frame
let frame = false;
let frameHeight = 500;
let frameWidth = 500;
let frameLeft = Math.ceil((window.innerWidth / 2) - (frameWidth / 2));
let frameRight = frameLeft + frameWidth;
let frameTop = 100;

// initialisation
window.onload = load;

// system functions
function load() {
    initialise();
}

function calculateCard(deckWidth,deckHeight,deckMargin,deckColumns,deckRows) {
  let cardWidth =
    (
      deckWidth -
        (
          (deckColumns * deckMargin) + deckMargin
        )
    )
    / deckColumns;

    let cardHeight =
      (
        deckHeight -
          (
            (deckRows * deckMargin) + deckMargin
          )
      )
      / deckRows;

      return {
        width: cardWidth,
        height: cardHeight
      }
}

function newElement(type,top,left,width,height,zIndex,backgroundColor) {
  let nE = document.createElement(type);
  nE.style.height = height;
  nE.style.left = left;
  nE.style.position = 'absolute';
  nE.style.top = top;
  nE.style.width = width;

  return nE;
}

function prepareDeck(containerTop, containerLeft, columns, rows, cardWidth, cardHeight, deckMargin) {
  let pointer = {
    left: containerLeft + deckMargin,
    top: containerTop + deckMargin
  }

  for (row = 0; row < rows; row++) {
    deck[row] = [];

    for (col = 0; col < columns; col++) {
      deck[row][col] = newElement(
        'div',
        pointer.top,
        pointer.left,
        cardWidth,
        cardHeight
      );
      deck[row][col].className = 'flip-container';
      deck[row][col].innerHTML = `
        <div class="flipper">
          <div class="front">front</div>
          <div class="back">back</div>
        </div>
      `;

      pointer.left = pointer.left + cardWidth + deckMargin;
    }

    pointer.left = containerLeft + deckMargin;
    pointer.top = pointer.top + cardHeight + deckMargin;
  }
}

function renderDeck(container,deck) {
  deck.forEach(function(row){
    row.forEach(function(column){
      container.appendChild(column);
    });
  });
}

function initialise() {
    // canvas
    frame = document.createElement('div');
    frame.style.position = 'absolute';
    frame.style.top = frameTop;
    frame.style.left = frameLeft;
    frame.style.height = frameHeight;
    frame.style.width = frameWidth;
    frame.style.backgroundColor = '#eee';
    frame.style.zIndex = 0;
    document.body.appendChild(frame);

    let card = calculateCard(frameWidth,frameHeight,deckMargin,deckColumns,deckRows);
    prepareDeck(0,0,deckColumns,deckRows,card.width,card.height,deckMargin);
    renderDeck(frame,deck);
}
