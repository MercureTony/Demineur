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
	if (largeur * hauteur <= nbMines) return matrix;

	var plantedMines = 0;
	var xCoord = 0, yCoord = 0;
	var loop = 0; // Give maximum number of tries based on size
	while (plantedMines != nbMines && loop < largeur * hauteur) {
		// Create random coordinate
		xCoord = Math.floor(Math.random() * largeur);
		yCoord = Math.floor(Math.random() * hauteur);

		// Don't place mine on starting space or already occupied
		if (x != xCoord && y != yCoord && !matrix[yCoord][xCoord]) {
			matrix[yCoord][xCoord] = true;
			plantedMines++;
		} else loop++;
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
	setScreenMode(largeur * tileSize, hauteur * tileSize);
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

/*
 * Function for tests
 * Counts number of trues
 *
 * @param {array} matrix 2D matrix to count from
 * @return {int} number of true values
 */
var testCountTrue = function (matrix) {
	var count = 0;
	for (var y = 0; y < matrix.length; y++) {
		for (var x = 0; x < matrix[0].length; x++) {
			count += matrix[y][x]
		}
	}
	return count;
};

var testDemineur = function () {
	// Test mine not on specified cell
	var openingCoords = [2, 3];
	var size = [5, 7];
	var nbMines = 12;
	var mineField = placerMines(size[0], size[1], nbMines,
		openingCoords[0], openingCoords[1]);
	assert(!mineField[openingCoords[1]][openingCoords[0]]);

	// Test correct size of matrix
	assert(mineField.length == size[1]); // y
	assert(mineField[0].length == size[0]); // x

	// Count correct number of mines
	assert(testCountTrue(mineField) == nbMines);

	/* Check bad conditions */

	// Too many mines
	nbMines = size[0] * size[1];
	mineField = placerMines(size[0], size[1], nbMines,
		openingCoords[0], openingCoords[1]);
	assert(mineField.length == 0);

	// Starting coordinate is outside of field
	openingCoords = [size[0] + 1, size[1] + 1];
	nbMines = 12;
	mineField = placerMines(size[0], size[1], nbMines,
		openingCoords[0], openingCoords[1]);
	assert(testCountTrue(mineField) == nbMines);

	 
	// Comparaison between differents images
	for (var i = 0; i <= 11; i++) {
		// Choose a random number 
		var x = Math.floor(10*Math.random() + 1);
		var comparant = [Math.floor(10*Math.random() + 1),
			Math.floor(10*Math.random() + 1)];

		// Give hexadecimal value of the screen
		var test = exportScreen(afficherImage(
			comparant[0], comparant[1], colormap, i
		));

		// Check uniqueness to another image
		if (x != i) {
			assert(test != exportScreen(
				afficherImage(0, 0, colormap, x)
			));    
		}
	}
};
