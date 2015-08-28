arithmepique.Carte = function() {
    this.joueurs = new arithmepique.Joueurs();    
    var scripts_scenes = arithmepique.scripts.scenes;
    var portes = arithmepique.scripts.portes;
    var nom_joueur = this.joueurs.obtientNomJoueurSession();
    var etoiles_recues = this.joueurs.obtientJoueur(nom_joueur).etoiles;
    
    this.totalNbEtoiles = this.joueurs.obtientTotalEtoilesJoueur(nom_joueur);
    
    var audio = new arithmepique.Audio();
    audio.jouerMusique("carte");
    audio.ajouteBouton();
    
    jQuery(".nb-etoiles-total").text(this.totalNbEtoiles);
    
    //Portes
    for(var scene_id in portes) {
        if(!portes.hasOwnProperty(scene_id)) continue;
        
        var porte = portes[scene_id];
        
        var marqueur_porte = jQuery("<div class='porte' id='porte-" + scene_id + "'></div>")
            .css({
                 top:  (porte.pos[1] * 32) + "px",
                 left: (porte.pos[0] * 32) + "px"
             })
            .appendTo("#carte");
    
        if(porte.nbEtoiles <= this.totalNbEtoiles) {
            marqueur_porte.addClass("ouverte");
        } else {
            marqueur_porte.append(sprintf("<div class='porte-etoiles'>%d</div>", porte.nbEtoiles - this.totalNbEtoiles));
        }
    }
    
    //Scènes
    for(var ii = 0; ii < scripts_scenes.length; ++ii) {
        var script = scripts_scenes[ii];
        
        var jeton = this.placerJeton(script);
        var info_joueur = this.joueurs.obtientJoueur(nom_joueur);
        
        if(ii <= info_joueur.indexSceneMax) {
            this.rendAccessible(script.id, jeton);
            
            var nb_etoiles = this.afficheEtoiles(script.id, script, jeton, etoiles_recues);
            
            if(0 === nb_etoiles) {
                //Les prochaines scènes ne sont pas accessible tant que celle-ci
                //n'a pas été complétée.
                est_accessible = false;
            }
        }
    }
};
arithmepique.Carte.prototype = {

    placerJeton: function(script) {
        var pos = script.posCarte.split(",");
        
        return jQuery("<div class='scene'>" +
                      "<div class='pos-id'>" + script.posCarte + "</div>" +
                      "<div class='jeton'></div>" +
                      "<div class='etoiles'><span></span><span></span><span></span></div>" +
                      "</div>").css({
                top:  (Number(pos[0]) * 32) + "px",
                left: (Number(pos[1]) * 32) + "px"
            }).appendTo("#carte");
    },
    
    
    rendAccessible: function(scene_id, jeton) {
        jeton.addClass("actif")
             .find(".jeton")
             .append("<a href='scene.html?scene=" + scene_id + "'></a>");
    },
    
    afficheEtoiles: function(scene_id, script, jeton, etoiles_recues) {
        var icones_etoiles = jeton.find(".etoiles span");
        
        if(script.chrono) {
            icones_etoiles.parent().addClass("trois-etoiles");
        } else {
            icones_etoiles.parent().addClass("deux-etoiles");
        }

        //charger les étoiles faites dans localStorage
        if(scene_id in etoiles_recues) {
            for(var ii = 0; ii < icones_etoiles.length && ii < etoiles_recues[scene_id]; ++ii) {
                icones_etoiles.eq(ii).addClass("gagnee");
            }
            
            return etoiles_recues[scene_id];
        }
        
        return 0;
    }
};

jQuery(function () {
    new arithmepique.Carte();
});