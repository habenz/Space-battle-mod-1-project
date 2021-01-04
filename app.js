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
		return attackingShip.accuracy > attackRoll;
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
	console.log('%c spacebattle ', 'font-size: 40px; text-decoration: underline overline; text-decoration-style: wavy; margin-top: 1rem; margin-bottom: .5rem;text-underline-position: under;');
}

function playRound(attackingShip, defendingShip){
	console.log(`${attackingShip.name} shot at ${defendingShip.name}`);
	displayShot();
	displayAttack(attackingShip, defendingShip.receiveAttack(attackingShip));

	if (defendingShip.hull > 0) {
		console.log(`${defendingShip.name} shot back at ${attackingShip.name}!`);
		displayShot();
		displayAttack(defendingShip, attackingShip.receiveAttack(defendingShip));
	}

	console.log("%c End Round", "color: lightgrey; font-style: italic; font-size: 75%");
}

// Main game play
function playGame(){
	while (activeAliens.length > 0) {
		const currBattlingAlien = activeAliens.pop();
		while (currBattlingAlien.hull > 0 && playerShip.hull > 0) {
			playRound(playerShip,currBattlingAlien);
			displayHealth(playerShip,currBattlingAlien);
		}

		if (playerShip.hull <= 0) {
			console.log("%c GAME LOST", 'font-size: 20px');
			displayEndOfTheWorld();
			return false;
		} else { // alien ship must have been destroyed
			console.log(`%c ${currBattlingAlien.name} has been destroyed!`, "border: 1px dashed red");
			let keepGoing = confirm(`Your hull is at ${playerShip.hull} health. Keep going?`);
			if (!keepGoing){
				console.log('%c You ran!', "font-size: 20px");
				displayEndOfTheWorld();
				return false;
			}
		}
	}

	console.log("%c GAME WON!", "font-size: 30px; color: orange; border: 2px dashed red;");
	console.log("%c You saved Earth!", "font-size: 35px; color: green; border: 2px dashed blue;");
	// console.log(playerShip);
	return true;
}

// -----------------Display Functions --------------------------------------------------------
function displayAttack(ship, attackSuccess) {
	if (attackSuccess) {
		console.log(`%c ${ship.name} hit for ${ship.firepower} damage!`, 
					"font-style: italic; background: azure; border: 1px solid grey;");
	} else {
		console.log(`${ship.name} missed!`)
	}
}

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

function displayShot() {
	console.log('%c.', 'font-size: 1px; padding: 15px 100%; background: url("https://i.imgur.com/b7Nr5eX.gif"); background-repeat: no-repeat; background-size: 30%; background-position: 0 45%;');
}

function displayEndOfTheWorld() {
	console.log('%c.', 'font-size: 1px; padding: 30% 100%; background: url("https://media1.giphy.com/media/h4UU5HbRX7R8pjHEpa/giphy.gif?cid=ecf05e47tgq3b226c3gao3koqo8vxqztf2oa9two0978dh06&rid=giphy.gif"); background-repeat: no-repeat; background-size: 50%;');
}
// ------------------------------------------------------------------------



// Running the game after the user indicates readiness
window.addEventListener('load', (e) => {
	document.getElementById('start-button').addEventListener('click', (btnClick) =>{
		if (confirm("Ready to fight for the fate of Earth?")){
			setUpGame(6);
			playGame();
		}
	});

});

