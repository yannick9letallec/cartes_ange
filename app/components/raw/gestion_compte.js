module.exports = {
	gestion_compte:  {
		data: function() { 
			return { 
				group_state: 'groups_existant',
				new_pseudo: '',
				new_email: '',
				carret_position: null,
				message: '',
				message_modif_pseudo: false,
				message_modif_email: false,
				message_erreur: false,
				message_ok: false,
				check: '',
				response: ''
			} 
		}, 
		props: [ 'user' ], 
		template: `<div id='gestion_compte'> 
				<bouton_fermeture_div @close_div='closeDiv'></bouton_fermeture_div> 
				<p class='form_title'> <mark> Mon Compte : </mark> </p> 
				<br />
				<p id='pseudo' contenteditable='true' @input="modifierField( )"> {{ user.pseudo }}  </p>
				<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' 
					v-if='message_modif_pseudo'> 
						{{ message }} 
				</message_modif_compte>
				<br /> 
				<p id='email' contenteditable='true' @input="modifierField( )"> {{ user.email }} </p> 
				<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' 
					v-if='message_modif_email'> 
						{{ message }} 
				</message_modif_compte>
				<statut :is='user.statut' :ttl='calculerTTL()'> </statut>	
				<br /> 
				<frequence_email 
					:form_id="'gestion_compte_frequence_email'" 
					:frequence_email='user.frequence_email' 
					:response='response'
					@change_frequence_email='changerFrequenceEmail'> 
					<mark> Modifiez la fréquence de vos tirages : </mark> 
				</frequence_email>

				<p class='form_title'> <mark> Mes Groupes : </mark> </p> 
					<groups_existant class='groups_existant' v-if='groupsExists' 
						:user='user'> 
					</groups_existant> 
					<group_ajout_wrapper 
						:user='user'> 
					</group_ajout_wrapper> 
				<br /> 
				<button class='deconnexion' @click="$emit( 'deconnexion' )"> Déconnexion </button> 
			</div>`,
		methods: {
			closeDiv(){
				let el = document.getElementById( "pop_up" )
				el.classList.replace( 'afficher_pop_up', 'afficher_none' )
			},
			changerFrequenceEmail(){
				let freq = event.target.id,
					that = this

				freq = freq.split( ':' )[ 1 ]
				that.freq = freq

				services( 'POST', 'modifierFrequenceEmail', { pseudo: this.user.pseudo, frequence_email: freq } ).then( function( value ){

					that.response = {
						freq: that.freq,
						statut: 'succes'
					}

					that.$props.user.frequence_email = freq
				}).catch( function( err ){
					that.response = {
						freq: that.freq,
						statut: 'erreur'
					}
				})
			},
			calculerTTL(){
				return Math.floor( this.user.ttl / 86400 )
			},
			modifierField(){

				// repositionner la caret; reinitialisé au début du champ par la réactivité de Vue
				this.carret_pos = document.getSelection().baseOffset

				let field_name = event.target.id,
					new_value = event.target.textContent.trim(),
					that = this

				let data = {
					pseudo: this.user.pseudo,
					type : field_name,
					old_value: this.user[ field_name ],
					new_value: new_value
				}

				function resetMessages(){
					setTimeout( function(){
						that.$data[ 'message_modif_' + field_name ] = false
						that.$data.message_erreur = false
						that.$data.message_ok = false
					}, 1000 )
				}

				switch( field_name ){
					case 'pseudo' :
						this.new_pseudo = new_value
						let l = new_value.length

						if( l > 5 && l < 255 ){

							callServices( data, callback, resetMessages )

						} else {
							afficherErreurs.call( this, 'Pseudo entre 5 et 255 caractères' )
						}
						break
					case 'email' :
						if( verifierEmailFormat( new_value ) ){
							callServices( data, callback, resetMessages )
						} else {
							afficherErreurs.call( this,  'Votre email doit être valide !' )
						}
						break
				}

				function afficherErreurs( message ) {
					this.message = message
					this[ 'message_modif_' + field_name ] = true
					this.message_erreur = true

					;( function( scope ){
						setTimeout( function(){
							scope.$data[ 'message_modif_' + field_name ]= false
							scope.$data.message_erreur = false
							scope.$data.message_ok = false
						}, 1000 )
					})( this )
				}

				function callback( value, reseting ){
					that.$data[ 'message_modif_' + field_name ] = true

					if( value.data[ 'new_value' ] ){
						that.$root.$data.user[ field_name ] = value.data.new_value
						that.$data.message_ok = true
						that.$data.message = value.data.message
					} else {
						that.$data.message_erreur = true
						that.$data.message = value.data.message
					}

					reseting()
				}

				function callServices( data, cb, resetting ){
					services.call( that, 'POST', 'modifierChamp',  data ).then( function( value ){
						cb( value, resetting )
					}).catch( function( err ){
					})
				}
				
			}
		},
		updated(){
			// place carret where it was before update
			let sel = document.getSelection(),
				id = sel.baseNode.parentNode.id,
				el = document.getElementById( id )

		},
		computed: {
			groupsExists: function(){
				if( this.user.groups.length > 0 ){
					return true
				} else {
					return false 
				}
			},
			handleGroups: function(){
				let l = this.user.groups.length
				if( l === 0 ){
					return this.group_state = 'groups_vide'
				} else {
					return this.group_state = 'groups_existant'
				}
			},
			groupAjouterNom: function(){
				this.group_ajout_state = 'group_ajouter_nom'
			},
			groupAjout: function() {
				return this.group_ajout_state
			}
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
