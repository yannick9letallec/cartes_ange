let Vue = require( 'vue' )
let mailer = require( 'nodemailer' )
let renderer = require( 'vue-server-renderer' ).createRenderer()
let redis = require( 'redis' ).createClient() 

redis.auth( 'Kixsell_1', function( err, reply ){
})

const freq = process.argv[ 2 ]

let frequence,
	html

Vue.component( 'H', require( '../components/email/header.js' ).top )
Vue.component( 'B', require( '../components/email/envoi_periodique.js' ).envoi_periodique )
Vue.component( 'F', require( '../components/email/footer.js' ).bottom )

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
			
			redis.hgetall( "Carte:" + reply, function( err, carte ){
				if( err ) redisError( err )

					let M = new Vue( {
						data: {
							period: freq,
							carte_nom: reply,
							carte
						},
						template: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
							<html>
							<head>
								<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
								<meta http-equiv="X-UA-Compatible" content="IE=edge" />
								<meta name="viewport" content="width=device-width, initial-scale=1.0 " />
								<style>
									header {
										background-color: blue;
										color: white;
									}
								</style>
							</head>	
							<body>
								<div>
									<H :period='period'></H>
									<B :carte_nom='carte_nom'
										:carte='carte'></B>
									<F></F>
								</div>
								<style>
									header {
										background-color: blue;
										color: white;
									}
								</style>
							</body>
							</html>`,
						created(){
						}
					} )
				
				new Promise( function( resolve, reject ){
					renderer.renderToString( M, ( err, html ) => {
						if (err) reject ( err )

						resolve( html )
					})
				} ).then( function( value ){


					redis.smembers( 'frequence_email:' + freq, function( err, reply ){
						if( err ) redisError( err )

						// udpate template with carte data ( text, couleur, Sephirot, Plan... )

						let info = []
						reply.forEach( function( val, index ){
								info = val.split( ':' )

							// TODO repmplacer mock email par info[ 1 ]
							let mailOptions = {
								from: 'message_des_anges@gmail.com',
								to: 'yannick9letallec@gmail.com',
								subject: `[ Messages Des Anges ] ${ info[ 0 ] } Votre tirage ${ frequence }`,
								html: value // '<html><body>' + process.argv[ 2 ] + ' TEMPLATE TO CREATE ! ' + n + ' ' + r + "<br />" + carte.text + '</body></html>'
							}
								
							sendMail( mailOptions )
						} )
					})
				})
			})
		})
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
	})
}

function redisError( err ){
	res.send( '[KO] REDIS ERROR ' + req.path )  
}
