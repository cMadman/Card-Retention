// initialisation
window.onload = load;
// system functions
function load() {
    initialise();
}
function initialise() {
    var players = [
        new Player("Mark"),
        new Player("Ste")
    ];
    var game = new Game(players, 0, "Medium");
}
var Game = /** @class */ (function () {
    function Game(players, currentPlayer, difficulty) {
        this.players = players;
        this.currentPlayer = currentPlayer;
        this.difficulty = difficulty;
        this.width = 500;
        this.height = 500;
        this.left = 50;
        this.top = 50;
        this.margin = 10;
        this.tableau = [];
        this.flipped = [];
        switch (difficulty) {
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
        if (difficulty == "Easy") {
            this.rows = 4;
            this.columns = 4;
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
        this.deal();
    }
    Game.prototype.createBoard = function () {
        this.board = document.createElement('div');
        this.board.id = "game-board";
        this.board.style = "\n            background-color: #eee;\n            height: " + this.height + ";\n            left: " + this.left + ";\n            position: relative;\n            top: " + this.top + ";\n            width: " + this.width + ";\n        ";
        document.body.appendChild(this.board);
    };
    Game.prototype.deal = function () {
        var _this = this;
        var cards = [
            "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🍍", "🥥", "🥝", "🍆", "🥑", "🥦", "🌽", "🥕", "🍠", "🍔", "🍟", "🍕", "🌮", "🥗", "🍣", "🍭", "🍩", "🍿"
        ];
        this.deck = new Deck(cards, this.totalCards);
        var pointer = {
            left: this.margin,
            top: this.margin
        };
        for (var row = 0; row < this.rows; row++) {
            this.tableau[row] = [];
            for (var col = 0; col < this.columns; col++) {
                this.tableau[row][col] = new Card(pointer.top, pointer.left, this.aCard.width, this.aCard.height, this.deck.cards.pop(), this);
                pointer.left = pointer.left + this.aCard.width + this.margin;
            }
            pointer.left = this.margin;
            pointer.top = pointer.top + this.aCard.height + this.margin;
        }
        this.tableau.forEach(function (row) {
            row.forEach(function (card) {
                _this.board.appendChild(card.html);
            });
        });
    };
    Game.prototype.match = function (card) {
        this.flipped[this.flipped.length] = card;
        if (this.flipped.length == 2) {
            var card1 = this.flipped[0];
            var card2 = this.flipped[1];
            if (card1.html.innerHTML == card2.html.innerHTML) {
                card1.hide();
                card2.hide();
                var thisPlayer = this.players[this.currentPlayer];
                thisPlayer.score++;
                thisPlayer.tile.innerHTML = "\n                    " + thisPlayer.nickname + " " + thisPlayer.score + "\n                ";
            }
            else {
                card1.flip();
                card2.flip();
                this.nextPlayer();
            }
            this.flipped.length = 0; // empty the array (source: https://stackoverflow.com/questions/1232040/how-do-i-empty-an-array-in-javascript)
        }
    };
    Game.prototype.nextPlayer = function () {
        if ((this.currentPlayer + 1) == this.players.length) {
            this.currentPlayer = 0;
        }
        else {
            this.currentPlayer++;
        }
        this.setActivePlayer();
    };
    Game.prototype.createPlayerZone = function () {
        var _this = this;
        var pzHeight = 32;
        this.playerZone = document.createElement("div");
        this.playerZone.style.width = this.width + "px";
        this.playerZone.style.height = pzHeight + "px";
        this.playerZone.style.top = (this.height + this.margin) + "px";
        this.playerZone.style.backgroundColor = "#eee";
        this.playerZone.style.position = "relative";
        this.board.appendChild(this.playerZone);
        var ptWidth = 150;
        var ptFontSize = 21;
        var ptMargin = pzHeight / 2;
        this.players.forEach(function (player, index) {
            var background = (index == _this.currentPlayer) ? "#000" : "#ccc";
            player.tile = document.createElement("div");
            player.tile.style = "\n                background-color: " + background + ";\n                box-sizing: border-box;\n                color: #fff;\n                height: " + pzHeight + "px;\n                font-family: monospace;\n                font-size: " + ptFontSize + "px;\n                font-weight: bold;\n                left: " + ((index * ptWidth)) + "px;\n                line-height: " + pzHeight + "px;\n                padding-left: " + (ptFontSize / 2) + "px;\n                position: absolute;\n                width: " + ptWidth + "px;\n            ";
            player.tile.innerHTML = player.nickname;
            _this.playerZone.appendChild(player.tile);
        });
    };
    Game.prototype.setActivePlayer = function () {
        var _this = this;
        this.players.forEach(function (player, index) {
            player.tile.style.backgroundColor = (index == _this.currentPlayer) ? "#000" : "#ccc";
        });
    };
    return Game;
}());
var Player = /** @class */ (function () {
    function Player(nickname, score) {
        if (score === void 0) { score = 0; }
        this.nickname = nickname;
        this.score = score;
    }
    return Player;
}());
var Card = /** @class */ (function () {
    function Card(top, left, width, height, content, game) {
        var _this = this;
        this.top = top;
        this.left = left;
        this.width = width;
        this.height = height;
        this.content = content;
        this.game = game;
        this.html = document.createElement('div');
        this.html.className = 'flip-container';
        this.html.style.height = height;
        this.html.style.left = left;
        this.html.style.position = 'absolute';
        this.html.style.top = top;
        this.html.style.width = width;
        this.html.addEventListener('click', function () { return _this.click(); });
        this.html.innerHTML = "\n          <div class=\"flipper\">\n            <div class=\"front\"></div>\n            <div class=\"back\">" + content + "</div>\n          </div>\n        ";
    }
    Card.prototype.click = function () {
        this.flip(true);
    };
    Card.prototype.flip = function (match) {
        var _this = this;
        this.html.classList.toggle("flip");
        if (match) {
            this.html.addEventListener('transitionend', function () { return _this.game.match(_this); }, { once: true });
        }
    };
    Card.prototype.hide = function () {
        this.html.classList.toggle("hide");
    };
    Card.calculateCard = function (options) {
        var cardWidth = (options.width -
            ((options.columns * options.margin) + options.margin))
            / options.columns;
        var cardHeight = (options.height -
            ((options.rows * options.margin) + options.margin))
            / options.rows;
        return {
            width: cardWidth,
            height: cardHeight
        };
    };
    return Card;
}());
var Deck = /** @class */ (function () {
    function Deck(cards, size) {
        this.cards = cards;
        this.size = size;
        // cut
        this.cards = this.cards.slice(0, (size / 2));
        // fill
        this.cards = this.cards.reduce(function (res, current, index, array) {
            return res.concat([current, current]);
        }, []);
        // shuffle
        shuffle(this.cards);
    }
    return Deck;
}());
// third party code
/**
  * source: https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
  * Shuffles array in place. ES6 version
  * @param {Array} a items An array containing the items.
  */
function shuffle(a) {
    var _a;
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        _a = [a[j], a[i]], a[i] = _a[0], a[j] = _a[1];
    }
    return a;
}
