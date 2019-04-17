'use strict'

/* --TEST WOOK */

let util = require( 'util' )
let fs = require( 'fs' )
let http = require( 'http' )

let redis = require( 'redis' ).createClient() 
let mailer = require( 'nodemailer' )
let UUID = require( 'uuid/v1' )
let express = require( 'express' )

let app = express()

// custom global config
app.set( 'mail_from', 'yannick@messages-des-anges.fr' )

// Express predefined
app.set( 'title', 'Les Anges' )
app.set( 'views', './components/email/' )
app.set( 'view engine', 'pug' )

app.engine( 'pug', require( 'pug' ).__express )

// GLOBAL DATA
let User = {},
	expire = 2592000 // 1 mois

redis.auth( 'Kixsell_1', function( err, reply ){
	console.log( "REDIS AUTH : " + err ? err : reply ) 
})

app.use( express.json() )
app.use( express.urlencoded() )

app.get( '/', function( req, res, next ){
	console.log( "REQUEST RECEIVED " + req.path ) 
	res.send( '/app/index.html' )
})

app.post( '/verifierUtilisateur', function( req, res, next ){
	console.log( req.path ) 
	console.dir( req.body ) 

	let data = req.body
	let user = 'user:' + data.pseudo

	redis.hgetall( user, function( err, reply ){
		if( err ) redisError( err )

		if( reply ){
			console.dir( reply ) 

			if( data.mdp === reply.mdp ){
				console.log( 'OK Utilisateur Valide' )

				User = {
					pseudo: data.pseudo,
					email: reply.email,
					statut: reply.statut,
					frequence_email: reply.frequence_email,
					se_souvenir: reply.se_souvenir
				}

				let cookie_max_age = new Date( Date.now() + 60 )

				res.cookie( 'loggedin', 'true', { httpOnly: false, expires: new Date( Date.now() + 900000 ) } )
				res.cookie( 'pseudo', data.pseudo, { httpOnly: false, expires: new Date( Date.now() + 900000 ) } )
				
				let groups = []

				for( let key in reply ){
					if( /^group:/.test( key ) ) {
						groups.push( key )	
					}
				}
	
				// Scan des groupes, pour avoir les membres
				let group_members = [],
					owner,
					frequence_email

				for( let i = 0; i < groups.length; i++ ){
					group_members[ i ] = new Promise( function( resolve, reject ){
						redis.smembers( groups[ i ], function( err, reply ){
							if( err ) redisError( err )

							owner = reply[ reply.findIndex( elem => elem === 'owner:' + data.pseudo ) ]
							console.log( owner ) 
							owner = owner.split( ':' )[ 1 ]

							frequence_email = reply[ reply.findIndex( elem => elem.match( /^frequence_email:/ ) ) ]
							frequence_email = frequence_email.split( ':' )[ 1 ]
						
							reply = reply.filter( elem => elem !== 'owner:' + data.pseudo && !elem.match( /frequence_email:/ ) )

							resolve( { group: { 
									name: groups[ i ],
									owner: owner,
									members: reply,
									frequence_email: frequence_email
								}
							} )
						})
					})
				}

				Promise.all(  group_members ).then( function( values ) {
					console.dir( util.inspect( values, { depth: null })) 

					User.groups = values

					redis.ttl( user, function( err, reply ){
						if( err ) reject( redisError( err ) )
						
						console.log( "FINISH : " + reply ) 
						User.ttl = reply

						res.json( { 
							response: 'utilisateur valide', 
							user: User
						} )
					})
				})
			} else {
				console.log( 'KO Utilisateur Non Valide' )
				res.json( { response: 'utilisateur invalide' } )
			} 

		} else {
			console.log( 'KO : No Redis Entry for this user : ' + JSON.stringify( req.body ) )
			res.json( { response: 'utilisateur inexistant' } )  
		}
	})
})

