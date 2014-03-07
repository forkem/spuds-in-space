
Game.Play = function (game) { };

var speeds = new Object();

Game.Play.prototype = {

	makeInvincible: function () {
		player.invincible = 1;
		invincibleTime = game.time.now + 3000;
	},
	create: function () {

		speeds.normalFireSpeed = 300;
		speeds.fastFireSpeed = 200;

		this.fireTime = 0; 
		this.sidefireTime = 0; 
		this.bonusTime = game.time.now + 15000; 
		this.enemyTime = 0; 
		this.stoneTime = 0; 
		this.bulletTime = 0;


		fireSpeed = speeds.normalFireSpeed;
		blinkTime = 0;
		playerY = h - 70; 
		score = 0;

	    this.cursor = game.input.keyboard.createCursorKeys();

		bgTile = game.add.tileSprite(0, 0, w, h, 'bgtile');

		potatoes = game.add.group();
	    potatoes.createMultiple(25, 'enemy');
	    potatoes.setAll('outOfBoundsKill', true);

		stones = game.add.group();
	    stones.createMultiple(4, 'stone');
	    stones.setAll('outOfBoundsKill', true);

		this.fires = game.add.group();
	    this.fires.createMultiple(30, 'fire');
	    this.fires.setAll('outOfBoundsKill', true);

		this.fires_sides = game.add.group();
	    this.fires_sides.createMultiple(30, 'fire_small');
	    this.fires_sides.setAll('outOfBoundsKill', true);

	    powerups = game.add.group();
	    powerups.createMultiple(1, 'bonus');
	    powerups.setAll('outOfBoundsKill', true);

	    this.bullets = game.add.group();
	    this.bullets.createMultiple(25, 'bullet');
	    this.bullets.setAll('outOfBoundsKill', true);


		player = game.add.sprite(w/2, playerY, 'ship_sprite');

		player.animations.add('move');
		player.animations.play('move', 4, true);
	    player.body.collideWorldBounds = true;
	    player.weaponLevel = 1;
	    player.lives = 3;

		this.makeInvincible();

	    this.hit_s = game.add.audio('hit');
	    this.fire_s = game.add.audio('fire');
	    this.exp_s = game.add.audio('exp');
	    this.bonus_s = game.add.audio('bonus');

	    /*
		    emitter = game.add.emitter(0, 0, 200);
		    emitter.makeParticles('pixel');
		    emitter.gravity = 0;
		*/
	    this.life1 = game.add.sprite(w-25, 5, 'ship');
	    this.life2 = game.add.sprite(w-50, 5, 'ship');
	    this.life3 = game.add.sprite(w-75, 5, 'ship');

	    this.scoreText = game.add.text(10, 10, "0", { font: '16px pressstart2p', fill: '#ffffff' });

	},

	createSpud: function( level) {

	    if (this.game.time.now > this.enemyTime) {
	    	if ( score < 3000) {
	        	this.enemyTime = game.time.now + 750 - score/6;
	    	}
	        else {
	        	this.enemyTime = game.time.now + 250;
	        }
		    var spud = potatoes.getFirstExists(false);

		    if (spud) {
			    spud.reset(rand(w/spud.width-1)*spud.width+7, -spud.height);

			    if (score < 2000) {
			    	spud.body.velocity.y = 100 + score / 10;
			    } else {
			    	spud.body.velocity.y = 300;

			    }
			    spud.life = Math.floor(score/1000)+1;
			    spud.angle = rand(100)*100;
			    spud.anchor.setTo(0.5, 0.5);
			}
		}
	},
	createStone: function() {

		if (score > 500) 
		    if (this.game.time.now > this.stoneTime) {
		        this.stoneTime = game.time.now + 500;
			    var spud = stones.getFirstExists(false);

			    if (spud) {
				    spud.reset(rand(w/spud.width-1)*spud.width+7, -spud.height);

			    	spud.body.velocity.y = 100;

			    	spud.life = Math.floor(score/500)+1;
				    spud.angle = rand(100)*100;
				    spud.anchor.setTo(0.5, 0.5);
				}
			}
	},
	update: function() {

		bgTile.tilePosition.y += 1;

		player.body.velocity.x = 0;
	    
	    //if (this.cursor.up.isDown) 
	    	this.fire();

	    //  only move when you click
	    if (game.input.activePointer.isDown)
	    {

	        player.x = game.input.activePointer.x - player.width/2;
	        player.y = game.input.activePointer.y - player.height - 5;
	    }

		if (this.cursor.left.isDown)
	        player.body.velocity.x = -350;
	    else if (this.cursor.right.isDown)
	        player.body.velocity.x = 350;


	    this.createSpud();


	    	this.createStone();


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

	        this.bonusTime = game.time.now + 15000;
	        var powerup = powerups.getFirstExists(false);
	        powerup.reset(rand(w-powerup.width)+powerup.width/2, -powerup.height/2);
	        powerup.body.velocity.y=150;
	        powerup.anchor.setTo(0.5, 0.5);
	    }    

	    if (this.game.time.now > invincibleTime) {
	        player.invincible = false;
	    }  

	    game.physics.overlap(this.fires, potatoes, this.enemyHit, null, this);
	    game.physics.overlap(this.fires_sides, potatoes, this.enemyHit, null, this);
	    game.physics.overlap(this.fires_sides, this.bullets, this.enemyHit, null, this);
	    game.physics.overlap(player, powerups, this.takeBonus, null, this);

	    game.physics.overlap(this.fires, stones, this.enemyHit, null, this);
	    game.physics.overlap(this.fires_sides, stones, this.enemyHit, null, this);

	    if (!player.invincible) {
	    	player.alpha = 1;
	    	game.physics.overlap(player, this.bullets, this.playerHit, null, this);
	    	game.physics.overlap(player, potatoes, this.playerHit, null, this);
	    } else {

	    	if (this.game.time.now > blinkTime) {

		        blinkTime = game.time.now + 100;
		        if (player.alpha > 0 ) {
		        	player.alpha = 0;
		        } else {
		        	player.alpha = 1;
		        }
	    	}  
	    }
	},

	playerHit: function(player, bullet) {

	    player.alpha = 0;
		this.makeInvincible();
	    player.lives -= 1;

	    if (player.lives == 2) {
	    	this.life3.alpha = 0.5;
	    }
	    if (player.lives == 1) {
	    	this.life3.alpha = 0.5;
	    	this.life2.alpha = 0.5;
	    }
	    if (player.lives == 0) {
	    	this.clear();
	    	game.state.start('Over');
	    }
		fireSpeed = speeds.normalFireSpeed;
		

	    explosion = game.add.sprite(bullet.x, bullet.y + bullet.height/2, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);
	    
	    game.add.tween(player).to( { y:playerY+20 }, 100, Phaser.Easing.Linear.None)
	    		.to( { y:playerY }, 100, Phaser.Easing.Linear.None).start();
	    player.weaponLevel = 1;

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);

	    bullet.kill();

	},

	takeBonus: function(player, powerup) {
	    //this.bonus_s.play('', 0, 0.1);
	    
	    player.weaponLevel +=1 ;
	    this.updateScore(100);
	    	if (player.weaponLevel > 3) {
	        	fireSpeed = speeds.fastFireSpeed;
	        } 

	    powerup.kill();
	},

	enemyHit: function(fire, enemy) {
		
		fire.kill();	    
	    
	    explosion = game.add.sprite(fire.x, fire.y - fire.height/2, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);
	    
	    if (!enemy.life || enemy.life < 2) {
	    	enemy.kill();
	    	this.updateScore(10);
	    }

	    enemy.life --;
	},

	killObject: function (obj) {
		obj.kill();
	},

	fire: function() {
		if (this.game.time.now > this.fireTime) {
			this.fireTime = game.time.now + fireSpeed;

			if (player.weaponLevel >= 4) {

	            this.oneFire(player.x+player.width*1/5 , player.y +10);
	            this.oneFire(player.x+player.width/2, player.y);
	            this.oneFire(player.x+player.width*4/5, player.y+ 10);                        
	        } else if (player.weaponLevel == 3) {
	            this.oneFire(player.x+player.width*1/5 , player.y +10);
	            this.oneFire(player.x+player.width/2, player.y);
	            this.oneFire(player.x+player.width*4/5, player.y+ 10);                        
	        } else if (player.weaponLevel == 2) {
	            this.oneFire(player.x+player.width*1/3, player.y);
	            this.oneFire(player.x+player.width*2/3, player.y);
	        } else {

	            this.oneFire(player.x+player.width/2, player.y);

	        }

	    }
		if (this.game.time.now > this.sidefireTime) {
			this.sidefireTime = game.time.now + 500;

			if (player.weaponLevel >= 4) {
				this.leftFire(player.x, player.y + 20);
				this.rightFire(player.x+player.width, player.y + 20);
	        }

	    }
	},

	oneFire: function(x, y) {
	    var fire = this.fires.getFirstExists(false);
	    
	    if (fire) {
	    	fire.anchor.setTo(0.5, 0.5);
		    fire.reset(x-fire.width/2+3, y-fire.height/2);
		    fire.body.velocity.y =- 500;
		    //fire.angle = 0;
		}
	},

	leftFire: function(x, y) {
	    var fire = this.fires_sides.getFirstExists(false);
	    
	   	if (fire) {
	   		fire.anchor.setTo(0.5, 0.5);
		    fire.reset(x-fire.width/2, y-fire.height);
		    fire.body.velocity.y =- 200;
		    fire.body.velocity.x =- 50;
		    //fire.angle = -20;
		}

	},
	rightFire: function(x, y) {
	    var fire = this.fires_sides.getFirstExists(false);
	    
	    if (fire) {
	    	fire.anchor.setTo(0.5, 0.5);
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
		player.lives = 3;
		player.weaponLevel = 1;
		fireSpeed = speeds.normalFireSpeed;
	}

};




