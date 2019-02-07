module.exports = {
	gestion_compte:  { 
		data: function() { 
			return { 
				group_state: 'groups_existant' 
			} 
		}, 
		props: [ 'pseudo', 'email', 'groups' ], 
		template: `<div id='gestion_compte'> 
				<bouton_fermeture_div></bouton_fermeture_div> 
				<p> Mon Pseudo : </p> 
					{{ this.pseudo }} 
				<br /> 
				<p> Mon Email : </p> 
					{{ this.email }} 
				<br /> 
				<p> Mes Groupes : 
					<groups_existant v-if='groupsExists' 
						:pseudo='pseudo' 
						:groups='groups'> 
					</groups_existant> 
					<group_ajout_wrapper 
						:pseudo='pseudo' 
						:groups='groups' 
						:email='email'> 
					</group_ajout_wrapper> 
				</p> 
				<br /> 
				<button @click="emit( 'deconnexion' )"> Déconnexion </button> 
			</div>",
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
		}
	}
}
