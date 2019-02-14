"use strict";

// HEADER RIGHT COMPONENTS
module.exports = {
  unlogged: {
    template: "<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_identification_div' )\" size='2x' />"
  },
  logged: {
    props: ['user'],
    template: "<div id='logged'> \n\t\t\t<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_connected_div' )\" size='2x' /> \n\t\t\t<p class='signature'> {{ user }} </p> \n\t\t</div>"
  },
  log_success: {
    template: "<p> LOGGED ! <br /> Welcome :) </p>"
  },
  bouton_fermeture_div: {
    template: "<div> \n\t\t\t\t<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> \n\t\t\t</div>",
    methods: {
      closeDiv: function closeDiv(e) {
        this.$emit('close_div', '');
      }
    }
  },
  frequence_email: {
    props: ['frequence_email', 'is_closable', 'form_id', 'response'],
    template: "<div> \n\t\t\t\t<slot></slot> \n\t\t\t\t<div class='choix-frequence'> \n\t\t\t\t\t<input type='radio' :name=\"form_id + ':frequence_email'\" :id=\"form_id + ':aucun'\" checked \n\t\t\t\t\t\t@change=\"$emit( 'change_frequence_email' )\"> \n\t\t\t\t\t\t<label :for=\"form_id + ':aucun'\"> Aucun </label> <br /> \n\t\t\t\t\t<input type='radio' :name=\"form_id + ':frequence_email'\" :id=\"form_id + ':quot'\" \n\t\t\t\t\t\t@change=\"$emit( 'change_frequence_email' )\"> \n\t\t\t\t\t\t<label :for=\"form_id + ':quot'\"> Quotidient </label> <br /> \n\t\t\t\t\t<input type='radio' :name=\"form_id + ':frequence_email'\" :id=\"form_id + ':hebdo'\" \n\t\t\t\t\t\t@change=\"$emit( 'change_frequence_email' )\"> \n\t\t\t\t\t\t<label :for=\"form_id + ':hebdo'\"> Hebdomadaire </label> <br /> \n\t\t\t\t\t<input type='radio' :name=\"form_id + ':frequence_email'\" :id=\"form_id + ':mensuel'\" \n\t\t\t\t\t\t@change=\"$emit( 'change_frequence_email' )\"> \n\t\t\t\t\t\t<label :for=\"form_id + ':mensuel'\"> Mensuel </label> <br /> \n\t\t\t\t</div>\n\t\t\t</div>",
    mounted: function mounted() {
      // called only for manage groups, not to create them
      if (this.frequence_email) this.selectRadio();
    },
    updated: function updated() {
      if (this.response) {
        var that = this,
            el = document.querySelector("[for='" + this.form_id + ":" + this.response.freq + "']");
        el.classList.toggle("frequence_change_" + this.response.statut);
        setTimeout(function () {
          console.log("TIMEOUT");
          el.classList.toggle("frequence_change_" + that.response.statut);
          that.$parent.$data.response = '';
        }, 1000);
      }

      if (this.frequence_email) this.selectRadio();
    },
    methods: {
      selectRadio: function selectRadio() {
        document.getElementById(this.form_id + ':' + this.frequence_email).checked = true;
      }
    }
  },
  se_souvenir_de_moi: {
    template: "<div class='se-souvenir-de-moi'> \n\t\t\t\t<input type='checkbox' id='se_souvenir_de_moi' value='se_souvenir' \n\t\t\t\t\t@change=\"$emit( 'se_souvenir_de_moi' )\" /> \n\t\t\t\t<label for='se_souvenir_de_moi'> Se souvenir de moi ( 30 jours ) </label> \n\t\t\t</div>"
  },
  vide: {
    template: "<input type='text' size='20' id='input' />"
  }
};