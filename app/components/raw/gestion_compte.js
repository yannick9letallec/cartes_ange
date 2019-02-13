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
				cursor_position: 0,
				check: '',
				response: ''
			} 
		}, 
		props: [ 'user' ], 
		template: `<div id='gestion_compte'> 
				<bouton_fermeture_div @close_div='closeDiv'></bouton_fermeture_div> 
				<p class='form_title'> <mark> Mon Compte : </mark> </p> 
				<br />
				<p contenteditable='true' @input="modifierField( 'pseudo' )"> {{ user.pseudo }}  </p>
				<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' 
					v-if='message_modif_pseudo'> 
						{{ message }} 
				</message_modif_compte>
				<br /> 
				<p contenteditable='true' @input="modifierField( 'email' )"> {{ user.email }} </p> 
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
				<button @click="$emit( 'deconnexion' )"> Déconnexion </button> 
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

				console.log( "*** " + this.user.pseudo + ' ' + freq ) 
				services( 'POST', 'modifierFrequenceEmail', { pseudo: this.user.pseudo, frequence_email: freq } ).then( function( value ){
					console.dir( this ) 

					that.response = {
						freq: that.freq,
						statut: 'succes'
					}

					that.$props.user.frequence_email = freq
				}).catch( function( err ){
					console.log( "ERROR : " + err ) 
					that.response = {
						freq: that.freq,
						statut: 'erreur'
					}
				})
			},
			calculerTTL(){
				return Math.floor( this.user.ttl / 86400 )
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
						that.$data.message_modif_pseudo = true

						if( value.data.new_pseudo ){
							that.$data.user.pseudo = value.data.new_pseudo 
							that.data.message_ok = true
							that.$data.message = value.data.message
						} else {
							that.$data.message_erreur = true
							that.$data.message = value.data.message
							console.log( "OK MODIF PSEUDO " + ' ' + this.message ) 
						}

						setTimeout( function(){
							that.$data.message_modif_pseudo = false
							that.$data.message_erreur = false
							that.$data.message_ok = false
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
				console.log( "groupsExists : " + this.user.groups.length ) 
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
				console.log( "TRACK 2 " + this.group_ajout_state ) 
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
