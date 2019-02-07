"use strict";

module.exports.form_auth = {
  props: ['groups'],
  template: "<div id='form_authentication'> \n\t\t<form id='login' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate > \n\t\t\t<bouton_fermeture_div></bouton_fermeture_div> \n\t\t\t<div> \n\t\t\t\t<p style='margin-bottom: 5px;'> Se Connecter : </p> \n\t\t\t</div> \n\t\t\t<div> \n\t\t\t\t<label for='pseudo'> Pseudo : </label> \n\t\t\t\t<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' style='margin-bottom: 10px;' autofocus autocomplete='on' maxlength='255' @input='verifierFormulaire( event )'> \n\t\t\t</div> \n\t\t\t<div> \n\t\t\t\t<label for='mdp'> Mot de Passe : </label> \n\t\t\t\t<input id='mdp' type='password' placeholder='votre mot de passe...' autocomplete='on' maxlength='255' @input='verifierFormulaire( event )'> \n\t\t\t</div> \n\t\t\t<div id='info'></div> \n\t\t\t<div> \n\t\t\t\t<button type='submit' disabled class='form_authentication-auth-button'> <i class='fa fa-close'></i> JE M'IDENTIFIE </button> \n\t\t\t\t<span class='mdp_oublie'> <a href='' alt='TO_DO!!'> Mot de passe oubli\xE9 ? </a> </span> \n\t\t\t\t<div class='clear'></div> \n\t\t\t</div> \n\t\t</form> \n\t\t\t<hr /> \n\t\t\t<div class='form_authentication-creer-compte-button'> \n\t\t\t\t<button type='submit' @click=\"emit( 'mod_contenu', 'form_creer_compte' )\"> Cr\xE9er un compte </button> \n\t\t\t</div> \n\t\t</div>",
  methods: {
    afficher_form_creer_compte: function afficher_form_creer_compte() {
      this.emit('close_div', '');
    },
    verifierFormulaire: function (_verifierFormulaire) {
      function verifierFormulaire(_x) {
        return _verifierFormulaire.apply(this, arguments);
      }

      verifierFormulaire.toString = function () {
        return _verifierFormulaire.toString();
      };

      return verifierFormulaire;
    }(function (event) {
      verifierFormulaire(event);
    }),
    submit: function submit(e) {
      var fname = "FORM AUTH SUBMIT";
      console.info("INFO : [ " + fname + " ] Appel : SERVICES");
      var pseudo = e.target[0].value;
      var mdp = e.target[1].value;
      services.call(this, 'POST', 'verifierUtilisateur', {
        pseudo: pseudo,
        mdp: mdp
      }).then(function (value) {
        console.dir(value.data.user);

        switch (value.data.response) {
          case 'utilisateur valide':
            value.vueComponent.root._data.log_state = 'log_success';
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
    }
  },
  mounted: function mounted() {
    document.getElementById('pseudo').focus();
  }
};