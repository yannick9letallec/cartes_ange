"use strict";

// VUE APP
var app = new Vue({
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
    services('GET', 'recuperer_liste_anges', {}).then(function (value) {
      console.dir(value);
      that.cartes = value.data;
    });
  }
});