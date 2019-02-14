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
			}
		},
		template: `<section class='liste_anges'> 
				<img v-for='carte in cartes' 
					class='carte_ange clickable'
					:alt="'carte unique représentative d un Ange et de son message ' + carte " 
					:src="cheminCarteImage( carte )" 
					:data-carte='carte'
					@mouseenter='afficherTitreCarte'
					@click='afficherCarte( carte )'> 
				</span> 
				<carte v-if='afficher_carte'
					@close_div='afficher_carte = false' 
					:carte_nom='carte_nom' 
					:carte='carte'> 
				</carte> 
			</section>`,
		methods: {
			afficherTitreCarte(){
				
			},
			cheminCarteImage( carte ){
				if( this.mode != 'manuel' ){ 
					return '/app/img/cartes/PNG/' + carte + '.png'
				} else {
					return '/app/img/back.png'
				}
			},
			afficherCarte: function( carte, timeout ){

				let that = this
				setTimeout( function() {
					that.afficher_carte = true
					that.carte_nom = carte
								
					services( 'POST', 'obtenirCarte', { carte } ).then( function( value ){
						that.carte = value.data 
						console.dir( value.data ) 

						that.reinitialiserAffichage()
					} ).catch( function( err ) {
						console.log( "OBTENIR CARTE ERROR : " + err ) 
					} )
				}, timeout ? timeout : 0 )

				if( this.mode === 'manuel' ) that.shuffle()
			},
			reinitialiserAffichage: function(){
				let el = document.getElementsByClassName( 'liste_anges' )[ 0 ].children

				console.log( "REINITIALISER ( length ) : " + this.cartes_marquees.length ) 
				this.cartes_marquees.forEach( function( val ){
					console.log( "REINITIALISER : " + val ) 
					el[ val ].style.transform = 'scale( 1 )'
					el[ val ].style.border = 'initial'
					el[ val ].style.outline = 'initial'
					el[ val ].style.zIndex = 'initial'
				} )
			},
			tirageAleatoire: function(){
				this.cartes_marquees.length = 0

				let i = 0,
					nb_flash = 5,
					liste_elements = this.cartes.length,
					el = document.getElementsByClassName( 'liste_anges' )[ 0 ].children,
					valeur_aleatoire,
					prev_index

				for( i; i <= nb_flash; i++ ){
					// reset style update
					if( i > 0 ) {
						prev_index = valeur_aleatoire
						;( function ( i, prev_index, that ) {
							setTimeout( function(){
								el[ prev_index ].style.transform = 'scale( 1 )'
								el[ prev_index ].style.border = 'initial'
								el[ prev_index ].style.outline = 'initial'
								el[ prev_index ].style.zIndex = 'initial'
							}, 1000 * i )
						} )( i, prev_index, this )
					}


					valeur_aleatoire = Math.floor( Math.random() * liste_elements )
					this.cartes_marquees.push( valeur_aleatoire )

					// mise en avant de la carte choisie
					;( function ( i, index, that ) {
						setTimeout( function(){
							el[ index ].style.transform = 'scale( 1.5 )'
							el[ index ].style.border = '8px solid #258'
							el[ index ].style.zIndex = '999'

							if( ( i ) === nb_flash ){
								setTimeout( function() {
									that.afficherCarte( el[ index ].dataset[ "carte" ], 1000 )	
								} )
							}	
						}, 1000 * i )
					} )( i, valeur_aleatoire, this )
				}
			},
			shuffle(){
				console.log( "CARTES" ) 
				console.dir( this.cartes ) 

				let L = this.cartes.length,
					Rand = Math.floor( Math.random() * L ) 
					TmpArray = Array( L ),
					target = this.cartes,
					tranche_1 = [], 
					tranche_2 = []

				target.forEach( function( e, i, a ){
					if( i + Rand >= L ){
						TmpArray[ ( i + Rand ) - L ] = e
					} else {
						TmpArray[ i + Rand ] = e
					}
				})

				tranche_1 = TmpArray.slice( 0, Rand ).reverse()
				tranche_2 = TmpArray.slice(  Rand ).reverse()

				return this.cartes = tranche_2.concat( tranche_1 )
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
