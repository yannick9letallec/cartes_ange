"use strict";

module.exports = {
  carte: {
    props: ['carte', 'carte_nom'],
    template: "<div> \n\t\t\t<div class='masque'></div> \n\t\t\t<div class='container'> \n\t\t\t\t<section id='carte'> \n\t\t\t\t\t<font-awesome-icon id='close_div' icon='times' @click=\"$emit( 'close_div' )\" style='float: right;' /> \n\t\t\t\t\t<article> \n\t\t\t\t\t\t<header> \n\t\t\t\t\t\t\t<span> {{ this.carte_nom.toUpperCase() }} </span> <span> {{ this.carte.Dates }} </span> \n\t\t\t\t\t\t\t<br > \n\t\t\t\t\t\t\t<span> {{ this.carte.Ange }} </span> <span> {{ this.carte.Sephirot }} </span> \n\t\t\t\t\t\t</header> \n\t\t\t\t\t\t<main> \n\t\t\t\t\t\t\t<div> \n\t\t\t\t\t\t\t\t<img /> \n\t\t\t\t\t\t\t</div> \n\t\t\t\t\t\t\t<div> \n\t\t\t\t\t\t\t\t<div> {{\xA0this.carte.text }} </div> \n\t\t\t\t\t\t\t\t<div> Plan Physique : {{\xA0this.carte[ 'Plan physique' ] }} </div> \n\t\t\t\t\t\t\t\t<div> Plan Emotionnel : {{\xA0this.carte[ 'Plan \xE9motionnel' ] }} </div> \n\t\t\t\t\t\t\t\t<div> Plan Spirituel : {{\xA0this.carte[ 'Plan spirituel' ] }} </div> \n\t\t\t\t\t\t\t</div> \n\t\t\t\t\t\t</main> \n\t\t\t\t\t</article> \n\t\t\t\t</section> \n\t\t\t</div> \n\t\t\t</div> \n\t\t</div>"
  }
};