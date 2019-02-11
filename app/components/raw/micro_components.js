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
				this.$emit( 'close_div', '' )
			}
		}
	},
	frequence_email: {
		props: [ 'frequence', 'is_closable', 'form_id' ],
		data(){
			return {
				count: 0
			}
		},
		template: `<div> 
				<slot></slot> 
				<div class='choix-frequence'> 
					<input type='radio' :name="form_id + 'frequence_email'" :id="form_id + ':aucun'" checked 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':aucun'"> Aucun </label> <br /> 
					<input type='radio' :name="form_id + 'frequence_email'" :id="form_id + ':quot'" 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':quot'"> Quotidient </label> <br /> 
					<input type='radio' :name="form_id + 'frequence_email'" :id="form_id + ':hebdo'" 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':hebdo'"> Hebdomadaire </label> <br /> 
					<input type='radio' :name="form_id + 'frequence_email'" :id="form_id + ':mensuel'" 
						@change="$emit( 'change_frequence_email' )"> 
						<label :for="form_id + ':mensuel'"> Mensuel </label> <br /> 
				</div>
			</div>`,
		mounted(){
			this.count ++
			console.log( "FREQUENCE EMAIL : " + this.frequence + ' ' + this.is_closable + ' ' + this.count + ' ' + this.form_id ) 
			if( this.frequence ) {
				document.getElementById( this.form_id + ':' + this.frequence ).checked = true
			} 
			/*
			if( this.is_closable ){
				this.is_closable = true
			}
			*/
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
