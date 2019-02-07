"use strict";

module.exports = {
  index: {
    props: ['cartouches'],
    template: "<div>\n\t\t\t\t<div class='index'>\n\t\t\t\t\tTirez Votre Ange !\n\t\t\t\t\t<div class='boutons_tirage'>\n\t\t\t\t\t\t<button class='tirage_manuel' @click=\"emit( 'tirer_ange_manuel' )\"> Manuel ! </button>\n\t\t\t\t\t\t<button class='tirage_manuel' @click=\"emit( 'tirer_ange_aleatoire' )\"> Al\xE9atoire ! </button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<index_cartouches v-for='cartouche, index in cartouches' :key='index' :cartouche='cartouche'></index_cartouches>\n\t\t\t\t</div>\n\t\t\t</div>",
    mounted: function mounted() {
      console.log("CARTOUCHES : " + this.cartouches);
    }
  },
  index_cartouches: {
    props: ['cartouche'],
    template: "<div class='cartouche' >\n\t\t\t\t{{ cartouche.text }}\n\t\t\t</div>"
  },
  confirmer_compte: {
    data: function data() {
      return {
        pseudo: ''
      };
    },
    template: "<div>\n\t\t\t\tCONFIRMER CREATION COMPTE\n\t\t\t</div>",
    mounted: function mounted() {
      services('POST', 'confirmerCreationCompte', {
        pseudo: pseudo
      });
    }
  },
  confirmer_invitation: {
    data: function data() {
      return {
        group_name: '',
        pseudo: '',
        frequence_email: '',
        se_souvenir_de_moi: false
      };
    },
    template: "<div>\n\t\t\t\t{{ this.pseudo.toUpperCase() }}, VALIDEZ VOTRE INVIATTION A PARTICIPER AU GROUPE {{ this.group_name.toUpperCase() }}\n\t\t\t\t<form id='confirmer_invitation' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate>\n\t\t\t\t<div>\n\t\t\t\t\t<label for='mdp_inv'> Mot de Passe : </label>\n\t\t\t\t\t<input id='mdp_inv' type='password' placeholder='12345' autocomplete='on' autofocus\n\t\t\t\t\t\t@input='verifierFormulaire'>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label for='confirmer_mdp_inv'> Confirmer le Mot de Passe : </label>\n\t\t\t\t\t<input id='confirmer_mdp_inv' type='password' placeholder='Votre mot de passe...' autocomplete='on'\n\t\t\t\t\t\t@input='verifierFormulaire'>\n\t\t\t\t</div>\n\t\t\t\t<br />\n\t\t\t\t<frequence_email @change_frequence_email='frequenceEmail'> Souhaitez recevoir un tirage personnel ? </frequence_email>\n\t\t\t\t<hr />\n\t\t\t\t<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi>\n\t\t\t\t<div class='form_creer-compte-button'>\n\t\t\t\t\t<button type='reset'> Annuler </button>\n\t\t\t\t\t<button type='submit' disabled> Cr\xE9er votre compte ! </button>\n\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>",
    methods: {
      frequenceEmail: function frequenceEmail() {
        console.log("freq : " + event.target.id);
        this.frequence_email = event.target.id;
      },
      seSouvenirDeMoi: function seSouvenirDeMoi() {
        console.log("se_souvenir_de_moi : " + event.target.checked);
        this.se_souvenir_de_moi = event.target.checked;
      },
      submit: function submit() {
        console.log("SUBMIT CONFIRME INVITATION " + this.pseudo);
        var confirmer_mdp_inv = document.getElementById('confirmer_mdp_inv').value,
            mdp_inv = document.getElementById('confirmer_mdp_inv').value;
        services('POST', 'confirmerInvitation', {
          pseudo: this.pseudo,
          mdp_inv: mdp_inv,
          confirmer_mdp_inv: confirmer_mdp_inv,
          se_souvenir_de_moi: this.se_souvenir_de_moi,
          frequence_email: this.frequence_email
        }).then(function (value) {
          console.log("" + value);
          services.call(this, 'POST', 'verifierUtilisateur', {
            pseudo: this.pseudo,
            mdp: mdp_inv
          }).then(function (value) {
            console.dir(value.data.user);

            switch (value.data.response) {
              case 'utilisateur valide':
                value.vueComponent.root._data.log_state = 'log_succes';
                value.vueComponent.root._data.connected = true;
                value.vueComponent.root._data.user.pseudo = value.data.user.pseudo;
                value.vueComponent.root._data.user.email = value.data.user.email;
                value.vueComponent.root._data.user.groups = value.data.user.groups;
                setTimeout(function () {
                  document.getElementById('pop_up').classList.replace('afficher_pop_up', 'afficher_none');
                  value.vueComponent.root._data.log_state = 'logged';
                }, 500);
                break;

              case 'utilisateur invalide':
                value.vueComponent.root._data.log_state = 'unlogged';
                break;
            }
          });
        });
      },
      verifierFormulaire: function (_verifierFormulaire) {
        function verifierFormulaire() {
          return _verifierFormulaire.apply(this, arguments);
        }

        verifierFormulaire.toString = function () {
          return _verifierFormulaire.toString();
        };

        return verifierFormulaire;
      }(function () {
        verifierFormulaire(event);
      })
    },
    beforeMount: function beforeMount() {
      console.log('Before Mount');
      var params = new URL(document.URL).searchParams;
      this.pseudo = params.get('pseudo');
      this.group_name = params.get('group');
    }
  },
  introduction: {
    template: "<div id='introduction'>\n\t\t\tINTRO DES ANGES\n\t\t\t</div>"
  },
  historique: {
    template: "<div>\n\t\t\tHISTO\n\t\t\t</div>"
  }
};