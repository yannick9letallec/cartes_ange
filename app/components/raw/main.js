module.exports = {
	index: {
		data: function(){
			return {
				args: [{
					titre: '',
					img: '',
					text: 'Les anges sont partout autour de nous. Créez, et entretenez le lien avec eux, savourez la puissance de leur message !'
				}, {
					titre: '',
					img: '',
					text: 'Partagez votre spiritualité par un tirage des cartes avec un, ou des groupes d\'amis.'
				}, {
					titre: '',
					img: '',
					text: 'Grace à l\'historique, suivez votre évolution sur une période indéterminée. Quel sera votre chemin avec les Anges ?'
				}, {
					titre: '',
					img: '',
					text: 'Recevez par email, à la fréquence que vous préférez, un tirage. Quoi de mieux pour commencer la journée que la lecture d\'un thème Angellique ?'
				}]
			}
		},
		template: `<div class='index'>
				<img id='hero_img' src='app/img/Hero_Image.png' alt='presentation des anges par quelques images' height='auto' width='100%' />
				<p class='hero_text'> Les Anges, Vos Compagnons Spirituels </p>
				<div class='args'>
					<div class='wrapper' v-for='arg, index in args' :key='index'>
						<div class='img'>
							<img alt='' src='arg.img' width='' />
						</div>
						<div class='titre'>
							{{ arg.title }}
						</div>
						<div class='text'>
							{{ arg.text }}
						</div>
					
					</div>
				</div>
				<contact></contact>
			</div>`,
		mounted(){
			let el = document.getElementsByClassName( 'hero_text' )[ 0 ],
				ref = document.getElementById( 'hero_img' )

			let H1 = ref.clientHeight,
				L1 = ref.clientWidth,
				H2 = el.clientHeight,
				L2 = el.clientWidth,
				offset_x, 
				offset_y

			offset_y = ( H1 - H2 ) / 2
			offset_x = ( L1 - L2 ) / 2

			console.log( H1, H2, L1, L2, offset_x, offset_y ) 

			el.style.top = ( offset_y + 200 ) + 'px'
			el.style.left = offset_x + 'px'
		}
	},
	confirmer_compte: {
		data: function(){
			return {
				pseudo: ''
			}
		},
		template: `<div>
				CONFIRMER CREATION COMPTE
			</div>`,
		mounted() {
			services( 'POST', 'confirmerCreationCompte', { pseudo } )
		}
	},
	confirmer_invitation: {
		data: function(){
			return {
				group_name: '',
				pseudo: '',
				frequence_email: '',
				se_souvenir_de_moi: false
			}
		},
		template: `<div>
				{{ this.pseudo.toUpperCase() }}, VALIDEZ VOTRE INVIATTION A PARTICIPER AU GROUPE {{ this.group_name.toUpperCase() }}
				<form id='confirmer_invitation' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate>
				<div>
					<label for='mdp_inv'> Mot de Passe : </label>
					<input id='mdp_inv' type='password' placeholder='12345' autocomplete='on' autofocus
						@input='verifierFormulaire'>
				</div>
				<div>
					<label for='confirmer_mdp_inv'> Confirmer le Mot de Passe : </label>
					<input id='confirmer_mdp_inv' type='password' placeholder='Votre mot de passe...' autocomplete='on'
						@input='verifierFormulaire'>
				</div>
				<br />
				<frequence_email @change_frequence_email='frequenceEmail'> Souhaitez recevoir un tirage personnel ? </frequence_email>
				<hr />
				<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi>
				<div class='form_creer-compte-button'>
					<button type='reset'> Annuler </button>
					<button type='submit' disabled> Créer votre compte ! </button>
				</div>
				</form>
			</div>`,
		methods: { 		
			frequenceEmail: function (){
				console.log( "freq : " + event.target.id ) 
				this.frequence_email = event.target.id
			},
			seSouvenirDeMoi: function() {
				console.log( "se_souvenir_de_moi : " + event.target.checked ) 
				this.se_souvenir_de_moi = event.target.checked
			},	
			submit: function() {
				console.log( "SUBMIT CONFIRME INVITATION " + this.pseudo ) 

				let confirmer_mdp_inv = document.getElementById( 'confirmer_mdp_inv' ).value,
					mdp_inv = document.getElementById( 'confirmer_mdp_inv' ).value

				services( 'POST', 'confirmerInvitation', { pseudo: this.pseudo, mdp_inv, confirmer_mdp_inv, se_souvenir_de_moi: this.se_souvenir_de_moi, frequence_email: this.frequence_email } ).then( function( value ){
					console.log( "" + value ) 

				services.call( this, 'POST', 'verifierUtilisateur', { pseudo: this.pseudo, mdp: mdp_inv } ).then( function( value ){ 
					console.dir( value.data.user ) 
					switch( value.data.response ){ 
						case 'utilisateur valide': 
							value.vueComponent.root._data.log_state = 'log_succes' 
							value.vueComponent.root._data.connected = true 
							value.vueComponent.root._data.user = {
								pseudo: value.data.user.pseudo,
								email: value.data.user.email,
								groups: value.data.user.groups,
								ttl: value.data.user.ttl
							}

							setTimeout( function() { 
								document.getElementById( 'pop_up' ).classList.replace( 'afficher_pop_up', 'afficher_none' ) 
								value.vueComponent.root._data.log_state = 'logged' 
							}, 500 ) 
							break 
						case 'utilisateur invalide': 
							value.vueComponent.root._data.log_state = 'unlogged' 
							break 
					} 
				}) 
				})
			},
			verifierFormulaire: function( ){
				verifierFormulaire( event )
			}
		},
		beforeMount: function(){
			console.log( 'Before Mount' ) 

			let params = new URL( document.URL ).searchParams
			this.pseudo = params.get( 'pseudo' )
			this.group_name = params.get( 'group' )
		}
	},
	contact: {
		template: `<div class='contact_form'>
				<form @submit.prevent='demandeContact'>
					TO DO FORM
				</form>
			</div>`,
		methods: {
			demandeContact(){
				console.log( "DEMANDE CONTACT" ) 
			}
		}
	},
	introduction: {
		template: `<div id='introduction'>
			INTRO DES ANGES
			</div>`
	},
	historique: {
		template: `<div>
			HISTO
			</div>`
	},
	partager: {
		template: ``
	},
	faire_un_don: {
		template: ``
	}
}
