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

	receiveAttack(attackingShip) {
		// maybe it's not appropriate to throw for this
		if (attackingShip.hull <= 0){
			throw "Zombie Ship! Ships without health cannot attack";
		}
		const attackRoll = Math.random(); // maybe rename this
		if (attackingShip.accuracy > attackRoll) {
			this.hull -= attackingShip.firepower;
		}
		// is it useful to return anything?
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

// setup function:
	// player ship, list of alien ships 
function setUpGame(numAliens) {
	// stats according to spec
	playerShip = new Spaceship('USS Schwarzenegger', 20, 5,.7);
	activeAliens = [];
	for(let i = 0; i < numAliens; i++){
		let alienShip = new AlienShip(`Alien Ship ${i+1}`);
		activeAliens.push(alienShip);
	}
}

let playerShip;
let activeAliens;

// testing code
setUpGame(6)

console.log(playerShip);
console.log(activeAliens[0]);

activeAliens[0].receiveAttack(playerShip);
playerShip.receiveAttack(activeAliens[0]);

console.log(playerShip);
console.log(activeAliens[0]);