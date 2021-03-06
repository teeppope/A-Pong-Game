const radius = 5;

export default class Ball {
	// Ball Properties
	constructor(height, width, controls, game){
		this.x = width/2; // sets starting x position
		this.y = height/2; //sets starting y position
		this.vy = 0;
		this.vx = 0;
		this.maxHeight = height;
		this.height = height;
		this.width = width;
		// this.speed = speed; <- can use later for new balls!
		this.radius = radius;
		this.game = game;
		this.startListener(controls);
		this.ballBounceSound = new Audio('../sounds/pong-01.wav');	
		this.ballPCSound = new Audio('../sounds/pong-02.wav');	
		this.ballGoalSound = new Audio('../sounds/pong-03.wav');	
	}
	//Ball Methods
	draw(ctx){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		ctx.fillStyle = "white";
		ctx.fill();
	}
	//this sets the starting velocities after the space key is pressed
	// space key value can be found in settings!
	startListener(controls){
		document.addEventListener('keydown', event => {
			if (this.vx === 0 && this.vy === 0 && event.keyCode === controls.start){
				const generateSpeed = () => {
					this.vy = Math.floor(Math.random() * 8 - 4);
					this.vx = Math.floor(Math.random() * 8 - 4);	
					//stops x & y from being at 0
					if (this.vx === 0 || this.vy === 0 ) {
						generateSpeed();
					}
				}
				generateSpeed();
			}
		});
	}
	//creating the bounce effect
	wallBounce(){
		const hitTop = this.y + this.radius < 5;
		const hitBottom = this.y >= this.height - 5;
		//Change y direction when hits top and bottom
		if (hitTop || hitBottom){
			this.vy = -this.vy;
			this.ballBounceSound.play();
		}
	}
	paddleCollision(player1, player2) {
		if (this.vx > 0) {
			const inRightEnd = 
			player2.x <= this.x + this.radius &&
			player2.x > this.x - this.vx + this.radius;
			if (inRightEnd) {
				const collisionDiff = this.x + this.radius - player2.x;
				const k = collisionDiff / this.vx;
				const y = this.vy * k + (this.y - this.vy);
				const hitRightPaddle = y >= player2.y && y + this.radius <= player2.y + player2.height;
				if (hitRightPaddle) {
					this.x = player2.x - this.radius;
					this.y = Math.floor(this.y - this.vy + this.vy * k);
					this.vx = -this.vx;
					this.ballPCSound.play();
				}
			}
		} else {
			const inLeftEnd = player1.x + player1.width >= this.x;
			if (inLeftEnd) {
				const collisionDiff = player1.x + player1.width - this.x;
				const k = collisionDiff / -this.vx;
				const y = this.vy * k + (this.y - this.vy);
				const hitLeftPaddle = y >= player1.y && y + this.radius <=
				player1.y + player1.height;
				if (hitLeftPaddle) {
					this.x = player1.x + player1.width;
					this.y = Math.floor(this.y - this.vy + this.vy * k);
					this.vx = -this.vx;
					this.ballPCSound.play();
				}
			}
		}
     }
     goal(){
     	const outOnRight = this.x >= this.width;
     	const outOnLeft = this.x + this.radius <= 0;

     	if (outOnRight){
     		this.game.leftScore.score++;
     		this.reset();
     	}else if(outOnLeft){
     		this.game.rightScore.score++;
     		this.reset();
     	}
     }
     reset(){
     	this.x = this.width/2;
     	this.y = this.height/2;
     	this.vx = 0;
     	this.vy = 0;
     	this.ballGoalSound.play();
     }
     render(ctx, player1, player2){
			this.x += this.vx;// this rendering keeps the ball moving!
			this.y += this.vy;
			this.draw(ctx);
			this.wallBounce();
			this.paddleCollision(player1, player2);
			this.goal(this.width, this.height);
			
		}
	}