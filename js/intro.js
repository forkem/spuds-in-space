Game.Intro = function (game) {

};

Game.Intro.prototype = {

	startGame: function () {
			game.state.start('Play');
	},

	create: function () {
		
		bgTile = game.add.tileSprite(0, 0, w, h, 'bgtile');
		var bg = game.add.sprite(w/2, 0, 'intro');
		bg.anchor.setTo(0.5, 0);
		bg.inputEnabled=true;

    	bg.events.onInputDown.add(this.startGame);

	},

	update: function() {
		 if (game.input.activePointer.isDown)
	    {
	    	this.startGame ();
	    }
		bgTile.tilePosition.y += 1;
		if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
			this.startGame ();
	}
};