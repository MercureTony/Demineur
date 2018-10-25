//@Etienne Beaulé
//@Anthony Uyende

load("image.js"); 


// Fonction afficherImage

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
