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

_fontawesomeSvgCore.library.add(_freeSolidSvgIcons.faCheckSquare);

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
var checkSquare = (0, _fontawesomeSvgCore.icon)({
  prefix: 'fas',
  iconName: 'check-square'
});

_vue.default.component('font-awesome-icon', _vueFontawesome.FontAwesomeIcon);

_vue.default.config.productionTip = true;
_vue.default.config.performance = true;

var helpers = require('./helpers.js');

for (var key in helpers) {
  window[key] = helpers[key];
}

var components = [];
components.push(require('./micro_components.js'), require('./main.js'), require('./gestion_compte.js'), require('./gestion_groupes.js'), require('./creer_compte.js'), require('./auth.js'), require('./liste_anges.js'), require('./carte.js'));
components.forEach(function (item) {
  for (var _key in item) {
    _vue.default.component(_key, item[_key]);
  }
}); // VUE APP

var app = new _vue.default({
  el: "#ui",
  data: {
    afficher_menu_navigation: false,
    log_state: 'unlogged',
    mod_contenu: '',
    connected: false,
    message: 'Les Cartes des Anges',
    sign: "@2019 / Yannick Le Tallec",
    user: {
      pseudo: '',
      email: '',
      statut: '',
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
      var pop_up = document.getElementById('pop_up'),
          info = document.getElementById('info');
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
      this.cacherPopUpDiv();
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
    afficherMenuNavigation: function afficherMenuNavigation() {
      console.log("AFFICHER MENU NAVIGATION");
      this.afficher_menu_navigation = true;
    },
    verifierEmailFormat: function verifierEmailFormat(email) {
      var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
      return regex.test(email);
    },
    cacherPopUpDiv: function cacherPopUpDiv() {
      console.log("CACHER POP UP");
      var pop_up = document.getElementById('pop_up');
      pop_up.classList.replace('afficher_pop_up', 'afficher_none');
      if (!this.connected) return this.log_state = 'unlogged';
    },
    connect: function connect(pseudo, mdp) {
      var that = this;
      services.call(that, 'POST', 'verifierUtilisateur', {
        pseudo: pseudo,
        mdp: mdp
      }).then(function (value) {
        console.dir(that);

        switch (value.data.response) {
          case 'utilisateur valide':
            that.$root.postConnect(value);
            break;

          case 'utilisateur invalide':
            that.$root._data.log_state = 'unlogged';
            break;
        }
      });
    },
    autoConnect: function autoConnect() {
      console.log("AUTOCONNECT");
      var cookie = document.cookie,
          cookies = cookie.split(';'),
          pseudo = [],
          mdp = [];
      pseudo = cookies.filter(function (elem) {
        return elem.match(/^ ?pseudo/);
      });
      mdp = cookies.filter(function (elem) {
        return elem.match(/^ ?mdp/);
      });
      pseudo.length > 0 ? pseudo = pseudo[0].split('=')[1] : pseudo = null;
      mdp.length > 0 ? mdp = mdp[0].split('=')[1] : mdp = null;
      console.log(pseudo, mdp);

      if (pseudo && mdp) {
        // ok for autoconnect
        this.connect(pseudo, mdp);
      } else {
        // NO OP
        console.log("KO : AUTOCONNECT, no cookie found");
      }
    },
    postConnect: function postConnect(value) {
      console.log("POST CONNECT");
      console.dir(value);
      this.log_state = 'log_success';
      this.connected = true;
      this.user = {
        pseudo: value.data.user.pseudo,
        email: value.data.user.email,
        groups: value.data.user.groups,
        statut: value.data.user.statut,
        ttl: value.data.user.ttl,
        frequence_email: value.data.user.frequence_email
      };
      var that = this;
      setTimeout(function () {
        document.getElementById('pop_up').classList.replace('afficher_pop_up', 'afficher_none');
        that.log_state = 'logged';
      }, 500);
    },
    preloadCartesImageSmall: function preloadCartesImageSmall() {
      console.log("PRELOAD IMAGES");
      console.dir(this.cartes);
      this.cartes.forEach(function (elem) {
        try {
          console.log(elem);
          var img = new Image();
          img.src = '/app/img/cartes/PNG/small/' + elem + '.png';
        } catch (e) {
          console.log("ERROR PRELOADING IMAGES : " + e);
        }
      });
    },
    mockConnecter: function mockConnecter() {
      var pseudo = 'yannicko',
          email = 'yannick9letallec@gmail.com',
          mdp = '000000';
      this.connect(pseudo, mdp);
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
    console.log('HOOK VUE MOUNTED ');
    var u = new URL(document.URL),
        p = u.pathname,
        pseudo = u.searchParams.get('pseudo'),
        group = u.searchParams.get('group');

    switch (p) {
      case '/':
        console.log("GET INDEX PAGE");
        this.main_page = 'index';
        break;

      case '/confirmer_invitation/':
        console.info("PAGE CONFIMER INVITATION");

        if (pseudo) {
          this.user.pseudo = pseudo;
          this.main_page = 'confirmer_invitation';
        } else {
          this.navigate('index');
        }

        break;

      case '/confirmer_creation_compte/':
        console.info("PAGE CONFIMER COMPTE");

        if (pseudo) {
          this.user.pseudo = pseudo;
          this.main_page = 'confirmer_compte';
        } else {
          this.navigate('index');
        }

        break;

      default:
        this.main_page = 'index';
        console.info("NO RESULT PAGE : FALLBACK TO INDEX");
        window.location.replace('/');
        break;
    }

    var that = this;
    services('GET', 'recuperer_liste_anges', {}).then(function (value) {
      console.dir(value);
      that.cartes = value.data;
      that.preloadCartesImageSmall();
    });
    this.autoConnect();
  },
  updated: function updated() {
    console.log("UI UPDATE");
    console.log(this.afficher_menu_navigation);
  }
});