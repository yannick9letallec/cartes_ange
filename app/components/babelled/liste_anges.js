"use strict";

module.exports = {
  liste_anges: {
    props: ['cartes', 'type', 'mode'],
    data: function data() {
      return {
        afficher_carte: false,
        nouveau_tirage: true,
        carte_nom: '',
        carte: {},
        cartes_marquees: [],
        clickableClass: true,
        afficher_noneClass: true,
        default_carteClass: true
      };
    },
    template: "<section class='liste_anges'> \n\t\t\t\t<img v-for='carte in cartes' \n\t\t\t\t\t:class='{carte_ange: default_carteClass, clickable: clickableClass }'\n\t\t\t\t\t:alt=\"'carte unique repr\xE9sentative d un Ange et de son message ' + carte \" \n\t\t\t\t\t:src=\"cheminCarteImage( carte )\" \n\t\t\t\t\t:data-carte='carte'\n\t\t\t\t\t@mouseenter='afficherTitreCarte'\n\t\t\t\t\t@click='afficherCarte( carte )'> \n\t\t\t\t</span> \n\t\t\t\t<carte v-if='afficher_carte'\n\t\t\t\t\t@close_div='finaliserTirageAleatoire'\n\t\t\t\t\t:carte_nom='carte_nom' \n\t\t\t\t\t:carte='carte'> \n\t\t\t\t</carte> \n\t\t\t\t<div :class='{ nouveau_tirage: nouveau_tirage,  afficher_none: afficher_noneClass }'>\n\t\t\t\t\t<div class='clickable' \n\t\t\t\t\t\t@click='tirageAleatoire'>\n\t\t\t\t\t\tNOUVEAU TIRAGE ?\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\n\t\t\t</section>",
    methods: {
      finaliserTirageAleatoire: function finaliserTirageAleatoire() {
        this.afficher_carte = false;
        this.afficher_noneClass = true;
        this.nouveau_tirage = true;

        if (this.mode === 'aleatoire') {
          this.afficher_noneClass = true;
          this.shuffle();
        }
      },
      afficherTitreCarte: function afficherTitreCarte() {},
      cheminCarteImage: function cheminCarteImage(carte) {
        if (this.mode != 'manuel') {
          return '/app/img/cartes/PNG/' + carte + '.png';
        } else {
          return '/app/img/back.png';
        }
      },
      afficherCarte: function afficherCarte(carte, timeout) {
        if (this.mode === 'aleatoire' && event) return undefined;
        var that = this;
        setTimeout(function () {
          that.afficher_carte = true;
          that.carte_nom = carte;
          services('POST', 'obtenirCarte', {
            carte: carte
          }).then(function (value) {
            that.carte = value.data;
            console.dir(value.data);
            that.reinitialiserAffichage();
          }).catch(function (err) {
            console.log("OBTENIR CARTE ERROR : " + err);
          });
        }, timeout ? timeout : 0);
        if (this.mode === 'manuel') that.shuffle();
      },
      reinitialiserAffichage: function reinitialiserAffichage() {
        var el = document.getElementsByClassName('liste_anges')[0].children;
        console.log("REINITIALISER ( length ) : " + this.cartes_marquees.length);
        this.cartes_marquees.forEach(function (val) {
          console.log("REINITIALISER : " + val);
          el[val].style.transform = 'scale( 1 )';
          el[val].style.border = 'initial';
          el[val].style.outline = 'initial';
          el[val].style.zIndex = 'initial';
          el[val].style.borderRadius = 'initial';
        });
      },
      tirageAleatoire: function tirageAleatoire() {
        // on masque le div d'invitation au tirage
        this.nouveau_tirage = false;
        this.cartes_marquees.length = 0;
        var i = 0,
            nb_flash = 1,
            liste_elements = this.cartes.length,
            el = document.getElementsByClassName('liste_anges')[0].children,
            valeur_aleatoire,
            prev_index;

        for (i; i <= nb_flash; i++) {
          // reset style update
          if (i > 0) {
            prev_index = valeur_aleatoire;

            (function (i, prev_index, that) {
              setTimeout(function () {
                el[prev_index].style.transform = 'scale( 1 )';
                el[prev_index].style.border = 'initial';
                el[prev_index].style.outline = 'initial';
                el[prev_index].style.zIndex = 'initial';
                el[prev_index].style.borderRadius = 'initial';
              }, 1000 * i);
            })(i, prev_index, this);
          }

          valeur_aleatoire = Math.floor(Math.random() * liste_elements);
          this.cartes_marquees.push(valeur_aleatoire) // mise en avant de la carte choisie
          ;

          (function (i, index, that) {
            setTimeout(function () {
              el[index].style.transform = 'scale( 1.5 )';
              el[index].style.border = '8px solid #258';
              el[index].style.borderRadius = '45px';
              el[index].style.zIndex = '999';

              if (i === nb_flash) {
                setTimeout(function () {
                  that.afficherCarte(el[index].dataset["carte"], 1000);
                });
              }
            }, 1000 * i);
          })(i, valeur_aleatoire, this);
        }
      },
      shuffle: function shuffle() {
        console.log("CARTES");
        console.dir(this.cartes);
        var L = this.cartes.length,
            Rand = Math.floor(Math.random() * L);
        TmpArray = Array(L), target = this.cartes, tranche_1 = [], tranche_2 = [];
        target.forEach(function (e, i, a) {
          if (i + Rand >= L) {
            TmpArray[i + Rand - L] = e;
          } else {
            TmpArray[i + Rand] = e;
          }
        });
        tranche_1 = TmpArray.slice(0, Rand).reverse();
        tranche_2 = TmpArray.slice(Rand).reverse();
        /*
        console.log( "UPDATED" )
        if( this.mode === 'aleatoire' ) this.shuffle()
        */

        return this.cartes = tranche_2.concat(tranche_1);
      }
    },
    beforeUpdate: function beforeUpdate() {
      console.log("BEFORE UPDATE");
      console.log(this.mode);

      if (this.mode === 'manuel' || this.mode === 'explorer') {
        this.nouveau_tirage = false;
        this.clickableClass = true;
      } else {
        this.clickableClass = false;
      }
    },
    updated: function updated() {
      // hook messing around to get dom access for var target ...
      if (this.mode === 'aleatoire' && this.nouveau_tirage) {
        // afficher la rpoposition de rejouer à nouveau
        var src = document.getElementsByClassName('liste_anges')[0],
            _target,
            target_H;

        src_H = src.getClientRects()[0].height;
        src_W = src.getClientRects()[0].width;
        _target = document.getElementsByClassName('nouveau_tirage')[0];
        target_H = _target.getClientRects()[0].height;
        _target.style.top = (src_H - target_H) / 2 + "px";
      }
    },
    created: function created() {
      console.log("CREATED");
    },
    mounted: function mounted() {
      console.log("MOUNTED : " + this.mode);

      if (this.mode === "aleatoire") {
        this.clickableClass = false;
        this.shuffle();
        this.tirageAleatoire();
      }

      if (this.mode === 'manuel') this.shuffle();
    }
  }
};