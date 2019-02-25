module.exports = {
	services( method, url, data ){
		let vueComponent = this,
			protocol = ''

		return new Promise( function ( resolve, reject ){
			const fname = "SERVICES"

			if( window.XMLHttpRequest ){
				var xhr = new XMLHttpRequest()
			} else {
				return false
			}
			
			xhr.timeout = 5000

			xhr.addEventListener( 'readystatechange', function( event ){
				if( xhr.readyState === 4 && xhr.status === 200 ){
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
					params += props + '=' + data[ props ]
				}
			}

			xhr.open( method, location.protocol + '//local.exemple.bzh/services/' + url, true )
			xhr.setRequestHeader( 'Content-Type', 'application/json' )
			xhr.send( data ? JSON.stringify( data ) : null )
		})
	},
	verifierFormulaire( event ){
		const fname = "VERIFIER FORMULAIRE"

		const form_name = event.target.form.id

		const pseudo_err_message = 'Pseudo > 5 caractères' 
		const email_err = 'Rentrez un email valide' 
		const mdp_err_message = 'Mot de Passe  > 5 caractères' 
		const mdp_differents = 'Les mots doivent correspondre' 

		let message = pseudo_err_message + "\n" + mdp_err_message,
			pseudo = document.getElementById( 'pseudo' ).value,
			mdp = document.getElementById( 'mdp' ).value,
			info = document.getElementById( 'info' ),
			classe_erreur = info.classList.contains( 'afficher_message_erreur' ),
			submit = document.querySelector( '[id=' + form_name + '] button[type=submit]' )
	

		switch( form_name ) {
			case 'login':
				if( pseudo.length > 5 && mdp.length > 5 ){
					info.innerText = null
					submit.disabled = false
				} else {

					info.innerText = message
					submit.disabled = true
				}

				break
			case 'creer_compte' :
				let email = document.getElementById( 'email' ).value,
					confirmer_mdp = document.getElementById( 'confirmer_mdp' ).value

				if( pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat( email ) && mdp === confirmer_mdp ){
					submit.disabled = false

					info.innerText = null
					if( classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
				} else {

					submit.disabled = true

					if( !classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
					info.innerText = message + '\n' + email_err + '\n' + mdp_differents
				}

				break;
			case 'confirmer_invitation' :
				let confirmer_mdp_inv = document.getElementById( 'confirmer_mdp_inv' ).value,
					mdp_inv = document.getElementById( 'mdp_inv' ).value


				if( mdp_inv.length > 5 && mdp_inv === confirmer_mdp_inv ){
					submit.disabled = false
				} else {
					submit.disabled = true
				}
				break
		}
	},
	verifierEmailFormat( email ){
		let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
		return regex.test( email )
	},
	viderDiv( div_id ){
		let div = document.getElementById( div_id )

		while( div.firstChild ){
			div.removeChild( div.firstChild )
		}
	}
}
