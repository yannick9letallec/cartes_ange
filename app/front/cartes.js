"use strict";

var _vue = _interopRequireDefault(require("vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// VUE LEARN
_vue.default.component("authentication_form", {
  template: "<div id='authentication_form'> \
		<i id='fermer_authentication_form' class='fa fa-close fa-2x'></i> \
		<form id='login' method='post' enctype='multipart/form-data'> \
			<div> \
				<p> Se Connecter : </p> \
			</div> \
			<div> \
				<label for='pseudo'> Pseudo : </label> \
				<input id='pseudo' type='text' size='15' placeholder='mon_pseudo...' required autofocus autocomplete='on'> \
			</div> \
			<div> \
				<label for='mdp'> Mot de Passe : </label> \
				<input id='mdp' type='password' placeholder='12345' required autocomplete='on'> \
			</div> \
			<div> \
				<button class='authentication_form-auth-button'> <i class='fa fa-close'></i> JE M\'IDENTIFIE </button> \
				<span class='mdp_oublie'> <a href='' alt='TO_DO!!'> Mot de passe oublié ? </a> </span> \
				<div class='clear'></div> \
			</div> \
		</form> \
			<hr /> \
			<p> Créer un compte : </p> \
			<div> \
				<button v-on:click='afficher_form_creer_compte' class='authentication_form-creer-compte-button'> JE CREE MON COMPTE </button> \
			</div> \
		</div>",
  methods: {
    afficher_form_creer_compte: function afficher_form_creer_compte() {
      console.log("/////////////////");
      this.template = "789";
    }
  }
});

var app = new _vue.default({
  el: "#ui",
  data: {
    connected: false,
    message: "Les Cartes des Anges",
    sign: "@2019 / Yannick Le Tallec"
  },
  methods: {
    showIdentificationDIV: function showIdentificationDIV() {
      var el = document.getElementById("pop_up");
      console.dir(el);
      el.style.display = "initial";
      el.style.position = "fixed";
      el.style.top = this.clientHeight;
      el.style.right = "0px";
      el.style.margin = "10px";
      el.style.padding = "10px";
      el.style.width = "250px";
      el.style.height = "250px";
      el.style.backgroundColor = "purple";
    },
    afficher_form_creer_compte: function afficher_form_creer_compte() {
      console.log("/////////////////");
    }
  }
});