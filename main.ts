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

  let game = new Game(players,"Mark","Easy",500,500);
  game.createBoard();
}

class Game {
    deck: Deck;
    rows: number;
    columns: number;
    totalCards: number;
    board: any;

    constructor(
        public players: Array<any>, 
        public currentPlayer: string, 
        public difficulty: string,
        public width: number,
        public height: number
    ) {
        if(difficulty == "Easy") {
            this.rows = 4;
            this.columns = 4;
            this.totalCards = this.rows * this.columns;
        }
    }

    createBoard() {
        this.board = document.createElement('div');
        this.board.style = `
            background-color: #eee;
            height: ${this.height};
            left: 0;
            position: absolute;
            top: 0;
            width: ${this.width};
        `;
        document.body.appendChild(this.board);
    }

    deal() {
    }

    start() {
        let cards = [
            "🍌","🍉","🍇","🍓","🍒","🍑","🍍","🥥","🥝","🍆","🥑","🥦","🌽","🥕","🍠"
        ]
        this.deck = new Deck(cards,this.totalCards);
        this.deal;
    }
}

class Player {
    constructor(
        public nickname: string
    ) {}
}

class Deck {
    constructor(
        public cards: Array<string>,
        public size: number
    ) {
        // cut
        this.cards.slice(0,size/2);

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