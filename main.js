// initialisation
window.onload = load;
// system functions
function load() {
    initialise();
}
function initialise() {
    var players = [
        new Player("Mark")
    ];
    var game = new Game(players, "Mark", "Easy", 500, 500);
    game.createBoard();
}
var Game = /** @class */ (function () {
    function Game(players, currentPlayer, difficulty, width, height) {
        this.players = players;
        this.currentPlayer = currentPlayer;
        this.difficulty = difficulty;
        this.width = width;
        this.height = height;
        if (difficulty == "Easy") {
            this.rows = 4;
            this.columns = 4;
            this.totalCards = this.rows * this.columns;
        }
    }
    Game.prototype.createBoard = function () {
        this.board = document.createElement('div');
        this.board.style = "\n            background-color: #eee;\n            height: " + this.height + ";\n            left: 0;\n            position: absolute;\n            top: 0;\n            width: " + this.width + ";\n        ";
        document.body.appendChild(this.board);
    };
    Game.prototype.deal = function () {
    };
    Game.prototype.start = function () {
        var cards = [
            "🍌", "🍉", "🍇", "🍓", "🍒", "🍑", "🍍", "🥥", "🥝", "🍆", "🥑", "🥦", "🌽", "🥕", "🍠"
        ];
        this.deck = new Deck(cards, this.totalCards);
        this.deal;
    };
    return Game;
}());
var Player = /** @class */ (function () {
    function Player(nickname) {
        this.nickname = nickname;
    }
    return Player;
}());
var Deck = /** @class */ (function () {
    function Deck(cards, size) {
        this.cards = cards;
        this.size = size;
        // cut
        this.cards.slice(0, size / 2);
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
