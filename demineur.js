//@Etienne Beaulé
//@Anthony Uyende

load("image.js"); 


// Fonction afficherImage

var afficherImage = function(x,y,colormap,image)
{
    setScreenMode(16, 16); // On defini la taille de l'image
    
    var selection = images[image]; // On choisit l'image qu'on veut afficher
    
    for(var i = 0 ; i< 16 ; i++) // La hauteur de notre tableau
    {
        for(var j = 0 ; j< 16 ; j++) // La largeur de notre tableau 
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
