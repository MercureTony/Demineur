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
	while (plantedMines != nbMines) {
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
 * Checks neighbours for mines
 *
 * @param {int} x x-coordinates for examined tile
 * @param {int} y y-coordinates for examined tile
 * @param {array} field Minefield to test
 * @return {int} number of mines next to
 */
var checkTile = function (x, y, field) {
	var num = 0;
	for (var i = y - 1; i <= y + 1; i++) {
		if (i < 0) continue;
		if (i >= field.length) break;

		for (var j = x - 1; j <= x + 1; j++) {
			if (j < 0) continue;
			if (j >= field[0].length) break;
			if (field[i][j]) num++;
		}
	}
	return num;
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
	var mineField = placerMines(largeur, hauteur, nbMines, click.x, click.y);

	// Show clicked tile
	afficherImage(
		click.x * tileSize, click.y * tileSize,
		colormap, checkTile(click.x, click.y, mineField)
	);
	mineField[click.y][click.x] = null; // Clicked

	// Tile died on - keeps tile red (set to good tile; no effect)
	var deadTile = [-1, -1];

	// Loop for clicking on tile, until all non-mines are shown
	while (goodTiles > 0) {
		click = attendreClic();

		if (mineField[click.y][click.x]) {
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
				if (y < 0) continue;
				if (y >= mineField.length) break;

				for (var x = click.x - 1; x <= click.x + 1; x++) {
					if (x < 0) continue;
					if (x >= mineField[0].length) break;

					if (!mineField[y][x] && mineField[y][x] !== null) {
						afficherImage(
							x * tileSize, y * tileSize,
							colormap, checkTile(x, y, mineField)
						);
						mineField[y][x] = null;
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

			if (mineField[my][mx] && !killed) {
				afficherImage(mx * tileSize, my * tileSize, colormap, 9);
			}
		}
	}

	// Check if win/loss - impossible to have neg number if lost
	if (deadTile[0] + deadTile[1] == -2) alert("Victoire");
	else alert("Échec");
};

// testDemineur






