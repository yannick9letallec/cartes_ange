module.exports = {
	group_ajouter_nom: {
		props: [ 'group_name' ],
		template: `<div> 
				<p> Nom {{ group_name }} : </p> 
				<input type='text' id='group_name' v-model='group_name' maxlenth='255' autofocus /> 
				<font-awesome-icon icon='angle-right' size='1x' @click="$emit( 'group_ajouter_membres', group_name )" /> 
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
				<frequence_email @change_frequence_email="$emit( 'change_frequence_email' )">
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
				this.frequence_email = event.target.id
			},
			creerInviterGroupe(){
				// MAJ MODEL pour les groups // sauvegardé en parallèle côté serveur
				let group_pseudos = [],
					i = 0,
					l = this.group_members.length

				for( i; i < l; i++ ){
					group_pseudos.push( this.group_members[ i ].pseudo )
				}

				this.groups.push( {
					group: {
						name: 'group:' + this.group_name,
						members: group_pseudos
					}	
				} )

				let data = {
					user: {
						pseudo: this.pseudo,
						email: this.email
					},
					group_name: this.group_name,
					frequence_email: this.frequence_email,
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
				afficher_membres: false,
				members: []
			}
		},
		props: [ 'groups', 'pseudo' ],
		template: `<div> 
				<div class='affiche_group clickable' v-for='item, index in groups' 
					@click='supprimerGroup( item, index )'
					@mouseenter='afficherMembres( item.group.members )' 
					@mouseleave='afficher_membres=false'> 
					<font-awesome-icon icon='minus-square' size='1x' /> 
					<span> {{ parse_groups( item.group.name ) }} </span> 
				</div> 
				<group_afficher_membres v-if='afficher_membres' 
					:members='members'> 
				</group_afficher_membres> 
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
			afficherMembres( members ){
				console.log( "AFFICHER MEMBRES" ) 

				this.afficher_membres = true
				let el = document.getElementsByClassName( 'afficher_membres' )[ 0 ]
				console.dir( el ) 

				/*
				el.style.top = event.clientX - 25
				el.style.right = event.clientY
				*/
				return this.members = members
			}
		}
	},
	group_afficher_membres: {
		props: [ 'members' ],
		template: `<div class='afficher_membres'> 
			<p> <mark> Participants : </mark> </p>
			<span v-for='member, index in this.members'> {{ member }} </span> 
		</div>`
	},

}