app.post( '/creerCompte', function( req, res, next ){
	console.log( req.path ) 

	let data = req.body,
		user = 'user:' + data.pseudo

	redis.hgetall( user, function (err, reply ){
		if( err ) redisError( err )

		console.log( !!reply, reply === Object, typeof reply )

		if( !reply ){
			redis.multi()
				.hmset( user, 'email', data.email, 'mdp', data.mdp, 'se_souvenir', data.se_souvenir_de_moi, 'frequence_email', data.frequence_email, 'statut', 'a_confirmer', function( err, reply ){})
				.expire( user, expire, function( err, reply ) {} )
				.sadd( 'frequence_email:' + data.frequence_email, data.pseudo + ':' + data.email, function( err, reply ){} )
				.exec( function( err, replies ){
					if( err ) {
						redisError( err )

						res.json( { 
							response: 'ko',
							message: 'Une erreur est survenue pendant l\enregistrement de votre compte. Veuillez réessayer ultérieurement. Si l\'erreur persiste, merci de nous contacter via le formulaire de contact.' 
						} )
					} else {
						console.log( 'OK : New Redis Entry for this user : ' + JSON.stringify( req.body ) )

						let pug_options = {
							pseudo: data.pseudo,
							href: 'local.exemple.bzh/confirmer_creation_compte?pseudo=' + data.pseudo
						}

						res.json( { 
							response: 'ok',
							message: 'Votre compte à bien été crée. Un email vient de vous être envoyé à l\'adresse : ' + data.email 
						} )

						prepareMail( data.email, 'confirmer_compte.pug', '[ Messages Des Anges ] ' + data.pseudo + ', Bienvenue ! ', pug_options )
					}
				})
		} else {
			res.json( { 
				response: 'ko',
				message: 'Ce compte existe déjà, merci de vérifier les informations fournies.' 
			} )
		}

	})
})

app.post( '/supprimerCompte', function( req, res, next ){
	console.log( "SUPPRIMER COMPTE" ) 
	console.dir( util.inspect( req.body ) ) 
	
	let pseudo = req.body.pseudo
	redis.del( 'user:' + pseudo, function( err, reply ){
		if( err ) redisError( err )

		console.log( !!reply )
		if( !!reply ){
			res.json( { data: 'OK : Suppression de l utilisateur : ' + pseudo } )
		} else {
			res.json( { data: 'KO : DATA : utilisateur :' + pseudo + ' inéxistant en DB' } )
		} 
	})
})

app.post( '/creerInviterGroupe', function( req, res, next ){
	console.log( "CREER INVITER GROUPE" ) 
	console.dir( util.inspect( req.body ) ) 

	let pseudo = req.body.user.pseudo,
		nom_du_groupe = req.body.nom_du_groupe,
		group_members = req.body.group_members,
		l = req.body.group_members.length,
		frequence_email = req.body.frequence_email

	// ajouter le groupe à l'utilisateur ( champ avec une valeur nulle )
	let ajout_groupe_au_createur = new Promise( function ( resolve, reject ){
		redis.hset( 'user:' + pseudo, 'group:' + nom_du_groupe, '', function( err, reply ){
			if( err ) {
				reject()
				redisError( err )
			}

			console.log( "[OK] REDIS : " + reply ) 
			resolve()	
		} )
	} )

	let members = [], 
		i,
		member_pseudo,
		member_email,
		promises = []

	for( i = 0; i < l; i++ ){
		member_pseudo = group_members[ i ].pseudo 
		member_email = group_members[ i ].email
		
		members.push( member_pseudo )

		// créer un hash expirant pour les membres invités
		promises.push( new Promise( function( resolve, reject ){
			// 2592000
			redis.multi()
				.hmset( 'user:' + member_pseudo, 'email', member_email, 'statut', 'invite', function( err, replies ){ })
				.expire( 'user:' + member_pseudo, expire, function( err, replies ){ } )
				.sadd( 'frequence_email:' + frequence_email, member_email, function( err, reply ) {} ) 
				.exec( function( err, replies ){
					if( err ) {
						reject()
						redisError( err )
					}

					replies.forEach( function( reply, index ){
						console.log( "MULTI : " + index + " / " + reply )
						resolve()
					})
				})

		} ) )

		let pug_options = {
			membre: member_pseudo,
			invitant: pseudo,
			group: nom_du_groupe,
			frequence: gendrifyFrequence( frequence_email, 'masculin' ),
			href: 'local.exemple.bzh/confirmer_invitation?pseudo=' + pseudo + '&group=' + nom_du_groupe 
		}

		prepareMail( member_email, 'confirmer_invitation.pug', '[ Messages Des Anges ] ' + capitalize( member_pseudo ) + ', ' + capitalize( pseudo ) + ' vous invite ! ', pug_options )

	} 

	members.push( 'owner:' + pseudo, "frequence_email:" + frequence_email )

	// creer le ( groupe ) ensemble contenant le nom des différents membres, dont celui du créateur
	let groupe_creation = new Promise( function( resolve, reject ){
		redis.sadd( 'group:' + nom_du_groupe, ...members, function( err, reply ){
			if( err ) {
				reject()
				redisError( err )
			}

			console.log( "[OK] REDIS : " + reply ) 
			resolve()
		} )
	} )

	promises.push( ajout_groupe_au_createur, groupe_creation )
	Promise.all( promises ).then( function( values ){
		console.log( 'OK : END PROMISES ' + values ) 
		res.json({
			response: 'ok',
			message: 'Le groupe ' + nom_du_groupe + ' a bien été enregistré. Un email d\'invitation a également été envoyé à chacun des membres. Merci de votre participation :)'
		})
	}).catch( function( err ){
		console.log( 'KO : END PROMISES ' + err ) 
		res.json({
			response: 'ko',
			message: 'Une erreur est survenue pendant l\'enregistrement du groupe ' + nom_du_groupe + '. Veuillez réessayer ultérieurement, et si le problème persiste, laissez nous un message via le formulaire de contact.'
		})
	})
})

