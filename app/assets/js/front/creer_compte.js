 module.exports = {
	 form_creer_compte: {
		data: function(){
			return {
				frequence_email: 'aucun',
				se_souvenir_de_moi: false
			}
		},
		template: "<div id='form_creer_compte'> \
			<form id='creer_compte' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> \
				<bouton_fermeture_div @close_div='closeDiv' ></bouton_fermeture_div> \
				<div> \
					<p style='margin-bottom: 5px;'> Créer votre compte : </p> \
				</div> \
				<div> \
					<label for='pseudo'> Pseudo : </label> \
					<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' autofocus autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<div> \
					<label for='email'> Email : </label> \
					<input id='email' type='email' size='15' placeholder='mon email...' autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<div> \
					<label for='mdp'> Mot de Passe : </label> \
					<input id='mdp' type='password' placeholder='12345' autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<div> \
					<label for='confirmer_mdp'> Confirmer le Mot de Passe : </label> \
					<input id='confirmer_mdp' type='password' placeholder='Votre mot de passe...' autocomplete='on' @input=\"verifierFormulaire( $event )\"> \
				</div> \
				<frequence_email @change_frequence_email='frequence'> Recevoir un tirage aléatoire dans votre boîte email : </frequence_email> \
				<div id='info'></div> \
				<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi> \
				<div class='form_creer-compte-button'> \
					<button type='reset'> Annuler </button> \
					<button type='submit' disabled> Créer votre compte ! </button> \
				</div> \
			</form> \
			</div>",
		methods: {
			frequence: function( ){
				this.frequence_email = event.target.id
			},
			seSouvenirDeMoi: function() {
				this.se_souvenir_de_moi = event.target.checked
			},	
			closeDiv: function( e ){
				let el = document.getElementById( "pop_up" )
				el.classList.replace( 'afficher_pop_up', 'afficher_none' )

				this.$emit( 'close_div', '' )
			},
			verifierFormulaire: function( event ){
				verifierFormulaire( event )
			},
			submit: function( e ){
				const fname = services.name.toUpperCase()

				console.info( "INFO : [ " + fname + " ] Appel : SERVICES" ) 

				let pseudo = document.getElementById( 'pseudo' ).value
				let email = document.getElementById( 'email' ).value
				let mdp = document.getElementById( 'mdp' ).value
				let confirmer_mdp = document.getElementById( 'confirmer_mdp' ).value
				let se_souvenir_de_moi = document.getElementById( 'se_souvenir_de_moi' ).checked

				services( 'POST', 'creerCompte', { pseudo, email, mdp, confirmer_mdp, se_souvenir_de_moi, frequence_email: this.frequence_email } )
			}
		}
}
}
