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
	var point = {x: null, y: null};

	while (!getMouse().down) {
		// Divide by tile size to get specific tile
		point.x = Math.floor(getMouse().x / tileSize);
		point.y = Math.floor(getMouse().y / tileSize);

		pause(0.01); // Pause to avoid excessive checking
	}
	return point;
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
	var field = [];
	var row = [];
	for (var c = 0; c < largeur; c++) row.push(false); // Create columns of false
	for (var r = 0; r < hauteur; r++) field.push(row); // Form rows from columns

	// Throw exceptions if it gets invalid parameters
	if (largeur * hauteur <= nbMines) throw Error("Trop de mines");
	if (typeof field[y][x] == 'undefined') throw Error("Coordonnées incorrectes");

	var plantedMines = 0;
	while (plantedMines != nbMines) {
		// Create random coordinate
		var xCoord = Math.floor(Math.random() * largeur);
		var yCoord = Math.floor(Math.random() * hauteur);

		// Don't place mine on starting space
		if (x == xCoord && y == yCoord) continue;

		field[yCoord][xCoord] = true;
		plantedMines++;
	}
	return field;
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
	
	// Tile-by-tile (so leaps by tile size)
	for (var y = 0; y < hauteur * tileSize; y += tileSize) {
		for (var x = 0; x < largeur * tileSize; x += tileSize) {
			// Set hidden tile - Hidden: 11
			afficherImage(x, y, colormap, 11);
		}
	}
	
	// Wait for first click to initialize mines
	
	// Loop for clicking on tile
};

// testDemineur






