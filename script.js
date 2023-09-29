'use strict';
const cellSize = 10; //px
const array = [];

const getBoardSize = () => {
	const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	const width = Math.floor(viewportWidth / cellSize);
	const height = Math.floor(viewportHeight / cellSize);
	return [width, height];
}

const countPeopleAround = (i, j) => {
	let peopleAround = 0;
	for (let y = -1; y <= 1; y++) {
		for (let x = -1; x <= 1; x++) {
			if (j + y < 0 ||
				i + x < 0 ||
				j + y + 1 > array.length ||
				i + x + 1 > array[j + y].length ||
				(x == 0 && y == 0))
				continue;
			if (array[j + y][i + x].isAlive) {
				peopleAround++;
			}
		}
	}
	return peopleAround;
}

const lifeHandler = () => {
	array.forEach((row, j) => {
		row.forEach((cell, i) => {
			const peopleAroundCount = countPeopleAround(i, j);
			if (cell.isAlive && (peopleAroundCount == 3 || peopleAroundCount == 2)) {
				cell.gonnaLive = true;
				return;
			}
			if (!cell.isAlive && peopleAroundCount == 3) {
				cell.gonnaLive = true;
				return;
			}

			cell.gonnaLive = false;
		});
	});

	array.forEach((row) => {
		row.forEach((cell) => {
			if (cell.gonnaLive) {
				cell.isAlive = true;
				return;
			}

			cell.isAlive = false;
		});
	});
}

const syncView = () => {
	array.forEach((row) => {
		row.forEach((cell) => {
			if (cell.isAlive) {
				cell.cellDom.classList.add('alive');
				cell.cellDom.classList.remove('dead');
				return;
			}
			cell.cellDom.classList.add('dead');
			cell.cellDom.classList.remove('alive');
		});
	});
}


const initializer = () => {
	const playground = document.getElementById('playground');
	const [width, height] = getBoardSize();
	for (let j = 0; j < height; j++) {
		const row = [];
		for (let i = 0; i < width; i++) {
			const cellDom = document.createElement('div');
			const isAlive = (Math.floor(Math.random() * 10) + 1) > 9;
			row.push({ cellDom, isAlive });
			cellDom.classList.add('cell', isAlive ? 'alive' : 'dead');
			playground.appendChild(cellDom);
		}
		array.push(row);
	}
	play();
}

let intervallId;
const play = () => {
	intervallId = setInterval(gameHandler, 100);
}

const pause = () => {
	clearInterval(intervallId);
	intervallId = null;
}

const playPauseToggle = () => {
	if (intervallId) {
		pause()
		return;
	}

	play();
}

const gameHandler = () => {
	lifeHandler();
	syncView();
}

// event handlers
document.addEventListener('DOMContentLoaded', () => {
	initializer();

	window.addEventListener('resize', () => {
		const newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
		const newViewportHeight = window.innerHeight || document.documentElement.clientHeight;
	});

	const playButton = document.getElementById('play-pause');
	playButton.addEventListener('click', playPauseToggle);
	let isMouseDown;
	document.addEventListener('mousedown', (e) => {
		e.preventDefault();
		isMouseDown = true;
	});
	document.addEventListener('mouseup', () => isMouseDown = false);
	const cells = document.querySelectorAll('.cell');
	cells.forEach((cell) => {
		cell.addEventListener('mouseenter', function () {
			if (!isMouseDown) return;
			const i = +cell.getAttribute('data-i');
			const j = +cell.getAttribute('data-j');
			for (let y = -1; y <= 1; y++) {
				for (let x = -1; x <= 1; x++) {
					if (j + y < 0 ||
						i + x < 0 ||
						j + y + 1 > array.length ||
						i + x + 1 > array[j + y].length) { continue; }
					giveLife(i + x, j + y)
				}
			}
		});
	})
});
