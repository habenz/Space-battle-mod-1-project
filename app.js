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

function setUpGame(numAliens) {
	// stats according to spec
	playerShip = new Spaceship('USS Schwarzenegger', 20, 5,.7);
	activeAliens = [];
	for(let i = 0; i < numAliens; i++){
		let alienShip = new AlienShip(`Alien Ship ${i+1}`);
		activeAliens.push(alienShip);
	}
}

function playRound(attackingShip, defendingShip){
	attackingShip.attack(defendingShip);
	console.log(`You attacked ${defendingShip.name}`);

	if (defendingShip.hull > 0) {
		defendingShip.attack(attackingShip);
		console.log(`${defendingShip.name} attacked you back!`);
	}
}

// Main game play
function playGame(){
	while (activeAliens.length > 0) {
		const currBattlingAlien = activeAliens.pop();
		while (currBattlingAlien.hull > 0 && playerShip.hull > 0) {
			playRound(playerShip,currBattlingAlien);
			displayHealth(playerShip, currBattlingAlien);
		}

		if (playerShip.hull <= 0) {
			console.log("GAME LOST");
			return false;
		} else { // alien ship must have been destroyed
			console.log(`${currBattlingAlien.name} has been destroyed!`);
			let keepGoing = confirm(`Your hull is at ${playerShip.hull} health. Keep going?`);
			if (!keepGoing){
				console.log('You ran!');
				return false;
			}
		}
	}

	console.log("GAME WON!")
	console.log(playerShip);
	return true;
}

//------------------------------------------------------------------------------------
function displayHealth(player, alien) {
	let healthStatus;
	if (player.hull > 10) {
		healthStatus = "green";
	} else if (player.hull > 5) {
		healthStatus = "orange";
	} else {
		healthStatus = "red";
	}

	let healthStr = `%c Player hull: %c ${player.hull} %c Alien hull: %c ${alien.hull}`;
	let healthStyles = ["font-style: italic; color:brown" , // "Player hull"
						`color: ${healthStatus}`, // player hull value
						"font-style: italic; color:brown", // "Alien hull"
						"color: grey"] // alien hull value
	console.log(healthStr, ...healthStyles);
}
//------------------------------------------------------------------------------------

// Running the game after the user indicates readiness
window.addEventListener('load', (e) => {
	document.getElementById('start-button').addEventListener('click', (btnClick) =>{
		if (confirm("Ready to fight for the fate of Earth?")){
			setUpGame(6);
			playGame();
		}
	});

});