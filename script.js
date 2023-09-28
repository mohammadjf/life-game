'use strict';
const cellSize = 10; //px

const detectSize = () => {

}

const testFiller = () => {
	const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
	const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
	const width = viewportWidth / cellSize;
	const height = viewportHeight / cellSize;
	const array = [];
	const playground = document.getElementById('playground');
	console.log({
		width,
		height,
	});
	for (let j = 0; j < height; j++) {
		for (let i = 0; i < width; i++) {
			const cell = document.createElement('div');
			cell.classList.add('cell');
			playground.appendChild(cell);
		}
	}
}

window.addEventListener('resize', () => {
	const newViewportWidth = window.innerWidth || document.documentElement.clientWidth;
	const newViewportHeight = window.innerHeight || document.documentElement.clientHeight;

	console.log(`New Viewport Width: ${newViewportWidth}`);
	console.log(`New Viewport Height: ${newViewportHeight}`);
});

testFiller();