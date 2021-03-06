module.exports = {
	group_ajouter_nom: {
		props: [ 'nom_du_groupe' ],
		template: `<div> 
				<p> Nom {{ nom_du_groupe }} : </p> 
				<input type='text' id='nom_du_groupe' v-model='nom_du_groupe' maxlenth='255' autofocus /> 
				<font-awesome-icon icon='angle-right' size='2x' @click="$emit( 'group_ajouter_membres', nom_du_groupe )" /> 
			</div>`
	},
	group_ajouter_membres: {
		props: [ 'group_members' ],
		template: `<div>
				<group_ajouter_membre v-for='group_member, i in group_members' :key='i'
					@membre_supprimer='group_members.splice( i, 1 )' 
					:index='i' 
					:member_data='group_members[ i ]'>
				</group_ajouter_membre>
				<button type='button'
					@click='groupAjouterMembre'>
						Ajouter Membre
				</button>
				<hr />
				<frequence_email 
					:form_id="'gestion_compte_ajouter_groupe'"
					@change_frequence_email="$emit( 'change_frequence_email' )">
						Définir la fréquence de tirage pour le groupe
				</frequence_email>
				<hr />
				<button @click="$emit( 'creer_inviter_groupe' )">
					Créer le groupe & Inviter
				</button>
				<br />
				<button @click="$emit( 'annuler_creation_groupe' )">
					Annuler le Groupe
				</button> 
			</div>`,
		methods: {
			groupAjouterMembre() {
				console.log( "TRACK 4" ) 
				return this.group_members.push( { } )
			}
		}
	},
	group_ajouter_membre: {
		props: [ 'index', 'member_data' ],
		template: ` <div class='membre'> 
				<p> Membre {{ index }} / <span class='clickable' @click="$emit( 'membre_supprimer' )"> supprimer </span> </p> 
				<p> Pseudo : </p> 
				<input type='text' name='pseudo' placeholder='votre pseudo ...' v-model='member_data.pseudo' /> 
				<p> Email : </p> 
				<input type='email' name='email' placeholder='votre email ...' v-model='member_data.email' /> 
			</div>`,
		methods: {
		}
	},
	group_ajout: {
		template: `<div> 
				<span class='clickable' @click="$emit( 'group_ajouter_nom' )"> Groupe 
					<font-awesome-icon icon='plus-square' size='1x' /> 
				</span> 
			</div>`
	},
	group_ajout_wrapper: {
		props: [ 'user' ],
		data(){
			return {
				group_ajout: false,
				group_ajout_state: 'group_ajout',
				nom_du_groupe: '',
				group_members: [],
				frequence_email: ''
			}
		},
		template: `<div id='group_ajout_wrapper'> 
			<div class='groups'> Groupe <strong> {{ nom_du_groupe }} </strong>: 
				<component :is='group_ajout_state' 
					:nom_du_groupe='nom_du_groupe' 	
					:group_members='group_members' 
					@change_frequence_email='frequence' 
					@group_ajouter_nom=\" group_ajout_state='group_ajouter_nom' \" 
					@group_ajouter_membres='groupAjouterMembres' 
					@annuler_creation_groupe='annulerCreationGroupe' 
					@frequence_email='frequence' 
					@creer_inviter_groupe='creerInviterGroupe'> 
				</component> 
			</div> 
		</div>`,
		methods: {
			groupAjouterMembres( nom ){
				this.nom_du_groupe = nom

				this.group_members = []
				// DEV ONLY
				if( this.group_members.length <= 1 ){
					this.group_members.push( {
						pseudo: 'bob',
						email: 'bob@gmail'
					} )
				}

				return this.group_ajout_state = 'group_ajouter_membres'
			},
			annulerCreationGroupe() {
				this.nom_du_groupe = ''
				return this.group_ajout_state = 'group_ajout'
			},
			frequence( ){
				console.log( "FREQUENCE EMAIL AJ GROUP " + event.target.id ) 
				this.frequence_email = event.target.id
			},
			creerInviterGroupe(){
				console.log( "CREER INVITER GROUPE" ) 
				console.dir( this ) 
				
				// MAJ MODEL pour les groups // sauvegardé en parallèle côté serveur
				let group_pseudos = [],
					i = 0,
					l = this.group_members.length,
					freq = this.frequence_email.split( ':' )[ 1 ],
					that = this

				for( i; i < l; i++ ){
					group_pseudos.push( this.group_members[ i ].pseudo )
				}

				this.user.groups.push( {
					group: {
						name: 'group:' + this.nom_du_groupe,
						members: group_pseudos,
						owner: this.user.pseudo,
						frequence_email: freq
					}	
				} )

				let data = {
					user: this.user,
					nom_du_groupe: this.nom_du_groupe,
					frequence_email: freq,
					group_members: this.group_members
				}
				/*
				services.call( this, 'POST', 'creerInviterGroupe', data ).then( function( value ){
					console.log( "PROMISE CREER ... GROUPE" ) 
					console.dir( value ) 

					if( value.data.response === 'ok' ){
						console.log( value.data.message ) 
						// afficher message / proposer de se connecter / autoconnect ?
						that.$root.$data.pop_up_center = 'simple_message'
						that.$root.$data.pop_up_center_success = true
						that.$root.$data.pop_up_center_message = value.data.message
					}
				})
				*/
				// MAJ UI
				this.nom_du_groupe = ''
				return this.group_ajout_state = 'group_ajout'
			}
		}
	},
	groups_existant: {
		data(){
			return {
				afficher_group_details: false,
				members: [],
				is_owner: false,
				frequence_email: '',
				group: '',
				nom_groupe_actuel: ''
			}
		},
		props: [ 'user' ],
		template: `<div> 
				<div class='affiche_group clickable' v-for='item, index in user.groups' 
					@mouseenter='afficherGroupDetails( item.group )'> 
					<span> {{ parse_groups( item.group.name ) }} </span> 
				</div> 
				<group_afficher_details v-if='afficher_group_details' 
					@supprimer_groupe='supprimerGroup'
					:user='user'
					:group='group'
					:is_closable='true'
					:is_owner='is_owner'>
				</group_afficher_details> 
			</div>`,
		methods: {
			parse_groups( group ){
				console.log( "GROUP" ) 
				console.dir( group ) 
				let s = group.indexOf( ':' ) + 1

				return group.substr( s )
			}, 
			supprimerGroup( group, i ) {
				console.log( 'SUPPRIMER GROUPE : ' ) 
				console.dir( group ) 

				let that = this

				services( 'POST', 'supprimer_groupe', { pseudo: this.user.pseudo, group: group.name } ).then( function( value ){
					let G = that.$root.$data.user.groups
					G = G.filter( elem => elem.group.name !== group.name )

					that.afficher_group_details = false
					return that.$root.$data.user.groups = G
				}).catch( function ( err ) {
					console.error( "ERR : " + err ) 
				})
			},
			afficherGroupDetails( group ){
				console.log( "AFFICHER GROUPE DETAIL" ) 
				console.dir( group ) 
				console.log( "OWNER" ) 
				console.dir( group.owner ) 

				this.group = group
				this.nom_groupe_actuel = group.name
				this.user.pseudo === group.owner ? this.is_owner = true : this.is_owner = false
				this.frequence_email = group.frequence_email
				console.log( "AFFICHER GROUP DETAILS " + this.group_name + ' ' + this.frequence_email ) 

				this.afficher_group_details = true
				return this.members = group.members
			}
		}
	},
	group_afficher_details: {
		data(){
			return {
				response: ''
			}
		},
		props: [ 'user', 'group', 'is_owner', 'is_closable' ],
		template: `<div class='afficher_membres' style='position: relative; top: 5px'> 
				<bouton_fermeture_div v-if='is_closable'
					@close_div='closeDiv'>
				</bouton_fermeture_div> 
				<p> <mark> Groupe : <strong> {{ group.name.split( ':' )[ 1 ] }} </strong> </mark> </p>
				<p class='participants'> <mark> Participants : </mark> </p>
				<span v-for='member, index in group.members'> {{ member }} </span> 
				<br />
				<div v-if='is_owner'>
					<frequence_email 
						:form_id="'afficher_group_details_' + getMiniHash + '__'"
						:is_closable='is_closable'
						:frequence_email='group.frequence_email' 
						:response='response'
						@change_frequence_email='changeFrequenceEmail'> 
						<mark> Modifiez la fréquence de tirage : </mark> 
					</frequence_email>
					<button type='button' 
						@click.prevent="$emit( 'supprimer_groupe', group )"> Supprimer {{ group.name }}
					</button>
				</div>
		</div>`,
		mounted(){
			console.log( "GROUP > AFFICHER DETAILS" ) 
			console.dir( this.group ) 
		},
		methods: {
			getMiniHash(){
				let r = String( Math.random() )
				return r.split( '.' )[ 1 ]
			},
			closeDiv(){
				this.$parent.$data.afficher_group_details = false
			},
			changeFrequenceEmail(){
				console.log( "CHANGER FREQ EMAIL FOR GROUPS" ) 

				let freq = event.target.id,
					that = this

				freq = freq.split( ':' )[ 1 ]
				that.group_name = this.group.name
				that.freq = freq

				services( 'POST', 'modifierFrequenceEmailGroup', { group_name: this.group.name, frequence_email: freq } ).then( function( value ) {
					that.response = {
						freq: that.freq,
						statut: 'succes'
					}

					console.log( "GROUPS PROMISE" ) 
					// update component's property
					that.$props.group.frequence_email = that.freq

					let groups = that.$props.user.groups

					groups.forEach( function( elem, index ){
						if( elem.group.name === that.group_name ){
							elem.group.frequence_email = that.freq
						}
					})

					// update Vue UI
					that.$props.user.groups = groups

					// TO DO : spaghetti ! Learn / Leverage usage of Vue Reactivity system -> props as full object vs tail properties
				} ).catch( function( err ) {
					console.error( "ERROR : " + err ) 
					that.response = {
						freq: that.freq,
						statut: 'erreur'
					}
				} )
			}
		}
	},

}

