// utility function for generating random integers
function randIntInRange(minNum,maxNum) {
	return Math.floor(Math.random()*(maxNum+1 - minNum) + minNum);
}
// Spaceship class
class Spaceship {
	constructor(name, hitpoints, firepower, accuracy) {
		this.name = name;
		this.hull = hitpoints;
		this.firepower = firepower;
		this.accuracy = accuracy;
	}

	attack(targetShip) {
		if(this.hull <= 0) {
			throw "Zombie Ship! Ships without health cannot attack";
		}
		const attackRoll = Math.random(); // maybe rename this
		if (this.accuracy > attackRoll) {
			targetShip.hull -= this.firepower;
		}
		// return attack success
		return this.accuracy > attackRoll;

	}
}
// Alien Ship sub-class
class AlienShip extends Spaceship{
	constructor(name) {
		let hullRoll = randIntInRange(3,6);
		let firepowerRoll = randIntInRange(2,4);
		let accuracyRoll = randIntInRange(60,80)*.01;
		super(name, hullRoll,firepowerRoll,accuracyRoll);
	}
}

// setup Game:

let playerShip;
let activeAliens;
let gameInProgress;
let gameEndReason;

function setUpGame(numAliens) {
	// stats according to spec
	playerShip = new Spaceship('USS Schwarzenegger', 20, 5,.7);
	activeAliens = [];
	for(let i = 0; i < numAliens; i++){
		let alienNumber = i+1
		eval ("globalThis.alien"+ alienNumber +" = new AlienShip(`Alien ${alienNumber}`)");
		eval(`activeAliens.push(alien${alienNumber})`);
	}
}

// Secretly drive game play by allowing the player to attack and then making the
// alien attack in turn. Also includes checks for end of game scenarios 
function attack(target) {
	if (!gameInProgress) {
		displayGameEnd(gameEndReason);
	} else {
		// attack the target
		if (playerShip.attack(target)) {
			console.log("Great Shot!");
		} else {
			console.log("Missed, try again!");
		}

		// have an alien attack back, check if the player is still alive
		if (target.hull > 0) {
			if (target.attack(playerShip)) {
				console.log("We've been hit!");
			} else {
				console.log("HA, they missed!")
			}

		if (playerShip.hull <= 0) {
			console.log("Aliens won. You're Dead!");
			gameInProgress = false;
			gameEndReason = "Game Over";
		}
			
		} else {
			// remove any dead aliens
			activeAliens[target.name.split(" ")[1]-1] = null;
		}

		// display a list of active aliens or end the game if there are none
		if (checkAllDeadAliens()) {
			console.log("You've saved Earth!");
			gameInProgress = false;
			gameEndReason = "Game Won"
		} else {
			displayActiveAliens();
		}

		displayHealth(playerShip);
	}

}

function retreat() {
	console.log("You Ran! Earth is lost T_T");
	console.log("Game Over");
	console.log("Click the button in the page to try again");
	gameInProgress = false;
	gameEndReason = "Ran Away";
}

function checkAllDeadAliens() {
	for (const alien of activeAliens) {
		if (alien !== null) {
			return false;
		}
	}
	return true;
}

//------------Display Information------------------------------------------------------------------------
function startGame(enemies) {
	console.log('%cSpace Battle: Fight for Earth!',
				"font-size: 15px; background:black; border: 2px solid red; color:green;");
	console.log(`%cYou are captain of the USS Schwarzenegger - and there are ${enemies} evil alien ships headed to destroy Earth!`,
				"background: lightyellow; color:red; font-size:12px");
	displayActiveAliens();
	console.log("%cTo attack the first alien use %cattack.(alien1)",
				'font-style: italic; background: azure; border: 1px solid grey;',
				'font-style: italic; background: red; border: 1px solid grey; color: white');
	console.log("%c If you're a coward, run away with %cretreat()",
				'font-style: italic; background: azure; border: 1px solid grey;',
				'font-style: italic; background: red; border: 1px solid grey; color: white');				
}

function displayActiveAliens() {
	console.log("%cThese ships are still threatening Earth! Choose Your next target",
		"background: lightblue; color:blue; font-size:12px");
	for (const alien of activeAliens) {
		if (alien !== null) {
			let varName = alien.name.split(" ")[0].toLowerCase();
			varName += alien.name.split(" ")[1];
			console.log(varName);
		}
	}
}

function displayHealth(player) {
	let healthStatus;
	if (player.hull > 10) {
		healthStatus = "green";
	} else if (player.hull > 5) {
		healthStatus = "orange";
	} else {
		healthStatus = "red";
	}

	let healthStr = `%c Player hull: %c ${player.hull}`;
	let healthStyles = ["font-style: italic; color:brown" , // "Player hull"
						`color: ${healthStatus}`] // player hull value
	console.log(healthStr, ...healthStyles);
}

function displayGameEnd(reason) {
	switch (reason) {
		case 'Game Won':
			alert("You've saved Earth! Click the button to 'Fight Again'");
			break;
		case 'Ran Away':
			alert("You Ran! Earth is lost T_T Click the button to 'Fight Again'");
			break;
		case 'Game Over':
			alert("You're dead! Click the button to 'Fight Again'")
	}
}

//------------------------------------------------------------------------------------

// Running the game after the user indicates readiness
window.addEventListener('load', (e) => {
	document.getElementById('start-button').addEventListener('click', (btnClick) =>{
		if (confirm("Ready to fight for the fate of Earth?")){
			setUpGame(6);
			startGame(6);
			gameInProgress = true;
			document.getElementById('start-button').innerHTML = "Fight Again"
			// playGame();
		}
	});

});