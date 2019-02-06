let mailer = require( 'nodemailer' )
let redis = require( 'redis' ).createClient() 

const frequence = process.argv[ 2 ] 

redis.llen( 'cartes', function( err, reply ){
	if( err ) redisError( err )

	let n = reply,
		r = Math.floor( Math.random() * reply )


	redis.lindex( 'cartes', r, function( err, reply ){
		if( err ) redisError( err )
		
		redis.hgetall( "Carte:" + reply, function( err, reply ){
			if( err ) redisError( err )

			let mailOptions = {
				from: 'message_des_anges@gmail.com',
				to: 'yannick9letallec@gmail.com',
				subject: '[ Messages Des Anges ] ' + 'CRON' + ' Confirmation d\'inscription',
				html: process.argv[ 2 ] + ' TEPLATE TO CREATE ! ' + n + ' ' + r + "<br />" + reply.text
			}

			redis.smembers( 'frequence_email:' + frequence, function( err, reply ){
				if( err ) redisError( err )

					
				
			})
			sendMail( mailConfirmerInscriptionOptions )

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
