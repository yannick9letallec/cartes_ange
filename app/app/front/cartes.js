"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _fontawesomeSvgCore = require("@fortawesome/fontawesome-svg-core");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _vueFontawesome = require("@fortawesome/vue-fontawesome");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faTimes);

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faUser);

var times = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'times'
});
var user = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'user'
});

_vue.default.component('font-awesome-icon', _vueFontawesome.FontAwesomeIcon);

_vue.default.config.productionTip = false; // COMPONENTS FEEDING POP_UP DIV

_vue.default.component('log_succes', {
  template: '<p> LOGGED ! <br /> Welcome :) </p>'
});

_vue.default.component('bouton_fermeture_div', {
  template: "<div> \
			<font-awesome-icon id='close_div' icon='times' v-on:click='closeDiv' style='float: right;' /> \
		</div>",
  methods: {
    closeDiv: function closeDiv(e) {
      var el = document.getElementById("pop_up");
      el.classList.replace('afficher_pop_up', 'afficher_none');
      this.$emit('close_div', '');
    }
  }
});

_vue.default.component("form_creer_compte", {
  template: "<div id='form_creer_compte'> \
		<form id='creer_compte' method='post' enctype='multipart/form-data' v-on:submit.prevent='submit' novalidate> \
			<bouton_fermeture_div v-on:close_div='closeDiv' ></bouton_fermeture_div> \
			<div> \
				<p style='margin-bottom: 5px;'> Créer votre compte : </p> \
			</div> \
			<div> \
				<label for='pseudo'> Pseudo : </label> \
				<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' autofocus autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='email'> Email : </label> \
				<input id='email' type='email' size='15' placeholder='mon email...' autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='mdp'> Mot de Passe : </label> \
				<input id='mdp' type='password' placeholder='12345' autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='confirmer_mdp'> Confirmer le Mot de Passe : </label> \
				<input id='confirmer_mdp' type='password' placeholder='Votre mot de passe...' autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div id='info'></div> \
			<div class='form_creer-compte-button'> \
				<button type='reset'> Annuler </button> \
				<button type='submit' disabled> Créer votre compte ! </button> \
			</div> \
		</form> \
		</div>",
  methods: {
    closeDiv: function closeDiv(e) {
      var el = document.getElementById("pop_up");
      el.classList.replace('afficher_pop_up', 'afficher_none');
      this.$emit('close_div', '');
    },
    verifierFormulaire: function verifierFormulaire(field, event) {
      _verifierFormulaire(field, event);
    },
    submit: function submit(e) {
      var fname = services.name.toUpperCase();
      console.info("INFO : [ " + fname + " ] Appel : SERVICES");
      var pseudo = document.getElementById('pseudo').value;
      var email = document.getElementById('email').value;
      var mdp = document.getElementById('mdp').value;
      var confirmer_mdp = document.getElementById('confirmer_mdp').value;
      services('POST', 'creerCompte', {
        pseudo: pseudo,
        email: email,
        mdp: mdp,
        confirmer_mdp: confirmer_mdp
      });
    }
  }
});

