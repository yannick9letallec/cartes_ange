"use strict";

module.exports = {
  gestion_compte: {
    data: function data() {
      return {
        group_state: 'groups_existant',
        new_pseudo: '',
        new_email: '',
        message: '',
        message_modif_pseudo: false,
        message_erreur: false,
        message_ok: false,
        cursor_position: 0,
        check: '',
        response: ''
      };
    },
    props: ['pseudo', 'email', 'statut', 'ttl', 'groups', 'frequence_email', 'se_souvenir'],
    template: "<div id='gestion_compte'> \n\t\t\t\t<bouton_fermeture_div @close_div='closeDiv'></bouton_fermeture_div> \n\t\t\t\t<p class='form_title'> <mark> Mon Compte : </mark> </p> \n\t\t\t\t<br />\n\t\t\t\t<p contenteditable='true' @input=\"modifierField( 'pseudo' )\"> {{ this.pseudo }}  </p>\n\t\t\t\t<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' \n\t\t\t\t\tv-if='message_modif_pseudo'> \n\t\t\t\t\t\t{{ this.message }} \n\t\t\t\t</message_modif_compte>\n\t\t\t\t<br /> \n\t\t\t\t<p contenteditable='true' @input=\"modifierField( 'email' )\"> {{ this.email }} </p> \n\t\t\t\t<statut :is='statut' :ttl='calculerTTL()'> </statut>\t\n\t\t\t\t<br /> \n\t\t\t\t<frequence_email \n\t\t\t\t\t:form_id=\"'gestion_compte_frequence_email'\" \n\t\t\t\t\t:frequence_email='frequence_email' \n\t\t\t\t\t:response='response'\n\t\t\t\t\t@change_frequence_email='changeFreqEmail'> \n\t\t\t\t\t<mark> Modifiez la fr\xE9quence de vos tirages : </mark> \n\t\t\t\t\t<span slot='frequence_email'><i class='fa fa-check-square'></i></span>\n\t\t\t\t</frequence_email>\n\t\t\t\t<p class='form_title'> <mark> Mes Groupes : </mark> </p> \n\t\t\t\t\t<groups_existant class='groups_existant' v-if='groupsExists' \n\t\t\t\t\t\t:pseudo='pseudo' \n\t\t\t\t\t\t:groups='groups'> \n\t\t\t\t\t</groups_existant> \n\t\t\t\t\t<group_ajout_wrapper \n\t\t\t\t\t\t:pseudo='pseudo' \n\t\t\t\t\t\t:groups='groups' \n\t\t\t\t\t\t:email='email'> \n\t\t\t\t\t</group_ajout_wrapper> \n\t\t\t\t<br /> \n\t\t\t\t<button @click=\"$emit( 'deconnexion' )\"> D\xE9connexion </button> \n\t\t\t</div>",
    methods: {
      closeDiv: function closeDiv() {
        var el = document.getElementById("pop_up");
        el.classList.replace('afficher_pop_up', 'afficher_none');
      },
      changeFreqEmail: function changeFreqEmail() {
        var freq = event.target.id,
            that = this;
        freq = freq.split(':')[1];
        that.freq = freq;
        services('POST', 'modifierFrequenceEmail', {
          pseudo: this.pseudo,
          frequence_email: freq
        }).then(function (value) {
          console.dir(this);
          that.response = {
            freq: that.freq,
            statut: 'succes'
          };
          that.$root._data.user.frequence_email = freq;
        }).catch(function (err) {
          console.log("ERROR : " + err);
          that.response = {
            freq: that.freq,
            statut: 'erreur'
          };
        });
      },
      calculerTTL: function calculerTTL() {
        return Math.floor(this.ttl / 86400);
      },
      modifierField: function modifierField(field) {
        this.new_pseudo = event.target.textContent.trim();
        var that = this,
            l = this.new_pseudo.length;

        if (l > 5 && l < 255) {
          services.call(that, 'POST', 'modifierPseudo', {
            old_pseudo: this.pseudo,
            new_pseudo: this.new_pseudo
          }).then(function (value) {
            console.dir(this);
            value.vueComponent._data.message_modif_pseudo = true;

            if (value.data.new_pseudo) {
              value.vueComponent.$root._data.user.pseudo = value.data.new_pseudo;
              value.vueComponent._data.message_ok = true;
              value.vueComponent._data.message = value.data.message;
            } else {
              value.vueComponent._data.message_erreur = true;
              value.vueComponent._data.message = value.data.message;
              console.log("OK MODIF PSEUDO " + ' ' + this.message);
            }

            setTimeout(function () {
              value.vueComponent._data.message_modif_pseudo = false;
              value.vueComponent._data.message_erreur = false;
              value.vueComponent._data.message_ok = false;
            }, 1000);
          }).catch(function (err) {
            console.log("ERROR MODIF PSEUDO");
            console.dir(err);
          });
        } else {
          this.message = 'Pseudo entre 5 et 255 caractères';
          this.message_modif_pseudo = true;
          this.message_erreur = true;

          (function (scope) {
            setTimeout(function () {
              scope._data.message_modif_pseudo = false;
              scope._data.message_erreur = false;
              scope._data.message_ok = false;
            }, 1000);
          })(this);
        }
      },
      modifierEmail: function modifierEmail() {
        console.dir(event);
      }
    },
    computed: {
      groupsExists: function groupsExists() {
        console.log("groupsExists : " + this.groups.length);

        if (this.groups.length > 0) {
          return true;
        } else {
          return false;
        }
      },
      handleGroups: function handleGroups() {
        var l = this.groups.length;

        if (l === 0) {
          return this.group_state = 'groups_vide';
        } else {
          return this.group_state = 'groups_existant';
        }
      },
      groupAjouterNom: function groupAjouterNom() {
        console.log("TRACK 2 " + this.group_ajout_state);
        this.group_ajout_state = 'group_ajouter_nom';
      },
      groupAjout: function groupAjout() {
        return this.group_ajout_state;
      }
    }
  },
  a_confirmer: {
    props: ['ttl'],
    template: "<div encore class='statut_a_confirmer'>\n\t\t\t\t Encore <strong> {{ this.ttl }} </strong> jours pour valider votre email.\n\t\t\t</div>"
  },
  permanent: {
    template: "<div class='statut_confirme'>\n\t\t\t\t Email confirm\xE9 <font-awesome-icon id='log_button' icon='check-square' size='1x' />\n\t\t\t</div>"
  },
  message_modif_compte: {
    template: "<div> <slot></slot> </div>"
  }
};