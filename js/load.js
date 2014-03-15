Game = {};

	var w = screen.width;
	var h = screen.height;

if (w > 1000) {
	w = 400;
	h = 480;
} 
var score = 0;
var highscore = 0;

function rand(num){ return Math.floor(Math.random() * num) };

Game.Load = function (game) {

};

Game.Load.prototype = {
	preload: function () {
	    game.stage.backgroundColor = '#000000';

		game.load.image('intro', 'images/bg.png');
		game.load.image('bgtile', 'images/bgTile.jpg');
		game.load.spritesheet('ship_sprite', 'images/ship_sprite.png', 40, 44, 2);
		game.load.image('ship', 'images/ship.png');
		game.load.image('fire', 'images/fire.png');
		game.load.image('fire_small', 'images/fire_small.png');
	    game.load.image('bonus', 'images/bonus.png');
		game.load.spritesheet('bullet', 'images/bullet.png', 16, 38);
		game.load.spritesheet('explosion', 'images/explosion.png', 40, 40, 5	);
		game.load.spritesheet('blast', 'images/blast.png', 160, 160, 5	);
		game.load.image('enemy', 'images/enemy.png');
		game.load.image('stone', 'images/stone.png');

	},
	create: function () {
		game.state.start('Intro');
	}
};
