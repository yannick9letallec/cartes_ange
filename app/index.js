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
		if( err ){
			res.send( '[KO] REDIS ERROR ' + req.path )  
			return console.log( "REDIS ERROR " + err ) 
		}

		if( reply ){
			console.dir( reply ) 

			if( data.mdp === reply.mdp ){
				console.log( 'OK Utilisateur Valide' )
				res.cookie( 'loggedin', 'true', { expires: new Date( Date.now() + 900000 ) } )
				res.json( { 
					response: 'utilisateur valide', 
					user: {
						name: data.pseudo
					}
				} )
			} else {
				console.log( 'KO Utilisateur Non Valide' )
				res.send( 'utilisateur invalide' )
			} 

		} else {
			console.log( 'KO : No Redis Entry for this user : ' + JSON.stringify( req.body ) )
			res.send( 'utilisateur inexistant' )  
		}
	})

	// TMP MAIL
	let mailOptions = {
		from: 'BOB@wanadoo.Fr',
		to: 'yannick9letallec@gmail.com',
		subject: 'NOdE IN THE PLACE',
		text: 'Easy Peasy'
	}
	transporter.sendMail( mailOptions, function( error, info ){
		error ?  console.log( "KO MAIL ERROR : " + error ) : console.log( "OK MAIL : " + info.response ) 
 

	})
})

app.post( '/creerCompte', function( req, res, next ){
	console.log( req.path ) 

	let data = req.body

	let user = 'user:' + data.pseudo
	redis.hgetall( user, function (err, reply ){
		console.log( "........" ) 
		if( err ) {
			res.send( '[KO] REDIS ERROR ' + req.path )  
			return console.log( "REDIS ERROR " + err ) 
		}

		console.log( !!reply, reply === Object, typeof reply )

		if( !reply ){
			redis.hmset( [user, 'email', data.email, 'mdp', data.mdp ], function( err, reply ){
				if( err ) {
					res.send( '[KO] REDIS ERROR ' + req.path )  
					return console.log( "REDIS ERROR " + err ) 
				}

				console.log( 'OK : New Redis Entry for this user : ' + JSON.stringify( req.body ) )
				res.send( "utilisateur ajoute" )
			})
		} else {
			res.send( 'utilisateur deja enregistre' )
		}
	})

	console.dir( util.inspect( req.body ) ) 
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
let transporter = mailer.createTransport( {
	    sendmail: true,
	    newline: 'unix',
	    path: '/usr/sbin/sendmail'
} )
