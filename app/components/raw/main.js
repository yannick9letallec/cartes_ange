module.exports = {
	index: {
		data: function(){
			return {
				args: [{
					titre: 'Ils sont partout !',
					img: './app/img/ange.jpg',
					bg_color: 'black',
					text: 'Les anges sont partout autour de nous. Créez, et entretenez le lien avec eux, savourez la puissance de leur message !'
				}, {
					titre: 'Spiritualité entre Amis :)',
					img: './app/img/partager.jpeg',
					bg_color: 'darkgoldenrod',
					text: 'Partagez votre spiritualité par un tirage des cartes avec un, ou des groupes d\'amis.'
				}, {
					titre: 'Historisez !',
					img: './app/img/archive.jpeg',
					bg_color: 'powderblue',
					text: 'Grace à l\'historique, suivez votre évolution sur une période indéterminée. Quel sera votre chemin avec les Anges ?'
				}, {
					titre: 'Tirage par Email.',
					img: './app/img/email.jpeg',
					bg_color: 'chocolate',
					text: 'Recevez par email, à la fréquence que vous préférez, un tirage. Quoi de mieux pour commencer la journée que la lecture d\'un thème Angellique ?'
				},{
					titre: 'Partagez sur Facebook',
					img: './app/img/facebook.png',
					bg_color: 'black',
					text: 'Partagez le résultat de votre tirage via Facebook'
				},{
					titre: 'Et plus à venir ...',
					img: './app/img/fountain.jpeg',
					bg_color: 'gold',
					text: 'Vos idées et remarques sont bienvenues ! Elles peuvent même donner lieux à de nouvelles fonctionnalités dans cette application.'
				}]
			}
		},
		template: `<div>
				<div class='index'>
					<p class='hero_text'> Les Anges, Vos Compagnons Spirituels </p>
				</div>
				<div class='separateur'></div>
				<section class='args'>
					<article class='wrapper' :style="'background-color: ' + arg.bg_color" v-for='arg, index in args' :key='index'>
						<figure class='img'>
							<img alt='' :src='arg.img' width='100%' />
						</figure>
						<div class='content'>
							<div class='titre'>
								{{ arg.titre }}
							</div>
							<div class='text'>
								{{ arg.text }}
							</div>
						</div>
					</article>
				</section>
				<contact></contact>
			</div>
			</div>`,
		mounted(){
			/*
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
			*/
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
	afficher_menu_navigation: {
		props: [ 'message', 'afficher_menu_navigation' ],
		template: `<transition name='afficher_menu_navigation'>
			<div class='afficher_menu_navigation'>
				<section class='clickable'>
					<div id='logo'> 
						<a @click.prevent="redirectNavigate( 'index' )"> {{ message }} </a>
					</div> 
					<div> <a @click.prevent="redirectNavigate( 'introduction' )"> Introduction </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'liste_anges', 'explorer' )"
						:mode='mode_liste_anges'> Explorer Les Anges </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'historique' )"> Historique </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'liste_anges', 'manuel' )"> Tirage Manuel </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'liste_anges', 'aleatoire' )"> Tirage Aléatoire </a> </div>
				</section>
				<section>
					<img alt='image d ambiance, hello !' src='./app/img/hello.jpeg' width='100%' />
					<div class='clickable' style='text-align: center;' @click='fermerMenuNavigationMobile'>
						<img alt='image de fermeture du menu de navigation' src='./app/img/croix_fermer.png' width='100%' />
					</div>
				</section>
			</div>
			</transition>`,
		methods: {
			fermerMenuNavigationMobile(){
				console.log( "FERMER MENU NAVIGATION MOBILE" ) 
				this.$root.$data.afficher_menu_navigation = false
			},
			redirectNavigate( link, mode ){
				this.$root.navigate( link, mode )
				this.fermerMenuNavigationMobile()
			}
		},
		mounted(){
			/*
			let target = document.getElementsByClassName( 'afficher_menu_navigation' )[ 0 ]
				el = document.getElementsByTagName( 'header' )[ 0 ],
				h = el.getClientRects()[ 0 ].height

			target.style.top = h + 'px'
			console.log( h ) 
			*/
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
