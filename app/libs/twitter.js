const util = require( 'util' )
const fs = require( 'fs' )
const twit = require( 'twit' )
const redis = require( 'redis' ).createClient() 

redis.auth( 'Kixsell_1', function( err, reply ){
	console.log( "REDIS AUTH : " + err ? err : reply ) 
})

let t = new twit({
	consumer_key: 'Zf13qpjUpCATeTq25H7K09lLh',
	consumer_secret: 'pKEzz12qy2NCtT5EVYfxMLj5wtMGJCXfpYV4S59PUACQMYaAww',
	access_token: '1102710876967260161-ER1ORS01MhLXuNbtqyO5CKOYzzcVnX',
	access_token_secret: 'vluWqqyr1pKzAeTJOYmWZXyhXRTxKesqh1U7Al4LzgrPt',
	strictSSL: true
})

let img64 = fs.readFileSync( './img/rejouer.png', { encoding: 'base64' } )

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
			
			let twitter_options = {
				nom_carte,
				carte: carte
			}

			let text = carte.text.slice( 0, 200 ),
				status = `Tirage des #Ange. Nouvelle Carte: ${ nom_carte }. ${ text } ... https://messages-des-anges.fr/afficherTweet?carte=${ nom_carte }`
				
			// process.exit()
			t.post( 'statuses/update', { status }, function( err, data, response ){
				if(err) {
					console.log( "TWEET ERROR SENDING STATUS : " + err )
					return
				}

				console.log( "DATA ---------------------------------------" ) 
				console.log( util.inspect( data, { depth: null, showProxy: true, showHidden: true } ) ) 

				process.exit()
			})

		} )
	})
})

function redisError( err ){
	res.send( '[KO] REDIS ERROR ' + req.path )  
	return console.log( "REDIS ERROR " + err ) 
}

/* 
t.post( 'media/upload', { media_data: img64 }, function( err, data, response ){

	console.log( "UPLOAD .... SIMPLE " ) 

	if(err) {
		console.log( "ERROR : " + err )
		return
	}


	let mediaIdStr = data.media_id_string,
		mediaId = data.media_id_string,
		altText = 'img ...... to show in twitter'
		meta_params = { media_id: mediaId, alt_text: { text: altText } }

	console.log( "INIT" ) 
	console.log( data )
	console.log( meta_params ) 


		let params = { status: '*****************## CE es amis est le aître ot ---', media_id: data.media_id, media_id_string: data.media_id_string }
		console.log( params ) 

} )

	t.get( 'search/tweets', { q: 'sexuality', count: 100 }, function( err, data, response ){
		console.log( "SEARCH TWEETS" ) 

		if(err) {
			console.log( "ERROR 1 : " + err )
			return
		}

		console.log( data ) 
	})

	t.get( 'media/upload', { command: 'STATUS', media_id: data.media_id_string }, function( err, data_s, response ){
		console.log( "MEDIA UPLOAD STATUS " ) 

		if(err) {
			console.log( "ERROR 1 : " + err )
			return
		}

		console.log( data_s ) 
	})
	t.post( 'media/upload', { segment_index: 0, media_id: mediaId, media_data: img64, command: 'APPEND' }, function( err, data, response ){

		console.log( "UPLOAD .... APPEND " ) 

		if(err) {
			console.log( "ERROR 1 : " + err )
			return
		}

		console.log( "APPEND" ) 
		console.log( data )
	})

	process.exit()
	t.post( 'media/metadata/create', meta_params, function( err, data, response ){
		if(err) {
			console.log( "ERROR 1 : " + err )
			return
		}

		console.log( data ) 

	} )
*/

