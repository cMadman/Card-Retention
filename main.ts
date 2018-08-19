// initialisation
window.onload = load;

// system functions
function load() {
    initialise();
}

function initialise() {
  let players = [
    new Player("Mark")
  ];

  let game = new Game(players,"Mark","Easy");
  game.createBoard();
  game.deal();
}

class Game {
    deck: Deck;
    rows: number;
    columns: number;
    totalCards: number;
    board: any;
    aCard: any;

    width = 500;
    height = 500;
    left = 50;
    top = 50;
    margin = 10;
    tableau = [];
    flipped = [];

    constructor(
        public players: Array<any>, 
        public currentPlayer: string, 
        public difficulty: string
    ) {
        if(difficulty == "Easy") {
            this.rows = 4;
            this.columns = 4;
            this.totalCards = this.rows * this.columns;
        }
        this.aCard = Card.calculateCard({
            width: this.width,
            height: this.height,
            margin: this.margin,
            columns: this.columns,
            rows: this.rows
        });
    }

    createBoard() {
        this.board = document.createElement('div');
        this.board.id = "game-board";
        this.board.style = `
            background-color: #eee;
            height: ${this.height};
            left: ${this.left};
            position: relative;
            top: ${this.top};
            width: ${this.width};
        `;
        document.body.appendChild(this.board);
    }

    deal() {
        let cards = [
            "🍌","🍉","🍇","🍓","🍒","🍑","🍍","🥥","🥝","🍆","🥑","🥦","🌽","🥕","🍠"
        ]
        this.deck = new Deck(cards,this.totalCards);
        
        let pointer = {
            left: this.margin,
            top: this.margin
          }
        
          for (let row = 0; row < this.rows; row++) {
            this.tableau[row] = [];
        
            for (let col = 0; col < this.columns; col++) {
              this.tableau[row][col] = new Card(
                  pointer.top,
                  pointer.left,
                  this.aCard.width,
                  this.aCard.height,
                  this.deck.cards.pop(),
                  this
                );
        
              pointer.left = pointer.left + this.aCard.width + this.margin;
            }
        
            pointer.left = this.margin;
            pointer.top = pointer.top + this.aCard.height + this.margin;
          }

        this.tableau.forEach(function(row) {
            row.forEach(function(card) {
                document.getElementById("game-board").appendChild(card.html);
            });
        });
    }

    match(card) {
        this.flipped[this.flipped.length] = card;

        if(this.flipped.length == 2) {
            let card1 = this.flipped[0];
            let card2 = this.flipped[1];

            if(card1.html.innerHTML == card2.html.innerHTML) {
                card1.hide();
                card2.hide();

            } else {
                card1.flip();
                card2.flip();
            }

            this.flipped.length = 0; // empty the array (source: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript)
        }
    }
}

class Player {
    constructor(
        public nickname: string
    ) {}
}

class Card {
    html: any;

    constructor(
        public top: number,
        public left: number,
        public width: number,
        public height: number,
        public content: string,
        public game: Game
    ) {
        this.html = document.createElement('div');
        this.html.className = 'flip-container';
        this.html.style.height = height;
        this.html.style.left = left;
        this.html.style.position = 'absolute';
        this.html.style.top = top;
        this.html.style.width = width;
        this.html.addEventListener('click', () => this.click());
      
        this.html.innerHTML = `
          <div class="flipper">
            <div class="front"></div>
            <div class="back">${content}</div>
          </div>
        `;
    }

    click() {
        this.flip(true);
    }

    flip(match?) {
        this.html.classList.toggle("flip");
        if(match) {
            this.html.addEventListener(
                'transitionend',
                () => this.game.match(this),
                {once: true}
            );
        }
    }

    hide() {
        this.html.classList.toggle("hide");
    }

    static calculateCard(options) {
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
}

class Deck {
    constructor(
        public cards: Array<string>,
        public size: number
    ) {
        // cut
        this.cards = this.cards.slice(0,(size/2));

        // fill
        this.cards = this.cards.reduce(function (res, current, index, array) {
            return res.concat([current, current]);
          }, []);

        // shuffle
        shuffle(this.cards);
    }
}

// third party code
/**
  * source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  * Shuffles array in place. ES6 version
  * @param {Array} a items An array containing the items.
  */
 function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}