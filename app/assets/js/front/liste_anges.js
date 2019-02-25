module.exports = {
	liste_anges: {
		props: [ 'cartes', 'type', 'mode' ],
		data: function(){
			return {
				activeClass: '',
				afficher_carte: false,
				carte_nom: '',
				carte: {},
				cartes_marquees: [],
				rejouer: false
			}
		},
		template: "<section class='liste_anges'> \
				<span :data-carte='carte' :class='activeClass' v-for='carte in cartes' \
					@click='afficherCarte( carte )'> \
					{{ this.activeClass !== 'manuel' ? carte : '-------' }} \
				</span> \
				<carte v-if='afficher_carte' \
					@close_div='reinitialiserAffichage' \
					:carte_nom='carte_nom' \
					:carte='carte'> \
				</carte> \
				<div id='rejouer' class='clickable' v-if='rejouer' @click='tirageAleatoire'> \
					Tirer à Nouveau ! \
				</div> \
			</section>",
		methods: {
			afficherCarte: function( carte, timeout ){
				console.log( "++++ : " + carte + " " + timeout ) 

				let that = this
				setTimeout( function() {
					that.afficher_carte = true
					that.carte_nom = carte
								
					services( 'POST', 'obtenirCarte', { carte } ).then( function( value ){
						console.dir( value.data ) 
						that.carte = value.data 
					} ).catch( function( err ) {
						console.log( "OBTENIR CARTE ERROR : " + err ) 
					} )
				}, timeout ? timeout : 0 )
			},
			reinitialiserAffichage: function(){
				this.afficher_carte=false

				let el = document.getElementsByClassName( 'liste_anges' )[ 0 ].children

				console.log( "REINITIALISER ( length ) : " + this.cartes_marquees.length ) 
				this.cartes_marquees.forEach( function( val ){
					console.log( "REINITIALISER : " + val ) 
					el[ val ].style.backgroundColor = 'initial'
				} )

				this.rejouer = true
			},
			allouerClasse: function(){
				console.log( "ALLO" ) 
			},
			tirageManuel: function(){
			},
			tirageAleatoire: function(){
				let i = 0,
					nb_flash = 2,
					liste_elements = this.cartes.length,
					el = document.getElementsByClassName( 'liste_anges' )[ 0 ].children,
					valeur_aleatoire,
					prev_index

				for( i; i <= nb_flash; i++ ){
					if( i > 0 ) {
						prev_index = valeur_aleatoire
						;( function ( i, prev_index, that ) {
							setTimeout( function(){

								el[ prev_index ].style.backgroundColor = 'red'
							}, 1000 * i )
						} )( i, prev_index, this )
					}


					valeur_aleatoire = Math.floor( Math.random() * liste_elements )
					this.cartes_marquees.push( valeur_aleatoire )

					;( function ( i, index, that ) {
						setTimeout( function(){

							// mise en avant de la carte choisie
							el[ index ].style.backgroundColor = 'blue'

							if( ( i ) === nb_flash ){
								setTimeout( function() {
									that.afficherCarte( el[ index ].dataset[ "carte" ], 1000 )	
								} )
							}	
						}, 1000 * i )
					} )( i, valeur_aleatoire, this )
				}
			}
		},
		mounted: function(){
			console.log( "CREATED : " + this.mode )
			this.activeClass = this.mode
			
			if( this.mode === "aleatoire" ){
				this.tirageAleatoire()
			}
		}
	}
}
