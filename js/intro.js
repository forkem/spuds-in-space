Game.Intro = function (game) {
	this.cursor;
};

Game.Intro.prototype = {

	startGame: function () {
			game.state.start('Play');
	},

	create: function () {
		
		bgTile = game.add.tileSprite(0, 0, w, h, 'bgtile');
		var bg = game.add.sprite(0, 0, 'intro');
		bg.inputEnabled=true;

    	bg.events.onInputDown.add(this.startGame);

	},

	update: function() {
		bgTile.tilePosition.y += 1;
		if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
			this.startGame ();
	}
};