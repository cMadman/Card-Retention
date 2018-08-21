// initialisation
window.onload = load;

// system functions
function load() {
    initialise();
}

function initialise() {
  let players = [
    new Player("Mark"),
    new Player("Ste")
  ];

  let game = new Game(players,0,"Medium");
  game.deal();
}

class Game {
    deck: Deck;
    rows: number;
    columns: number;
    totalCards: number;
    board: any;
    aCard: any;
    playerZone: any;

    clientHeight = document.documentElement.clientHeight;
    clientWidth = document.documentElement.clientWidth;
    viewportMax = ((this.clientHeight > this.clientWidth ? this.clientWidth : this.clientHeight));
    playerZoneHeight = Math.floor(this.viewportMax * 0.15);
    width = this.viewportMax - this.playerZoneHeight;
    height = this.viewportMax - this.playerZoneHeight;
    left = 0;
    top = 0;
    margin = 10;
    tableau = [];
    flipped = [];
    color = {
        floor: "#393059",
        table: "#393059",
        cardBorder: "#FABF0C",
        cardBackground: "#FFEBAD",
        playerZone: "#393059",
        playerActive: "#B9A6FF",
        playerInactive: "#393059"
    }

    constructor(
        public players: Array<any>, 
        public currentPlayer: number, 
        public difficulty: string
    ) {
        switch(difficulty) {
            case "Hard":
                this.rows = 8;
                this.columns = 8;
                break;
            case "Medium":
                this.rows = 6;
                this.columns = 6;
                break;
            case "Easy":
            default:
                this.rows = 4;
                this.columns = 4;
            break;
        }

        this.totalCards = this.rows * this.columns;
        this.aCard = Card.calculateCard({
            width: this.width,
            height: this.height,
            margin: this.margin,
            columns: this.columns,
            rows: this.rows
        });

        this.createBoard();
        this.createPlayerZone();
        this.setActivePlayer();
    }

    createBoard() {
        this.board = document.createElement('div');
        this.board.id = "game-board";
        this.board.style = `
            background-color: ${this.color.floor};
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
            "🍌","🍉","🍇","🍓","🍒","🍑","🍍","🥥","🥝","🍆","🥑","🥦","🌽","🥕","🍠","🍔","🍟","🍕","🌮","🥗","🍣","🍭","🍩","🍿","🍺","🍾","🍪","🍧","🍸","🍰","🍖","🥓"
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

        this.tableau.forEach((row) => {
            row.forEach((card) => {
                this.board.appendChild(card.html);
            });
        });


    }

    match(card) {
        let thisPlayer = this.players[this.currentPlayer];

        this.flipped[this.flipped.length] = card;

        if(this.flipped.length == 2) {
            thisPlayer.attempts++;

            let card1 = this.flipped[0];
            let card2 = this.flipped[1];

            if(card1.html.innerHTML == card2.html.innerHTML) {
                card1.hide(); card2.hide();

                thisPlayer.score++;
            } else {
                card1.flip(); card2.flip();
                card1.listen(); card2.listen();

                this.nextPlayer();
            }

            thisPlayer.tile.innerHTML = `
                ${thisPlayer.nickname} ${thisPlayer.attempts}:${thisPlayer.score}
            `;

            this.flipped.length = 0; // empty the array (source: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript)
        }
    }

    nextPlayer() {
        if((this.currentPlayer+1) == this.players.length) {
            this.currentPlayer = 0;
        } else {
            this.currentPlayer++;
        }
        this.setActivePlayer();
    }

    createPlayerZone() {
        this.playerZone = document.createElement("div");
        this.playerZone.style = `
            background-color: ${this.color.playerZone};
            height: ${this.playerZoneHeight}px;
            position: relative;
            top: ${(this.height+this.margin)}px;
            width: ${this.width}px;
        `;
        this.board.appendChild(this.playerZone);

        let ptWidth = 150;
        let ptFontSize = Math.floor(this.playerZoneHeight * 0.2);
        let ptMargin = this.playerZoneHeight / 2;
        this.players.forEach((player, index) => {
            player.tile = document.createElement("div");
            player.tile.style = `
                box-sizing: border-box;
                color: #fff;
                height: ${this.playerZoneHeight}px;
                font-family: monospace;
                font-size: ${ptFontSize}px;
                font-weight: bold;
                left: ${((index*ptWidth))}px;
                padding-left: ${(ptFontSize/2)}px;
                position: absolute;
                width: ${ptWidth}px;
            `;
            player.tile.innerHTML = player.nickname;
            this.playerZone.appendChild(player.tile);
        });
    }

    setActivePlayer() {
        this.players.forEach((player, index) => {
            player.tile.style.backgroundColor = (index == this.currentPlayer) ? this.color.playerActive : this.color.playerInactive;
        });
    }
}

class Player {
    constructor(
        public nickname: string,
        public score = 0,
        public attempts = 0
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
        this.html.style = `
            height: ${height}px;
            left: ${left}px;
            position: absolute;
            top: ${top}px;
            width: ${width}px;
        `;
        this.listen();
      
        this.html.innerHTML = `
          <div class="flipper">
            <div class="front"></div>
            <div class="back" style="font-size: ${(Math.floor(width*0.8))}px">${content}</div>
          </div>
        `;
    }

    handleEvent(evt) {
        switch(evt.type) {
            case "click":
                this.click(evt);
                break;
            default:
                return;
        }
    }

    listen() {
        this.html.addEventListener('click', this, {once: true});
    }

    deafen() {
        this.html.removeEventListener('click', this, {once: true});
    }

    click(evt) {
        this.deafen();
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