_vue.default.component("form_auth", {
  template: "<div id='form_authentication'> \
		<form id='login' method='post' enctype='multipart/form-data' v-on:submit.prevent='submit' novalidate > \
			<font-awesome-icon id='close_div' icon='times' v-on:click='closeDiv' style='float: right;' /> \
			<div> \
				<p style='margin-bottom: 5px;'> Se Connecter : </p> \
			</div> \
			<div> \
				<label for='pseudo'> Pseudo : </label> \
				<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' style='margin-bottom: 10px;' autofocus autocomplete='on' maxlength='255' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='mdp'> Mot de Passe : </label> \
				<input id='mdp' type='password' placeholder='votre mot de passe...' autocomplete='on' maxlength='255' @input=\"verifierFormulaire( 'mdp', $event )\"> \
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
				<button type='submit' v-on:click=\"$emit( 'mod_contenu', 'form_creer_compte' )\"> Créer un compte </button> \
			</div> \
		</div>",
  methods: {
    afficher_form_creer_compte: function afficher_form_creer_compte() {
      this.$emit('close_div', '');
    },
    closeDiv: function closeDiv(e) {
      var el = document.getElementById("pop_up");
      el.classList.replace('afficher_pop_up', 'afficher_none');
      this.$emit('close_div', '');
    },
    verifierFormulaire: function verifierFormulaire(field, event) {
      _verifierFormulaire(field, event);
    },
    submit: function submit(e) {
      var fname = services.name.toUpperCase();
      console.error("INFO : [ " + fname + " ] Appel : SERVICES");
      var pseudo = document.getElementById('pseudo').value;
      var mdp = document.getElementById('mdp').value;
      services.call(this, 'POST', 'verifierUtilisateur', {
        pseudo: pseudo,
        mdp: mdp
      }).then(function (value) {
        console.log("PROMISE " + value.data);
        console.dir(value.vueComponent);

        switch (value.data.response) {
          case 'utilisateur valide':
            value.vueComponent.$root._data.log_state = 'log_succes';
            value.vueComponent.$root._data.connected = true;
            value.vueComponent.$root._data.user = {
              name: value.data.user.name
            };
            console.dir(value.data.user);
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
  }
});

_vue.default.component('deconnexion_tab', {
  template: "<div id='deconnexion'> \
			<bouton_fermeture_div v-on:close_div='closeDiv' ></bouton_fermeture_div> \
			<button> Mon compte </button> \
			<br /> \
			<button v-on:click=\"$emit( 'deconnexion' )\"> Déconnexion </button> \
		</div>"
}); // HEADER RIGHT COMPONENTS


_vue.default.component('unlogged', {
  template: "<font-awesome-icon id='log_button' icon='user' v-on:click=\"$emit( 'show_identification_div' )\" size='2x' />"
});

_vue.default.component('logged', {
  props: ['user'],
  template: "<div id='logged'> \
		<font-awesome-icon id='log_button' icon='user' v-on:click=\"$emit( 'show_connected_div' )\" size='2x' /> \
		<p class='sign'> {{ user }} </p> \
	</div>"
});

var app = new _vue.default({
  el: "#ui",
  data: {
    log_state: 'unlogged',
    mod_contenu: '',
    connected: false,
    message: 'Les Cartes des Anges',
    sign: "@2019 / Yannick Le Tallec",
    user: {
      name: '',
      email: '',
      groups: [],
      history: []
    }
  },
  methods: {
    onModContenu: function onModContenu(e) {
      this.log_state = 'creer_compte';
      console.log("change contenu");
    },
    showIdentificationDIV: function showIdentificationDIV() {
      var pop_up = document.getElementById('pop_up');
      var info = document.getElementById('info');
      info.innerText = null;
      pop_up.classList.add('afficher_pop_up');
      pop_up.classList.remove('afficher_none');
    },
    showConnectedDiv: function showConnectedDiv() {
      var pop_up = document.getElementById('pop_up');
      pop_up.classList.replace('afficher_none', 'afficher_pop_up');
    },
    resetAuthVar: function resetAuthVar(e) {
      this.log_state !== "logged" ? this.log_state = "unlogged" : null;
    },
    deconnexion: function deconnexion() {
      console.log("DISCONENCT");
      var pop_up = document.getElementById('pop_up');
      pop_up.classList.replace('afficher_pop_up', 'afficher_none');
      this.log_state = 'unlogged';
      this.user = {
        name: '',
        email: '',
        groups: [],
        history: {}
      };
      browser.cookies.remove({
        name: 'loggedin'
      });
    }
  },
  computed: {
    isConnected: function isConnected() {
      if (this.connected) {
        return 'logged';
      } else {
        return 'unlogged';
      }
    },
    choixAuthForm: function choixAuthForm() {
      console.log('log_state : ' + this.log_state);

      switch (this.log_state) {
        // returns content for pop_uo
        case 'unlogged':
          return 'form_auth';
          break;

        case 'log_succes':
          return 'log_succes';
          break;

        case 'logged':
          return 'deconnexion_tab';
          break;

        case 'creer_compte':
          return 'form_creer_compte';
          break;

        case 'creer_compte_ok':
          return 'form_creer_compte_ok';
          break;

        case 'creer_compte_ok':
          return 'form_creer_compte_ko';
          break;
      }
    }
  }
}); // GLOBAL HELPERS FUNCTIONS

function services(method, url, data) {
  console.log("---");
  console.dir(this);
  var vueComponent = this;
  return new Promise(function (resolve, reject) {
    var fname = services.name.toUpperCase();

    if (window.XMLHttpRequest) {
      console.info("OK : [ " + fname + " ] XHR Object Found");
      var xhr = new XMLHttpRequest();
    } else {
      console.info("KO : [ " + fname + " ] No XHR Object Found");
      return false;
    }

    xhr.addEventListener('readystatechange', function (event) {
      if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText);
        resolve({
          vueComponent: vueComponent,
          data: JSON.parse(xhr.responseText)
        });
      }
    });

    xhr.onerror = function () {
      reject(Error(xhr.statusText));
    };

    var params = '';

    if (data) {
      for (var props in data) {
        console.log(props);
        params += props + '=' + data[props];
      }
    }

    xhr.open(method, 'http://local.exemple.bzh/services/' + url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(data ? JSON.stringify(data) : null);
  });
}

function _verifierFormulaire(field, event) {
  var fname = services.name.toUpperCase();
  var form_name = event.target.form.id;
  var pseudo_err_message = 'Pseudo > 5 caractères';
  var email_err = 'Rentrez un email valide';
  var mdp_err_message = 'Mot de Passe  > 5 caractères';
  var mdp_differents = 'Les mots doivent correspondre';
  var message = pseudo_err_message + "\n" + mdp_err_message;
  var pseudo = document.getElementById('pseudo').value;
  var mdp = document.getElementById('mdp').value;
  var info = document.getElementById('info');
  var classe_erreur = info.classList.contains('afficher_message_erreur');
  console.log(classe_erreur, event);

  switch (form_name) {
    case 'login':
      console.log(form_name);

      if (pseudo.length > 5 && mdp.length > 5) {
        event.target.form[2].disabled = false;
        info.innerText = null;
        if (classe_erreur) info.classList.toggle('afficher_message_erreur');
      } else {
        console.error("KO : [ " + fname + " ] Données invalides pour authentifier l'utilisateur");
        event.target.form[2].disabled = true;
        if (!classe_erreur) info.classList.toggle('afficher_message_erreur');
        info.innerText = message;
      }

      break;

    case 'creer_compte':
      var email = document.getElementById('email').value;
      var confirmer_mdp = document.getElementById('confirmer_mdp').value;

      if (pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat(email) && mdp === confirmer_mdp) {
        event.target.form[5].disabled = false;
        info.innerText = null;
        if (classe_erreur) info.classList.toggle('afficher_message_erreur');
      } else {
        console.error("KO : [ " + fname + " ] Données invalides pour la création du compte");
        event.target.form[5].disabled = true;
        if (!classe_erreur) info.classList.toggle('afficher_message_erreur');
        info.innerText = message + '\n' + email_err + '\n' + mdp_differents;
      }

      break;
  }
}

function verifierEmailFormat(email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

function viderDiv(div_id) {
  var div = document.getElementById(div_id);

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}