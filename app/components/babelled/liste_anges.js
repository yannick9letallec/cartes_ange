"use strict";

module.exports = {
  liste_anges: {
    props: ['cartes', 'type', 'mode'],
    data: function data() {
      return {
        activeClass: '',
        afficher_carte: false,
        carte_nom: '',
        carte: {},
        cartes_marquees: [],
        rejouer: false
      };
    },
    template: "<section class='liste_anges'> \n\t\t\t\t<div style=\"width: 100%\"> TEST NOM </div>\n\t\t\t\t<img v-for='carte in cartes' \n\t\t\t\t\tclass='carte_ange clickable'\n\t\t\t\t\t:alt=\"'carte unique repr\xE9sentative d un Ange et de son message ' + carte \" \n\t\t\t\t\t:src=\"choixCarte( carte )\" \n\t\t\t\t\t:data-carte='carte'\n\t\t\t\t\t@mouseenter='afficherTitreCarte'\n\t\t\t\t\t@click='afficherCarte( carte )'> \n\t\t\t\t</span> \n\t\t\t\t<carte v-if='afficher_carte'\n\t\t\t\t\t@close_div='reinitialiserAffichage' \n\t\t\t\t\t:carte_nom='carte_nom' \n\t\t\t\t\t:carte='carte'> \n\t\t\t\t</carte> \n\t\t\t\t<div id='rejouer' class='clickable' v-if='rejouer' @click='tirageAleatoire'> \n\t\t\t\t\tTirer \xE0 Nouveau ! \n\t\t\t\t</div> \n\t\t\t</section>",
    methods: {
      afficherTitreCarte: function afficherTitreCarte() {},
      choixCarte: function choixCarte(carte) {
        if (this.mode != 'manuel') {
          return '/app/img/cartes/PNG/' + carte + '.png';
        } else {
          return '/app/img/back.png';
        }
      },
      afficherCarte: function afficherCarte(carte, timeout) {
        console.log("++++ : " + carte + " " + timeout);
        var that = this;
        setTimeout(function () {
          that.afficher_carte = true;
          that.carte_nom = carte;
          services('POST', 'obtenirCarte', {
            carte: carte
          }).then(function (value) {
            console.dir(value.data);
            that.carte = value.data;
          }).catch(function (err) {
            console.log("OBTENIR CARTE ERROR : " + err);
          });
        }, timeout ? timeout : 0);
      },
      reinitialiserAffichage: function reinitialiserAffichage() {
        this.afficher_carte = false;
        var el = document.getElementsByClassName('liste_anges')[0].children;
        console.log("REINITIALISER ( length ) : " + this.cartes_marquees.length);
        this.cartes_marquees.forEach(function (val) {
          console.log("REINITIALISER : " + val);
          el[val].style.backgroundColor = 'initial';
        });
        this.rejouer = true;
      },
      allouerClasse: function allouerClasse() {
        console.log("ALLO");
      },
      tirageManuel: function tirageManuel() {},
      tirageAleatoire: function tirageAleatoire() {
        var i = 0,
            nb_flash = 2,
            liste_elements = this.cartes.length,
            el = document.getElementsByClassName('liste_anges')[0].children,
            valeur_aleatoire,
            prev_index;

        for (i; i <= nb_flash; i++) {
          if (i > 0) {
            prev_index = valeur_aleatoire;

            (function (i, prev_index, that) {
              setTimeout(function () {
                el[prev_index].style.backgroundColor = 'red';
              }, 1000 * i);
            })(i, prev_index, this);
          }

          valeur_aleatoire = Math.floor(Math.random() * liste_elements);
          this.cartes_marquees.push(valeur_aleatoire);

          (function (i, index, that) {
            setTimeout(function () {
              // mise en avant de la carte choisie
              el[index].style.backgroundColor = 'blue';

              if (i === nb_flash) {
                setTimeout(function () {
                  that.afficherCarte(el[index].dataset["carte"], 1000);
                });
              }
            }, 1000 * i);
          })(i, valeur_aleatoire, this);
        }
      }
    },
    mounted: function mounted() {
      console.log("CREATED : " + this.mode);
      this.activeClass = this.mode;

      if (this.mode === "aleatoire") {
        this.tirageAleatoire();
      }
    }
  }
};