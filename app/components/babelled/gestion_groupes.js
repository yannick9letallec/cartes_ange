"use strict";

module.exports = {
  group_ajouter_nom: {
    props: ['group_name'],
    template: "<div> \n\t\t\t\t<p> Nom {{ group_name }} : </p> \n\t\t\t\t<input type='text' id='group_name' v-model='group_name' maxlenth='255' autofocus /> \n\t\t\t\t<font-awesome-icon icon='angle-right' size='2x' @click=\"$emit( 'group_ajouter_membres', group_name )\" /> \n\t\t\t</div>"
  },
  group_ajouter_membres: {
    props: ['group_members'],
    template: "<div>\n\t\t\t\t<group_ajouter_membre v-for='group_member, i in group_members' :key='i'\n\t\t\t\t\t@membre_supprimer='group_members.splice( i, 1 )' \n\t\t\t\t\t:index='i' \n\t\t\t\t\t:member_data='group_members[ i ]'>\n\t\t\t\t</group_ajouter_membre>\n\t\t\t\t<hr />\n\t\t\t\t<span class='clickable' \n\t\t\t\t\t@click='groupAjouterMembre'>\n\t\t\t\t\t\tAjouter Membre\n\t\t\t\t</span>\n\t\t\t\t<hr />\n\t\t\t\t<frequence_email \n\t\t\t\t\t:form_id=\"'gestion_compte_ajouter_groupe'\"\n\t\t\t\t\t@change_frequence_email=\"$emit( 'change_frequence_email' )\">\n\t\t\t\t\t\tD\xE9finir la fr\xE9quence de tirage pour le groupe\n\t\t\t\t</frequence_email>\n\t\t\t\t<hr />\n\t\t\t\t<button @click=\"$emit( 'creer_inviter_groupe' )\">\n\t\t\t\t\tCr\xE9er le groupe & Inviter\n\t\t\t\t</button>\n\t\t\t\t<br />\n\t\t\t\t<button @click=\"$emit( 'annuler_creation_groupe' )\">\n\t\t\t\t\tAnnuler le Groupe\n\t\t\t\t</button> \n\t\t\t</div>",
    methods: {
      groupAjouterMembre: function groupAjouterMembre() {
        console.log("TRACK 4");
        return this.group_members.push({});
      }
    }
  },
  group_ajouter_membre: {
    props: ['index', 'member_data'],
    template: " <div class='membre'> \n\t\t\t\t<p> Membre {{ index }}  <span class='clickable' @click=\"$emit( 'membre_supprimer' )\"> supprimer </span> </p> \n\t\t\t\t<p> Pseudo : </p> \n\t\t\t\t<input type='text' name='pseudo' placeholder='votre pseudo ...' v-model='member_data.pseudo' /> \n\t\t\t\t<p> Email : </p> \n\t\t\t\t<input type='email' name='email' placeholder='votre email ...' v-model='member_data.email' /> \n\t\t\t</div>",
    methods: {}
  },
  group_ajout: {
    template: "<div> \n\t\t\t\t<span class='clickable' @click=\"$emit( 'group_ajouter_nom' )\"> Groupe \n\t\t\t\t\t<font-awesome-icon icon='plus-square' size='1x' /> \n\t\t\t\t</span> \n\t\t\t</div>"
  },
  group_ajout_wrapper: {
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
    template: "<div> \n\t\t\t<div class='groups'> Groupes {{\xA0group_name }}: \n\t\t\t\t<component :group_name='group_name' \t:is='group_ajout_state' \n\t\t\t\t\t:group_members='group_members' \n\t\t\t\t\t@change_frequence_email='frequence' \n\t\t\t\t\t@group_ajouter_nom=\" group_ajout_state='group_ajouter_nom' \" \n\t\t\t\t\t@group_ajouter_membres='groupAjouterMembres' \n\t\t\t\t\t@annuler_creation_groupe='annulerCreationGroupe' \n\t\t\t\t\t@frequence_email='frequence' \n\t\t\t\t\t@creer_inviter_groupe='creerInviterGroupe'> \n\t\t\t\t</component> \n\t\t\t</div> \n\t\t</div>",
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
        console.log("FREQUENCE EMAIL AJ GROUP " + event.target.id);
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
          group: {
            name: 'group:' + this.group_name,
            members: group_pseudos
          }
        });
        var data = {
          user: {
            pseudo: this.pseudo,
            email: this.email
          },
          group_name: this.group_name,
          frequence_email: this.frequence_email.split(':')[1],
          group_members: this.group_members
        };
        services('POST', 'creerInviterGroupe', data); // MAJ UI

        this.group_name = '';
        return this.group_ajout_state = 'group_ajout';
      }
    }
  },
  groups_existant: {
    data: function data() {
      return {
        afficher_membres: false,
        members: [],
        is_owner: false,
        frequence_email: '',
        group_name: ''
      };
    },
    props: ['groups', 'pseudo'],
    template: "<div> \n\t\t\t\t<div class='affiche_group clickable' v-for='item, index in groups' \n\t\t\t\t\t@click='supprimerGroup( item, index )'\n\t\t\t\t\t@mouseenter='afficherMembres( \n\t\t\t\t\t\titem.group.members, \n\t\t\t\t\t\titem.group.owner, \n\t\t\t\t\t\titem.group.name,\n\t\t\t\t\t\titem.group.frequence_email )'> \n\t\t\t\t\t<font-awesome-icon icon='minus-square' size='1x' /> \n\t\t\t\t\t<span> {{ parse_groups( item.group.name ) }} </span> \n\t\t\t\t</div> \n\t\t\t\t<group_afficher_membres v-if='afficher_membres' \n\t\t\t\t\t:group_name='group_name'\n\t\t\t\t\t:is_closable='true'\n\t\t\t\t\t:is_owner='is_owner'\n\t\t\t\t\t:frequence_email='frequence_email'\n\t\t\t\t\t:members='members'> \n\t\t\t\t</group_afficher_membres> \n\t\t\t</div>",
    methods: {
      parse_groups: function parse_groups(group) {
        console.log("GROUP");
        console.dir(group);
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
          return that.root._data.user.groups = that.groups;
        }).catch(function (err) {
          console.error("ERR : " + err);
        });
      },
      afficherMembres: function afficherMembres(members, owner, group_name, frequence_email) {
        console.log("AFFICHER MEMBRES");
        this.afficher_membres = true;
        this.group_name = group_name;
        this.pseudo === owner ? this.is_owner = true : this.is_owner = false;
        this.frequence_email = frequence_email;
        var el = document.getElementsByClassName('afficher_membres')[0];
        console.dir(el);
        /*
        el.style.top = event.clientX - 25
        el.style.right = event.clientY
        */

        return this.members = members;
      }
    }
  },
  group_afficher_membres: {
    props: ['is_owner', 'members', 'frequence_email', 'is_closable', 'group_name'],
    template: "<div class='afficher_membres'> \n\t\t\t\t<bouton_fermeture_div v-if='is_closable'\n\t\t\t\t\t@close_div='closeDiv'>\n\t\t\t\t</bouton_fermeture_div> \n\t\t\t\t<p> <mark> Groupe : {{ group_name.split( ':' )[ 1 ] }} </mark> </p>\n\t\t\t\t<p class='participants'> <mark> Participants : </mark> </p>\n\t\t\t\t<span v-for='member, index in this.members'> {{ member }} </span> \n\t\t\t\t<br />\n\t\t\t\t<div v-if='is_owner'>\n\t\t\t\t\t<frequence_email \n\t\t\t\t\t\t:form_id=\"'afficher_membres'\"\n\t\t\t\t\t\t:is_closable='is_closable'\n\t\t\t\t\t\t:frequence='frequence_email' \n\t\t\t\t\t\t@change_frequence_email='changeFrequenceEmail'> \n\t\t\t\t\t\t<mark> Modifiez la fr\xE9quence de tirage : </mark> \n\t\t\t\t\t</frequence_email>\n\t\t\t\t</div>\n\t\t</div>",
    methods: {
      closeDiv: function closeDiv() {
        var el = document.getElementsByClassName('afficher_membres')[0];
        el.classList.toggle('afficher_none');
      },
      changeFrequenceEmail: function changeFrequenceEmail() {
        console.log("CHANGER FREQ EMAIL FOR GROUPS");
        var freq = event.target.id,
            that = this;
        freq = freq.split(':')[1];
        services('POST', 'modifierFrequenceEmailGroup', {
          group_name: this.group_name,
          frequence_email: freq
        }).then(function (value) {
          console.log("PROMISE OK");
        }).catch(function (err) {
          console.log("ERROR : " + err);
        });
      }
    },
    mounted: function mounted() {
      /*
      let el = document.getElementsByClassName( 'afficher_membres' )[ 0 ]
      el.classList.toggle( 'afficher_none' )
      */
    }
  }
};