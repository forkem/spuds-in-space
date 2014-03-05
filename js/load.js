Game = {};

var w = 320;
var h = 480;
var score = 0;

function rand(num){ return Math.floor(Math.random() * num) };

Game.Load = function (game) {

};

Game.Load.prototype = {
	preload: function () {
	    game.stage.backgroundColor = '#000000';
	    label = game.add.text(w/2, h/2, 'Loading', { font: '30px Arial', fill: '#fff' });
		label.anchor.setTo(0.5, 0.5);

		game.load.image('intro', 'images/bg.png');
		game.load.image('bg', 'images/bg-empty.png');
		game.load.image('bgtile', 'images/bgtile.png');
		game.load.image('player', 'images/player.png');
		game.load.image('ship', 'images/ship.png');
		game.load.image('fire', 'images/fire.png');
		game.load.image('fire_small', 'images/fire_small.png');
	    game.load.image('bonus', 'images/bonus.png');
		game.load.image('pixel', 'images/pixel.png');
		game.load.spritesheet('bullet', 'images/bullet.png', 16, 32);
		game.load.spritesheet('explosion', 'images/explosion.png', 40, 40, 5	);
		game.load.image('enemy', 'images/enemy.png');

	},
	create: function () {
		game.state.start('Intro');
	}
};
