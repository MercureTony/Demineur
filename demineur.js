load("image.js"); 

var afficherImage = function(x,y,colormap,image)
{
    setScreenMode(16, 16); // On defini la taille de l'image
    
    var selection = images[image]; // On choisit l'image qu'on veut afficher
    
    for(var i = 0 ; i< 16 ; i++) // La hauteur de notre tableau
    {
        for(var j = 0 ; j< 16 ; j++) // La largeur de notre tableau 
        {
           	var couleur = selection[i][j]; // On selectionne l'élèment 
            
            if (i == x && j == y)
            {
            setPixel(x , y , colormap[couleur]); //Afficher l'élément à la position (x,y)
            }
        }
    }
    
    //return selection.length ;
};

afficherImage(7,14,colormap , 4);
