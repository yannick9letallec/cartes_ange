let mailer = require( 'nodemailer' )
let fs = require( 'fs' )
let renderer = require( 'vue-server-renderer' ).createRenderer()
let redis = require( 'redis' ).createClient() 

let pug = require( 'pug' )

redis.auth( 'Kixsell_1', function( err, reply ){
	console.log( "REDIS AUTH : " + err ? err : reply ) 
})

console.log( 'WORKING DIR IS : ' + process.cwd() ) 
const freq = process.argv[ 2 ]

let frequence,
	tirage

switch( freq ){
	case 'quot': {
		frequence = 'quotidient'
		tirage = 'du Jour'
		break
	}
	case 'hebdo': {
		frequence = 'hebdomadaire'
		tirage = 'de la Semaine'
		break
	}
	case 'mensuel':
		tirage = 'du Mois'
	default: {
		frequence = freq
	}
}


console.log( "FREQUENCE : " + freq ) 

redis.llen( 'cartes', function( err, reply ){
	if( err ) redisError( err )

	console.log( "CARTES LIST + " + reply ) 
	let n = reply,
		r = Math.floor( Math.random() * reply )

	redis.lindex( 'cartes', r, function( err, reply ){
		if( err ) redisError( err )
		
		console.log( "CARTE CHOISIE : " ) 
		console.log( reply) 

		let nom_carte = reply

		redis.hgetall( "Carte:" + reply, function( err, carte ){
			if( err ) redisError( err )

			console.dir( carte ) 
			
			redis.smembers( 'frequence_email:' + freq, function( err, reply ){
				if( err ) redisError( err )

				console.log( "MEMBRES DU GROUPE : " ) 
				console.dir( reply ) 

				// udpate template with carte data ( text, couleur, Sephirot, Plan... )

				let info = [],
					m_pseudo = '',
					m_email = ''

				reply.forEach( function( val, index ){
					info = val.split( ':' )
					m_pseudo = info[ 0 ]
					m_email = info[ 1 ]

					let subject = `[ Messages Des Anges ] ${ m_pseudo }, Votre tirage ${ frequence } !`

					let pug_options = {
						nom_carte,
						carte: carte,
						m_pseudo,
						m_email,
						tirage,
					}

					prepareMail( m_email, '/var/www/cartes_ange/app/components/email/envoi_periodique.pug', subject, pug_options )
				} )
			})
		})
	})
})

function prepareMail( email, template, subject, pug_options ){

	let pug_source = fs.readFile( template, 'utf8', function( err, data ){
		if( err ) console.log( "ERREUR LECTURE PUG SOURCE : " + err ) 

		console.log( "PUG OPTIONS" ) 
		console.log( pug_options ) 
		
		console.log( "PURE PUG" ) 
		console.log( data ) 

		/*
		let fn = pug.compile( data, { filename: 'tmp_email_template.html', basedir: '/var/www/cartes_ange/app/components/email' } ) 
		let html = fn( pug_options )
		*/

		let html = pug.renderFile( template, pug_options )

		if( !html ) {
			console.log( "KO : Reading mail template" + err ) 
			return
		}

		console.log( "PURE HTML" ) 
		console.dir( html ) 
			
		// MAIL
		let mailOptions = {
			from: 'message_des_anges@gmail.com',
			to: email,
			subject,
			html
		}
		sendMail( mailOptions )

	})
}

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

function redisError( err ){
	res.send( '[KO] REDIS ERROR ' + req.path )  
	return console.log( "REDIS ERROR " + err ) 
}
