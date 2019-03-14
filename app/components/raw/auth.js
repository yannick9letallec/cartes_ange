module.exports = {
	form_auth : {
		props: [ 'groups' ],
		template: `<div id='form_authentication'> 
			<form id='login' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> 
				<bouton_fermeture_div @close_div='closeDiv'></bouton_fermeture_div> 
				<div> 
					<p class='form_title' style='margin-bottom: 5px;'> <mark> Se Connecter : </mark></p> 
				</div> 
				<div> 
					<label for='pseudo'> Pseudo : </label> 
					<input id='pseudo' ref='pseudo' type='text' size='15' placeholder='mon pseudo...' style='margin-bottom: 10px;' autofocus='true' autocomplete='on' maxlength='255' @input='verifierFormulaire'> 
				</div> 
				<div> 
					<label for='mdp'> Mot de Passe : </label> 
					<input id='mdp' type='password' placeholder='votre mot de passe...' autocomplete='on' maxlength='255' @input='verifierFormulaire'> 
				</div> 
				<div id='info'></div> 
				<div> 
					<button type='submit' disabled class='form_authentication-auth-button'> <i class='fa fa-close'></i> JE M'IDENTIFIE </button> 
					<span class='mdp_oublie'> 
						<a alt='action pour recupérer / renouveller votre mot de passe'
							@click.prevent='modifierMDP'>
							Mot de passe oublié ? 
						</a> 
					</span> 
					<div class='clear'></div> 
				</div> 
			</form> 
				<hr /> 
				<div class='form_authentication-creer-compte-button'> 
					<button type='submit' @click="$emit( 'mod_contenu', 'form_creer_compte' )"> Créer un compte </button> 
				</div> 
			</div>`,
		methods: {
			modifierMDP(){
				this.closeDiv()
				this.$emit( 'modifier_mdp' )
			},
			closeDiv(){
				let el = document.getElementById( "pop_up" )
				el.classList.replace( 'afficher_pop_up', 'afficher_none' )
			},
			afficher_form_creer_compte( ){
				this.$emit( 'close_div', '' )
			},
			verifierFormulaire(){
				verifierFormulaire( event )
			},
			submit( e ){ 
				const fname = "FORM AUTH SUBMIT"
				console.info( "INFO : [ " + fname + " ] Appel : SERVICES" ) 
				console.dir( this.$root._data ) 
				
				let pseudo = e.target[ 0 ].value,
					mdp = e.target[ 1 ].value,
					that = this

				that.$root.connect( pseudo, mdp )
			}
		}, 
		mounted(){
			console.log( "FOCUS ON PSEUDO" ) 
			// document.getElementById( 'pseudo' ).focus()
			this.$refs.pseudo.focus()
		} 
	},
	modifier_mot_de_passe: {
		template: `<div id='modifier_mot_de_passe'>
			<bouton_fermeture_div @close_div='closeDiv'></bouton_fermeture_div> 
				<header>
					Pour activer le renouvellement de votre mot de passe, veuillez renseigner les champs suivants :
				</header>
			<form id='form_modifier_mot_de_passe' @submit.prevent='submit'>
				<label for='modifier_mot_de_passe_pseudo'> Votre Pseudo : </label> 
				<input id='modifier_mot_de_passe_pseudo' type='text' width='auto' @input='verifierFormulaire' autocomplete autofocus />
				<br />
				<label for='modifier_mot_de_passe_email'> Votre Email : </label> 
				<input id='modifier_mot_de_passe_email' type='email' width='auto' @input='verifierFormulaire' autocomplete />
				<br />
				<div class='buttons'>
					<button type='reset'> Annuler </button> <button type='submit' disabled> Valider </button> 
				</div>
			</form>
		</div>`,
		methods: {
			closeDiv(){
				console.log( "CLOSE DIV" ) 
				document.getElementById( 'afficher_message' ).classList.toggle( 'afficher_none' )
			},
			verifierFormulaire(){
				verifierFormulaire( event )
			},
			submit(){
				console.log( "SUBMIT MODIFIER MOT DE PASSE" ) 
				let pseudo = document.getElementById( 'modifier_mot_de_passe_pseudo' ).value,
					email = document.getElementById( 'modifier_mot_de_passe_email' ).value,
					that = this,
					data = {
						pseudo,
						email
					}

				services.call( this, 'POST', 'modifierMotDePasse', data ).then( function( value ){
					console.dir( value ) 
					console.log( "----" + value.data.data.message ) 
					if( value.data.data.response === 'ko' ){
						that.$root.$data.pop_up_center_message = value.data.data.message
						that.$root.$data.pop_up_center_error = true
						that.$root.$data.pop_up_center_success = false
						that.$root.$data.callback_component = 'modifier_mot_de_passe'
						that.$root.$data.target_component = 'pop_up_center'
					} else if( value.data.data.response === 'ok' ) {
						that.$root.$data.pop_up_center_message = value.data.data.message
						that.$root.$data.pop_up_center_error = false
						that.$root.$data.pop_up_center_success = true
						that.$root.$data.target_component = 'pop_up_center'
						that.$root.$data.callback_component = ''
					}
					that.$root.$data.pop_up_center = 'simple_message'
				})
			}
		}
	},
	modifier_mot_de_passe_concret: {
		props: [ 'user' ],
		template: `<div id='modifier_mot_de_passe_concret'>
				<h1> MODIFIER VOTRE MOT DE PASSE </h1>
				<p> <strong> {{ user.pseudo }}, </strong> </p>
				<br />
				<p> Pour modifier votre mot de passe, veuillez renseigner les champs suivants : 
				<br />
				INFO : Votre mot de passe doit contenir un minimum de 6 caractères. </p>
				<form id='modifier_mot_de_passe_valider' @submit.prevent='submit'>
					<label for='mot_de_passe'> Votre Nouveau Mot De Passe : </label> 
					<input id='mot_de_passe' type='password' width='auto' @input='verifierFormulaire' autocomplete autofocus />
					<br />
					<label for='mot_de_passe_confirmer'> Confirmez votre Mot De Passe : </label> 
					<input id='mot_de_passe_confirmer' type='password' width='auto' @input='verifierFormulaire' autocomplete />
					<br />
					<div class='buttons'>
						<button type='reset'> Annuler </button> <button type='submit' disabled> Valider </button> 
					</div>
				</form>
			</div>`,
		methods: {
			verifierFormulaire(){
				verifierFormulaire( event )
			},
			submit(){
				console.log( "MODIFIER LE MOT DE PASSE CONCRET" ) 

				let that = this,
					passwd = document.getElementById( 'mot_de_passe' ).value,
						passwd_cfm = document.getElementById( 'mot_de_passe_confirmer' ).value

				services.call( this, 'POST', 'modifier_mot_de_passe_concret', { passwd, passwd_cfm, pseudo: this.user.pseudo } ).then( function( value ){

					console.dir( value ) 
					if( value.data.response === 'ok' ){
						console.log( value.data.message ) 
						// afficher message / proposer de se connecter / autoconnect ?
						that.$root.$data.pop_up_center = 'simple_message'
						that.$root.$data.pop_up_center_success = true
						that.$root.$data.pop_up_center_message = value.data.message
						// renvoyer sur l'index
						that.$root.$data.target_component = 'main_page'
						that.$root.$data.callback_component = 'index'

					} else {

					}
				})
			}
		}
	}
}
