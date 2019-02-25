module.exports.form_auth = {
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
				<span class='mdp_oublie'> <a href='' alt='TO_DO!!'> Mot de passe oublié ? </a> </span> 
				<div class='clear'></div> 
			</div> 
		</form> 
			<hr /> 
			<div class='form_authentication-creer-compte-button'> 
				<button type='submit' @click="$emit( 'mod_contenu', 'form_creer_compte' )"> Créer un compte </button> 
			</div> 
		</div>`,
	methods: {
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
}
