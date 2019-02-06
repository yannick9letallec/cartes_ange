"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _fontawesomeSvgCore = require("@fortawesome/fontawesome-svg-core");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _vueFontawesome = require("@fortawesome/vue-fontawesome");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faTimes);

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faUser);

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faAngleRight);

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faMinusSquare);

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faPlusSquare);

var times = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'times'
});
var user = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'user'
});
var angleRight = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'angle-right'
});
var minusSquare = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'minus-square'
});
var plusSquare = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'plus-square'
});

_vue.default.component('font-awesome-icon', _vueFontawesome.FontAwesomeIcon);

_vue.default.config.productionTip = true;
_vue.default.config.performance = true;

var _require = require('./helpers.js'),
    services = _require.services,
    verifierEmailFormat = _require.verifierEmailFormat,
    verifierFormulaire = _require.verifierFormulaire,
    viderDiv = _require.viderDiv;

window.verifierFormulaire = verifierFormulaire;
window.services = services;
window.verifierEmailFormat = verifierEmailFormat;
window.viderDiv = viderDiv;

_vue.default.component('unlogged', require('./micro_components.js').unlogged);

_vue.default.component('logged', require('./micro_components.js').logged);

_vue.default.component('log_success', require('./micro_components.js').log_success);

_vue.default.component('bouton_fermeture_div', require('./micro_components.js').bouton_fermeture_div);

_vue.default.component('frequence_email', require('./micro_components.js').frequence_email);

_vue.default.component('se_souvenir_de_moi', require('./micro_components.js').se_souvenir_de_moi);

_vue.default.component('form_auth', require('./auth.js').form_auth);

_vue.default.component('form_creer_compte', require('./creer_compte.js').form_creer_compte);

_vue.default.component('group_ajout', require('./gestion_groupes.js').group_ajout);

_vue.default.component('group_ajout_wrapper', require('./gestion_groupes.js').group_ajout_wrapper);

_vue.default.component('groups_existant', require('./gestion_groupes.js').groups_existant);

_vue.default.component('group_ajouter_nom', require('./gestion_groupes.js').group_ajouter_nom);

_vue.default.component('group_ajouter_membres', require('./gestion_groupes.js').group_ajouter_membres);

_vue.default.component('group_ajouter_membre', require('./gestion_groupes.js').group_ajouter_membre);

_vue.default.component('group_afficher_membres', require('./gestion_groupes.js').group_afficher_membres);

_vue.default.component('gestion_compte', require('./gestion_compte.js').gestion_compte);

_vue.default.component('index', require('./main.js').index);

_vue.default.component('confirmer_invitation', require('./main.js').confirmer_invitation);

_vue.default.component('confirmer_compte', require('./main.js').confirmer_compte);

_vue.default.component('introduction', require('./main.js').introduction);

_vue.default.component('historique', require('./main.js').historique);

_vue.default.component('liste_anges', require('./liste_anges.js').liste_anges);

_vue.default.component('carte', require('./carte.js').carte); // VUE APP


var app = new _vue.default({
  el: "#ui",
  components: {},
  data: {
    log_state: 'unlogged',
    mod_contenu: '',
    connected: false,
    message: 'Les Cartes des Anges',
    sign: "@2019 / Yannick Le Tallec",
    user: {
      pseudo: '',
      email: '',
      groups: [],
      history: []
    },
    main_page: 'index',
    cartes: [],
    mode_liste_anges: ''
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
        pseudo: '',
        email: '',
        groups: [],
        history: {}
      };
    },
    navigate: function navigate(route, mode) {
      this.main_page = route;
      this.mode_liste_anges = mode;
    },
    verifierEmailFormat: function verifierEmailFormat(email) {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return regex.test(email);
    },
    mockConnecter: function mockConnecter() {
      var pseudo = 'yannicko',
          email = 'yannick9letallec@gmail.com',
          mdp = '000000';
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
    },
    mockCreerInviterGroupe: function mockCreerInviterGroupe() {
      console.log("MOCK ");
      console.dir(this);
      var data = {
        user: {
          pseudo: this.user.pseudo,
          email: this.user.email
        },
        group_name: 'test',
        group_members: [{
          pseudo: 'Anna',
          email: 'yannick9letallec@gmail.com'
        }, {
          pseudo: 'Robert',
          email: 'yannick9letallec@gmail.com'
        }]
      };
      services('POST', 'creerInviterGroupe', data);
    },
    mockCreerCompte: function mockCreerCompte() {
      services('POST', 'creerCompte', {
        pseudo: 'utilisateur_test',
        email: 'test@email.commmm',
        mdp: '000000',
        confirmer_mdp: '000000',
        se_souvenir_de_moi: true,
        frequence_email: 'aucun'
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

        case 'log_success':
          return 'log_success';
          break;

        case 'logged':
          return 'gestion_compte';
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
  },
  mounted: function mounted() {
    // gestion des connexions indirectes
    console.log('HOOK BeforeCreate');
    var u = new URL(document.URL),
        p = u.pathname,
        pseudo = u.searchParams.get('pseudo'),
        group = u.searchParams.get('group');

    switch (p) {
      case '/':
        console.log("GET INDEX PAGE");
        this._data.main_page = 'index';
        break;

      case '/confirmer_invitation/':
        console.info("PAGE CONFIMER INVITATION");
        this.user.pseudo = pseudo;
        this._data.main_page = 'confirmer_invitation';
        break;

      case '/confirmer_creation_compte/':
        console.info("PAGE CONFIMER COMPTE");
        this.user.pseudo = pseudo;
        this._data.main_page = 'confirmer_compte';
        break;

      default:
        this._data.main_page = 'index';
        console.info("GET NO RESULT PAGE");
        break;
    }

    var that = this;
    services('GET', 'recuperer_liste_anges', {}).then(function (value) {
      console.dir(value);
      that.cartes = value.data;
    });
  }
});