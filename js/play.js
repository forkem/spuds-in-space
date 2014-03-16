
Game.Play = function (game) { };

var speeds = new Object();
speeds.bonus = new Object();

Game.Play.prototype = {

	checkBounds: function (obj) {
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
		speeds.bonus.weapons = 15000;
		speeds.bonus.oneUps = 49200;
		speeds.bonus.sideShips = 21600;

		this.fireTime = 0; 
		this.sidefireTime = 0; 
		this.weaponsTime = game.time.now + speeds.bonus.weapons; 
		this.oneUpsTime = game.time.now + speeds.bonus.oneUps; 
		this.sideShipsTime = game.time.now + speeds.bonus.sideShips; 
		this.enemyTime = 0; 
		this.stoneTime = 0; 
		this.bulletTime = 0;

		fireSpeed = speeds.normalFireSpeed;
		blinkTime = 0;
		playerInitialY = h - 70; 
		score = 0;

	    this.cursor = game.input.keyboard.createCursorKeys();

	    harmful = game.add.group();
   		enemies = game.add.group();

		potatoes = game.add.group();
	    potatoes.createMultiple(25, 'enemy');
	    potatoes.setAll('outOfBoundsKill', true);

		stones = game.add.group();
	    stones.createMultiple(4, 'stone');
	    stones.setAll('outOfBoundsKill', true);

	    // Add both to enemies group, using the Pixi container otherwise it's impossible 
	    enemies.add(potatoes._container);
	    enemies.add(stones._container);

   		fires = game.add.group();

		this.frontFires = game.add.group();
	    this.frontFires.createMultiple(30, 'fire');
	    this.frontFires.setAll('outOfBoundsKill', true);

		this.sideFires = game.add.group();
	    this.sideFires.createMultiple(30, 'fire_small');
	    this.sideFires.setAll('outOfBoundsKill', true);

	    fires.add(this.frontFires._container);
	    fires.add(this.sideFires._container);

	    bonusWeapons = game.add.group();
	    bonusWeapons.createMultiple(1, 'weapons');
	    bonusWeapons.setAll('outOfBoundsKill', true);
	    bonusSideShips = game.add.group();
	    bonusSideShips.createMultiple(1, 'sideshippresent');
	    bonusSideShips.setAll('outOfBoundsKill', true);
	    bonusOneUps = game.add.group();
	    bonusOneUps.createMultiple(1, '1p');
	    bonusOneUps.setAll('outOfBoundsKill', true);

	    this.bullets = game.add.group();
	    this.bullets.createMultiple(25, 'bullet');
	    this.bullets.setAll('outOfBoundsKill', true);



	    nukes = game.add.group();
	    nukes.createMultiple(2, 'bullet');
	    nukes.setAll('outOfBoundsKill', true);

	    blasts = game.add.group();
	    blasts.createMultiple(2, 'blast');
	    blasts.setAll('outOfBoundsKill', true);

		player = game.add.sprite(w/2, playerInitialY, 'ship_sprite');

		player.animations.add('move');
		player.animations.play('move', 4, true);
	    player.body.collideWorldBounds = true;
	    player.weaponLevel = 1;
	    this.maxWeaponLevel = 4;
	    player.lives = 3;
	    player.sideShips = 2;
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
		lives = game.add.group();
		lives.createMultiple(3, 'ship');
	    lives.setAll('outOfBoundsKill', true);

	    var life = lives.getFirstExists(false);
	    life.reset(w-25, 5);
	    var life = lives.getFirstExists(false);
	    life.reset(w-50, 5);
	    var life = lives.getFirstExists(false);
	    life.reset(w-75, 5);

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

			    if (score < 2000) {
			    	spud.body.velocity.y = 100 + score / 10;
			    } else {
			    	spud.body.velocity.y = 300;

			    }
			    if (player.x > spud.x) {
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

	        player.x = game.input.activePointer.x;
	        player.y = game.input.activePointer.y - player.height/2;

	        if (sideShips.getAt(0) && sideShips.getAt(0).alive) {
	        	sideShips.getAt(0).reset(player.x - 35,player.y - 10 );
	        }
	        if (sideShips.getAt(1) && sideShips.getAt(1).alive) {
	        	sideShips.getAt(1).reset(player.x + 35,player.y - 10 );
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
		    	bullet.anchor.setTo(0.5, 0.5);
			    bullet.reset(rand(w-bullet.width), -bullet.height);
			    bullet.body.velocity.y = 350;
			    bullet.animations.add('move');
			    bullet.animations.play('move', 4, true);
			}
		}

	    if (this.game.time.now > this.weaponsTime) {

	        this.weaponsTime = game.time.now + speeds.bonus.weapons;

	        var powerup = bonusWeapons.getFirstExists(false);
	        if (powerup) {
		        powerup.reset(rand(w-powerup.width)+powerup.width/2, -powerup.height/2);
		        powerup.body.velocity.y=150;
		        powerup.anchor.setTo(0.5, 0.5);
	    	}
	    }    
	    if (this.game.time.now > this.sideShipsTime) {

	        this.sideShipsTime = game.time.now + speeds.bonus.sideShips;
	        
	        var powerup = bonusSideShips.getFirstExists(false);
	        if (powerup) {
		        powerup.reset(rand(w-powerup.width)+powerup.width/2, -powerup.height/2);
		        powerup.body.velocity.y=150;
		        powerup.anchor.setTo(0.5, 0.5);
	    	}
	    }    
	    if (this.game.time.now > this.oneUpsTime) {

	        this.oneUpsTime = game.time.now + speeds.bonus.oneUps;
	        
	        var powerup = bonusOneUps.getFirstExists(false);
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
	    game.physics.overlap(fires, enemies, this.enemyHit, null, this);

	    game.physics.overlap(this.sideFires, this.bullets, this.enemyHit, null, this);

	    game.physics.overlap(nukes, enemies, this.nukeHit, null, this);
	    game.physics.overlap(nukes, this.bullets, this.nukeHit, null, this);

	    game.physics.overlap(player, bonusWeapons, this.takeWeapon, null, this);
	    game.physics.overlap(sideShips, bonusWeapons, this.takeWeapon, null, this);
	    game.physics.overlap(player, bonusOneUps, this.takeOneUp, null, this);
	    game.physics.overlap(sideShips, bonusOneUps, this.takeOneUp, null, this);
	    game.physics.overlap(player, bonusSideShips, this.takeSideShip, null, this);
	    game.physics.overlap(sideShips, bonusSideShips, this.takeSideShip, null, this);

	    game.physics.collide(blasts, enemies, this.blastHit, null, this);
	    game.physics.collide(blasts, this.bullets, this.blastHit, null, this);

	    if (!player.invincible) {
	    	player.alpha = 1;
	    	sideShips.alpha = 1;
	    	game.physics.overlap(player, this.bullets, this.playerHit, null, this);
	    	game.physics.overlap(player, enemies, this.playerHit, null, this);
		    game.physics.overlap(sideShips, potatoes, this.sideShipKill, null, this);
		    game.physics.overlap(sideShips, this.bullets, this.sideShipKill, null, this);		    
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

		explosion = game.add.sprite(sideShip.x, sideShip.y, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);

		sideShip.kill();

	},
	updateLives: function() {

		for (var i = 0; i<3; i++) {
			if (player.lives > i) {
				lives.getAt(i).alpha = 1;
			} else {
				lives.getAt(i).alpha = 0.5;
			}
		};

	    if (player.lives == 0) {
	    	this.clear();
	    	game.state.start('Over');
	    }
	},
	playerHit: function(player, bullet) {

	    player.alpha = 0.2;
		this.makeInvincible();
	    player.lives -= 1;

	    this.updateLives();

		fireSpeed = speeds.normalFireSpeed;
		
	    explosion = game.add.sprite(bullet.x, bullet.y + bullet.height/2, 'explosion');
	    explosion.anchor.setTo(0.5, 0.5);
    	explosion.animations.add('boom');
	    explosion.animations.play('boom', 10, false);

	    if (player.weaponLevel > 1){
	    	player.weaponLevel--;
	    }

	    explosion.events.onAnimationComplete.add(this.killObject, explosion);

	    bullet.kill();

	},

	takeWeapon: function(p, powerup) {
	    //this.bonus_s.play('', 0, 0.1);
	    powerup.kill();
	    if (player.weaponLevel < this.maxWeaponLevel ) {

	  		player.weaponLevel +=1 ;
	  	}
	    this.updateScore(100);
	    	if (player.weaponLevel > 3) {
	        	fireSpeed = speeds.fastFireSpeed;
	        } 
	    
	},
	takeOneUp: function(p, powerup) {

	    powerup.kill();
	    if (player.lives < 3 ) {

	  		player.lives +=1 ;
	  	}
	  	this.updateLives();
	    this.updateScore(100);
	    
	},
	takeSideShip: function (p,powerup) {
		powerup.kill();
		var alive = sideShips.countLiving();
		if ( alive > 1 ) {
			return;
		}
		var ship = sideShips.getFirstExists(false);
		this.checkBounds(ship);
	    this.centralize(ship);
	    ship.nukeTime = 0;
		if (sideShips.getAt(0).alive) {

		    ship.reset(player.x + 35, player.y - 10);
		    
		} else {

		    ship.reset(player.x - 35, player.y - 10);

		}
		this.updateScore(100);
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
	nukeHit: function(fire, enemy) {		
			    

	    enemy.kill();
	    
	    var blast = blasts.getFirstExists(false);
	    blast.reset(fire.x,fire.y);
	    blast.anchor.setTo(0.5, 0.5);
    	blast.animations.add('boom');
	    blast.animations.play('boom', 10, false);
	    blast.events.onAnimationComplete.add(this.killObject, blast);

		fire.kill();

	},
	blastHit: function(nuke, enemy) {		

	    if (enemy.alive) {
		    explosion = game.add.sprite(enemy.x, enemy.y, 'explosion');
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
		if (this.game.time.now > this.fireTime) {
			this.fireTime = game.time.now + fireSpeed;

			if (player.weaponLevel >= 3) {
	            this.oneFire(player.x-10 , player.y +10);
	            this.oneFire(player.x, player.y);
	            this.oneFire(player.x+10, player.y+ 10);                        
	        } else if (player.weaponLevel == 2) {
	            this.oneFire(player.x-7, player.y);
	            this.oneFire(player.x+7, player.y);
	        } else {

	            this.oneFire(player.x, player.y);

	        }

	    }
		if (this.game.time.now > this.sidefireTime) {
			this.sidefireTime = game.time.now + 500;

			if (player.weaponLevel >= 4) {
				this.leftFire(player.x-player.width/2 + 3, player.y );
				this.rightFire(player.x+player.width/2 - 3, player.y );
	        }

	    }
	    for (var i = 1; i >= 0; i--) {
		    ship = sideShips.getAt(i);
		    if (ship && ship.alive && (this.game.time.now > ship.nukeTime)) {
		    	ship.nukeTime = game.time.now + speeds.nukeFireSpeed;
		    	this.nuke(ship);
		    }
	    };


	},
	nuke: function(ship) {

		if (ship.x < 0 || ship.x > w || ship.y > h || ship.y < 0)
			return false;

	    var fire = nukes.getFirstExists(false);
	    

	    if (fire) {
	    	this.centralize( fire );
	    	this.checkBounds(fire);
		    fire.reset(ship.x, ship.y- 10);
		    fire.body.velocity.y =- 400;
		    fire.angle = 180;
		    fire.animations.add('move');
		    fire.animations.play('move', 4, true);
		    //fire.angle = 0;
		}
	},
	oneFire: function(x, y) {

		if (x < 0 || x > w || y > h || y < 0)
			return false;

	    var fire = this.frontFires.getFirstExists(false);
	    
	    if (fire) {
	    	this.centralize( fire );
		    fire.reset(x-fire.width/2+3, y-fire.height/2);
		    fire.body.velocity.y =- 500;
		    //fire.angle = 0;
		}
	},

	leftFire: function(x, y) {
		if (x < 0 || x > w || y > h || y < 0)
			return false;

	    var fire = this.sideFires.getFirstExists(false);
	    
	   	if (fire) {
	   		fire.anchor.setTo(0.5, 0.5);
		    fire.reset(x, y);
		    fire.body.velocity.y =- 200;
		    fire.body.velocity.x =- 50;
		    //fire.angle = -20;
		}

	},
	rightFire: function(x, y) {
		if (x < 0 || x > w || y > h || y < 0)
			return false;
	    var fire = this.sideFires.getFirstExists(false);
	    
	    if (fire) {
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




