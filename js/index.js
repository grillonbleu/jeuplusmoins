jQuery(function() {
    var gabarit_joueur = "<li><div class='nom'>%s</div><div class='etoiles'>%d</div><div class='scene'>%s</div><div class='ctrl'><button type='button' class='btn-effacer'>Effacer</button></div></li>";
    var contenant_joueurs = jQuery("ul.joueurs");
    
    var audio = new arithmepique.Audio();
    audio.jouerMusique("presentation");
    
    var joueurs = new arithmepique.Joueurs();
    
    function affiche_joueur(nom_joueur, info_joueur) {
        var scene = arithmepique.scripts.scenes[info_joueur.indexSceneMax];
        
        var nb_etoiles = joueurs.obtientTotalEtoilesJoueur(nom_joueur);
        
        var marqueur_partie = jQuery(sprintf(gabarit_joueur, nom_joueur, nb_etoiles, scene.id))
                .appendTo(contenant_joueurs)
                .find(".nom")
                .on("click", function() {
                    joueurs.debuteSessionJoueur(nom_joueur);
                    location.href = "carte.html";
                })
                .end()
                .find(".btn-effacer")
                .on("click", function() {
                    joueurs.effacePartie(nom_joueur);
                    marqueur_partie.remove();
                })
                .end();
    }
    
    var info_joueurs = joueurs.obtientJoueurs();
    for(var nom_joueur in info_joueurs) {
        if(!info_joueurs.hasOwnProperty(nom_joueur)) continue;
        var info_joueur = info_joueurs[nom_joueur];
        affiche_joueur(nom_joueur, info_joueur);
    }
    
    jQuery("button#bouton-nouveau-joueur").on("click", function() {
        var nom_joueur = jQuery("input#nom-nouveau-joueur").val();
        if(joueurs.creeJoueur(nom_joueur)) {
            var info_joueur = joueurs.obtientJoueur(nom_joueur);
            affiche_joueur(nom_joueur, info_joueur);
        }
    });

});