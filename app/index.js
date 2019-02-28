'use strict'

/*  TEST WOOK */

let { execFileSync } = require( 'child_process' )
let util = require( 'util' )
let fs = require( 'fs' )

let http = require( 'http' )
let express = require( 'express' )
let app = express()

app.set( 'title', 'Les Anges' )



let redis = require( 'redis' ).createClient() 
let mailer = require( 'nodemailer' )

/*
let expressVue = require( 'express-vue' )
const expressVueMiddleWare = expressVue.init()
app.use( expressVueMiddleWare )
*/

// GLOBAL DATA
let User = {},
	expire = 1000

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
					if( err ) redisError( err )

					console.log( 'OK : New Redis Entry for this user : ' + JSON.stringify( req.body ) )
					res.json( { data: 'utilisateur ajoute' } )

					// MAIL
					let mailOptions = {
						from: 'message_des_anges@gmail.com',
						to: 'yannick9letallec@gmail.com',
						subject: '[ Messages Des Anges ] ' + data.pseudo + ', Bienvenue ! ',
						html: "Bienvenu dans le monde des anges, pour continuer, merci de confirmez votre adresse email :)-------<b> 000000 </b> 00 -------------- " +
							"<br />" +
							"<a href='local.exemple.bzh/confirmer_creation_compte?pseudo=" + data.pseudo + "' > CONFIRMER VOTRE ADRESSE EMAIL </a>"
					}
					sendMail( mailOptions )
				})
		} else {
			res.json( { data: 'utilisateur deja enregistre' } )
		}

	})
})

app.post( '/creerInviterGroupe', function( req, res, next ){
	console.dir( util.inspect( req.body ) ) 

	let pseudo = req.body.user.pseudo,
		nom_du_groupe = req.body.nom_du_groupe,
		group_members = req.body.group_members,
		l = req.body.group_members.length,
		frequence_email = req.body.frequence_email

	// ajouter le groupe à l'utilisateur ( champ avec une valeur nulle )
	let ajout_groupe_au_createur = new Promise( function ( resolve, reject ){
		redis.hset( 'user:' + pseudo, 'group:' + nom_du_groupe, '', function( err, reply ){
			if( err ) redisError( err )

			console.log( "[OK] REDIS : " + reply ) 
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
					if( err ) redisError( err )

					replies.forEach( function( reply, index ){
						console.log( "MULTI : " + index + " / " + reply )
					})
				})
		} ) )

		// inviter les membres par email
		let mailInviterOptions = {
			from: 'message_des_anges@gmail.com',
			to: 'yannick9letallec@gmail.com',
			subject: '[ Messages Des Anges ] ' + member_pseudo + ' , ' + pseudo + ' vous invite !',
			html: "vous avez x jours pour valider votre inscription au groupe " + nom_du_groupe + " crée par votre ami, " + pseudo +
				"<br />" +
				"<a href='local.exemple.bzh/confirmer_invitation?pseudo=" + member_pseudo + "&group=" + nom_du_groupe + "'> CONFIRMER </a>"
		}

		sendMail( mailInviterOptions )

	} 
	members.push( 'owner:' + pseudo, "frequence_email:" + frequence_email )

	// creer le ( groupe ) ensemble contenant le nom des différents membres, dont celui du créateur
	let groupe_creation = new Promise( function( resolve, reject ){
		redis.sadd( 'group:' + nom_du_groupe, ...members, function( err, reply ){
			if( err ) redisError( err )

			console.log( "[OK] REDIS : " + reply ) 
		} )
	} )

	promises.push( ajout_groupe_au_createur, groupe_creation )
	Promise.all( promises ).then( function( values ){
		console.log( values ) 
		res.send( values )
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
			from: 'message_des_anges@gmail.com',
			to: 'yannick9letallec@gmail.com',
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

// APP FILES MANAGEMENT
app.get( '*.css', function( req, res ){
	console.log( "-----" ) 
	res.send( 'ZO' )
})

app.post( '/ajax', function( req, res ) {
	res.send( 'BADABOUM' )
})


// REDIS PART
redis.on( 'error', function( err ){
	console.log( "KO : [ REDIS ] " + err ) 
})

// NODEMAILER PART
// sendMail( mailConfirmerInscriptionOptions )
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
// Gestion du WebHook GitHub
/************************************************/
app.post( '/github_push_webhook', function( req, res ){
	console.log( "WEBHOOK GITHUB" ) 
	res.send( 'OK - Thanks GitHub for the Hook !' )

	let webhook = execFileSync( 'libs/github_webhook', { uid: 1001, gid: 1001 } )
	console.log( webhook )
})
app.listen( 8000 )