app.post( '/supprimer_groupe', function( req, res ){
	let pseudo = req.body.pseudo,
		groupe = req.body.group

	console.log( "SUPPRIMER GROUPE : " + pseudo + ' ' + groupe ) 

	// get  ownership
	redis.smembers( groupe, function( err, reply ){
		console.log( reply[ 0 ] ) 
		let s = reply[ 0 ],
			members

		if( s.indexOf( 'owner:' + pseudo ) !== -1 ){
			console.log( "SUCCESS OWNER FOUND" ) 
		
			members = s.split( ' ' )
			members = members.filter( elem => elem !== 'owner:' + pseudo )

			// suppression des membres du groupe
			members.forEach( function( elem ){
				redis.hdel( 'user:' + elem, groupe, function( err, reply ){
					if( err ) redisError( err )
				
					console.log( "OK : SUP GROUPE : Suppresion du USER : " + elem ) 
				})
			})
			console.log( "--- " + members ) 

			// suppression du groupe de l'owner
			// suppression du groupe
			redis.multi()
				.hdel( 'user:' + pseudo, groupe, function( err, reply ) {} )
				.del( groupe, function( err, reply ){} )
				.exec( function( err, replies ){
					if( err ) redisError( err )

					console.dir( replies ) 
					res.send( { data: 'OK' } )
				})
		} 
	})
})

app.get( '/recuperer_liste_anges', function( req, res ){
	console.log( "RECUP LISTE ANGES" ) 
	redis.llen( 'cartes', function( err, reply ){
			if( err ) redisError( err )

			redis.lrange( 'cartes', 0, reply, function( err, reply ){
				console.log( "CARTES : " ) 
				console.dir( reply  ) 

				res.json( reply )
			} )
		})
})

app.post( '/obtenirCarte', function( req, res ){
	console.log( "OBTENIR CARTE " + req.body.carte ) 
	redis.hgetall( 'Carte:' + req.body.carte, function( err, reply ){
		if( err ) redisError( err )

		res.json( reply ) 		
	} )
} )

app.post( '/confirmerInvitation', function( req, res ){
	console.dir( req.body ) 

	let data = req.body,
		key = 'user:' + data.pseudo,
		group_name = data.group_name,
		se_souvenir_de_moi = data.se_souvenir_de_moi,
		frequence_email = data.frequence_email

	redis.multi()
		.persist( key, function( err, reply ){} )
		.hmset( key, 'statut', 'permanent', 'group:' + group_name, '', 'se_souvenir_de_moi', se_souvenir_de_moi, 'frequence_email', frequence_email, function( err, reply ){} )
		.exec( function( err, replies ){
			if( err ) redisError( err )

			replies.forEach( function( reply, index ){
				console.log( "MULTI : " + index + " / " + reply )
			})

		})
})

app.post( '/modifierChamp', function( req, res ){
	let data = req.body,
		pseudo = data.pseudo,
		type = data.type,
		old = data.old_value,
		upd = data.new_value

	console.log( 'DATA' ) 
	console.dir( data ) 

	if( type === 'pseudo' ){
		verifierUtilisateur( 'user:' + upd ).then( function( value ){
			if( !!value ){
				console.log( "UTILISATEUR DISPONIBLE" ) 
				redis.rename( 'user:' + old, 'user:' + upd, function( err, reply ){
					if( err ) redisError( req, res, err )

					console.log( reply ) 
					res.json( { 
						response: 'ok',
						message: 'Nouveau Pseudo enregistrée',
						new_value: upd
					} )
				})
			} else {
				console.log( "UTILISATEUR DEJA PRIS" ) 
				res.json( {
					response: 'ko',
					message: 'utilisateur déjà existant'
				} )
			} 
		}).catch( function( err ) {
			console.dir( err ) 
		})
	} else if( type === 'email' ){
		// TODO - Check Emails
		redis.hset( 'user:' + pseudo, 'email', upd, function( err, reply ){
			if( err ) redisError( req, res, err )

			console.log( reply ) 
			res.json( {
				response: 'ok',
				message: 'Nouvel Email enregistré',
				new_value: upd
			} )
		})
	}
	

})

