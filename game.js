var game
var clickBox
var coordX 
var coordY
var cardsForMatching = []
var numMatches = 0
var interactivePool = []
var alphaPool = []


let gameOptions = {
    type: Phaser.AUTO,
    cardWidth: 128,
    cardHeight: 128,
    cardScale: 2,
}

window.onload = function() {
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x4488aa,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "memoryMatch",
            width: 1800,
            height: 1334

        },
        scene: [ PlayGame ]
    }
    game = new Phaser.Game(gameConfig);
    window.focus();
}

class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    preload() {
        this.load.spritesheet('back', 'assets/images/back.png', {
            frameWidth: gameOptions.cardWidth,
            frameHeight: gameOptions.cardHeight  
        });
		this.load.spritesheet('ball', 'assets/images/ball.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });
		this.load.spritesheet('beetroot', 'assets/images/beetroot.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });
		this.load.spritesheet('bomb', 'assets/images/bomb.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });
		this.load.spritesheet('boulders', 'assets/images/boulders.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });
		this.load.spritesheet('box', 'assets/images/box.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });
        this.load.spritesheet('bush', 'assets/images/bush.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });
        this.load.spritesheet('carrot', 'assets/images/carrot.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });;
        this.load.spritesheet('coin', 'assets/images/coin.png', {
            frameWidth: gameOptions.cardWidth, 
            frameHeight: gameOptions.cardHeight 
        });;
    }

    create() {
        this.deck = ['ball', 'beetroot', 'bomb', 'boulders', 'box', 
        'bush', 'carrot', 'coin', 'ball', 'beetroot', 'bomb', 'boulders', 'box', 
        'bush', 'carrot', 'coin']

        Phaser.Utils.Array.Shuffle(this.deck) 

        this.fillTheField()

        this.input.on('gameobjectup', function (pointer, gameObject) {
            gameObject.emit('clicked', gameObject)
            cardsForMatching.push(gameObject.name)
            gameObject.alpha = 0
            gameObject.disableInteractive()
            interactivePool.push(gameObject)
            alphaPool.push(gameObject)
            if (cardsForMatching.length == 2) {
                this.input.mouse.manager.enabled = false
                this.compareCards()
            }
        }, this);
    }

    clickHandler (box) {
    }
    
    compareCards() {
        if (cardsForMatching[0] == cardsForMatching[1]) {
            cardsForMatching.length = 0
            numMatches++
            alphaPool.pop()
            alphaPool.pop()  
            this.input.mouse.manager.enabled = true
        } else {
            for (let i = 0; i < interactivePool.length; i++) {
                interactivePool[i].setInteractive()                 
            }
            this.time.addEvent({
				delay: 700,
				callbackScope: this,
				callback: function() {
                    for (let i = 0; i < alphaPool.length; i++) {
                        alphaPool[i].alpha = 1
                    }
                    alphaPool.pop()
                    alphaPool.pop()    
                    cardsForMatching.length = 0
                    this.input.mouse.manager.enabled = true
					},
			});   
        }    
        if (numMatches == 8) {
            this.time.addEvent({
				delay: 5000,
				callbackScope: this,
				callback: function() {
					this.scene.start('PlayGame');
				},
			});
        }  
    }
        
    createCard(i) {
        let card = this.add.sprite(gameOptions.cardWidth * gameOptions.cardScale, game.config.height / 2, this.deck[i]);
        card.setScale(gameOptions.cardScale);
        return card;
    }

    createClickBox(i) {
        clickBox = this.add
            .rectangle(coordX, coordY, gameOptions.cardWidth, gameOptions.cardHeight, 0x0000ff)
            .setScale(gameOptions.cardScale)
            .setName(this.deck[i])
            .setInteractive();
            clickBox.on('clicked', this.clickHandler, this);
        return clickBox
    }

    fillTheField() {
        coordX = 300
        coordY = 200
        for (let i = 0; i < 16; i++) {      
            this.tweens.add({
                targets: this.createCard(i), 
                x: coordX,
                y: coordY,               
                duration: 500,
                ease: "Cubic.easeOut",
            })
            coordX = coordX + 400
            if ((i + 1) % 4 == 0) {
                coordX = 300
                coordY = coordY + 300
            }
        }
        coordX = 300
        coordY = 200
        this.time.addEvent({
            delay: 5000,
            callbackScope: this,
            callback: function() {
                for (let i = 0; i < 16; i++) {      
                    this.tweens.add({
                        targets: this.createClickBox(i), 
                        x: coordX,
                        y: coordY,               
                    })       
                    coordX = coordX + 400
                    if ((i + 1) % 4 == 0) {
                        coordX = 300
                        coordY = coordY + 300
                    }
                }
            }, 
        })
    }
}
