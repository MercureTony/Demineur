/**
 * Minesweeper for CodeBoot
 *
 * @author Etienne Beaulé
 * @author Anthony Uyende
 * @date 5 November 2018
 */

load("image.js"); 

/*
 * Displays the specified image at the coordinates
 *
 * @param {int} x The x-coordinate for the image
 * @param {int} y The y-coordinate for the image
 * @param {array} colourmap Choice of colour for the image
 * @param {array} image The bitmap of pixels to display
 */
var afficherImage = function (x, y, colourmap, image) {
	var selection = images[image];
	var hauteur = selection.length;
	var largeur = selection[0].length;

	setScreenMode(hauteur, largeur);
	
	for (var i = 0; i < hauteur; i++) {
		for (var j = 0 ; j < largeur; j++) {
			var couleur = selection[j][i]; // On colorie la surface (i, j)

			if (j == x && i == y) setPixel(x, y, colourmap[couleur]);
		}
	}
};

// afficherImage(8, 6, colormap, 4);

// attendreClic









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

	// Handle exceptions
	if (largeur * hauteur >= nbMines) throw Error("Trop de mines");
	if (field[y][x] == undefined) throw Error("Coordonnées incorrectes");

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

// demineur








// testDemineur






