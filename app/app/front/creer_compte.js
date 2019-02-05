"use strict";

module.exports = {
  form_creer_compte: {
    data: function data() {
      return {
        frequence_email: 'aucun',
        se_souvenir_de_moi: false
      };
    },
    template: "<div id='form_creer_compte'> \
			<form id='creer_compte' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> \
				<bouton_fermeture_div @close_div='closeDiv' ></bouton_fermeture_div> \
				<div> \
					<p style='margin-bottom: 5px;'> Créer votre compte : </p> \
				</div> \
				<div> \
					<label for='pseudo'> Pseudo : </label> \
					<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' autofocus autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<div> \
					<label for='email'> Email : </label> \
					<input id='email' type='email' size='15' placeholder='mon email...' autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<div> \
					<label for='mdp'> Mot de Passe : </label> \
					<input id='mdp' type='password' placeholder='12345' autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<div> \
					<label for='confirmer_mdp'> Confirmer le Mot de Passe : </label> \
					<input id='confirmer_mdp' type='password' placeholder='Votre mot de passe...' autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<frequence_email @change_frequence_email='frequence'> Recevoir un tirage aléatoire dans votre boîte email : </frequence_email> \
				<div id='info'></div> \
				<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi> \
				<div class='form_creer-compte-button'> \
					<button type='reset'> Annuler </button> \
					<button type='submit' disabled> Créer votre compte ! </button> \
				</div> \
			</form> \
			</div>",
    methods: {
      frequence: function frequence() {
        this.frequence_email = event.target.id;
      },
      seSouvenirDeMoi: function seSouvenirDeMoi() {
        this.se_souvenir_de_moi = event.target.checked;
      },
      closeDiv: function closeDiv(e) {
        var el = document.getElementById("pop_up");
        el.classList.replace('afficher_pop_up', 'afficher_none');
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
        var fname = services.name.toUpperCase();
        console.info("INFO : [ " + fname + " ] Appel : SERVICES");
        var pseudo = document.getElementById('pseudo').value;
        var email = document.getElementById('email').value;
        var mdp = document.getElementById('mdp').value;
        var confirmer_mdp = document.getElementById('confirmer_mdp').value;
        var se_souvenir_de_moi = document.getElementById('se_souvenir_de_moi').checked;
        services('POST', 'creerCompte', {
          pseudo: pseudo,
          email: email,
          mdp: mdp,
          confirmer_mdp: confirmer_mdp,
          se_souvenir_de_moi: se_souvenir_de_moi,
          frequence_email: this.frequence_email
        });
      }
    }
  }
};