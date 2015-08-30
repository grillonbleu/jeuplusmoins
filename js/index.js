jQuery(function() {
    var confirmation_effacer = "Voulez-vous vraiment effacer la partie « %s »? Si c'est le cas, tapez OUI, en majuscules.";

    var gabarit_joueur = "<li>" +
            "<div class='joueur'>" +
                "<div class='nom'>%s</div>" +
                "<div class='scene'>%s</div>" + 
                "<div class='etoiles'>%d</div>" +
            "</div>" +
            "<div class='actions'>" +
                "<div class='jouer'><button class='btn-jouer'>Jouer</button></div>" +
                "<div class='supprimer'><button class='btn-effacer'>Effacer</button></div>" + 
            "</div>" +
            "</li>";

    var contenant_joueurs = jQuery("ul.joueurs");
    
    var audio = new arithmepique.Audio();
    audio.jouerMusique("presentation");
    audio.ajouteBouton();
    
    
    var joueurs = new arithmepique.Joueurs();
    
    var msgAucunJoueur = jQuery(".aucune-partie").hide();
    
    function affiche_joueur(nom_joueur, info_joueur) {
        var scene = arithmepique.scripts.scenes[info_joueur.indexSceneMax];
        
        var nb_etoiles = joueurs.obtientTotalEtoilesJoueur(nom_joueur);
        
        var marqueur_partie = jQuery(sprintf(gabarit_joueur, nom_joueur, scene.titre, nb_etoiles))
                .appendTo(contenant_joueurs)
                .find(".btn-jouer")
                .on("click", function() {
                    joueurs.debuteSessionJoueur(nom_joueur);
                    location.href = "carte.html";
                })
                .end()
                .find(".btn-effacer")
                .on("click", function() {
                    if("OUI" === window.prompt(sprintf(confirmation_effacer, nom_joueur))) {
                        joueurs.effacePartie(nom_joueur);
                        marqueur_partie.remove();
                        if(jQuery(".joueurs li").length === 0) {
                            msgAucunJoueur.show();
                        }
                    }                    
                })
                .end();
    }
    
    var info_joueurs = joueurs.obtientJoueurs();
    for(var nom_joueur in info_joueurs) {
        if(!info_joueurs.hasOwnProperty(nom_joueur)) continue;
        var info_joueur = info_joueurs[nom_joueur];
        affiche_joueur(nom_joueur, info_joueur);
    }
    
    if(jQuery(".joueurs li").length === 0) {
        msgAucunJoueur.show();
    } else {
        msgAucunJoueur.hide();
    }
    
    jQuery("button#bouton-nouveau-joueur").on("click", function() {
        var nom_joueur = jQuery("input#nom-nouveau-joueur").val();
        if(joueurs.creeJoueur(nom_joueur)) {
            var info_joueur = joueurs.obtientJoueur(nom_joueur);
            affiche_joueur(nom_joueur, info_joueur);
            msgAucunJoueur.hide();
        }
    });



    var details_generique = jQuery(".generique .details").hide();
    jQuery(".generique .ouvrir").on('click', function(e) {
        e.preventDefault();
        
        var hauteur_vue = jQuery(window).height();
        
        $.Zebra_Dialog(details_generique.html(), {
            width: 800,
            max_height: hauteur_vue > 700 ? 550 : hauteur_vue - 150,
            buttons: ["Fermer"]
        });
    });
    
    
    
    //Navigateur OK?
    var details_fonctionalites_manquantes = jQuery("#fonctionnalite-manquante");
    if(!Modernizr.localstorage ||
       !Modernizr.sessionstorage ||
       !Modernizr.cssanimations ||
       !Modernizr.audio) {
   
        var hauteur_vue = jQuery(window).height();
        
        $.Zebra_Dialog(details_fonctionalites_manquantes.html(), {
            width: 800,
            max_height: hauteur_vue > 700 ? 550 : hauteur_vue - 150,
            buttons: ["Fermer"],
            type: "error"
        });
    }
});