Game.Over = function (game) {
};

Game.Over.prototype = {
	startGame: function () {
			game.state.start('Play');
	},
	create: function () {
		var bg = game.add.sprite(0, 0, 'bg');
		bg.inputEnabled=true;
		bgTile = game.add.tileSprite(0, 0, w, h, 'bgtile');

		label = game.add.text(w/2, 0, 'GAME OVER', { font: '30px pressstart2p', fill: '#fff', align: 'center' });
		label.anchor.setTo(0.5, 0.5);
	    game.add.tween(label).to({ y: h*1/3 }, 5000, Phaser.Easing.Quadratic.InOut, true, 0, 0, false);

	    if (score > highscore) {
			labelscore = game.add.text(w/2, h/2, 'New highscore!', { font: '18px pressstart2p', fill: '#fff', align: 'center' });
			labelscore.anchor.setTo(0.5, 0.5);    	
			labelhi = game.add.text(w/2, h/2 + labelscore.height + 10, String(score), { font: '18px pressstart2p', fill: '#fff', align: 'center' });
			labelhi.anchor.setTo(0.5, 0.5);
			highscore = score;
	    } else {
			labelscore = game.add.text(w/2, h/2, 'Score: '+score, { font: '18px pressstart2p', fill: '#fff', align: 'center' });
			labelscore.anchor.setTo(0.5, 0.5);
			labelhi = game.add.text(w/2, h/2 + labelscore.height + 10, 'High Score: '+highscore, { font: '18px pressstart2p', fill: '#fff', align: 'center' });
			labelhi.anchor.setTo(0.5, 0.5);
		}
		label3 = game.add.text(w/2, h-40, 'Insert coin', { font: '18px pressstart2p', fill: '#fff', align: 'center' });
		label3.anchor.setTo(0.5, 0.5);
	},

	update: function() {
		if (game.input.activePointer.isDown)
	    {
	    	this.startGame ();
	    }
		bgTile.tilePosition.y += 1;
		//if (this.game.time.now > this.time && this.cursor.up.isDown)
		if (game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
			this.startGame ();
	}
};