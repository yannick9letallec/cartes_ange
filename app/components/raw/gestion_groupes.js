module.exports = {
	group_ajouter_nom: {
		props: [ 'group_name' ],
		template: `<div> 
				<p> Nom {{ group_name }} : </p> 
				<input type='text' id='group_name' v-model='group_name' maxlenth='255' autofocus /> 
				<font-awesome-icon icon='angle-right' size='2x' @click="$emit( 'group_ajouter_membres', group_name )" /> 
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
				<hr />
				<span class='clickable' 
					@click='groupAjouterMembre'>
						Ajouter Membre
				</span>
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
				<p> Membre {{ index }}  <span class='clickable' @click="$emit( 'membre_supprimer' )"> supprimer </span> </p> 
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
		props: [ 'pseudo', 'email', 'groups' ],
		data(){
			return {
				group_ajout: false,
				group_ajout_state: 'group_ajout',
				group_name: '',
				group_members: [],
				frequence_email: ''
			}
		},
		template: `<div> 
			<div class='groups'> Groupes {{ group_name }}: 
				<component :group_name='group_name' 	:is='group_ajout_state' 
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
			groupAjouterMembres( group_name ){
				this.group_name = group_name

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
				this.group_name = ''
				return this.group_ajout_state = 'group_ajout'
			},
			frequence( ){
				console.log( "FREQUENCE EMAIL AJ GROUP " + event.target.id ) 
				this.frequence_email = event.target.id
			},
			creerInviterGroupe(){
				// MAJ MODEL pour les groups // sauvegardé en parallèle côté serveur
				let group_pseudos = [],
					i = 0,
					l = this.group_members.length,
					freq = this.frequence_email.split( ':' )[ 1 ]

				for( i; i < l; i++ ){
					group_pseudos.push( this.group_members[ i ].pseudo )
				}

				this.groups.push( {
					group: {
						name: 'group:' + this.group_name,
						members: group_pseudos,
						owner: this.pseudo,
						frequence_email: freq
					}	
				} )

				let data = {
					user: {
						pseudo: this.pseudo,
						email: this.email
					},
					group_name: this.group_name,
					frequence_email: freq,
					group_members: this.group_members
				}
				services( 'POST', 'creerInviterGroupe', data )

				// MAJ UI
				this.group_name = ''
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
				group_name: ''
			}
		},
		props: [ 'groups', 'pseudo' ],
		template: `<div> 
				<div class='affiche_group clickable' v-for='item, index in groups' 
					@click='supprimerGroup( item, index )'
					@mouseenter='afficherGroupDetails( 
						item.group.members, 
						item.group.owner, 
						item.group.name,
						item.group.frequence_email )'> 
					<font-awesome-icon icon='minus-square' size='1x' /> 
					<span> {{ parse_groups( item.group.name ) }} </span> 
				</div> 
				<group_afficher_details v-if='afficher_group_details' 
					:group_name='group_name'
					:is_closable='true'
					:is_owner='is_owner'
					:frequence_email='frequence_email'
					:members='members'> 
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
				console.log( "SUP GROUP : " + group.name + ' ' + this.pseudo + ' ' + i ) 
				console.dir( this ) 

				let that = this

				services( 'POST', 'supprimer_groupe', { pseudo: this.pseudo, group: group.name } ).then( function( value ){
					console.dir( value ) 

					that.groups = that.groups.filter( elem => elem !== group )
					return that.root._data.user.groups = that.groups

				}).catch( function ( err ) {
					console.error( "ERR : " + err ) 
				})
			},
			afficherGroupDetails( members, owner, group_name, frequence_email ){

				this.group_name = group_name
				this.pseudo === owner ? this.is_owner = true : this.is_owner = false
				this.frequence_email = frequence_email
				console.log( "AFFICHER GROUP DETAILS " + this.group_name + ' ' + this.frequence_email ) 

				this.afficher_group_details = true
				return this.members = members
			}
		}
	},
	group_afficher_details: {
		data(){
			return {
				response: ''
			}
		},
		props: [ 'is_owner', 'members', 'frequence_email', 'is_closable', 'group_name' ],
		template: `<div class='afficher_membres'> 
				<bouton_fermeture_div v-if='is_closable'
					@close_div='closeDiv'>
				</bouton_fermeture_div> 
				<p> <mark> Groupe : {{ group_name.split( ':' )[ 1 ] }} </mark> </p>
				<p class='participants'> <mark> Participants : </mark> </p>
				<span v-for='member, index in this.members'> {{ member }} </span> 
				<br />
				<div v-if='is_owner'>
					<frequence_email 
						:form_id="'afficher_group_details_' + getMiniHash + '__'"
						:is_closable='is_closable'
						:frequence_email='frequence_email' 
						:response='response'
						@change_frequence_email='changeFrequenceEmail'> 
						<mark> Modifiez la fréquence de tirage : </mark> 
					</frequence_email>
				</div>
		</div>`,
		methods: {
			getMiniHash(){
				let r = String( Math.random() )
				return r.split( '.' )[ 1 ]
			},
			closeDiv(){
				this.$parent._data.afficher_group_details = false
			},
			changeFrequenceEmail(){
				console.log( "CHANGER FREQ EMAIL FOR GROUPS" ) 

				let freq = event.target.id,
					that = this

				freq = freq.split( ':' )[ 1 ]
				that.group_name = this.group_name
				that.freq = freq

				services( 'POST', 'modifierFrequenceEmailGroup', { group_name: this.group_name, frequence_email: freq } ).then( function( value ) {
					that.response = {
						freq: that.freq,
						statut: 'succes'
					}

					// update component's property
					that._props.frequence_email = that.freq

					let groups = that.$root._data.user.groups

					groups.forEach( function( elem, index ){
						if( elem.group.name === that.group_name ){
							elem.group.frequence_email = that.freq
						}
					})

					// update Vue UI
					that.$root._data.user.groups = groups

					// update component
					that.$children[ 1 ]._props.frequence_email = that.freq

					// TO DO : spaghetti ! Learn / Leverage usage of Vue Reactivity system

				} ).catch( function( err ) {
					console.log( "ERROR : " + err ) 
					that.response = {
						freq: that.freq,
						statut: 'erreur'
					}
				} )
			}
		}
	},

}

