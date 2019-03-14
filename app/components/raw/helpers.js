module.exports = {
	services( method, url, data ){
		console.log( "SERVICES" ) 
		let vueComponent = this,
			protocol = ''

		if( vueComponent !== window ) console.log( "---" + vueComponent.$el.id + "---" ) 
		return new Promise( function ( resolve, reject ){
			const fname = "SERVICES"

			if( window.XMLHttpRequest ){
				console.info( "OK : [ " + fname + " ] XHR Object Found" ) 
				var xhr = new XMLHttpRequest()
			} else {
				console.info( "KO : [ " + fname + " ] No XHR Object Found" ) 
				return false
			}
			
			xhr.timeout = 10000

			xhr.addEventListener( 'readystatechange', function( event ){
				// waiting for server response
				if( vueComponent != window && ( vueComponent.$el.id === 'group_ajout_wrapper'|| vueComponent.$el.id === 'form_creer_compte' || vueComponent.$el.id === 'modifier_mot_de_passe' || vueComponent.$el.id === 'modifier_mot_de_passe_concret' ) && xhr.readyState != 4 ){
					switch( vueComponent.$el.id ){
						case 'modifier_mot_de_passe_concret':
						case 'form_creer_compte':
						case 'group_ajout_wrapper':
							document.getElementById( 'afficher_message' ).classList.toggle( 'afficher_none' )
						break
					}

					console.dir( vueComponent ) 
					vueComponent.$root.$data.pop_up_center = 'spinner'
				}
				if( xhr.readyState === 4 && xhr.status === 200 ){
					console.log( "SERVICE RESPONSE : " ) 
					console.log( xhr.responseText ) 
					resolve( { vueComponent: vueComponent, data: JSON.parse( xhr.responseText ) } )
				}
			})

			xhr.onprogress = function(){
				console.dir( vueComponent ) 
			}

			xhr.onerror = function(){
				reject( Error( xhr.statusText ) )
			}
			
			xhr.ontimeout = function( ){
				reject( 'XHR Timeout : ' + Error( 'in error constructor ' + xhr.statusText ) )
			}

			let params = ''
			if( data ){
				console.log( "SERVICE : Données Recues : " ) 
				for( let props in data ){
					console.log( props ) 
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

		console.log( fname, form_name ) 

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
	
		console.log( pseudo, mdp ) 

		switch( form_name ) {
			case 'login': {
				if( pseudo.length > 5 && mdp.length > 5 ){
					info.innerText = null
					submit.disabled = false
				} else {
					console.error( "KO : [ " + fname + " ] Données invalides pour authentifier l'utilisateur" ) 

					info.innerText = message
					submit.disabled = true
				}

		 	} break
			case 'creer_compte' : {
				let email = document.getElementById( 'email' ).value,
					confirmer_mdp = document.getElementById( 'confirmer_mdp' ).value

				if( pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat( email ) && mdp === confirmer_mdp ){
					submit.disabled = false

					info.innerText = null
					if( classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
				} else {
					console.error( "KO : [ " + fname + " ] Données invalides pour la création du compte" ) 

					submit.disabled = true

					if( !classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
					info.innerText = message + '\n' + email_err + '\n' + mdp_differents
				}

			} break
			case 'confirmer_invitation' : {
				let confirmer_mdp_inv = document.getElementById( 'confirmer_mdp_inv' ).value,
					mdp_inv = document.getElementById( 'mdp_inv' ).value

				console.log( "CONFIRMER INVITATIOH : " + mdp_inv + ' / ' + confirmer_mdp_inv ) 

				if( mdp_inv.length > 5 && mdp_inv === confirmer_mdp_inv ){
					submit.disabled = false
				} else {
					console.error( "KO : [ " + fname + " ] Données invalides pour confirmer l'invitation du membre" ) 
					submit.disabled = true
				}
			} break
			case 'form_modifier_mot_de_passe': {
				console.log( "VERFI FORMULAIRE : FORM MODIFIER MDP" ) 
				let pseudo = document.getElementById( 'modifier_mot_de_passe_pseudo' ).value,
					email = document.getElementById( 'modifier_mot_de_passe_email' ).value 

				if( pseudo.length > 5 && verifierEmailFormat( email ) ){
					console.log( "FIELD DATA OK" ) 
					document.querySelector( '#form_modifier_mot_de_passe [type=submit]' ).disabled = false
				} else {
					console.log( "FIELD DATA KO" ) 
				}
			} break
			case 'modifier_mot_de_passe_valider': {
				console.log( "MODIFIER MOT DE PASSE CONFIRMER" ) 
				let passwd = document.getElementById( 'mot_de_passe' ).value,
					passwd_cfm = document.getElementById( 'mot_de_passe_confirmer' ).value

				if( passwd.length > 5 && passwd_cfm.length > 5 && passwd === passwd_cfm ){
					console.log( "OK" ) 
					document.querySelector( '#modifier_mot_de_passe_concret [type=submit]' ).disabled = false
					//send new passwd

				} else {
					console.log( "KO" ) 
					// afficher msg erreur

				}

			} break
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
