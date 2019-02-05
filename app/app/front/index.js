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

_vue.default.config.productionTip = true; // let { unlogged, logged, log_success, bouton_fermeture_div, frequence_email, se_souvenir_de_moi } = require( './micro_components.js' )
// let { form_auth } = require( './auth.js' )
// let { form_creer_compte } = require( './creer_compte.js' )
// let { gestion_compte } = require( './gestion_compte.js' )
// let { carte } = require( './carte.js' )
// let { liste_anges } = require( './liste_anges.js' )
// let { index, confirmer_invitation, introduction, historique } = require( './main.js' )
// let { group_ajout, group_ajout_wrapper, groups_existant, group_ajouter_nom, group_ajouter_membres, group_ajouter_membre, group_afficher_membres } = require( './gestion_groupes.js' )

var group_ajout = {
  template: "<div> \
			<span class='clickable' @click=\"$emit( 'group_ajouter_nom' )\"> Groupe \
				<font-awesome-icon icon='plus-square' size='1x' /> \
			</span> \
		</div>"
};
var group_ajout_wrapper = {
  props: ['pseudo', 'email', 'groups'],
  data: function data() {
    return {
      group_ajout: false,
      group_ajout_state: 'group_ajout',
      group_name: '',
      group_members: [],
      frequence_email: ''
    };
  },
  template: "<div> \
		<div class='groups'> Groupes {{ group_name }}: \
			<component :group_name='group_name' 	:is='group_ajout_state' \
				:group_members='group_members' \
				@change_frequence_email='frequence' \
				@group_ajouter_nom=\" group_ajout_state='group_ajouter_nom' \" \
				@group_ajouter_membres='groupAjouterMembres' \
				@annuler_creation_groupe='annulerCreationGroupe' \
				@frequence_email='frequence' \
				@creer_inviter_groupe='creerInviterGroupe'> \
			</component> \
		</div> \
	</div>",
  methods: {
    groupAjouterMembres: function groupAjouterMembres(group_name) {
      this.group_name = group_name;
      this.group_members = []; // DEV ONLY

      if (this.group_members.length <= 1) {
        this.group_members.push({
          pseudo: 'bob',
          email: 'bob@gmail'
        });
      }

      return this.group_ajout_state = 'group_ajouter_membres';
    },
    annulerCreationGroupe: function annulerCreationGroupe() {
      this.group_name = '';
      return this.group_ajout_state = 'group_ajout';
    },
    frequence: function frequence() {
      this.frequence_email = event.target.id;
    },
    creerInviterGroupe: function creerInviterGroupe() {
      // MAJ MODEL pour les groups // sauvegardé en parallèle côté serveur
      var group_pseudos = [],
          i = 0,
          l = this.group_members.length;

      for (i; i < l; i++) {
        group_pseudos.push(this.group_members[i].pseudo);
      }

      this.groups.push({
        name: 'group:' + this.group_name,
        members: group_pseudos
      });
      var data = {
        user: {
          pseudo: this.pseudo,
          email: this.email
        },
        group_name: this.group_name,
        frequence_email: this.frequence_email,
        group_members: this.group_members
      };
      services('POST', 'creerInviterGroupe', data); // MAJ UI

      this.group_name = '';
      return this.group_ajout_state = 'group_ajout';
    }
  }
};
var groups_existant = {
  data: function data() {
    return {
      is_active: false,
      members: []
    };
  },
  props: ['groups', 'pseudo'],
  template: "<div> \
			<div class='affiche_group' v-for='group, index in groups' \
				@mouseover='afficherMembres( group.members )' \
				@mouseleave='is_active=false'> \
				<span> {{ parse_groups( group.name ) }} </span> \
				<font-awesome-icon icon='minus-square' @click='supprimerGroup( group, index )' size='1x' /> \
			</div> \
			<group_afficher_membres v-if='is_active' \
				:members='members'> \
			</group_afficher_membres> \
		</div>",
  methods: {
    parse_groups: function parse_groups(group) {
      console.log("GROUP");
      var s = group.indexOf(':') + 1;
      return group.substr(s);
    },
    supprimerGroup: function supprimerGroup(group, i) {
      console.log("SUP GROUP : " + group.name + ' ' + this.pseudo + ' ' + i);
      console.dir(this);
      var that = this;
      services('POST', 'supprimer_groupe', {
        pseudo: this.pseudo,
        group: group.name
      }).then(function (value) {
        console.dir(value);
        that.groups = that.groups.filter(function (elem) {
          return elem !== group;
        });
        return that.$root._data.user.groups = that.groups;
      }).catch(function (err) {
        console.error("ERR : " + err);
      });
    },
    afficherMembres: function afficherMembres(members) {
      console.log("AFFICHER MEMBRES");
      console.dir(members);
      this.is_active = true;
      return this.members = members;
    }
  }
};
var group_ajouter_nom = {
  props: ['group_name'],
  template: "<div> \
			<p> Nom {{ group_name }} : </p> \
			<input type='text' id='group_name' v-model='group_name' maxlenth='255' autofocus /> \
			<font-awesome-icon icon='angle-right' size='1x' @click=\"$emit( 'group_ajouter_membres', group_name )\" /> \
		</div>"
};
var group_afficher_membres = {
  props: ['members'],
  template: "<div class='afficher_membres'> \
		<span v-for='member, index in this.members'> {{ member }} </span> \
	</div>"
};
var group_ajouter_membres = {
  props: ['group_members'],
  data: function data() {
    return {};
  },
  template: "<div> \
			<group_ajouter_membre v-for='group_member, i in group_members' :key='i' \
				@membre_supprimer='group_members.splice( i, 1 )' \
				:index='i' \
				:member_data='group_members[ i ]'> \
			</group_ajouter_membre> \
			<hr /> \
			<span class='clickable' @click='groupAjouterMembre'> Ajouter Membre </span> \
			<hr /> \
			<frequence_email @change_frequence_email=\"$emit( 'change_frequence_email' )\"> Définir la fréquence de tirage pour le groupe </frequence_email> \
			<hr /> \
			<button @click=\"$emit( 'creer_inviter_groupe' )\"> Créer le groupe & Inviter </button> \
			<br /> \
			<button @click=\"$emit( 'annuler_creation_groupe' )\"> Annuler le Groupe </button> \
		</div>",
  methods: {
    groupAjouterMembre: function groupAjouterMembre() {
      console.log("TRACK 4");
      return this.group_members.push({});
    }
  }
};
var group_ajouter_membre = {
  props: ['index', 'member_data'],
  template: " <div class='membre'> \
			<p> Membre {{ index }}  <span class='clickable' @click=\"$emit( 'membre_supprimer' )\"> supprimer </span> </p> \
			<p> Pseudo : </p> \
			<input type='text' name='pseudo' placeholder='votre pseudo ...' v-model='member_data.pseudo' /> \
			<p> Email : </p> \
			<input type='email' name='email' placeholder='votre email ...' v-model='member_data.email' /> \
		</div>  ",
  methods: {}
};
var form_creer_compte = {
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
    verifierFormulaire: function verifierFormulaire(event) {
      _verifierFormulaire(event);
    },
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
};
var index = {
  template: "<div class='index'> \
			Tirez Votre Ange ! \
			<div class='boutons_tirage'> \
				<button class='tirage_manuel' @click=\"$emit( 'tirer_ange_manuel' )\"> Manuel ! </button> \
				<button class='tirage_manuel' @click=\"$emit( 'tirer_ange_aleatoire' )\"> Aléatoire ! </button> \
			</div> \
		</div>",
  methods: {
    tirerAnge: function tirerAnge() {
      console.log("TIRAGE ALEATOIRE");
    }
  }
};
var confirmer_invitation = {
  data: function data() {
    return {
      group_name: '',
      pseudo: '',
      frequence_email: '',
      se_souvenir_de_moi: false
    };
  },
  template: "<div> \
			{{ this.pseudo.toUpperCase() }}, VALIDEZ VOTRE INVIATTION A PARTICIPER AU GROUPE {{ this.group_name.toUpperCase() }}  \
			<form id='confirmer_invitation' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> \
			<div> \
				<label for='mdp_inv'> Mot de Passe : </label> \
				<input id='mdp_inv' type='password' placeholder='12345' autocomplete='on' autofocus \
					@input='verifierFormulaire'> \
			</div> \
			<div> \
				<label for='confirmer_mdp_inv'> Confirmer le Mot de Passe : </label> \
				<input id='confirmer_mdp_inv' type='password' placeholder='Votre mot de passe...' autocomplete='on' \
					@input='verifierFormulaire'> \
			</div> \
			<br /> \
			<frequence_email @change_frequence_email='frequenceEmail'> Souhaitez recevoir un tirage personnel ? </frequence_email> \
			<hr /> \
			<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi> \
			<div class='form_creer-compte-button'> \
				<button type='reset'> Annuler </button> \
				<button type='submit' disabled> Créer votre compte ! </button> \
			</div> \
			</form> \
		</div>",
  methods: {
    frequenceEmail: function frequenceEmail() {
      console.log("freq : " + event.target.id);
      this.frequence_email = event.target.id;
    },
    seSouvenirDeMoi: function seSouvenirDeMoi() {
      console.log("se_souvenir_de_moi : " + event.target.checked);
      this.se_souvenir_de_moi = event.target.checked;
    },
    submit: function submit() {
      console.log("SUBMIT CONFIRME INVITATION " + this.pseudo);
      var confirmer_mdp_inv = document.getElementById('confirmer_mdp_inv').value,
          mdp_inv = document.getElementById('confirmer_mdp_inv').value;
      services('POST', 'confirmerInvitation', {
        pseudo: this.pseudo,
        mdp_inv: mdp_inv,
        confirmer_mdp_inv: confirmer_mdp_inv,
        se_souvenir_de_moi: this.se_souvenir_de_moi,
        frequence_email: this.frequence_email
      }).then(function (value) {
        console.log("" + value);
        services.call(this, 'POST', 'verifierUtilisateur', {
          pseudo: this.pseudo,
          mdp: mdp_inv
        }).then(function (value) {
          console.dir(value.data.user);

          switch (value.data.response) {
            case 'utilisateur valide':
              value.vueComponent.$root._data.log_state = 'log_succes';
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
      });
    },
    verifierFormulaire: function verifierFormulaire() {
      _verifierFormulaire(event);
    }
  },
  beforeMount: function beforeMount() {
    console.log('Before Mount');
    var params = new URL(document.URL).searchParams;
    this.pseudo = params.get('pseudo');
    this.group_name = params.get('group');
  }
};
var introduction = {
  template: "<div id='introduction'> \
		INTRO DES ANGES \
		</div>"
};
var historique = {
  template: "<div> \
		HISTO \
		</div>"
};
var unlogged = {
  template: "<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_identification_div' )\" size='2x' />",
  created: function created() {
    console.log("UNLOGGED");
    console.dir(this);
    console.dir(parent.a);
  }
};
var logged = {
  props: ['user'],
  template: "<div id='logged'> \
		<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_connected_div' )\" size='2x' /> \
		<p class='sign'> {{ user }} </p> \
	</div>"
};
var log_success = {
  template: '<p> LOGGED ! <br /> Welcome :) </p>'
};
var bouton_fermeture_div = {
  template: "<div> \
			<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> \
		</div>",
  methods: {
    closeDiv: function closeDiv(e) {
      var el = document.getElementById("pop_up");
      el.classList.replace('afficher_pop_up', 'afficher_none');
      this.$emit('close_div', '');
    }
  }
};
var frequence_email = {
  template: "<div> \
			<slot></slot> \
			<div class='choix-frequence'> \
				<input type='radio' name='frequence_email' id='aucun' checked @change=\"$emit( 'change_frequence_email' )\"> <label for='aucun'> Aucun </label> <br /> \
				<input type='radio' name='frequence_email' id='quot' @change=\"$emit( 'change_frequence_email' )\"> <label for='quot'> Quotidient </label> <br /> \
				<input type='radio' name='frequence_email' id='hebdo' @change=\"$emit( 'change_frequence_email' )\"> <label for='hebdo'> Hebdomadaire </label> <br /> \
				<input type='radio' name='frequence_email' id='mensuel' @change=\"$emit( 'change_frequence_email' )\"> <label for='mensuel'> Mensuel </label> <br /> \
			</div> \
		</div>"
};
var se_souvenir_de_moi = {
  template: "<div class='se-souvenir-de-moi'> \
			<input type='checkbox' id='se_souvenir_de_moi' value='se_souvenir' \
				@change=\"$emit( 'se_souvenir_de_moi' )\" /> \
			<label for='se_souvenir_de_moi'> Se souvenir de moi ( 30 jours ) </label> \
		</div>"
};
var liste_anges = {
  props: ['cartes', 'type', 'mode'],
  data: function data() {
    return {
      activeClass: '',
      afficher_carte: false,
      carte_nom: '',
      carte: {},
      cartes_marquees: [],
      rejouer: false
    };
  },
  template: "<section class='liste_anges'> \
			<span :data-carte='carte' :class='activeClass' v-for='carte in cartes' \
				@click='afficherCarte( carte )'> \
				{{ this.activeClass !== 'manuel' ? carte : '-------' }} \
			</span> \
			<carte v-if='afficher_carte' \
				@close_div='reinitialiserAffichage' \
				:carte_nom='carte_nom' \
				:carte='carte'> \
			</carte> \
			<div id='rejouer' class='clickable' v-if='rejouer' @click='tirageAleatoire'> \
				Tirer à Nouveau ! \
			</div> \
		</section>",
  methods: {
    afficherCarte: function afficherCarte(carte, timeout) {
      console.log("++++ : " + carte + " " + timeout);
      var that = this;
      setTimeout(function () {
        that.afficher_carte = true;
        that.carte_nom = carte;
        services('POST', 'obtenirCarte', {
          carte: carte
        }).then(function (value) {
          console.dir(value.data);
          that.carte = value.data;
        }).catch(function (err) {
          console.log("OBTENIR CARTE ERROR : " + err);
        });
      }, timeout ? timeout : 0);
    },
    reinitialiserAffichage: function reinitialiserAffichage() {
      this.afficher_carte = false;
      var el = document.getElementsByClassName('liste_anges')[0].children;
      console.log("REINITIALISER ( length ) : " + this.cartes_marquees.length);
      this.cartes_marquees.forEach(function (val) {
        console.log("REINITIALISER : " + val);
        el[val].style.backgroundColor = 'initial';
      });
      this.rejouer = true;
    },
    allouerClasse: function allouerClasse() {
      console.log("ALLO");
    },
    tirageManuel: function tirageManuel() {},
    tirageAleatoire: function tirageAleatoire() {
      var i = 0,
          nb_flash = 2,
          liste_elements = this.cartes.length,
          el = document.getElementsByClassName('liste_anges')[0].children,
          valeur_aleatoire,
          prev_index;

      for (i; i <= nb_flash; i++) {
        if (i > 0) {
          prev_index = valeur_aleatoire;

          (function (i, prev_index, that) {
            setTimeout(function () {
              el[prev_index].style.backgroundColor = 'red';
            }, 1000 * i);
          })(i, prev_index, this);
        }

        valeur_aleatoire = Math.floor(Math.random() * liste_elements);
        this.cartes_marquees.push(valeur_aleatoire);

        (function (i, index, that) {
          setTimeout(function () {
            // mise en avant de la carte choisie
            el[index].style.backgroundColor = 'blue';

            if (i === nb_flash) {
              setTimeout(function () {
                that.afficherCarte(el[index].dataset["carte"], 1000);
              });
            }
          }, 1000 * i);
        })(i, valeur_aleatoire, this);
      }
    }
  },
  mounted: function mounted() {
    console.log("CREATED : " + this.mode);
    this.activeClass = this.mode;

    if (this.mode === "aleatoire") {
      this.tirageAleatoire();
    }
  }
};
var carte = {
  props: ['carte', 'carte_nom'],
  template: "<div> \
		<div class='masque'></div> \
		<div class='container'> \
			<section id='carte'> \
				<font-awesome-icon id='close_div' icon='times' @click=\"$emit( 'close_div' )\" style='float: right;' /> \
				<article> \
					<header> \
						<span> {{ this.carte_nom.toUpperCase() }} </span> <span> {{ this.carte.Dates }} </span> \
						<br > \
						<span> {{ this.carte.Ange }} </span> <span> {{ this.carte.Sephirot }} </span> \
					</header> \
					<main> \
						<div> \
							<img /> \
						</div> \
						<div> \
							<div> {{ this.carte.text }} </div> \
							<div> Plan Physique : {{ this.carte[ 'Plan physique' ] }} </div> \
							<div> Plan Emotionnel : {{ this.carte[ 'Plan émotionnel' ] }} </div> \
							<div> Plan Spirituel : {{ this.carte[ 'Plan spirituel' ] }} </div> \
						</div> \
					</main> \
				</article> \
			</section> \
		</div> \
		</div> \
	</div>"
};
var form_auth = {
  props: ['groups'],
  template: "<div id='form_authentication'> \
		<form id='login' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate > \
			<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> \
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
    closeDiv: function closeDiv(e) {
      var el = document.getElementById("pop_up");
      el.classList.replace('afficher_pop_up', 'afficher_none');
      this.$emit('close_div', '');
    },
    verifierFormulaire: function verifierFormulaire(event) {
      _verifierFormulaire(event);
    },
    submit: function submit(e) {
      var fname = "SUBMIT AUTH FORM";
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
            }, 1000);
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
var gestion_compte = {
  data: function data() {
    return {
      group_state: 'groups_existant'
    };
  },
  props: ['pseudo', 'email', 'groups'],
  template: "<div id='gestion_compte'> \
				<bouton_fermeture_div @close_div='closeDiv' ></bouton_fermeture_div> \
				<p> Mon Pseudo : </p> \
					{{ this.pseudo }} \
				<br /> \
				<p> Mon Email : </p> \
					{{ this.email }} \
				<br /> \
				<p> Mes Groupes : \
					<groups_existant v-if='groupsExists' \
						:pseudo='pseudo' \
						:groups='groups'> \
					</groups_existant> \
					<group_ajout_wrapper \
						:pseudo='pseudo' \
						:groups='groups' \
						:email='email'> \
					</group_ajout_wrapper> \
				</p> \
				<br /> \
				<button @click=\"$emit( 'deconnexion' )\"> Déconnexion </button> \
			</div>",
  methods: {
    closeDiv: function closeDiv() {
      var el = document.getElementById("pop_up");
      el.classList.replace('afficher_pop_up', 'afficher_none');
      this.$emit('close_div', '');
    }
  },
  computed: {
    groupsExists: function groupsExists() {
      console.log("groupsExists : " + this.groups.length);

      if (this.groups.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    handleGroups: function handleGroups() {
      var l = this.groups.length;

      if (l === 0) {
        return this.group_state = 'groups_vide';
      } else {
        return this.group_state = 'groups_existant';
      }
    },
    groupAjouterNom: function groupAjouterNom() {
      console.log("TRACK 2 " + this.group_ajout_state);
      this.group_ajout_state = 'group_ajouter_nom';
    },
    groupAjout: function groupAjout() {
      return this.group_ajout_state;
    }
  }
};

_vue.default.component('unlogged', unlogged);

_vue.default.component('logged', logged);

_vue.default.component('log_success', log_success);

_vue.default.component('bouton_fermeture_div', bouton_fermeture_div);

_vue.default.component('frequence_email', frequence_email);

_vue.default.component('se_souvenir_de_moi', se_souvenir_de_moi);

_vue.default.component('form_auth', form_auth);

_vue.default.component('form_creer_compte', form_creer_compte);

_vue.default.component('group_ajout', group_ajout);

_vue.default.component('group_ajout_wrapper', group_ajout_wrapper);

_vue.default.component('groups_existant', groups_existant);

_vue.default.component('group_ajouter_nom', group_ajouter_nom);

_vue.default.component('group_ajouter_membres', group_ajouter_membres);

_vue.default.component('group_ajouter_membre', group_ajouter_membre);

_vue.default.component('group_afficher_membres', group_afficher_membres);

_vue.default.component('gestion_compte', gestion_compte);

_vue.default.component('index', index);

_vue.default.component('confirmer_invitation', confirmer_invitation);

_vue.default.component('introduction', introduction);

_vue.default.component('historique', historique);

_vue.default.component('liste_anges', liste_anges);

_vue.default.component('carte', carte); // VUE APP


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

function services(method, url, data) {
  var vueComponent = this;
  return new Promise(function (resolve, reject) {
    var fname = "SERVICES";

    if (window.XMLHttpRequest) {
      console.info("OK : [ " + fname + " ] XHR Object Found");
      var xhr = new XMLHttpRequest();
    } else {
      console.info("KO : [ " + fname + " ] No XHR Object Found");
      return false;
    }

    xhr.timeout = 5000;
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

    xhr.ontimeout = function () {
      reject('XHR Timeout : ' + Error('in error constructor ' + xhr.statusText));
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

function viderDiv(div_id) {
  var div = document.getElementById(div_id);

  while (div.firstChild) {
    div.removeChild(div.firstChild);
  }
}

function _verifierFormulaire(event) {
  console.log("VERFIFIER FORMULAIRE");
  var fname = "VERFIFIER FORMULAIRE";
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

  switch (form_name) {
    case 'login':
      console.log(form_name);

      if (pseudo.length > 5 && mdp.length > 5) {
        event.target.form[2].disabled = false;
        info.innerText = null;
        if (classe_erreur) info.classList.toggle('afficher_message_erreur');
      } else {
        console.error("KO : [ " + fname + " ] Données invalides pour authentifier l'utilisateur");
        document.querySelector('[type=submit]').disabled = true;
        if (!classe_erreur) info.classList.toggle('afficher_message_erreur');
        info.innerText = message;
      }

      break;

    case 'creer_compte':
      var email = document.getElementById('email').value,
          confirmer_mdp = document.getElementById('confirmer_mdp').value;

      if (pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat(email) && mdp === confirmer_mdp) {
        document.querySelector('[type=submit]').disabled = false;
        info.innerText = null;
        if (classe_erreur) info.classList.toggle('afficher_message_erreur');
      } else {
        console.error("KO : [ " + fname + " ] Données invalides pour la création du compte");
        document.querySelector('[type=submit]').disabled = true;
        if (!classe_erreur) info.classList.toggle('afficher_message_erreur');
        info.innerText = message + '\n' + email_err + '\n' + mdp_differents;
      }

      break;

    case 'confirmer_invitation':
      var confirmer_mdp_inv = document.getElementById('confirmer_mdp_inv').value,
          mdp_inv = document.getElementById('mdp_inv').value;
      console.log("CONFIRMER INVITATIOH : " + mdp_inv + ' / ' + confirmer_mdp_inv);

      if (mdp_inv.length > 5 && mdp_inv === confirmer_mdp_inv) {
        document.querySelector('[type=submit]').disabled = false;
      } else {
        console.error("KO : [ " + fname + " ] Données invalides pour confirmer l'invitation du membre");
        document.querySelector('[type=submit]').disabled = true;
      }

      break;
  }
}

function verifierEmailFormat(email) {
  var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}