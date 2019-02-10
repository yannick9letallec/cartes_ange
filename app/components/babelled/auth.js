"use strict";

module.exports.form_auth = {
  props: ['groups'],
  template: "<div id='form_authentication'> \n\t\t<form id='login' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> \n\t\t\t<bouton_fermeture_div></bouton_fermeture_div> \n\t\t\t<div> \n\t\t\t\t<p class='form_title' style='margin-bottom: 5px;'> <mark> Se Connecter : </mark></p> \n\t\t\t</div> \n\t\t\t<div> \n\t\t\t\t<label for='pseudo'> Pseudo : </label> \n\t\t\t\t<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' style='margin-bottom: 10px;' autofocus autocomplete='on' maxlength='255' @input='verifierFormulaire'> \n\t\t\t</div> \n\t\t\t<div> \n\t\t\t\t<label for='mdp'> Mot de Passe : </label> \n\t\t\t\t<input id='mdp' type='password' placeholder='votre mot de passe...' autocomplete='on' maxlength='255' @input='verifierFormulaire'> \n\t\t\t</div> \n\t\t\t<div id='info'></div> \n\t\t\t<div> \n\t\t\t\t<button type='submit' disabled class='form_authentication-auth-button'> <i class='fa fa-close'></i> JE M'IDENTIFIE </button> \n\t\t\t\t<span class='mdp_oublie'> <a href='' alt='TO_DO!!'> Mot de passe oubli\xE9 ? </a> </span> \n\t\t\t\t<div class='clear'></div> \n\t\t\t</div> \n\t\t</form> \n\t\t\t<hr /> \n\t\t\t<div class='form_authentication-creer-compte-button'> \n\t\t\t\t<button type='submit' @click=\"$emit( 'mod_contenu', 'form_creer_compte' )\"> Cr\xE9er un compte </button> \n\t\t\t</div> \n\t\t</div>",
  methods: {
    afficher_form_creer_compte: function afficher_form_creer_compte() {
      this.$emit('close_div', '');
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
    }),
    submit: function submit(e) {
      var fname = "FORM AUTH SUBMIT";
      console.info("INFO : [ " + fname + " ] Appel : SERVICES");
      console.dir(this.$root._data);
      var pseudo = e.target[0].value,
          mdp = e.target[1].value,
          that = this;
      services.call(that, 'POST', 'verifierUtilisateur', {
        pseudo: pseudo,
        mdp: mdp
      }).then(function (value) {
        console.dir(that);

        switch (value.data.response) {
          case 'utilisateur valide':
            that.$root._data.log_state = 'log_success';
            that.$root._data.connected = true;
            that.$root._data.user = {
              pseudo: value.data.user.pseudo,
              email: value.data.user.email,
              groups: value.data.user.groups,
              statut: value.data.user.statut,
              ttl: value.data.user.ttl
            };
            setTimeout(function () {
              document.getElementById('pop_up').classList.replace('afficher_pop_up', 'afficher_none');
              that.$root._data.log_state = 'logged';
            }, 500);
            break;

          case 'utilisateur invalide':
            that.$root._data.log_state = 'unlogged';
            break;
        }
      });
    }
  },
  mounted: function mounted() {
    document.getElementById('pseudo').focus();
  }
};