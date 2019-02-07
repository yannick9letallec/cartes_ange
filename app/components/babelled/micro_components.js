"use strict";

// HEADER RIGHT COMPONENTS
module.exports = {
  unlogged: {
    template: "<font-awesome-icon id='log_button' icon='user' @click=\"emit( 'show_identification_div' )\" size='2x' />"
  },
  logged: {
    props: ['user'],
    template: "<div id='logged'> \n\t\t\t<font-awesome-icon id='log_button' icon='user' @click=\"emit( 'show_connected_div' )\" size='2x' /> \n\t\t\t<p class='sign'> {{ user }} </p> \n\t\t</div>"
  },
  log_success: {
    template: "<p> LOGGED ! <br /> Welcome :) </p>"
  },
  bouton_fermeture_div: {
    template: "<div> \n\t\t\t\t<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> \n\t\t\t</div>",
    methods: {
      closeDiv: function closeDiv(e) {
        var el = document.getElementById("pop_up");
        el.classList.replace('afficher_pop_up', 'afficher_none');
        this.emit('close_div', '');
      }
    }
  },
  frequence_email: {
    template: "<div> \n\t\t\t\t<slot></slot> \n\t\t\t\t<div class='choix-frequence'> \n\t\t\t\t\t<input type='radio' name='frequence_email' id='aucun' checked @change=\"emit( 'change_frequence_email' )\"> <label for='aucun'> Aucun </label> <br /> \n\t\t\t\t\t<input type='radio' name='frequence_email' id='quot' @change=\"emit( 'change_frequence_email' )\"> <label for='quot'> Quotidient </label> <br /> \n\t\t\t\t\t<input type='radio' name='frequence_email' id='hebdo' @change=\"emit( 'change_frequence_email' )\"> <label for='hebdo'> Hebdomadaire </label> <br /> \n\t\t\t\t\t<input type='radio' name='frequence_email' id='mensuel' @change=\"emit( 'change_frequence_email' )\"> <label for='mensuel'> Mensuel </label> <br /> \n\t\t\t\t</div> \n\t\t\t</div>"
  },
  se_souvenir_de_moi: {
    template: "<div class='se-souvenir-de-moi'> \n\t\t\t\t<input type='checkbox' id='se_souvenir_de_moi' value='se_souvenir' \n\t\t\t\t\t@change=\"emit( 'se_souvenir_de_moi' )\" /> \n\t\t\t\t<label for='se_souvenir_de_moi'> Se souvenir de moi ( 30 jours ) </label> \n\t\t\t</div>"
  }
};