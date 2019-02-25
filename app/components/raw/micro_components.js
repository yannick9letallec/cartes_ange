// HEADER RIGHT COMPONENTS
module.exports = {
	unlogged: {
		template: `<font-awesome-icon id='log_button' icon='user' @click="$emit( 'show_identification_div' )" size='2x' />`,
	},
	logged: {
		props: [ 'user' ],
		template: `<div id='logged'> 
			<font-awesome-icon id='log_button' icon='user' @click="$emit( 'show_connected_div' )" size='2x' /> 
			<p class='signature'> {{ user }} </p> 
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
				this.$emit( 'close_div', '' )
			}
		}
	},
	frequence_email: {
		props: [ 'frequence_email', 'is_closable', 'form_id', 'response' ],
		template: `<div> 
				<slot></slot> 
				<div class='choix-frequence'> 
					<input type='radio' :name="form_id + ':frequence_email'" :id="form_id + ':aucun'" checked 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':aucun'"> Aucun </label> <br /> 
					<input type='radio' :name="form_id + ':frequence_email'" :id="form_id + ':quot'" 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':quot'"> Quotidient </label> <br /> 
					<input type='radio' :name="form_id + ':frequence_email'" :id="form_id + ':hebdo'" 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':hebdo'"> Hebdomadaire </label> <br /> 
					<input type='radio' :name="form_id + ':frequence_email'" :id="form_id + ':mensuel'" 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':mensuel'"> Mensuel </label> <br /> 
				</div>
			</div>`,
		mounted(){
			// called only for manage groups, not to create them
			if( this.frequence_email ) this.selectRadio()
		},
		updated(){
			if( this.response ){
				let that = this,
					el = document.querySelector( "[for='" + this.form_id + ":" + this.response.freq + "']" )

				el.classList.toggle( "frequence_change_" + this.response.statut )

				setTimeout( function(){
					console.log( "TIMEOUT" ) 
					el.classList.toggle( "frequence_change_" + that.response.statut )
					that.$parent.$data.response = ''
				}, 1000 )

			}

			if( this.frequence_email ) this.selectRadio()
		}, 
		methods: {
			selectRadio(){
				document.getElementById( this.form_id + ':' + this.frequence_email ).checked = true
			}
		}
	},
	se_souvenir_de_moi: {
		template: `<div class='se-souvenir-de-moi'> 
				<input type='checkbox' id='se_souvenir_de_moi' value='se_souvenir' 
					@change="$emit( 'se_souvenir_de_moi' )" /> 
				<label for='se_souvenir_de_moi'> Se souvenir de moi ( 30 jours ) </label> 
			</div>`
	},
	vide: {
		template: `<input type='text' size='20' id='input' />`
	}
}