app.post( '/modifierFrequenceEmail', function( req, res ){
	console.log( "Modifier Frequence Email User" ) 
	let data = req.body

	redis.hset( 'user:' + data.pseudo, 'frequence_email', data.frequence_email, function( err, reply ) {
		if( err ) redisError( req, res, err )

		res.json( { response: 'ok' } )
	})
})

app.post( '/modifierFrequenceEmailGroup', function( req, res ){
	console.log( "Modifier Frequence Email Groupe" ) 
	console.dir( req.body ) 
	let data = req.body


	redis.smembers( data.group_name, function( err, reply ) {
		if( err ) redisError( req, res, err )

		reply = reply.filter( function( val, ind, arr ){
			return !val.match( /^frequence_email:/ )
		} )

		reply.push( 'frequence_email:' + data.frequence_email )
		console.dir( reply ) 


		redis.multi()
			.del( data.group_name, function( err, rep ){} )
			.sadd( data.group_name, ...reply, function( err, reply ){} )
			.exec( function( err, replies ){
				if( err ) redisError( err )
				
				console.log( "010" ) 
				console.dir( replies ) 
				res.json( { response: 'ok' } )
			})
	})
})

app.post( '/demandeContact', function( req, res ){
	console.log( "DEMANDE CONTACT" ) 
	let  data = req.body
	console.dir( data ) 
	// Archiver la demande
	redis.hset( 'Contact:' + data.email, 'date', data.date, 'message', data.message, function( err, reply ){
		if( err ) redisError( req, res, err )

		console.log( "REDIS REPLY" ) 
		console.dir( reply )
		res.json({
			response: 'ok'
		})

		// Envoyer un email à l'administrateur
		let mailOptions = {
			to: 'yannick@messages-des-anges.fr',
			subject: '[ Messages Des Anges ] Demande de Contact',
			html: `<div>
				nouveau message recu de : ${ data.email }
				<br />
				message : ${ data.message }
			</div>`
		}
		sendMail( mailOptions )

	} )
})

app.post( '/confirmer_creation_compte', function( req, res ){
	console.log( "CONFIRMER CREATION COMPTE" ) 
	console.dir( req.body ) 

	let data = req.body,
		key = 'user:' + data.pseudo,
		group_name = data.group_name,
		se_souvenir_de_moi = data.se_souvenir_de_moi,
		frequence_email = data.frequence_email

	redis.multi()
		.persist( key, function( err, reply ){} )
		.hmset( key, 'statut', 'permanent', function( err, reply ){} )
		.exec( function( err, replies ){
			if( err ) redisError( err )

			replies.forEach( function( reply, index ){
				console.log( "MULTI : " + index + " / " + reply )
			})

	})
})

app.post( '/modifier_mot_de_passe_token', function( req, res ){
	let token = req.body.token
	console.log( 'Modifier mot de passe token ' + token ) 

	redis.hgetall( 'modifier_mdp:' + token, function( err, reply ){
		if( err ) redisError( err )
		
		res.json({
			pseudo: reply.user,
			email: reply.email
		})
	})
})

app.post( '/modifierMotDePasse', function( req, res ){
	console.log( "modifierMotDePasse" ) 
	let data = req.body,
		pseudo = data.pseudo,
		email = data.email

	console.log( data ) 

	redis.hgetall( 'user:' + pseudo, function( err, reply ){
		if( err ) redisError( err )

		console.log( "TEST USER PSEUDO : " + reply + ' : EMAIL : ' ) 
		if( reply && ( email === reply.email )){

			// sending email
			// generating token.
			let random = UUID(),
				pug_options = {
					pseudo: pseudo,
					href: 'local.exemple.bzh/modifier-mot-de-passe?token=' + random,
					token: random
				}

			console.log( 'UUID : ' + random ) 
			prepareMail( email, 'modifier_mot_de_passe.pug', 'Modifiez votre Mot de Passe ...', pug_options )

			// recording process in DB
			redis.hset( 'modifier_mdp:' + random, 'user', pseudo, 'email', email, 'EX', 86400, function( err, reply ){
				if( err ) {
					redisError( err )
					var response = 'ko',
						message = pseudo + ', un problème est survenu lors de l\'enregistrement de votre demande, merci de la renouveller.'
				} else {
					// sending UI response
					var response = 'ok',
						message = pseudo + ', un email vous permettant de changer votre mot de passe vient de vous être envoyé à l\'adresse email suivante : ' + email
				}
				res.json({ 
					data: {
						response,
						message
					 	}
					})
			})
		} else {
			res.json({ 
				data: {
					response: 'ko',
					message: 'Les informations transmises ne nous permettent pas de vous identifier, veuillez réessayer...'
			 	}
			})
		}
	})

	/*
	setTimeout( function(){
		res.json({ 
				data: {
					response: 'ok',
					message: 'Identifiants Inconnus ...'
			 	}
			})
	}, 5000 )
	*/
})

