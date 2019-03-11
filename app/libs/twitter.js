/* TODO :
 * add image to tweet ... impossible to use media_id / media_id_str properties after use of media/upload endpoint
 * Eventually : use deprecate endpoint statuses/update_with_media ~
 * YLT : 2019 Q1
 */


const util = require( 'util' )
const fs = require( 'fs' )
const twit = require( 'twit' )
const redis = require( 'redis' ).createClient() 

const tweet_limit = 72

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

// let img64 = fs.readFileSync( './img/rejouer.png' )

getAleatoire()

function getAleatoire( ){
	console.log( "GET RANDOM NUMBER" ) 

	redis.llen( 'cartes', function( err, reply ){
		if( err ) redisError( err )

		console.log( "CARTES LIST #" + reply ) 
		let n = reply,
			r = Math.floor( Math.random() * reply )
	
		console.log( "ALEA : " + r ) 
		getNomCarte( r )
	})
}

function getNomCarte( r ){
	console.log( "GET CARD" ) 

	redis.lindex( 'cartes', r, function( err, reply ){
		if( err ) redisError( err )
		
		console.log( "CARTE : " + reply ) 

		fetchCarte( reply )
	})
}

function fetchCarte( nom_carte ){
	console.log( "FETCH CARD DATA" ) 

	redis.hgetall( "Carte:" + nom_carte, function( err, carte ){
		if( err ) redisError( err )

		console.dir( carte ) 
		
		let text = carte.text.slice( 0, 185 ),
			status = `Tirage des #Ange. Nouvelle Carte: ${ nom_carte }. ${ text } ... https://messages-des-anges.fr/afficherTweet?carte=${ nom_carte }`
			
		sendTweet( status )
	})
}

function sendTweet( status ){
	console.log( "SENDING TWEET" ) 

	t.post( 'statuses/update', { status }, function( err, data, response ){
		if ( err ) {
			console.log( "TWEET ERROR SENDING STATUS : " + typeof err )
			console.dir( err ) 

			if( err.message.includes( 'duplicate' ) ){
				console.log( "RESTART PROCESS ... \n\r ----------------------- \n\r ------------------------" ) 
				getAleatoire()
			} 
		}

		let tweet_id = data.id_str

		console.log( util.inspect( data, { depth: null, showProxy: true, showHidden: true } ) ) 
		console.log( "TWEET ID STR : " + tweet_id )

		enregistrerTweetId( tweet_id )
	})
}

function enregistrerTweetId( tweet_id ){
	console.log( "REDIS : ENREGISTRER LE TWEET : " + tweet_id ) 

	redis.lpush( 'twitter_ids_list', tweet_id, function( err, reply ){
		if( err ) redisError( err )

		verifierDimensionTwiterIDSListe()
	})
}

function verifierDimensionTwiterIDSListe() {
	console.log( "VERIFIER LA DIMENSION DE LA LISTE DES TWEETS ENVOYES" ) 

	redis.llen( 'twitter_ids_list', function( err, reply ){
		if( err ) redisError( err )

		console.log( "LISTE DIMENSION : #" + reply ) 
		if( reply == tweet_limit ){
			supprimerTweets()
			// supprimerTwitterListe()
		} else {
			process.exit()
		}
	})
}
	// record tweet id in DB, for future purge

function supprimerListeTweetsRedis(){
	console.log( "SUPPRIMER LA LISTE TWITTER IDS" ) 

	redis.del( 'twitter_ids_list', function( err, reply ){
		console.log( "PURGE TWEETER IDS LIST -- 30 tweets présents ..." ) 
		if( err ) redisError( err )

		console.log( "PURGE OK" ) 

		// on tweet a minima une fois
		getAleatoire()
	})
}

function supprimerTweets(){
	console.log( "SUPPRESSION DES TWEETS" ) 

	redis.lpop( 'twitter_ids_list', function( err, reply ){
		if( err ) redisError( err )

		if( reply ){
			console.log( "TWEET A SUPPRIMER : " + reply ) 
			t.post( 'statuses/destroy/' + reply, function( err, data, response ){
				if(err) {
					console.log( "ERROR 1 : " + err )
					process.exit()
				}

				console.log( "TWEET SUPPRIME : " + reply ) 
				supprimerTweets()
			})
		} else {
			console.log( "OK / TOUS LES TWEETS SONT EFFACES DE TWITTER" ) 
			supprimerListeTweetsRedis()
		}
	})
}

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

