const DECK_MARGIN = 20;
const DECK_COLUMNS = 5;
const DECK_ROWS = 5;
const FRAME_HEIGHT = 500;
const FRAME_WIDTH = 500;
const FRAME_LEFT = Math.ceil((window.innerWidth / 2) - (FRAME_WIDTH / 2));
const FRAME_RIGHT = FRAME_LEFT + FRAME_WIDTH;
const FRAME_TOP = 100;

// initialisation
window.onload = load;

// system functions
function load() {
    initialise();
}

function calculateCard(input) {
  let cardWidth =
    (
      input.width -
        (
          (input.columns * input.margin) + input.margin
        )
    )
    / input.columns;

    let cardHeight =
      (
        input.height -
          (
            (input.rows * input.margin) + input.margin
          )
      )
      / input.rows;

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
      deck[row][col] = createCard(pointer.top,pointer.left,i.cardWidth,i.cardHeight
      );

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
    // canvas

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
