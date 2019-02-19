"use strict";

module.exports = {
  index: {
    props: ['user'],
    data: function data() {
      return {
        args: [{
          titre: 'Ils sont partout !',
          img: './app/img/ange.jpg',
          bg_color: 'black',
          text: 'Les anges sont partout autour de nous. Créez, et entretenez le lien avec eux, savourez la puissance de leur message !'
        }, {
          titre: 'Spiritualité entre Amis :)',
          img: './app/img/partager.jpeg',
          bg_color: 'darkgoldenrod',
          text: 'Partagez votre spiritualité par un tirage des cartes avec un, ou des groupes d\'amis.'
        }, {
          titre: 'Historisez !',
          img: './app/img/archive.jpeg',
          bg_color: 'powderblue',
          text: 'Grace à l\'historique, suivez votre évolution sur une période indéterminée. Quel sera votre chemin avec les Anges ?'
        }, {
          titre: 'Tirage par Email.',
          img: './app/img/email.jpeg',
          bg_color: 'chocolate',
          text: 'Recevez par email, à la fréquence que vous préférez, un tirage. Quoi de mieux pour commencer la journée que la lecture d\'un thème Angellique ?'
        }, {
          titre: 'Partagez sur Facebook',
          img: './app/img/facebook.png',
          bg_color: 'black',
          text: 'Partagez le résultat de votre tirage via Facebook'
        }, {
          titre: 'Et plus à venir ...',
          img: './app/img/fountain.jpeg',
          bg_color: 'gold',
          text: 'Vos idées et remarques sont bienvenues ! Elles peuvent même donner lieux à de nouvelles fonctionnalités dans cette application.'
        }]
      };
    },
    template: "<div>\n\t\t\t\t<div class='index'>\n\t\t\t\t\t<p class='hero_text'> Les Anges, Vos Compagnons Spirituels </p>\n\t\t\t\t</div>\n\t\t\t\t<div class='separateur'></div>\n\t\t\t\t<section class='args'>\n\t\t\t\t\t<article class='wrapper' :style=\"'background-color: ' + arg.bg_color\" v-for='arg, index in args' :key='index'>\n\t\t\t\t\t\t<figure class='img'>\n\t\t\t\t\t\t\t<img alt='' :src='arg.img' width='100%' />\n\t\t\t\t\t\t</figure>\n\t\t\t\t\t\t<div class='content'>\n\t\t\t\t\t\t\t<div class='titre'>\n\t\t\t\t\t\t\t\t{{ arg.titre }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class='text'>\n\t\t\t\t\t\t\t\t{{ arg.text }}\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</article>\n\t\t\t\t</section>\n\t\t\t\t<div class='separateur'></div>\n\t\t\t\t<contact :user='user'></contact>\n\t\t\t</div>\n\t\t\t</div>",
    mounted: function mounted() {
      /*
      let el = document.getElementsByClassName( 'hero_text' )[ 0 ],
      	ref = document.getElementById( 'hero_img' )
      	let H1 = ref.clientHeight,
      	L1 = ref.clientWidth,
      	H2 = el.clientHeight,
      	L2 = el.clientWidth,
      	offset_x, 
      	offset_y
      	offset_y = ( H1 - H2 ) / 2
      offset_x = ( L1 - L2 ) / 2
      	console.log( H1, H2, L1, L2, offset_x, offset_y ) 
      	el.style.top = ( offset_y + 200 ) + 'px'
      el.style.left = offset_x + 'px'
      */
    }
  },
  confirmer_compte: {
    data: function data() {
      return {
        pseudo: ''
      };
    },
    template: "<div>\n\t\t\t\tCONFIRMER CREATION COMPTE\n\t\t\t</div>",
    mounted: function mounted() {
      services('POST', 'confirmerCreationCompte', {
        pseudo: pseudo
      });
    }
  },
  confirmer_invitation: {
    data: function data() {
      return {
        group_name: '',
        pseudo: '',
        frequence_email: '',
        se_souvenir_de_moi: false
      };
    },
    template: "<div>\n\t\t\t\t{{ this.pseudo.toUpperCase() }}, VALIDEZ VOTRE INVIATTION A PARTICIPER AU GROUPE {{ this.group_name.toUpperCase() }}\n\t\t\t\t<form id='confirmer_invitation' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate>\n\t\t\t\t<div>\n\t\t\t\t\t<label for='mdp_inv'> Mot de Passe : </label>\n\t\t\t\t\t<input id='mdp_inv' type='password' placeholder='12345' autocomplete='on' autofocus\n\t\t\t\t\t\t@input='verifierFormulaire'>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<label for='confirmer_mdp_inv'> Confirmer le Mot de Passe : </label>\n\t\t\t\t\t<input id='confirmer_mdp_inv' type='password' placeholder='Votre mot de passe...' autocomplete='on'\n\t\t\t\t\t\t@input='verifierFormulaire'>\n\t\t\t\t</div>\n\t\t\t\t<br />\n\t\t\t\t<frequence_email @change_frequence_email='frequenceEmail'> Souhaitez recevoir un tirage personnel ? </frequence_email>\n\t\t\t\t<hr />\n\t\t\t\t<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi>\n\t\t\t\t<div class='form_creer-compte-button'>\n\t\t\t\t\t<button type='reset'> Annuler </button>\n\t\t\t\t\t<button type='submit' disabled> Cr\xE9er votre compte ! </button>\n\t\t\t\t</div>\n\t\t\t\t</form>\n\t\t\t</div>",
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
                value.vueComponent.root._data.log_state = 'log_succes';
                value.vueComponent.root._data.connected = true;
                value.vueComponent.root._data.user = {
                  pseudo: value.data.user.pseudo,
                  email: value.data.user.email,
                  groups: value.data.user.groups,
                  ttl: value.data.user.ttl
                };
                setTimeout(function () {
                  document.getElementById('pop_up').classList.replace('afficher_pop_up', 'afficher_none');
                  value.vueComponent.root._data.log_state = 'logged';
                }, 500);
                break;

              case 'utilisateur invalide':
                value.vueComponent.root._data.log_state = 'unlogged';
                break;
            }
          });
        });
      },
      verifierFormulaire: function (_verifierFormulaire) {
        function verifierFormulaire() {
          return _verifierFormulaire.apply(this, arguments);
        }

        verifierFormulaire.toString = function () {
          return _verifierFormulaire.toString();
        };

        return verifierFormulaire;
      }(function () {
        verifierFormulaire(event);
      })
    },
    beforeMount: function beforeMount() {
      console.log('Before Mount');
      var params = new URL(document.URL).searchParams;
      this.pseudo = params.get('pseudo');
      this.group_name = params.get('group');
    }
  },
  afficher_menu_navigation: {
    props: ['message', 'afficher_menu_navigation'],
    template: "<transition name='afficher_menu_navigation'>\n\t\t\t<div class='afficher_menu_navigation'>\n\t\t\t\t<section class='clickable'>\n\t\t\t\t\t<div id='logo'> \n\t\t\t\t\t\t<a @click.prevent=\"redirectNavigate( 'index' )\"> {{ message }} </a>\n\t\t\t\t\t</div> \n\t\t\t\t\t<div> <a @click.prevent=\"redirectNavigate( 'introduction' )\"> Introduction </a> </div>\n\t\t\t\t\t<div> <a @click.prevent=\"redirectNavigate( 'liste_anges', 'explorer' )\"\n\t\t\t\t\t\t:mode='mode_liste_anges'> Explorer Les Anges </a> </div>\n\t\t\t\t\t<div> <a @click.prevent=\"redirectNavigate( 'historique' )\"> Historique </a> </div>\n\t\t\t\t\t<div> <a @click.prevent=\"redirectNavigate( 'liste_anges', 'manuel' )\"> Tirage Manuel </a> </div>\n\t\t\t\t\t<div> <a @click.prevent=\"redirectNavigate( 'liste_anges', 'aleatoire' )\"> Tirage Al\xE9atoire </a> </div>\n\t\t\t\t</section>\n\t\t\t\t<section>\n\t\t\t\t\t<img alt='image d ambiance, hello !' src='./app/img/hello.jpeg' width='100%' />\n\t\t\t\t\t<div class='clickable' style='text-align: center;' @click='fermerMenuNavigationMobile'>\n\t\t\t\t\t\t<img alt='image de fermeture du menu de navigation' src='./app/img/croix_fermer.png' width='100%' />\n\t\t\t\t\t</div>\n\t\t\t\t</section>\n\t\t\t</div>\n\t\t\t</transition>",
    methods: {
      fermerMenuNavigationMobile: function fermerMenuNavigationMobile() {
        console.log("FERMER MENU NAVIGATION MOBILE");
        this.$root.$data.afficher_menu_navigation = false;
      },
      redirectNavigate: function redirectNavigate(link, mode) {
        this.$root.navigate(link, mode);
        this.fermerMenuNavigationMobile();
      }
    },
    mounted: function mounted() {
      /*
      let target = document.getElementsByClassName( 'afficher_menu_navigation' )[ 0 ]
      	el = document.getElementsByTagName( 'header' )[ 0 ],
      	h = el.getClientRects()[ 0 ].height
      	target.style.top = h + 'px'
      console.log( h ) 
      */
    }
  },
  contact: {
    props: ['user'],
    data: function data() {
      return {
        message_contact: false,
        message: null,
        message_ok: false,
        message_erreur: false
      };
    },
    template: "<div class='contact_form'>\n\t\t\t\t<div class='form_title'>\n\t\t\t\t\tPour nous contacter :\n\t\t\t\t</div>\n\t\t\t\t<form @submit.prevent='demandeContact'>\n\t\t\t\t\t<div class='email_line'>\n\t\t\t\t\t\t<label for='email_contact_form'> Votre Email : </label>\n\t\t\t\t\t\t<input type='email' id='email_contact_form' :value='user.email' width='100%'/>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='message_line'>\n\t\t\t\t\t\t<label for='message_contact_form'> Votre Message : </label>\n\t\t\t\t\t\t<textarea id='message_contact_form' value='' width='100%'></textarea>\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class='buttons_line'>\n\t\t\t\t\t\t<button type='reset'> Annuler </button>\n\t\t\t\t\t\t<button type='submit'> Envoyer ! </button>\n\t\t\t\t\t</div>\n\t\t\t\t\t<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' \n\t\t\t\t\t\tv-if='message_contact'> \n\t\t\t\t\t\t\t{{ message }} \n\t\t\t\t\t</message_modif_compte>\n\t\t\t\t</form>\n\t\t\t</div>",
    methods: {
      demandeContact: function demandeContact() {
        console.log("CONTACT : SUBMIT");
        console.dir(event);
        var email = document.getElementById('email_contact_form').value.trim(),
            message = document.getElementById('message_contact_form').value.trim(),
            that = this,
            data = {};

        function resetMessages() {
          setTimeout(function () {
            that.$data.message_contact = false;
            that.$data.message_erreur = false;
            that.$data.message_ok = false;
          }, 3000);
        }

        if (verifierEmailFormat && message.length > 0) {
          data = {
            date: new Date(),
            email: email,
            message: message
          };
          services('POST', 'demandeContact', data).then(function (value) {
            if (value.data.response === 'ok') {
              that.message_contact = true;
              that.message = 'Votre demande est en cours de traitement. Merci de votre interet !';
              that.message_ok = true;
              document.getElementById('message_contact_form').value = '';
              resetMessages();
            } else {
              throw 'Demande impossible à traiter';
            }
          }).catch(function (err) {
            that.message_contact = true;
            that.message_erreur = true;
            that.message = err;
          }).finally(function () {
            resetMessages();
          });
        } else {
          that.message_contact = true;
          that.message = 'Merci de renseigner : \nun email valide \n un message non nul !';
          that.message_erreur = true;
          resetMessages();
        }
      }
    },
    updated: function updated() {
      console.log("CONTACT UPDATE HOOK :");
      console.dir(this.user);
      console.log(!!this.user.email);
      var el = document.getElementById('email_contact_form');

      if (this.user.email) {
        el.disabled = true;
      } else {
        el.disabled = false;
      }

      console.log("------");
    }
  },
  introduction: {
    template: "<div id='introduction'>\n\t\t\tINTRO DES ANGES\n\t\t\t</div>"
  },
  historique: {
    template: "<div>\n\t\t\tHISTO\n\t\t\t</div>"
  },
  partager: {
    template: ""
  },
  faire_un_don: {
    template: ""
  }
};