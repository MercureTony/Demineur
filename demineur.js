//@Etienne Beaulé
//@Anthony Uyende

load("image.js"); 

// afficherImage

var afficherImage = function(x,y,colormap,image)
{
    var selection = images[image]; // On choisit l'image qu'on veut afficher
    var hauteur = selection.length ; // Hauteur du tableau images
    var largeur = selection[0].length ; // Largeur du tableau images ** j'ai pris 0 comme index
    
    setScreenMode(hauteur, largeur); // On defini la taille de l'image
    
    for(var i = 0 ; i<hauteur; i++) // La hauteur de notre tableau
    {
        for(var j = 0 ; j<largeur; j++) // La largeur de notre tableau 
        {
           	var couleur = selection[j][i]; // On colorie la surface ixj
           
            if (i == x && j == y)//si on atteinnt le coordonné (x,y)
            {
            setPixel(x , y , colormap[couleur]); //on l'affiche
            }
        }
    }
};
afficherImage(8,6,colormap , 4);

// attendreClic









// placerMines

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
		var xCoord = Math.floor(Math.random() * largeur);
		var yCoord = Math.floor(Math.random() * hauteur);

		if (x == xCoord && y == yCoord) continue;

		field[yCoord][xCoord] = true;
		plantedMines++;
	}
	return field;
};

// demineur








// testDemineur






