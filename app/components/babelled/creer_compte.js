"use strict";

module.exports = {
  form_creer_compte: {
    data: function data() {
      return {
        frequence_email: 'aucun',
        se_souvenir_de_moi: false
      };
    },
    template: "<div id='form_creer_compte'> \n\t\t\t<form id='creer_compte' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> \n\t\t\t\t<bouton_fermeture_div ></bouton_fermeture_div> \n\t\t\t\t<div> \n\t\t\t\t\t<p style='margin-bottom: 5px;'> Cr\xE9er votre compte : </p> \n\t\t\t\t</div> \n\t\t\t\t<div> \n\t\t\t\t\t<label for='pseudo'> Pseudo : </label> \n\t\t\t\t\t<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' autofocus autocomplete='on' @input=\"verifierFormulaire( event )\"> \n\t\t\t\t</div> \n\t\t\t\t<div> \n\t\t\t\t\t<label for='email'> Email : </label> \n\t\t\t\t\t<input id='email' type='email' size='15' placeholder='mon email...' autocomplete='on' @input=\"verifierFormulaire( event )\"> \n\t\t\t\t</div> \n\t\t\t\t<div> \n\t\t\t\t\t<label for='mdp'> Mot de Passe : </label> \n\t\t\t\t\t<input id='mdp' type='password' placeholder='12345' autocomplete='on' @input=\"verifierFormulaire( event )\"> \n\t\t\t\t</div> \n\t\t\t\t<div> \n\t\t\t\t\t<label for='confirmer_mdp'> Confirmer le Mot de Passe : </label> \n\t\t\t\t\t<input id='confirmer_mdp' type='password' placeholder='Votre mot de passe...' autocomplete='on' @input=\"verifierFormulaire( event )\"> \n\t\t\t\t</div> \n\t\t\t\t<frequence_email @change_frequence_email='frequence'> Recevoir un tirage al\xE9atoire dans votre bo\xEEte email : </frequence_email> \n\t\t\t\t<div id='info'></div> \n\t\t\t\t<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi> \n\t\t\t\t<div class='form_creer-compte-button'> \n\t\t\t\t\t<button type='reset'> Annuler </button> \n\t\t\t\t\t<button type='submit' disabled> Cr\xE9er votre compte ! </button> \n\t\t\t\t</div> \n\t\t\t</form> \n\t\t\t</div>",
    methods: {
      frequence: function frequence() {
        this.frequence_email = event.target.id;
      },
      seSouvenirDeMoi: function seSouvenirDeMoi() {
        this.se_souvenir_de_moi = event.target.checked;
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
        this.root._data.connected = false;
        this.root._data.log_state = 'unlogged';
        var el = document.getElementById("pop_up");
        el.classList.replace('afficher_pop_up', 'afficher_none');
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