const assert = require( 'assert' )
const sinon = require( 'sinon' )
const tap = require( 'tap' )

let o = {
	p1: '11111',
	p2: '22222',
	p3: '33333',
	m1(){
		return 'azerty'
	},
	m2( un, deux, trois ){
		// may be async
	}
}

tap.pass( 'OK - Should be fine' )
tap.equal( o.p1, '11111' )

tap.test( 'It may be async code', function( childTest ){
	tap.strictSame( 1, 1 )
	assert.deepEqual( null, null )
	childTest.end()
})

describe( 'Bal bla bla bla bla', function(){
	it( 'should match something', function(){
		sinon.assert.match( { a: 1 }, { a: 1 } )
	} )
} )
