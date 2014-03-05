
Game.Play = function (game) { };

Game.Play.prototype = {

	makeInvincible: function () {
		invincible = 1;
		invincibleTime = game.time.now + 3000;
	},
	create: function () {
		this.fireTime = 0; 
		this.sidefireTime = 0; 
		this.bonusTime = 0; 
		this.enemyTime = 0; 
		this.bulletTime = 0;
		this.lives = 3;
		this.evolution = 1;

		fireSpeed = 300;
		blinkTime = 0;

		this.playerY = h - 70; 
		score = 0;

		this.makeInvincible();

	    this.cursor = game.input.keyboard.createCursorKeys();

		//var bg = game.add.sprite(0, 0, 'bg');

		bgs1 = game.add.group();
		bgs1.inputEnabled=true;
	    //bgs1.createMultiple(2, 'bg');
	    bgs1.setAll('outOfBoundsKill', true);
            var bg = bgs1.create(0, 0, 'bg');
            bg.anchor.setTo(0.5, 0.5);


		bgTile = game.add.tileSprite(0, 0, w, h, 'bgtile');



		this.enemies = game.add.group();
	    this.enemies.createMultiple(25, 'enemy');
	    this.enemies.setAll('outOfBoundsKill', true);

		this.fires = game.add.group();
	    this.fires.createMultiple(30, 'fire');
	    this.fires.setAll('outOfBoundsKill', true);

		this.fires_sides = game.add.group();
	    this.fires_sides.createMultiple(30, 'fire_small');
	    this.fires_sides.setAll('outOfBoundsKill', true);

	    this.bonuses = game.add.group();
	    this.bonuses.createMultiple(3, 'bonus');
	    this.bonuses.setAll('outOfBoundsKill', true);

	    this.bullets = game.add.group();
	    this.bullets.createMultiple(25, 'bullet');
	    this.bullets.setAll('outOfBoundsKill', true);


		this.player = game.add.sprite(w/2, this.playerY, 'player');
	    this.player.body.collideWorldBounds = true;


	    this.hit_s = game.add.audio('hit');
	    this.fire_s = game.add.audio('fire');
	    this.exp_s = game.add.audio('exp');
	    this.bonus_s = game.add.audio('bonus');

	    this.emitter = game.add.emitter(0, 0, 200);
	    this.emitter.makeParticles('pixel');
	    this.emitter.gravity = 0;

	    this.life1 = game.add.sprite(w-25, 5, 'ship');
	    this.life2 = game.add.sprite(w-50, 5, 'ship');
	    this.life3 = game.add.sprite(w-75, 5, 'ship');

	    this.scoreText = game.add.text(10, 10, "0", { font: '16px pressstart2p', fill: '#ffffff' });

	},

	update: function() {

		bgTile.tilePosition.y += 1;

		this.player.body.velocity.x = 0;
	    
	    //if (this.cursor.up.isDown) 
	    	this.fire();

	    //  only move when you click
	    if (game.input.activePointer.isDown)
	    {

	        this.player.x = game.input.activePointer.x - this.player.width/2;
	        this.player.y = game.input.activePointer.y - this.player.height - 10;
	    }

		if (this.cursor.left.isDown)
	        this.player.body.velocity.x = -350;
	    else if (this.cursor.right.isDown)
	        this.player.body.velocity.x = 350;

	    if (this.game.time.now > this.enemyTime) {
	        this.enemyTime = game.time.now + 250;
		    var enemy = this.enemies.getFirstExists(false);

		    if (enemy) {
		        //enemy.body.setSize(enemy.width, enemy.height, 0, 0);
			    enemy.reset(rand(w/enemy.width-1)*enemy.width+7, -enemy.height);

			    if (score < 2000) {
			    	enemy.body.velocity.y = 100 + score / 10;
			    } else {
			    	enemy.body.velocity.y = 300;

			    }
			    enemy.angle = rand(100)*100;
			    enemy.anchor.setTo(0.5, 0.5);
			}
		}



	    if (this.game.time.now > this.bulletTime) {
	    	if (score < 1500) {
	       		this.bulletTime = game.time.now + 1000 - score/2;
	    	} else {
	    		this.bulletTime = game.time.now + 300;
	    	}
		    var bullet = this.bullets.getFirstExists(false);
		    bullet.anchor.setTo(0.5, 0.5);
		    if (bullet) {
			    bullet.reset(rand(w-bullet.width), -bullet.height);
			    bullet.body.velocity.y = 350;
			    bullet.animations.add('move');
			    bullet.animations.play('move', 4, true);
			}
		}

	    if (this.game.time.now > this.bonusTime) {

	        this.bonusTime = game.time.now + 5000;
	        var bonus = this.bonuses.getFirstExists(false);
	        bonus.reset(rand(w-bonus.width)+bonus.width/2, -bonus.height/2);
	        bonus.body.velocity.y=150;
	        bonus.anchor.setTo(0.5, 0.5);
	    }    

	    if (this.game.time.now > invincibleTime) {
	        invincible = false;
	    }  

	    game.physics.overlap(this.fires, this.enemies, this.enemyHit, null, this);
	    game.physics.overlap(this.fires_sides, this.enemies, this.enemyHit, null, this);
	    game.physics.overlap(this.fires_sides, this.bullets, this.enemyHit, null, this);
	    game.physics.overlap(this.player, this.bonuses, this.takeBonus, null, this);

	    if (!invincible) {
	    	this.player.alpha = 1;
	    	game.physics.overlap(this.player, this.bullets, this.playerHit, null, this);
	    	game.physics.overlap(this.player, this.enemies, this.playerHit, null, this);
	    } else {

	    	if (this.game.time.now > blinkTime) {

		        blinkTime = game.time.now + 100;
		        if (this.player.alpha > 0 ) {
		        	this.player.alpha = 0;
		        } else {
		        	this.player.alpha = 1;
		        }
	    	}  
	    }
	},

	playerHit: function(player, bullet) {

	    this.player.alpha = 0;
		this.makeInvincible();
	    this.lives -= 1;

	    if (this.lives == 2) {
	    	this.life3.alpha = 0;
	    }
	    if (this.lives == 1) {
	    	this.life3.alpha = 0;
	    	this.life2.alpha = 0;
	    }
	    if (this.lives == 0) {
	    	this.clear();
	    	game.state.start('Over');
	    }

		bullet.kill();

	    explosion = game.add.sprite(bullet.x, bullet.y + bullet.height/2, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);
	    
	    game.add.tween(player).to( { y:this.playerY+20 }, 100, Phaser.Easing.Linear.None)
	    		.to( { y:this.playerY }, 100, Phaser.Easing.Linear.None).start();
	    this.evolution = 1;
   		fireSpeed = 300;

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);

	},

	takeBonus: function(player, bonus) {
	    //this.bonus_s.play('', 0, 0.1);
	    bonus.kill();
	    this.evolution +=1 ;
	    this.updateScore(100);
	    	if (this.evolution > 3) {
	        	fireSpeed = 200;
	        } 
	},

	enemyHit: function(fire, enemy) {
		//this.exp_s.play('', 0, 0.1);
		fire.kill();
	    enemy.kill();
	    this.updateScore(10);
	    explosion = game.add.sprite(fire.x, fire.y - fire.height/2, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);
	     
	},

	killObject: function (obj) {
		obj.kill();
	},

	fire: function() {
		if (this.game.time.now > this.fireTime) {
			this.fireTime = game.time.now + fireSpeed;

			if (this.evolution >= 4) {

	            this.oneFire(this.player.x+this.player.width*1/5 , this.player.y +10);
	            this.oneFire(this.player.x+this.player.width/2, this.player.y);
	            this.oneFire(this.player.x+this.player.width*4/5, this.player.y+ 10);                        
	        } else if (this.evolution == 3) {
	            this.oneFire(this.player.x+this.player.width*1/5 , this.player.y +10);
	            this.oneFire(this.player.x+this.player.width/2, this.player.y);
	            this.oneFire(this.player.x+this.player.width*4/5, this.player.y+ 10);                        
	        } else if (this.evolution == 2) {
	            this.oneFire(this.player.x+this.player.width*1/3, this.player.y);
	            this.oneFire(this.player.x+this.player.width*2/3, this.player.y);
	        } else {

	            this.oneFire(this.player.x+this.player.width/2, this.player.y);

	        }

	    }
		if (this.game.time.now > this.sidefireTime) {
			this.sidefireTime = game.time.now + 500;

			if (this.evolution >= 4) {
				this.leftFire(this.player.x, this.player.y + 20);
				this.rightFire(this.player.x+this.player.width, this.player.y + 20);
	        }

	    }
	},

	oneFire: function(x, y) {
	    var fire = this.fires.getFirstExists(false);
	    fire.anchor.setTo(0.5, 0.5);
	    if (fire) {
		    fire.reset(x-fire.width/2, y-fire.height);
		    fire.body.velocity.y =- 500;
		    //fire.angle = 0;
		}
	},

	leftFire: function(x, y) {
	    var fire = this.fires_sides.getFirstExists(false);
	    fire.anchor.setTo(0.5, 0.5);
	   	if (fire) {
		    fire.reset(x-fire.width/2, y-fire.height);
		    fire.body.velocity.y =- 200;
		    fire.body.velocity.x =- 50;
		    //fire.angle = -20;
		}

	},
	rightFire: function(x, y) {
	    var fire = this.fires_sides.getFirstExists(false);
	    fire.anchor.setTo(0.5, 0.5);
	    if (fire) {
		    fire.reset(x-fire.width/2, y-fire.height);
		    fire.body.velocity.y =- 200;
		    fire.body.velocity.x =  50;
		    //fire.angle = 20;
		}
	},

	updateScore: function (n) {
	    score += n;
	    this.scoreText.content = score;
	},

	clear: function() {
		this.lives = 3;
		this.evolution = 1;
		fireSpeed = 300;
	}

};




