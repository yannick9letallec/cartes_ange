module.exports.services = function( method, url, data ){
		let vueComponent = this
		return new Promise( function ( resolve, reject ){
			const fname = this.name.toUpperCase()

			if( window.XMLHttpRequest ){
				console.info( "OK : [ " + fname + " ] XHR Object Found" ) 
				var xhr = new XMLHttpRequest()
			} else {
				console.info( "KO : [ " + fname + " ] No XHR Object Found" ) 
				return false
			}
			
			xhr.timeout = 5000

			xhr.addEventListener( 'readystatechange', function( event ){
				if( xhr.readyState === 4 && xhr.status === 200 ){
					console.log( xhr.responseText ) 
					resolve( { vueComponent: vueComponent, data: JSON.parse( xhr.responseText ) } )
				}
			})

			xhr.onerror = function(){
				reject( Error( xhr.statusText ) )
			}
			
			xhr.ontimeout = function( ){
				reject( 'XHR Timeout : ' + Error( 'in error constructor ' + xhr.statusText ) )
			}

			let params = ''
			if( data ){

				for( let props in data ){
					console.log( props ) 
					params += props + '=' + data[ props ]
				}
			}

			xhr.open( method, 'http://local.exemple.bzh/services/' + url, true )
			xhr.setRequestHeader( 'Content-Type', 'application/json' )
			xhr.send( data ? JSON.stringify( data ) : null )
		})
	}

module.exports.verifierFormulaire = function ( event ){
		const fname = this.name.toUpperCase()

		const form_name = event.target.form.id

		const pseudo_err_message = 'Pseudo > 5 caractères' 
		const email_err = 'Rentrez un email valide' 
		const mdp_err_message = 'Mot de Passe  > 5 caractères' 
		const mdp_differents = 'Les mots doivent correspondre' 

		let message = pseudo_err_message + "\n" + mdp_err_message

		let pseudo = document.getElementById( 'pseudo' ).value
		let mdp = document.getElementById( 'mdp' ).value

		let info = document.getElementById( 'info' )
		let classe_erreur = info.classList.contains( 'afficher_message_erreur' )
		

		switch( form_name ) {
			case 'login':
				console.log( form_name ) 

				if( pseudo.length > 5 && mdp.length > 5 ){
					event.target.form[2].disabled = false

					info.innerText = null
					if( classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
				} else {
					console.error( "KO : [ " + fname + " ] Données invalides pour authentifier l'utilisateur" ) 

					document.querySelector( '[type=submit]' ).disabled = true

					if( !classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
					info.innerText = message
				}

				break
			case 'creer_compte' :
				let email = document.getElementById( 'email' ).value,
					confirmer_mdp = document.getElementById( 'confirmer_mdp' ).value

				if( pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat( email ) && mdp === confirmer_mdp ){
					document.querySelector( '[type=submit]' ).disabled = false

					info.innerText = null
					if( classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
				} else {
					console.error( "KO : [ " + fname + " ] Données invalides pour la création du compte" ) 

					document.querySelector( '[type=submit]' ).disabled = true

					if( !classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
					info.innerText = message + '\n' + email_err + '\n' + mdp_differents
				}

				break;
			case 'confirmer_invitation' :
				let confirmer_mdp_inv = document.getElementById( 'confirmer_mdp_inv' ).value,
					mdp_inv = document.getElementById( 'mdp_inv' ).value

				console.log( "CONFIRMER INVITATIOH : " + mdp_inv + ' / ' + confirmer_mdp_inv ) 

				if( mdp_inv.length > 5 && mdp_inv === confirmer_mdp_inv ){
					document.querySelector( '[type=submit]' ).disabled = false
				} else {
					console.error( "KO : [ " + fname + " ] Données invalides pour confirmer l'invitation du membre" ) 
					document.querySelector( '[type=submit]' ).disabled = true
				}
				break
		}
	}

module.exports.verifierEmailFormat = function( email ){
		let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
		return regex.test( email )
}
module.exports.viderDiv = function ( div_id ){
		let div = document.getElementById( div_id )

		while( div.firstChild ){
			div.removeChild( div.firstChild )
		}
	}
