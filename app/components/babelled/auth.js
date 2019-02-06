"use strict";

module.exports.form_auth = {
  props: ['groups'],
  template: "<div id='form_authentication'> \
		<form id='login' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate > \
			<bouton_fermeture_div></bouton_fermeture_div> \
			<div> \
				<p style='margin-bottom: 5px;'> Se Connecter : </p> \
			</div> \
			<div> \
				<label for='pseudo'> Pseudo : </label> \
				<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' style='margin-bottom: 10px;' autofocus autocomplete='on' maxlength='255' @input=\"verifierFormulaire( $event )\"> \
			</div> \
			<div> \
				<label for='mdp'> Mot de Passe : </label> \
				<input id='mdp' type='password' placeholder='votre mot de passe...' autocomplete='on' maxlength='255' @input=\"verifierFormulaire( $event )\"> \
			</div> \
			<div id='info'></div> \
			<div> \
				<button type='submit' disabled class='form_authentication-auth-button'> <i class='fa fa-close'></i> JE M\'IDENTIFIE </button> \
				<span class='mdp_oublie'> <a href='' alt='TO_DO!!'> Mot de passe oublié ? </a> </span> \
				<div class='clear'></div> \
			</div> \
		</form> \
			<hr /> \
			<div class='form_authentication-creer-compte-button'> \
				<button type='submit' @click=\"$emit( 'mod_contenu', 'form_creer_compte' )\"> Créer un compte </button> \
			</div> \
		</div>",
  methods: {
    afficher_form_creer_compte: function afficher_form_creer_compte() {
      this.$emit('close_div', '');
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
            value.vueComponent.$root._data.log_state = 'log_success';
            value.vueComponent.$root._data.connected = true;
            value.vueComponent.$root._data.user.pseudo = value.data.user.pseudo;
            value.vueComponent.$root._data.user.email = value.data.user.email;
            value.vueComponent.$root._data.user.groups = value.data.user.groups;
            setTimeout(function () {
              document.getElementById('pop_up').classList.replace('afficher_pop_up', 'afficher_none');
              value.vueComponent.$root._data.log_state = 'logged';
            }, 500);
            break;

          case 'utilisateur invalide':
            value.vueComponent.$root._data.log_state = 'unlogged';
            break;
        }
      });
    }
  },
  mounted: function mounted() {
    document.getElementById('pseudo').focus();
  }
};