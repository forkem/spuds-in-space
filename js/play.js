
Game.Play = function (game) { };

var speeds = new Object();

Game.Play.prototype = {

	arcade: function (obj) {
		game.physics.enable(obj, Phaser.Physics.ARCADE);
		obj.enableBody = true;
    	obj.physicsBodyType = Phaser.Physics.ARCADE;
    	obj.checkWorldBounds = true;

	},
	makeInvincible: function () {
		player.invincible = 1;
		invincibleTime = game.time.now + 3000;
	},
	create: function () {


		bgTile = game.add.tileSprite(0, 0, w, h, 'bgtile');

		game.onPause.add(this.onGamePause, this);
		game.onResume.add(this.onGameResume, this);

		speeds.normalFireSpeed = 300;
		speeds.fastFireSpeed = 200;
		speeds.nukeFireSpeed = 2000;

		this.fireTime = 0; 
		this.sidefireTime = 0; 
		this.bonusTime = game.time.now + 15000; 
		this.enemyTime = 0; 
		this.stoneTime = 0; 
		this.bulletTime = 0;

		fireSpeed = speeds.normalFireSpeed;
		blinkTime = 0;
		playerInitialY = h - 70; 
		score = 0;

	    this.cursor = game.input.keyboard.createCursorKeys();

   		enemies = game.add.group();
   		this.arcade(enemies);
		potatoes = game.add.group();
		this.arcade(potatoes);
	    potatoes.createMultiple(25, 'enemy');
	    potatoes.setAll('outOfBoundsKill', true);

		stones = game.add.group();
		this.arcade(stones);
	    stones.createMultiple(4, 'stone');
	    stones.setAll('outOfBoundsKill', true);

	    // Add both to enemies group, using the Pixi container otherwise it's impossible 
	    enemies.add(potatoes);
	    enemies.add(stones);

   		fires = game.add.group();
   		//this.arcade(fires);
		this.frontFires = game.add.group();
		this.arcade(this.frontFires);
	    this.frontFires.createMultiple(30, 'fire');
	    this.frontFires.setAll('outOfBoundsKill', true);

		this.sideFires = game.add.group();
		this.arcade(this.sideFires);
	    this.sideFires.createMultiple(30, 'fire_small');
	    this.sideFires.setAll('outOfBoundsKill', true);

	    fires.add(this.frontFires);
	    fires.add(this.sideFires);

	    powerups = game.add.group();
	    powerups.createMultiple(1, 'bonus');
	    powerups.setAll('outOfBoundsKill', true);
	    this.arcade(powerups);
	    this.bullets = game.add.group();
	    this.bullets.createMultiple(25, 'bullet');
	    this.bullets.setAll('outOfBoundsKill', true);
	    this.arcade(this.bullets);

	    nukes = game.add.group();
	    nukes.createMultiple(2, 'bullet');
	    nukes.setAll('outOfBoundsKill', true);
	    this.arcade(nukes);

	    blasts = game.add.group();
	    blasts.createMultiple(2, 'blast');
	    blasts.setAll('outOfBoundsKill', true);
	    this.arcade(blasts);
		player = game.add.sprite(w/2, playerInitialY, 'ship_sprite');
		player.animations.add('move');
		player.animations.play('move', 4, true);
		this.arcade(player);

	    player.body.collideWorldBounds = true;
	    player.weaponLevel = 1;
	    this.maxWeaponLevel = 4;
	    player.lives = 3;

	    this.centralize(player);
		this.makeInvincible();

		sideShips = game.add.group();
	    sideShips.createMultiple(2, 'ship');

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
		this.pauseText = game.add.text(w/2, h/2, "Pause", { font: '20px pressstart2p', fill: '#ffffff' });
		this.centralize(this.pauseText);
		this.pauseText.alpha = 0;
	},
	centralize: function (obj) {
		obj.anchor.setTo(0.5, 0.5);
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
			    this.arcade(spud);
			    if (score < 2000) {
			    	spud.body.velocity.y = 100 + score / 10;
			    } else {
			    	spud.body.velocity.y = 300;

			    }
			    if (player.body.x > spud.body.x) {
			    	spud.body.velocity.x = rand(20);
			    } else {
			    	spud.body.velocity.x = -rand(20);
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
			    	this.arcade(spud);
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

	        player.body.x = game.input.activePointer.x;
	        player.body.y = game.input.activePointer.y - player.height/2;

	        if (sideShips.getAt(0) && sideShips.getAt(0).alive) {
	        	sideShips.getAt(0).reset(player.body.x - 35,player.body.y - 10 );
	        }
	        if (sideShips.getAt(1) && sideShips.getAt(1).alive) {
	        	sideShips.getAt(1).reset(player.body.x + 35,player.body.y - 10 );
	        }
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
		    
		    if (bullet) {
		    	this.arcade(bullet);
		    	bullet.anchor.setTo(0.5, 0.5);
			    bullet.reset(rand(w-bullet.width), -bullet.height);
			    bullet.body.velocity.y = 350;
			    bullet.animations.add('move');
			    bullet.animations.play('move', 4, true);
			}
		}

	    if (this.game.time.now > this.bonusTime) {

	        this.bonusTime = game.time.now + 15000;
	        var powerup = powerups.getFirstExists(false);
	        this.arcade(powerup);
	        if (powerup) {
		        powerup.reset(rand(w-powerup.width)+powerup.width/2, -powerup.height/2);
		        powerup.body.velocity.y=150;
		        powerup.anchor.setTo(0.5, 0.5);
	    	}
	    }    

	    if (this.game.time.now > invincibleTime) {
	        player.invincible = false;
	    }  

	    //	Collisions
	    


	    //game.physics.arcade.overlap(fires, enemies, this.enemyHit, null, this);
	    game.physics.arcade.overlap(this.frontFires, potatoes, this.enemyHit, null, this);
	    game.physics.arcade.overlap(this.frontFires, stones, this.enemyHit, null, this);
	    game.physics.arcade.overlap(this.sideFires, potatoes, this.enemyHit, null, this);
	    game.physics.arcade.overlap(this.sideFires, stones, this.enemyHit, null, this);

	    game.physics.arcade.overlap(this.sideFires, this.bullets, this.enemyHit, null, this);

	    //game.physics.arcade.overlap(nukes, enemies, this.nukeHit, null, this);
	    game.physics.arcade.overlap(nukes, potatoes, this.nukeHit, null, this);
	    game.physics.arcade.overlap(nukes, stones, this.nukeHit, null, this);

	    game.physics.arcade.overlap(nukes, this.bullets, this.nukeHit, null, this);

	    game.physics.arcade.overlap(player, powerups, this.takeBonus, null, this);
	    game.physics.arcade.overlap(sideShips, powerups, this.takeBonus, null, this);

	    //game.physics.arcade.overlap(blasts, enemies, this.blastHit, null, this);
	    game.physics.arcade.overlap(blasts, potatoes, this.blastHit, null, this);
	    game.physics.arcade.overlap(blasts, stones, this.blastHit, null, this);

	    game.physics.arcade.overlap(blasts, this.bullets, this.blastHit, null, this);

	    if (!player.invincible) {
	    	player.alpha = 1;
	    	sideShips.alpha = 1;
	    	game.physics.arcade.overlap(player, this.bullets, this.playerHit, null, this);
	    	//game.physics.arcade.overlap(player, enemies, this.playerHit, null, this);
			game.physics.arcade.overlap(player, potatoes, this.playerHit, null, this);
			game.physics.arcade.overlap(player, stones, this.playerHit, null, this);

		    game.physics.arcade.overlap(sideShips, potatoes, this.sideShipKill, null, this);
		    game.physics.arcade.overlap(sideShips, stones, this.sideShipKill, null, this);
		    game.physics.arcade.overlap(sideShips, this.bullets, this.sideShipKill, null, this);		    
	    } else {

	    	if (this.game.time.now > blinkTime) {

		        blinkTime = game.time.now + 100;
		        if (player.alpha == 1 ) {
		        	player.alpha = 0.2;
		        	sideShips.alpha = 0.1;
		        } else {
		        	player.alpha = 1;
		        	sideShips.alpha = 1;
		        }
	    	}  
	    }
	},

	sideShipKill: function(sideShip, bullet) {

		bullet.kill();

		explosion = game.add.sprite(sideShip.body.x, sideShip.body.y, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);

		sideShip.kill();

	},

	playerHit: function(player, bullet) {
	    player.alpha = 0.2;
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
		

	    explosion = game.add.sprite(bullet.body.x, bullet.body.y + bullet.height/2, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);

	    if (player.weaponLevel > 1){
	    	player.weaponLevel--;
	    }

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);

	    bullet.kill();

	},
	getSideShip: function () {
		var alive = sideShips.countLiving();
		if ( alive > 1 ) {
			return;
		}
		var ship = sideShips.getFirstExists(false);
		this.arcade(ship);
	    this.centralize(ship);
	    ship.nukeTime = 0;
		if (sideShips.getAt(0).alive) {

		    ship.reset(player.body.x + 35, player.body.y - 10);
		    
		} else {

		    ship.reset(player.body.x - 35, player.body.y - 10);

		}
	},
	takeBonus: function(p, powerup) {
	    //this.bonus_s.play('', 0, 0.1);
	    if (player.weaponLevel < this.maxWeaponLevel ) {

	  		player.weaponLevel +=1 ;
	  	}
	    this.updateScore(100);
	    	if (player.weaponLevel > 3) {
	        	fireSpeed = speeds.fastFireSpeed;
	        } 

	    powerup.kill();
	    this.getSideShip();
	},

	enemyHit: function(fire, enemy) {
		
		fire.kill();	    
	    
	    explosion = game.add.sprite(fire.body.x, fire.body.y - fire.height/2, 'explosion');
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
	nukeHit: function(fire, enemy) {		
			    

	    enemy.kill();
	    
	    var blast = blasts.getFirstExists(false);

	    if (blast) {
		    this.arcade(blast);
		    blast.reset(fire.body.x,fire.body.y);
		    blast.anchor.setTo(0.5, 0.5);
	    	blast.animations.add('boom');
		    blast.animations.play('boom', 10, false);
		    blast.events.onAnimationComplete.add(this.killObject, blast);
		}
		fire.kill();

	},
	blastHit: function(nuke, enemy) {		

	    if (enemy.alive) {
		    explosion = game.add.sprite(enemy.body.x, enemy.body.y, 'explosion');
		    if (explosion) {
			    explosion.anchor.setTo(0.5, 0.5);
		    	explosion.animations.add('boom');
			    explosion.animations.play('boom', 10, false);

			    explosion.events.onAnimationComplete.add(this.killObject, explosion);
			}
	    }

	    enemy.kill();

	    this.updateScore(10);

	},
	killObject: function (obj) {
		obj.kill();
	},

	fire: function() {
	    for (var i = 1; i >= 0; i--) {
		    ship = sideShips.getAt(i);
		    if (ship && ship.alive && (this.game.time.now > ship.nukeTime)) {
		    	ship.nukeTime = game.time.now + speeds.nukeFireSpeed;
		    	this.nuke(ship);
		    }
	    };
		if (this.game.time.now > this.fireTime) {
			this.fireTime = game.time.now + fireSpeed;

			if (player.weaponLevel >= 3) {
	            this.oneFire(player.body.x-10 , player.body.y +10);
	            this.oneFire(player.body.x, player.body.y);
	            this.oneFire(player.body.x+10, player.body.y+ 10);                        
	        } else if (player.weaponLevel == 2) {
	            this.oneFire(player.body.x-7, player.body.y);
	            this.oneFire(player.body.x+7, player.body.y);
	        } else {

	            this.oneFire(player.body.x, player.body.y);

	        }

	    }
		if (this.game.time.now > this.sidefireTime) {
			this.sidefireTime = game.time.now + 500;

			if (player.weaponLevel >= 4) {
				this.leftFire(player.body.x-player.width/2 + 3, player.body.y );
				this.rightFire(player.body.x+player.width/2 - 3, player.body.y );
	        }

	    }



	},
	nuke: function(ship) {
		if (ship.body.x<0 || ship.body.x>w || ship.body.y<0 || ship.body.y>h) return;
	    var fire = nukes.getFirstExists(false);
	    if (!fire) {
	    	nukes.getAt(0).kill();
	    }

	    if (fire) {
	    	this.arcade(fire);
	    	this.centralize( fire );
		    fire.reset(ship.body.x, ship.body.y- 10);
		    fire.body.velocity.y =- 300;
		    fire.angle = 180;
		    fire.animations.add('move');
		    fire.animations.play('move', 4, true);
		    //fire.angle = 0;
		}
	},
	oneFire: function(x, y) {
		if (x<0 || x>w || y<0 || y>h) return;
	    var fire = this.frontFires.getFirstExists(false);
	    if (fire) {

		    this.arcade(fire);
	    	this.centralize( fire );
		    fire.reset(x-fire.width/2+3, y-fire.height/2);
		    fire.body.velocity.y =- 500;
		    //fire.angle = 0;
		}
	},

	leftFire: function(x, y) {
	    var fire = this.sideFires.getFirstExists(false);
	    
	   	if (fire) {
	   		this.arcade(fire);
	   		fire.anchor.setTo(0.5, 0.5);
		    fire.reset(x, y);
		    fire.body.velocity.y =- 200;
		    fire.body.velocity.x =- 50;
		    //fire.angle = -20;
		}

	},
	rightFire: function(x, y) {
	    var fire = this.sideFires.getFirstExists(false);
	    
	    if (fire) {
	    	this.arcade(fire);
	    	fire.anchor.setTo(0.5, 0.5);
		    fire.reset(x, y);
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
	},

	onGamePause: function() {
		this.pauseText.alpha = 1;
	},
	onGameResume: function() {
		this.pauseText.alpha = 0;
	}

};




