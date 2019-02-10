module.exports = {
	gestion_compte:  {
		data: function() { 
			return { 
				group_state: 'groups_existant',
				new_pseudo: '',
				new_email: '',
				message: '',
				message_modif_pseudo: false,
				message_erreur: false,
				message_ok: false,
				cursor_position: 0
			} 
		}, 
		props: [ 'pseudo', 'email', 'statut', 'ttl', 'groups' ], 
		template: `<div id='gestion_compte'> 
				<bouton_fermeture_div></bouton_fermeture_div> 
				<p class='form_title'> <mark> Mon Compte : </mark> </p> 
				<br />
				<p contenteditable='true' @input="modifierField( 'pseudo' )"> {{ this.pseudo }}  </p>
				<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' 
					v-if='message_modif_pseudo'> 
						{{ this.message }} 
				</message_modif_compte>
				<br /> 
				<p contenteditable='true' @input="modifierField( 'email' )"> {{ this.email }} </p> 
				<statut :is='statut' :ttl='calculerTTL()'> </statut>	
				<br /> 
				<p class='form_title'> <mark> Mes Groupes : </mark> </p> 
					<groups_existant class='groups_existant' v-if='groupsExists' 
						:pseudo='pseudo' 
						:groups='groups'> 
					</groups_existant> 
					<group_ajout_wrapper 
						:pseudo='pseudo' 
						:groups='groups' 
						:email='email'> 
					</group_ajout_wrapper> 
				<br /> 
				<button @click="$emit( 'deconnexion' )"> Déconnexion </button> 
			</div>`,
		methods: {
			calculerTTL(){
				return Math.floor( this.ttl / 86400 )
			},
			modifierField( field ){
				this.new_pseudo = event.target.textContent.trim()
				let that = this,
					l = this.new_pseudo.length 

				if( l > 5 && l < 255 ){
					services.call( that, 'POST', 'modifierPseudo', { 
						old_pseudo:this.pseudo,
						new_pseudo:this.new_pseudo
					}).then( function( value ){
						console.dir( this ) 
						value.vueComponent._data.message_modif_pseudo = true

						if( value.data.new_pseudo ){
							value.vueComponent.$root._data.user.pseudo = value.data.new_pseudo 
							value.vueComponent._data.message_ok = true
							value.vueComponent._data.message = value.data.message
						} else {
							value.vueComponent._data.message_erreur = true
							value.vueComponent._data.message = value.data.message
							console.log( "OK MODIF PSEUDO " + ' ' + this.message ) 
						}

						setTimeout( function(){
							value.vueComponent._data.message_modif_pseudo = false
							value.vueComponent._data.message_erreur = false
							value.vueComponent._data.message_ok = false
						}, 1000 )
					}).catch( function( err ){
						console.log( "ERROR MODIF PSEUDO" ) 
						console.dir( err ) 
					})
				} else {
					this.message = 'Pseudo entre 5 et 255 caractères'
					this.message_modif_pseudo = true
					this.message_erreur = true

					;( function( scope ){
						setTimeout( function(){
							scope._data.message_modif_pseudo = false
							scope._data.message_erreur = false
							scope._data.message_ok = false
						}, 1000 )
					})( this )
				}
				
			},
			modifierEmail(){
				console.dir( event )  

			}
		},
		computed: {
			groupsExists: function(){
				console.log( "groupsExists : " + this.groups.length ) 
				if( this.groups.length > 0 ){
					return true
				} else {
					return false 
				}
			},
			handleGroups: function(){
				let l = this.groups.length
				if( l === 0 ){
					return this.group_state = 'groups_vide'
				} else {
					return this.group_state = 'groups_existant'
				}
			},
			groupAjouterNom: function(){
				console.log( "TRACK 2 " + this.group_ajout_state ) 
				this.group_ajout_state = 'group_ajouter_nom'
			},
			groupAjout: function() {
				return this.group_ajout_state
			}
		},
		created(){
		}
	},
	a_confirmer: {
		props: [ 'ttl' ],
		template: `<div encore class='statut_a_confirmer'>
				 Encore <strong> {{ this.ttl }} </strong> jours pour valider votre email.
			</div>`
	},
	permanent: {
		template: `<div class='statut_confirme'>
				 Email confirmé <font-awesome-icon id='log_button' icon='check-square' size='1x' />
			</div>`
	},
	message_modif_compte: {
		template: `<div> <slot></slot> </div>`
	}
}
