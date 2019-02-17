"use strict";

module.exports = {
  group_ajouter_nom: {
    props: ['nom_du_groupe'],
    template: "<div> \n\t\t\t\t<p> Nom {{ nom_du_groupe }} : </p> \n\t\t\t\t<input type='text' id='nom_du_groupe' v-model='nom_du_groupe' maxlenth='255' autofocus /> \n\t\t\t\t<font-awesome-icon icon='angle-right' size='2x' @click=\"$emit( 'group_ajouter_membres', nom_du_groupe )\" /> \n\t\t\t</div>"
  },
  group_ajouter_membres: {
    props: ['group_members'],
    template: "<div>\n\t\t\t\t<group_ajouter_membre v-for='group_member, i in group_members' :key='i'\n\t\t\t\t\t@membre_supprimer='group_members.splice( i, 1 )' \n\t\t\t\t\t:index='i' \n\t\t\t\t\t:member_data='group_members[ i ]'>\n\t\t\t\t</group_ajouter_membre>\n\t\t\t\t<button type='button'\n\t\t\t\t\t@click='groupAjouterMembre'>\n\t\t\t\t\t\tAjouter Membre\n\t\t\t\t</button>\n\t\t\t\t<hr />\n\t\t\t\t<frequence_email \n\t\t\t\t\t:form_id=\"'gestion_compte_ajouter_groupe'\"\n\t\t\t\t\t@change_frequence_email=\"$emit( 'change_frequence_email' )\">\n\t\t\t\t\t\tD\xE9finir la fr\xE9quence de tirage pour le groupe\n\t\t\t\t</frequence_email>\n\t\t\t\t<hr />\n\t\t\t\t<button @click=\"$emit( 'creer_inviter_groupe' )\">\n\t\t\t\t\tCr\xE9er le groupe & Inviter\n\t\t\t\t</button>\n\t\t\t\t<br />\n\t\t\t\t<button @click=\"$emit( 'annuler_creation_groupe' )\">\n\t\t\t\t\tAnnuler le Groupe\n\t\t\t\t</button> \n\t\t\t</div>",
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
    props: ['user'],
    data: function data() {
      return {
        group_ajout: false,
        group_ajout_state: 'group_ajout',
        nom_du_groupe: '',
        group_members: [],
        frequence_email: ''
      };
    },
    template: "<div> \n\t\t\t<div class='groups'> Groupe <strong> {{ nom_du_groupe }}\xA0</strong>: \n\t\t\t\t<component :is='group_ajout_state' \n\t\t\t\t\t:nom_du_groupe='nom_du_groupe' \t\n\t\t\t\t\t:group_members='group_members' \n\t\t\t\t\t@change_frequence_email='frequence' \n\t\t\t\t\t@group_ajouter_nom=\" group_ajout_state='group_ajouter_nom' \" \n\t\t\t\t\t@group_ajouter_membres='groupAjouterMembres' \n\t\t\t\t\t@annuler_creation_groupe='annulerCreationGroupe' \n\t\t\t\t\t@frequence_email='frequence' \n\t\t\t\t\t@creer_inviter_groupe='creerInviterGroupe'> \n\t\t\t\t</component> \n\t\t\t</div> \n\t\t</div>",
    methods: {
      groupAjouterMembres: function groupAjouterMembres(nom) {
        this.nom_du_groupe = nom;
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
        this.nom_du_groupe = '';
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
            l = this.group_members.length,
            freq = this.frequence_email.split(':')[1];

        for (i; i < l; i++) {
          group_pseudos.push(this.group_members[i].pseudo);
        }

        this.user.groups.push({
          group: {
            name: 'group:' + this.nom_du_groupe,
            members: group_pseudos,
            owner: this.user.pseudo,
            frequence_email: freq
          }
        });
        var data = {
          user: this.user,
          nom_du_groupe: this.nom_du_groupe,
          frequence_email: freq,
          group_members: this.group_members
        };
        services('POST', 'creerInviterGroupe', data); // MAJ UI

        this.nom_du_groupe = '';
        return this.group_ajout_state = 'group_ajout';
      }
    }
  },
  groups_existant: {
    data: function data() {
      return {
        afficher_group_details: false,
        members: [],
        is_owner: false,
        frequence_email: '',
        group: '',
        nom_groupe_actuel: ''
      };
    },
    props: ['user'],
    template: "<div> \n\t\t\t\t<div class='affiche_group clickable' v-for='item, index in user.groups' \n\t\t\t\t\t@click='supprimerGroup( item,  index )'\n\t\t\t\t\t@mouseenter='afficherGroupDetails( item )'> \n\t\t\t\t\t<font-awesome-icon icon='minus-square' size='1x' /> \n\t\t\t\t\t<span> {{ parse_groups( item.group.name ) }} </span> \n\t\t\t\t</div> \n\t\t\t\t<group_afficher_details v-if='afficher_group_details' \n\t\t\t\t\t:user='user'\n\t\t\t\t\t:group='group'\n\t\t\t\t\t:is_closable='true'\n\t\t\t\t\t:is_owner='is_owner'>\n\t\t\t\t</group_afficher_details> \n\t\t\t</div>",
    methods: {
      parse_groups: function parse_groups(group) {
        console.log("GROUP");
        console.dir(group);
        var s = group.indexOf(':') + 1;
        return group.substr(s);
      },
      supprimerGroup: function supprimerGroup(group, i) {
        console.log("SUP GROUP : " + group.name + ' ' + this.user.pseudo + ' ' + i);
        console.dir(this);
        var that = this;
        services('POST', 'supprimer_groupe', {
          pseudo: this.user.pseudo,
          group: group.name
        }).then(function (value) {
          console.dir(value);
          that.groups = that.groups.filter(function (elem) {
            return elem !== group;
          });
          return that.$data.user.groups = that.groups;
        }).catch(function (err) {
          console.error("ERR : " + err);
        });
      },
      afficherGroupDetails: function afficherGroupDetails(group) {
        console.log("AFFICHER GROUPE DETAIL");
        console.log("GROUP");
        console.dir(group);
        console.log("OWNER");
        console.dir(group.owner);
        this.group = group;
        this.nom_groupe_actuel = group.name;
        this.user.pseudo === group.owner ? this.is_owner = true : this.is_owner = false;
        this.frequence_email = group.frequence_email;
        console.log("AFFICHER GROUP DETAILS " + this.group_name + ' ' + this.frequence_email);
        this.afficher_group_details = true;
        return this.members = group.members;
      }
    }
  },
  group_afficher_details: {
    data: function data() {
      return {
        response: ''
      };
    },
    props: ['user', 'group', 'is_owner', 'is_closable'],
    template: "<div class='afficher_membres' style='position: relative; top: 5px'> \n\t\t\t\t<bouton_fermeture_div v-if='is_closable'\n\t\t\t\t\t@close_div='closeDiv'>\n\t\t\t\t</bouton_fermeture_div> \n\t\t\t\t<p> <mark> Groupe : {{ group.name.split( ':' )[ 1 ] }} </mark> </p>\n\t\t\t\t<p class='participants'> <mark> Participants : </mark> </p>\n\t\t\t\t<span v-for='member, index in group.members'> {{ member }} </span> \n\t\t\t\t<br />\n\t\t\t\t<div v-if='is_owner'>\n\t\t\t\t\t<frequence_email \n\t\t\t\t\t\t:form_id=\"'afficher_group_details_' + getMiniHash + '__'\"\n\t\t\t\t\t\t:is_closable='is_closable'\n\t\t\t\t\t\t:frequence_email='group.frequence_email' \n\t\t\t\t\t\t:response='response'\n\t\t\t\t\t\t@change_frequence_email='changeFrequenceEmail'> \n\t\t\t\t\t\t<mark> Modifiez la fr\xE9quence de tirage : </mark> \n\t\t\t\t\t</frequence_email>\n\t\t\t\t</div>\n\t\t</div>",
    mounted: function mounted() {
      console.log("GROUP > AFFICHER DETAILS");
      console.dir(this.group);
    },
    methods: {
      getMiniHash: function getMiniHash() {
        var r = String(Math.random());
        return r.split('.')[1];
      },
      closeDiv: function closeDiv() {
        this.$parent.$data.afficher_group_details = false;
      },
      changeFrequenceEmail: function changeFrequenceEmail() {
        console.log("CHANGER FREQ EMAIL FOR GROUPS");
        var freq = event.target.id,
            that = this;
        freq = freq.split(':')[1];
        that.group_name = this.group.name;
        that.freq = freq;
        services('POST', 'modifierFrequenceEmailGroup', {
          group_name: this.group.name,
          frequence_email: freq
        }).then(function (value) {
          that.response = {
            freq: that.freq,
            statut: 'succes'
          };
          console.log("GROUPS PROMISE"); // update component's property

          that.$props.group.frequence_email = that.freq;
          var groups = that.$props.user.groups;
          groups.forEach(function (elem, index) {
            if (elem.group.name === that.group_name) {
              elem.group.frequence_email = that.freq;
            }
          }); // update Vue UI

          that.$props.user.groups = groups; // TO DO : spaghetti ! Learn / Leverage usage of Vue Reactivity system -> props as full object vs tail properties
        }).catch(function (err) {
          console.error("ERROR : " + err);
          that.response = {
            freq: that.freq,
            statut: 'erreur'
          };
        });
      }
    }
  }
};