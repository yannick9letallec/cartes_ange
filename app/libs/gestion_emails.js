let mailer = require( 'nodemailer' )
let redis = require( 'redis' ).createClient() 

const freq = process.argv[ 2 ]
let frequence

switch( freq ){
	case 'quot':
		frequence = 'Journalier'
		break
	case 'hebdo' :
		frequence = 'Hebdomadaire'
		break
	case 'mensuel' :
		frequence = 'Mensuel'
		break
}
		

redis.llen( 'cartes', function( err, reply ){
	if( err ) redisError( err )

	let n = reply,
		r = Math.floor( Math.random() * reply )


	redis.lindex( 'cartes', r, function( err, reply ){
		if( err ) redisError( err )
		
		redis.hgetall( "Carte:" + reply, function( err, reply ){
			if( err ) redisError( err )


			redis.smembers( 'frequence_email:' + freq, function( err, reply ){
				if( err ) redisError( err )

				let info = []
				reply.forEach( function( val, index ){
						info = val.split( ':' )

					// TODO repmplacer mock email par info[ 1 ]
					let mailOptions = {
						from: 'message_des_anges@gmail.com',
						to: 'yannick9letallec@gmail.com',
						subject: `[ Messages Des Anges ] ${ info[ 0 ] } Votre tirage ${ frequence }`,
						html: process.argv[ 2 ] + ' TEPLATE TO CREATE ! ' + n + ' ' + r + "<br />" + reply.text
					}
						
					sendMail( mailOptions )
				} )
			})

		})
	})

	/*
	redis.lrange( 'cartes', 0, reply, function( err, reply ){
		reply 
	} )
	*/
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

function redisError( err ){
	res.send( '[KO] REDIS ERROR ' + req.path )  
	return console.log( "REDIS ERROR " + err ) 
}
