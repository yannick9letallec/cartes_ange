const twit = require( 'twit' )
const fs = require( 'fs' )

let t = new twit({
	consumer_key: 'KgMFIPkj0FnazE4XCXpJpEhL8',
	consumer_secret: 'UYJ9g8NpNoSbSNjRLoeMoHvyIkWS6qz3euYge1r0vDduTIDqWK',
	access_token: '1102710876967260161-Yu0AYqzCl3buBNBXdYcVhL93yg0dk7',
	access_token_secret: 'YgzZ74CJ77ZL1eecKM0EwmeHIka87digoenG9CDtIHYRG',
	timeout_ms: '60000',
	strictSSL: true

})

let img64 = fs.readFileSync( './img/rejouer.png', { encoding: 'base64' } )

t.post( 'media/upload', { media_data: img64, name: 'rejouer',  media_type: 'image/png' }, function( err, data, response ){
	if(err) {
		console.log( "ERROR : " + err )
		return
	}


	let mediaIdStr = data.media_id_string,
		mediaId = data.media_id,
		altText = 'img ...... to show in twitter'
		meta_params = { media_id: mediaId, alt_text: { text: altText }, media_ids: [ mediaId, mediaIdStr ] }

	console.log( data )
	console.log( meta_params ) 

	console.log( "------------------------------------------------------------------------------------------------- LOADING MEDIA OK ..." ) 


	/*
	process.exit()
	t.post( 'media/metadata/create', meta_params, function( err, data, response ){
		if(err) {
			console.log( "ERROR 1 : " + err )
			return
		}

		console.log( data ) 

	} )
	*/
		let params = { status: '---- 0000000000000----', in_reply_to_status_id: 1102998847079485400, media_id: mediaId }
		console.log( params ) 

		t.post( 'statuses/update', params, function( err, data, response ){
			if(err) {
				console.log( "ERROR 2 : " + err )
				return
			}

			console.log( "DATA ---------------------------------------" ) 
			console.dir( data ) 

			/*
			console.log( "RESPONSE ---------------------------------------" ) 
			console.dir( response ) 
			*/

		})
} )
