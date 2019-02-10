// HEADER RIGHT COMPONENTS
module.exports = {
	unlogged: {
		template: `<font-awesome-icon id='log_button' icon='user' @click="$emit( 'show_identification_div' )" size='2x' />`,
	},
	logged: {
		props: [ 'user' ],
		template: `<div id='logged'> 
			<font-awesome-icon id='log_button' icon='user' @click="$emit( 'show_connected_div' )" size='2x' /> 
			<p class='sign'> {{ user }} </p> 
		</div>`
	},
	log_success: {
		template: `<p> LOGGED ! <br /> Welcome :) </p>`
	},
	bouton_fermeture_div: {
		template: `<div> 
				<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> 
			</div>`,
		methods: {
			closeDiv: function( e ){
				let el = document.getElementById( "pop_up" )
				el.classList.replace( 'afficher_pop_up', 'afficher_none' )

				this.$emit( 'close_div', '' )
			}
		}
	},
	frequence_email: {
		template: `<div> 
				<slot></slot> 
				<div class='choix-frequence'> 
					<input type='radio' name='frequence_email' id='aucun' checked @change="$emit( 'change_frequence_email' )"> <label for='aucun'> Aucun </label> <br /> 
					<input type='radio' name='frequence_email' id='quot' @change="$emit( 'change_frequence_email' )"> <label for='quot'> Quotidient </label> <br /> 
					<input type='radio' name='frequence_email' id='hebdo' @change="$emit( 'change_frequence_email' )"> <label for='hebdo'> Hebdomadaire </label> <br /> 
					<input type='radio' name='frequence_email' id='mensuel' @change="$emit( 'change_frequence_email' )"> <label for='mensuel'> Mensuel </label> <br /> 
				</div> 
			</div>`
	},
	se_souvenir_de_moi: {
		template: `<div class='se-souvenir-de-moi'> 
				<input type='checkbox' id='se_souvenir_de_moi' value='se_souvenir' 
					@change="$emit( 'se_souvenir_de_moi' )" /> 
				<label for='se_souvenir_de_moi'> Se souvenir de moi ( 30 jours ) </label> 
			</div>`
	}
}
