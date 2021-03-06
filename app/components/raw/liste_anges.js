module.exports = {
	liste_anges: {
		props: [ 'cartes', 'type', 'mode' ],
		data: function(){
			return {
				afficher_carte: false,
				nouveau_tirage: false,
				etat_du_tirage: null,
				carte_nom: '',
				carte: {},
				cartes_marquees: [],
				clickableClass: true,
				afficher_noneClass: true,
				default_carteClass: true
			}
		},
		template: `<section class='liste_anges'> 
				<img v-for='carte in cartes' 
					:class='{carte_ange: default_carteClass, clickable: clickableClass }'
					:alt="'carte unique représentative d un Ange et de son message ' + carte " 
					:src="cheminCarteImage( carte )" 
					:data-carte='carte'
					@mouseenter='afficherTitreCarte'
					@click='afficherCarte( carte )'> 
				</span> 
				<carte v-if='afficher_carte'
					@close_div='finaliserTirageAleatoire'
					:carte_nom='carte_nom' 
					:carte='carte'> 
				</carte> 
				<div :class='{ nouveau_tirage: nouveau_tirage,  afficher_none: afficher_noneClass }'>
					<div class='clickable' 
						@click='nouveauTirageAleatoire'>
						NOUVEAU TIRAGE ?
					</div>
				</div>

			</section>`,
		methods: {
			finaliserTirageAleatoire(){
				this.afficher_carte = false
				this.afficher_noneClass = true
				this.nouveau_tirage = true

				if( this.mode === 'aleatoire' ){
					this.etat_du_tirage = 'arret'
					this.afficher_noneClass = true
				
					this.shuffle()
				}
			},
			afficherTitreCarte(){
				
			},
			cheminCarteImage( carte ){
				if( this.mode != 'manuel' ){ 
					return '/app/img/cartes/PNG/small/' + carte + '.png'
				} else {
					return '/app/img/back.png'
				}
			},
			afficherCarte: function( carte, timeout ){
				if( this.mode === 'aleatoire' && event ) return undefined

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
					el[ val ].style.borderRadius = 'initial'
				} )
			},
			tirageAleatoire: function(){
				// on masque le div d'invitation au tirage
				this.nouveau_tirage = false

				this.cartes_marquees.length = 0

				// activation du tirage
				this.etat_du_tirage = 'en_cours'

				let i = 0,
					nb_flash = 1,
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
								el[ prev_index ].style.borderRadius = 'initial'
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
							el[ index ].style.borderRadius = '45px'
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
			nouveauTirageAleatoire(){
				this.etat_du_tirage = 'pret'
				this.tirageAleatoire()
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


				/*
				console.log( "UPDATED" )
				if( this.mode === 'aleatoire' ) this.shuffle()
				*/
				return this.cartes = tranche_2.concat( tranche_1 )
			}
		},
		beforeUpdate(){
			console.log( "BEFORE UPDATE" ) 
			console.log( this.mode ) 
			console.log( this.etat_du_tirage ) 

			if( this.mode === 'manuel' || this.mode === 'explorer' ) {
				this.etat_du_tirage = 'pret'
				this.nouveau_tirage = false
				this.clickableClass = true
			} else {
				if( this.etat_du_tirage === 'pret' ) this.tirageAleatoire()
				this.clickableClass = false
			}
		},
		updated(){
			// hook messing around to get dom access for var target ...
			if( this.mode === 'aleatoire' && this.nouveau_tirage ){
				// afficher la rpoposition de rejouer à nouveau
				let src = document.getElementsByClassName( 'liste_anges' )[ 0 ],
					target,
					target_H

				src_H = src.getClientRects()[ 0 ].height
				src_W = src.getClientRects()[ 0 ].width

				target = document.getElementsByClassName( 'nouveau_tirage' )[ 0 ]
				target_H = target.getClientRects()[ 0 ].height
				target.style.top = ( ( src_H - target_H ) / 2 ) + "px"
			}

		},
		created(){
			console.log( "CREATED" ) 
		},
		mounted: function(){
			console.log( "MOUNTED : " + this.mode )
			
			if( this.mode === "aleatoire" ){
				this.clickableClass = false
				this.shuffle()
				this.tirageAleatoire()
			}

			if( this.mode === 'manuel' ) this.shuffle()
		}
	}
}
