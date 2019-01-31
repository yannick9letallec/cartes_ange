'use strict'

let util = require( 'util' )

let express = require( 'express' )
let app = express()

let bodyParser = require('body-parser');
let redis = require( 'redis' ).createClient() 
let mailer = require( 'nodemailer' )

// Vue plugin for SSR in express 
/*
let expressVue = require( 'express-vue' )
const expressVueMiddleWare = expressVue.init()
app.use( expressVueMiddleWare )
*/

// GLOBAL DATA
let User = {}
let v = 'yehea'

redis.auth( 'Kixsell_1', function( err, reply ){
	console.log( "REDIS AUTH : " + err ? err : reply ) 
})


// building requests' content body
app.use(bodyParser.json())

app.get( '/', function( req, res, next ){
	console.log( "REQUEST RECEIVED " + req.path ) 
	res.send( '/app/index.html' )
})

app.post( '/verifierUtilisateur', function( req, res, next ){
	console.log( req.path ) 

	let data = req.body
	let user = 'user:' + data.pseudo

	redis.hgetall( user, function( err, reply ){
		if( err ) redisError( err )

		if( reply ){
			console.dir( reply ) 

			if( data.mdp === reply.mdp ){
				console.log( 'OK Utilisateur Valide' )

				User = {
					pseudo: reply.pseudo,
					email: reply.email
				}

				res.cookie( 'loggedin', 'true', { expires: new Date( Date.now() + 900000 ) } )
				
				// 
				let groups = []

				for( let key in reply ){
					if( /^group:/.test( key ) ) {
						groups.push( key )	
					}
				}
	
				// Scan des groupes, pour avoir les membres
				let group_members = []
				for( let i = 0; i < groups.length; i++ ){
					group_members[ i ] = new Promise( function( resolve, reject ){
						redis.smembers( groups[ i ], function( err, reply ){
							if( err ) {
								reject( 'REDIS ERROR : ' + err )
								redisError( err )
							}

							reply = reply[ 0 ]
							reply = reply.split( ' ' )
							reply = reply.filter( elem => elem !== 'owner:' + data.pseudo )

							resolve( { 
								name: groups[ i ],
								members: reply
							} )
						})
					})
				}

				Promise.all( group_members ).then( function( values ) {
					console.log( "FINISH : ") 
					console.dir( util.inspect( values, { depth: null })) 

					res.json( { 
						response: 'utilisateur valide', 
						user: {
							pseudo: data.pseudo,
							email: reply.email,
							groups: values
						}
					} )
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

	let data = req.body

	let user = 'user:' + data.pseudo
	redis.hgetall( user, function (err, reply ){
		if( err ) redisError( err )

		console.log( !!reply, reply === Object, typeof reply )

		if( !reply ){
			redis.hmset( [user, 'email', data.email, 'mdp', data.mdp ], function( err, reply ){
				if( err ) redisError( err )

				console.log( 'OK : New Redis Entry for this user : ' + JSON.stringify( req.body ) )
				res.send( "utilisateur ajoute" )
			})
		} else {
			res.send( 'utilisateur deja enregistre' )
		}

		// MAIL
		let mailConfirmerInscriptionOptions = {
			from: 'message_des_anges@gmail.com',
			to: 'yannick9letallec@gmail.com',
			subject: '[ Messages Des Anges ] ' + User.pseudo + ' Confirmation d\'inscription',
			html: '-------<b> 000000 </b> 00 --------------'
		}

	})
})

app.post( '/creerInviterGroupe', function( req, res, next ){
	console.dir( util.inspect( req.body ) ) 

	let pseudo = req.body.user.pseudo
	let group_name = req.body.group_name
	let group_members = req.body.group_members
	let l = req.body.group_members.length

	// ajouter le groupe à l'utilisateur ( champ avec une valeur nulle )
	let ajout_groupe_au_createur = new Promise( function ( resolve, reject ){
		redis.hset( 'user:' + pseudo, 'group:' + group_name, '', function( err, reply ){
			if( err ) redisError( err )

			console.log( "[OK] REDIS : " + reply ) 
		} )
	} )

	let members = '', 
		i,
		member_pseudo,
		member_email,
		promises = []

	for( i = 0; i < l; i++ ){
		member_pseudo = group_members[ i ].pseudo 
		member_email = group_members[ i ].email
		
		members += member_pseudo+ ' '

		// créer un hash expirant pour les membres invités
		promises.push( new Promise( function( resolve, reject ){
			// 2592000
			redis.multi()
				.hmset( 'user:' + member_pseudo, 'email', member_email, 'statut', 'invite', function( err, replies ){ })
				.expire( 'user:' + member_pseudo, '1000', function( err, replies ){ } )
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
			html: "vous avez x jours pour valider votre inscription au groupe " + group_name + " crée par votre ami, " + pseudo +
				"<br />" +
				"<a href='local.exemple.bzh/confirmer_invitation?pseudo=" + member_pseudo + "&group=" + group_name + "'> CONFIRMER </a>"
		}

		sendMail( mailInviterOptions )

	} 
	members += 'owner:' + pseudo

	// creer le ( groupe ) ensemble contenant le nom des différents membres, dont celui du créateur
	let groupe_creation = new Promise( function( resolve, reject ){
		redis.sadd( 'group:' + group_name, members, function( err, reply ){
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
	console.log( "CFR INVIT" ) 
	console.dir( req.body ) 

	let key = 'user:' + req.body.member_pseudo

	redis.multi()
		.persist( key, function( err, reply ){} )
		.hmset( key, 'statut', 'permanent', 'group:' + req.body.group_name, '', function( err, reply ){} )
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

app.listen( 8000 )

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
function redisError( err ){
	res.send( '[KO] REDIS ERROR ' + req.path )  
	return console.log( "REDIS ERROR " + err ) 
}