app.post( '/modifier_mot_de_passe_concret', function( req, res ){
	let data = req.body,
		response = '',
		message = ''

	console.log( 'modifier_mot_de_passe_concret : ' )
	console.dir( data ) 

	redis.hset( 'user:' + data.pseudo, 'mdp', data.passwd, function( err, reply ){
		if( err ) {
			redisError( err )
			response = 'ko'
			message = 'Un problème est survenu pendant l\'enregistrement de votre nouveau mot de passe. Merci de réessayer.'
		} else {
			response = 'ok'
			message = 'Votre nouveau mot de passe est bien enregistré'
		}

		res.json({
			response,
			message
		})
	})
})
// APP FILES MANAGEMENT
app.get( '*.css', function( req, res ){
	console.log( "-----" ) 
	res.send( 'CSS sended' )
})

app.post( '/ajax', function( req, res ) {
	res.send( 'BADABOUM' )
})


// REDIS PART
redis.on( 'error', function( err ){
	console.log( "KO : [ REDIS ] " + err ) 
})

// NODEMAILER PART

app.get( '/mail', function( req, res ){
	console.log( "TEST MAILING" ) 
	res.send( 'OK' )
	prepareMail()
})

// 
function prepareMail( email, template, subject, pug_options ){
	/*
	let pseudo = 'Yannicko',
		nom_du_groupe = 'Alpha',
		template = 'confirmer_invitation.pug',
		subject = '[ Messages Des Anges ] ' + pseudo + ', On vous invite ! ',
		pug_options = {
			pseudo: pseudo,
			invitant: 'PERSONNE INVITANT',
			href: 'local.exemple.bzh/modifier_mot_de_passe?token=' + random
		}
	*/

	app.render( template, pug_options, ( err, html ) => {
		if( err ) {
			console.log( "KO : Reading mail template" + err ) 
			return
		}

		// console.log( "---" ) 
		// console.dir( html ) 
		
		// MAIL
		let mailOptions = {
			from: app.get( 'mail_from' ),
			to: email,
			subject,
			html
		}
		sendMail( mailOptions )
	})

}

let transporter = mailer.createTransport( {
	    sendmail: true,
	    newline: 'unix',
	    path: '/usr/sbin/sendmail'
} )
function sendMail( mailOptions ) {
	transporter.sendMail( mailOptions, function( error, info ){
		error ?  console.log( "KO MAIL ERROR : " + error ) : console.log( "OK MAIL : " + info.response ) 
	})
}

// HELPERS
function redisError( req, res, err ){
	res.json( { response: '[KO] REDIS ERROR ' + req.path } )  
	return console.log( "REDIS ERROR " + err ) 
}

function verifierUtilisateur( pseudo ){
	return new Promise( function( resolve, reject ){
		console.log( "PROMISE " )
		redis.hgetall( pseudo, function( err, reply ){
			if( err ) reject( redisError( err ) )
	
			if( reply === null ){
				console.log( "null - no user" ) 
				console.dir( reply ) 
				resolve( true ) 
			} else {
				console.log( "not null - users" ) 
				console.dir( reply ) 
				resolve( false )
			}
		})
	})
}


/*************************************************
// Utilitaires
/***********************************************/
function gendrifyFrequence( f, mode ){
	switch( mode ){
		case 'feminin' :
			switch( f ){
				case 'quot':
					return 'Quotidienne'
					break
				case 'mensuel':
					return 'Mensuelle'
					break
			}
		case 'masculin' :
			switch( f ){
				case 'quot':
					return 'Quotidient'
					break
				case 'mensuel':
					return 'Mensuel'
					break
			}
		default:
			return f
	}
}

function capitalize( s ){
	return s[ 0 ].toUpperCase() + s.slice( 1 )
}

app.listen( 8123 )
