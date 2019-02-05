"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _fontawesomeSvgCore = require("@fortawesome/fontawesome-svg-core");

var _freeSolidSvgIcons = require("@fortawesome/free-solid-svg-icons");

var _vueFontawesome = require("@fortawesome/vue-fontawesome");

var _helpers = require("./helpers.js");

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

var _require = require('./micro_components.js'),
    unlogged = _require.unlogged,
    logged = _require.logged,
    log_success = _require.log_success,
    bouton_fermeture_div = _require.bouton_fermeture_div,
    frequence_email = _require.frequence_email,
    se_souvenir_de_moi = _require.se_souvenir_de_moi;

var _require2 = require('./auth.js'),
    form_auth = _require2.form_auth;

var _require3 = require('./creer_compte.js'),
    form_creer_compte = _require3.form_creer_compte;

var _require4 = require('./gestion_compte.js'),
    gestion_compte = _require4.gestion_compte;

var _require5 = require('./gestion_groupes.js'),
    group_ajout = _require5.group_ajout,
    group_ajout_wrapper = _require5.group_ajout_wrapper,
    groups_existant = _require5.groups_existant,
    group_ajouter_nom = _require5.group_ajouter_nom,
    group_ajouter_membres = _require5.group_ajouter_membres,
    group_ajouter_membre = _require5.group_ajouter_membre,
    group_afficher_membres = _require5.group_afficher_membres;

var _require6 = require('./main.js'),
    index = _require6.index,
    confirmer_invitation = _require6.confirmer_invitation,
    introduction = _require6.introduction,
    historique = _require6.historique;

var _require7 = require('./liste_anges.js'),
    liste_anges = _require7.liste_anges;

var _require8 = require('./carte.js'),
    carte = _require8.carte;

_vue.default.component('unlogged', unlogged);

_vue.default.component('logged', logged);

_vue.default.component('log_success', log_success);

_vue.default.component('bouton_fermeture_div', bouton_fermeture_div);

_vue.default.component('frequence_email', frequence_email);

_vue.default.component('se_souvenir_de_moi', se_souvenir_de_moi);

_vue.default.component('form_auth', form_auth);

_vue.default.component('form_creer_compte', form_creer_compte);

_vue.default.component('gestion_compte', gestion_compte);

_vue.default.component('group_ajout', group_ajout);

_vue.default.component('group_ajout_wrapper', group_ajout_wrapper);

_vue.default.component('groups_existant', groups_existant);

_vue.default.component('group_ajouter_nom', group_ajouter_nom);

_vue.default.component('group_ajouter_membres', group_ajouter_membres);

_vue.default.component('group_ajouter_membre', group_ajouter_membre);

_vue.default.component('group_afficher_membres', group_afficher_membres);

_vue.default.component('index', index);

_vue.default.component('confirmer_invitation', confirmer_invitation);

_vue.default.component('introduction', introduction);

_vue.default.component('historique', historique);

_vue.default.component('liste_anges', liste_anges);

_vue.default.component('carte', carte); // VUE APP


var app = new _vue.default({
  el: "#ui",
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
    mockConnecter: function mockConnecter() {
      var pseudo = 'yannicko',
          email = 'yannick9letallec@gmail.com',
          mdp = '000000';

      _helpers.services.call(this, 'POST', 'verifierUtilisateur', {
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
      (0, _helpers.services)('POST', 'creerInviterGroupe', data);
    },
    mockCreerCompte: function mockCreerCompte() {
      (0, _helpers.services)('POST', 'creerCompte', {
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
        console.info("GET CONFIMER INVITATION PAGE");
        this.user.pseudo = pseudo;
        this._data.main_page = 'confirmer_invitation';
        break;

      default:
        this._data.main_page = 'index';
        console.info("GET NO RESULT PAGE");
        break;
    }

    var that = this;
    (0, _helpers.services)('GET', 'recuperer_liste_anges', {}).then(function (value) {
      console.dir(value);
      that.cartes = value.data;
    });
  }
});