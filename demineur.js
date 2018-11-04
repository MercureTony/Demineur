/**
 * Minesweeper for CodeBoot
 *
 * @author Etienne Beaulé
 * @author Anthony Uyende
 * @date 5 November 2018
 */

load("images.js"); 

var tileSize = 16; // Size of component square tiles

/*
 * Displays the specified image at the coordinates
 *
 * @param {int} x The starting x-coordinate for the image
 * @param {int} y The starting y-coordinate for the image
 * @param {array} colourmap Choice of colour for the image
 * @param {int} image The index for the image to display
 */
var afficherImage = function (x, y, colormap, image) {
	// Fetch bitmap of image
	var selection = images[image];
	
	// Get size of bitmap
	var hauteur = selection.length;
	var largeur = selection[0].length;
	
	// Colourize area from specified colours in bitmap mapped to colourmap
	for (var i = 0; i < hauteur; i++) {
		for (var j = 0 ; j < largeur; j++) {
			var couleur = selection[i][j];
			setPixel(j + x, i + y, colormap[couleur]);
		}
	}
};

/*
 * Detect when the mouse is press-up
 *
 * @return {Dict} Coordinates of pressed tile
 */
var attendreClic = function() {
	while (!getMouse().down) {
		pause(0.01); // Pause to avoid excessive checking
	}

	// Divide by tile size to get specific tile
	return {
		x: Math.floor(getMouse().x / tileSize),
		y: Math.floor(getMouse().y / tileSize)
	};
};

/*
 * Initialize mines
 * Create 2D matrix with randomly placed "mines"
 *
 * @param {int} largeur The y-length of the matrix
 * @param {int} hauteur The x-length of the matrix
 * @param {int} nbMines The number of "mines" to place
 * @param {int} x illegal x-coordinate to place mine
 * @param {int} y illegal y-coordinate to place mine
 * @return {array} 2D boolean matrix with nbMines "true"s
 */
var placerMines = function (largeur, hauteur, nbMines, x, y) {
	// Create "false" 2D matrix
	var matrix = [];
	var row = [];
	for (var c = 0; c < largeur; c++) row.push(false); // Create false columns
	for (var r = 0; r < hauteur; r++) matrix.push(row.slice()); // Form rows

	// Throw returns if it gets invalid parameters
	if (largeur * hauteur <= nbMines) return;
	if (typeof matrix[y][x] == 'undefined') return;

	var plantedMines = 0;
	var xCoord = 0, yCoord = 0;
	while (plantedMines < nbMines) {
		// Create random coordinate
		xCoord = Math.floor(Math.random() * largeur);
		yCoord = Math.floor(Math.random() * hauteur);

		// Don't place mine on starting space
		if (x == xCoord && y == yCoord) continue;

		matrix[yCoord][xCoord] = true;
		plantedMines++;
	}
	return matrix;
};

/*
 * Convert mine field to an integer field
 * Allows for easier calculations when clicking on a tile
 *
 * Required due to asinine specifications requiring boolean matrix
 *
 * @param {array} 2D boolean matrix with mines = true
 * @return {array} 2D integer matrix where ints equivalent to index of image
 *                 to show once revealed
 */
var numeriserChamp = function (mineField) {
	var intField = mineField.slice(); // Initialize new matrix of same size

	// First pass; map true booleans to Infinity - should use forEach/map
	for (var y = 0; y < mineField.length; y++) {
		for (var x = 0; x < mineField[0].length; x++ ) {
			// Prevent changes to mines by setting to Infinity
			if (mineField[y][x]) intField[y][x] = Infinity;
			else intField[y][x] = 0;
		}
	}

	// Second pass; increment neighbouring cells of mine(s)
	for (var y2 = 0; y2 < intField.length; y2++) {
		for (var x2 = 0; x2 < intField[0].length; x2++) {

			if (intField[y2][x2] == Infinity) { // Mine
				// Increment neighbours (3x3 matrix or corners) by 1
				for (var my = y2 - 1;
					0 <= my && my <= y2 + 1 && my < mineField.length;
					my++) {
					for (var mx = x2 - 1;
						0 <= mx && mx <= x2 + 1 && mx < mineField[0].length;
						mx++) {
						intField[my][mx]++;
					}
				}
			}
		}
	}

	// Mines can remain Infinity - special handling
	return intField;
};

/*
 * Run Minesweeper
 * Main function
 *
 * @param {int} largeur The width of the game grid
 * @param {int} hauteur The heigt of the game grid
 * @param {int} nbMines The number of mines to include
 */
var demineur = function (largeur, hauteur, nbMines) {
	// Initialize grid
	setScreenMode(hauteur * tileSize, largeur * tileSize);
	var goodTiles = largeur * hauteur - nbMines - 1;
	
	// Tile-by-tile (so leaps by tile size)
	for (var i = 0; i < hauteur * tileSize; i += tileSize) {
		for (var j = 0; j < largeur * tileSize; j += tileSize) {
			// Set hidden tile - Hidden: 11
			afficherImage(j, i, colormap, 11);
		}
	}
	
	// Wait for first click to initialize mines
	var click = attendreClic();
	var mineField = numeriserChamp(
		placerMines(largeur, hauteur, nbMines, click.x, click.y)
	);

	// Show clicked tile
	afficherImage(
		click.x * tileSize, click.y * tileSize,
		colormap, mineField[click.y][click.x]
	);
	mineField[click.y][click.x] = -1; // Clicked

	// Tile died on - keeps tile red (set to good tile; no effect)
	var deadTile = [click.x, click.y];

	// Loop for clicking on tile, until all non-mines are shown
	while (goodTiles > 0) {
		click = attendreClic();

		if (mineField[click.x][click.y] == Infinity) {
			// Tile with mine - Lose game
			afficherImage(
				click.x * tileSize, click.y * tileSize,
				colormap, 10
			);

			deadTile = [click.x, click.y];
			break;
		} else {
			// Show adjacent tiles (if not mines)
			for (var y = click.y - 1; y <= click.y + 1; y++) {
				for (var x = click.x - 1; x <= click.x + 1; x++) {
					if (mineField[y][x] != Infinity && mineField[y][x] != -1) {
						afficherImage(
							x * tileSize, y * tileSize,
							colormap, mineField[y][x]
						);
						mineField[y][x] = -1;
						goodTiles--;
					}
				}
			}
		}
	}

	// If killed on examined tile
	var killed = false;

	// Show mines
	for (var my = 0; my < mineField.length; my++) {
		for (var mx = 0; mx < mineField[0].length; mx++) {
			killed = deadTile[0] == mx && deadTile[1] == my;

			if (mineField[my][mx] == Infinity && !killed) {
				afficherImage(mx * tileSize, my * tileSize, colormap, 9);
			}
		}
	}
};

// testDemineur






