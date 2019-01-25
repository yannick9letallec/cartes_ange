import Vue from 'vue'

import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faUser, faAngleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add( faTimes )
library.add( faUser )
library.add( faAngleRight )

const times = icon( { prefix: 'fas', iconName: 'times' } )
const user = icon( { prefix: 'fas', iconName: 'user' } )
const angleRight = icon( { prefix: 'fas', iconName: 'angle-right' } )

Vue.component( 'font-awesome-icon', FontAwesomeIcon )
Vue.config.productionTip = false


// HEADER RIGHT COMPONENTS
Vue.component( 'unlogged', {
	template: "<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_identification_div' )\" size='2x' />"
})

Vue.component( 'logged', {
	props: [ 'user' ],
	template: "<div id='logged'> \
		<font-awesome-icon id='log_button' icon='user' @click=\"$emit( 'show_connected_div' )\" size='2x' /> \
		<p class='sign'> {{ user }} </p> \
	</div>"
})

// COMPONENTS FEEDING POP_UP DIV
Vue.component( 'log_succes', {
	template: '<p> LOGGED ! <br /> Welcome :) </p>'
})

Vue.component( 'bouton_fermeture_div', {
	template: "<div> \
			<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> \
		</div>",
	methods: {
		closeDiv: function( e ){
			let el = document.getElementById( "pop_up" )
			el.classList.replace( 'afficher_pop_up', 'afficher_none' )

			this.$emit( 'close_div', '' )
		}
	}
})

Vue.component( "form_creer_compte", {
	template: "<div id='form_creer_compte'> \
		<form id='creer_compte' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate> \
			<bouton_fermeture_div @close_div='closeDiv' ></bouton_fermeture_div> \
			<div> \
				<p style='margin-bottom: 5px;'> Créer votre compte : </p> \
			</div> \
			<div> \
				<label for='pseudo'> Pseudo : </label> \
				<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' autofocus autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='email'> Email : </label> \
				<input id='email' type='email' size='15' placeholder='mon email...' autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='mdp'> Mot de Passe : </label> \
				<input id='mdp' type='password' placeholder='12345' autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='confirmer_mdp'> Confirmer le Mot de Passe : </label> \
				<input id='confirmer_mdp' type='password' placeholder='Votre mot de passe...' autocomplete='on' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div id='info'></div> \
			<div class='form_creer-compte-button'> \
				<button type='reset'> Annuler </button> \
				<button type='submit' disabled> Créer votre compte ! </button> \
			</div> \
		</form> \
		</div>",
	methods: {
		closeDiv: function( e ){
			let el = document.getElementById( "pop_up" )
			el.classList.replace( 'afficher_pop_up', 'afficher_none' )

			this.$emit( 'close_div', '' )
		},
		verifierFormulaire: function( field, event ){
			verifierFormulaire( field, event )
		},
		submit: function( e ){
			const fname = services.name.toUpperCase()

			console.info( "INFO : [ " + fname + " ] Appel : SERVICES" ) 

			let pseudo = document.getElementById( 'pseudo' ).value
			let email = document.getElementById( 'email' ).value
			let mdp = document.getElementById( 'mdp' ).value
			let confirmer_mdp = document.getElementById( 'confirmer_mdp' ).value
			services( 'POST', 'creerCompte', { pseudo, email, mdp, confirmer_mdp } )
		}
	}
})

Vue.component( "form_auth", {
	template: "<div id='form_authentication'> \
		<form id='login' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate > \
			<font-awesome-icon id='close_div' icon='times' @click='closeDiv' style='float: right;' /> \
			<div> \
				<p style='margin-bottom: 5px;'> Se Connecter : </p> \
			</div> \
			<div> \
				<label for='pseudo'> Pseudo : </label> \
				<input id='pseudo' type='text' size='15' placeholder='mon pseudo...' style='margin-bottom: 10px;' autofocus autocomplete='on' maxlength='255' @input=\"verifierFormulaire( 'pseudo', $event )\"> \
			</div> \
			<div> \
				<label for='mdp'> Mot de Passe : </label> \
				<input id='mdp' type='password' placeholder='votre mot de passe...' autocomplete='on' maxlength='255' @input=\"verifierFormulaire( 'mdp', $event )\"> \
			</div> \
			<div id='info'></div> \
			<div> \
				<button type='submit' disabled class='form_authentication-auth-button'> <i class='fa fa-close'></i> JE M\'IDENTIFIE </button> \
				<span class='mdp_oublie'> <a href='' alt='TO_DO!!'> Mot de passe oublié ? </a> </span> \
				<div class='clear'></div> \
			</div> \
		</form> \
			<hr /> \
			<div class='form_authentication-creer-compte-button'> \
				<button type='submit' @click=\"$emit( 'mod_contenu', 'form_creer_compte' )\"> Créer un compte </button> \
			</div> \
		</div>",
	methods: {
		afficher_form_creer_compte: function( ){
			this.$emit( 'close_div', '' )
		},
		closeDiv: function( e ){
			let el = document.getElementById( "pop_up" )
			el.classList.replace( 'afficher_pop_up', 'afficher_none' )

			this.$emit( 'close_div', '' )
		},
		verifierFormulaire: function( field, event ){
			verifierFormulaire( field, event )
		},
		submit: function( e ){
			const fname = services.name.toUpperCase()

			console.info( "INFO : [ " + fname + " ] Appel : SERVICES" ) 

			let pseudo = document.getElementById( 'pseudo' ).value
			let mdp = document.getElementById( 'mdp' ).value

			services.call( this, 'POST', 'verifierUtilisateur', { pseudo, mdp } ).then( function( value ){ 
				switch( value.data.response ){
					case 'utilisateur valide':
						value.vueComponent.$root._data.log_state = 'log_succes'
						value.vueComponent.$root._data.connected = true

						value.vueComponent.$root._data.user.pseudo = value.data.user.pseudo
						value.vueComponent.$root._data.user.email = value.data.user.email
								
						setTimeout( function() {
							document.getElementById( 'pop_up' ).classList.replace( 'afficher_pop_up', 'afficher_none' )

							value.vueComponent.$root._data.log_state = 'logged'
						}, 500 )
					break
					case 'utilisateur invalide':
						value.vueComponent.$root._data.log_state = 'unlogged'
					break
				}
			})
		}
	}
})

// GESTION COMPTE UTILISATEUR COMPONENTS
Vue.component( 'gestion_compte', {
	data: function() {
		return {
			group_state: 'groups_existant'
		}
	},
	props: { 
		'pseudo': String,
		'email': String,
		'groups': Array
	},
	// <bouton_fermeture_div @close_div='closeDiv' ></bouton_fermeture_div> \
	template: "<div id='gestion_compte'> \
			<!-- <bouton_fermeture_div @close_div='closeDiv' ></bouton_fermeture_div> --> \
			<p> Mon compte : </p> \
			<br /> \
			<p class='sign'> {{ email }} </p> \
				<groups_existant v-if='groupsExists'></groups_existant> \
				<group_ajout_wrapper \
					:pseudo='pseudo' \
					:email='email'> \
				</group_ajout_wrapper> \
			<br /> \
			<button @click=\"$emit( 'deconnexion' )\"> Déconnexion </button> \
		</div>",
	computed: {
		groupsExists: function(){
			if( this.groups.length > 0 ){
				return true
			} else {
				return false 
			}
		},
		handleGroups: function(){
			let l = this.groups.length
			if( l === 0 ){
				return this.group_state = 'groups_vide'
			} else {
				return this.group_state = 'groups_existant'
			}
		},
		groupAjouterNom: function(){
			console.log( "TRACK 2 " + this.group_ajout_state ) 
			this.group_ajout_state = 'group_ajouter_nom'
		},
		groupAjout: function() {
			return this.group_ajout_state
		}
	}
})

// GROUPS COMPONENTS
Vue.component( 'group_ajouter_nom', {
	props: [ 'group_name' ],
	template: "<div> \
			<p> Nom {{ group_name }} : </p> \
			<input type='text' id='group_name' v-model='group_name' maxlenth='255' autofocus /> \
			<font-awesome-icon icon='angle-right' size='2x' @click=\"$emit( 'group_ajouter_membres', group_name )\" /> \
		</div>"
})

Vue.component( 'group_ajouter_membres', {
	props: [ 'group_members' ],
	data: function() {
		return {
		}
	},
	template: "<div> \
			<group_ajouter_membre v-for='group_member, i in group_members' :key='i' \
				@membre_supprimer='group_members.splice( i, 1 )' \
				:index='i' \
				:member_data='group_members[ i ]'> \
			</group_ajouter_membre> \
			<hr /> \
			<span class='clickable' @click='groupAjouterMembre'> Ajouter Membre </span> \
			<hr /> \
			<button @click=\"$emit( 'creer_inviter_groupe' )\"> Créer le groupe & Inviter </button> \
		</div>",
	methods: {
		groupAjouterMembre: function() {
			console.log( "TRACK 4" ) 
			return this.group_members.push( { } )
		}
	}
})

Vue.component( 'group_ajouter_membre', {
	props: [ 'index', 'member_data' ],
	template: " <div class='membre'> \
			<p> Membre {{ index }}  <span class='clickable' @click=\"$emit( 'membre_supprimer' )\"> supprimer </span> </p> \
			<p> Pseudo : </p> \
			<input type='text' name='pseudo' placeholder='votre pseudo ...' v-model='member_data.pseudo' /> \
			<p> Email : </p> \
			<input type='email' name='email' placeholder='votre email ...' v-model='member_data.email' /> \
		</div>  ",
	methods: {
	}
})

Vue.component( 'group_ajout', {
	template: "<div> \
			<span class='clickable' @click=\"$emit( 'group_ajouter_nom' )\">  <b> + </b> Groupe </span> \
		</div>"
})

Vue.component( 'group_ajout_wrapper', {
	props: [ 'pseudo', 'email' ],
	data: function(){
		return {
			group_ajout: false,
			group_ajout_state: 'group_ajout',
			group_name: '',
			group_members: []
		}
	},
	template: "<div> \
		<div class='groups'> Groupes {{ group_name }}: \
			<component :group_name='group_name' :group_members='group_members' \
				v-bind:is='group_ajout_state' \
				@group_ajouter_nom=\" group_ajout_state='group_ajouter_nom' \" \
				@group_ajouter_membres='groupAjouterMembres' \
				@creer_inviter_groupe='creerInviterGroupe'> \
			</component> \
		</div> \
	</div>",
	methods: {
		groupAjouterMembres: function( group_name ){
			this.group_name = group_name
			this.group_members.push( {
				pseudo: 'bob',
				email: 'bob@gmail'
			} )
			return this.group_ajout_state = 'group_ajouter_membres'
		},
		creerInviterGroupe: function(){
			let data = {
				user: {
					pseudo: this.pseudo,
					email: this.email
				},
				group_name: this.group_name,
				group_members: this.group_members
			}
			services( 'POST', 'creerInviterGroupe', data )
		}
	}
} )

Vue.component( 'groups_existant', {
	template: "<div> \
			UI To display Existing GROUPS \
		</div>"
})

// VUE APP
var app = new Vue({
	el: "#ui",
	data: {
		log_state: 'unlogged',
		mod_contenu: '',
		connected: false,
		message: 'Les Cartes des Anges',
		sign: "@2019 / Yannick Le Tallec",
		user: {
			pseudo: '',
			email: '',
			groups: [],
			history: []
		}
	},
	methods: {
		onModContenu: function( e ){
			this.log_state = 'creer_compte'
			console.log( "change contenu" ) 
		},
		showIdentificationDIV: function( ){
			let pop_up = document.getElementById( 'pop_up' )
			let info = document.getElementById( 'info' )

			info.innerText = null

			pop_up.classList.add( 'afficher_pop_up' )
			pop_up.classList.remove( 'afficher_none' )
		},
		showConnectedDiv: function(){
			let pop_up = document.getElementById( 'pop_up' )
			pop_up.classList.replace( 'afficher_none', 'afficher_pop_up' )
		},
		resetAuthVar: function( e ){
			this.log_state !== "logged" ? this.log_state = "unlogged" : null
		}, 
		deconnexion: function() {
			console.log( "DISCONENCT" ) 	

			let pop_up = document.getElementById( 'pop_up' )
			pop_up.classList.replace( 'afficher_pop_up', 'afficher_none' )

			this.log_state = 'unlogged'
			this.user = {
				pseudo:  '',
				email: '',
				groups: [],
				history: {}
			}
		}
	},
	computed: {
		isConnected: function(){
			if( this.connected ){
				return 'logged'
			} else {
				return 'unlogged'
			}
		},
		choixAuthForm: function(){
			console.log( 'log_state : ' + this.log_state ) 
			switch( this.log_state ){
				// returns content for pop_uo
				case 'unlogged':
					return 'form_auth'	
					break
				case 'log_succes':
					return 'log_succes'	
					break
				case 'logged':
					return 'gestion_compte'	
					break
				case 'creer_compte':
					return 'form_creer_compte'	
					break
				case 'creer_compte_ok':
					return 'form_creer_compte_ok'	
					break
				case 'creer_compte_ok':
					return 'form_creer_compte_ko'	
					break
			}
		}
	},
	beforeCreate: function(){
		console.log( "HOOK BeforeCreate" ) 
	}
})

// GLOBAL HELPERS FUNCTIONS
function services( method, url, data ){
	let vueComponent = this
	return new Promise( function ( resolve, reject ){
		const fname = services.name.toUpperCase()

		if( window.XMLHttpRequest ){
			console.info( "OK : [ " + fname + " ] XHR Object Found" ) 
			var xhr = new XMLHttpRequest()
		} else {
			console.info( "KO : [ " + fname + " ] No XHR Object Found" ) 
			return false
		}
		
		xhr.addEventListener( 'readystatechange', function( event ){
			if( xhr.readyState === 4 && xhr.status === 200 ){
				console.log( xhr.responseText ) 
				resolve( { vueComponent: vueComponent, data: JSON.parse( xhr.responseText ) } )
			}
		})

		xhr.onerror = function(){
			reject( Error( xhr.statusText ) )
		}
		
		let params = ''
		if( data ){

			for( let props in data ){
				console.log( props ) 
				params += props + '=' + data[ props ]
			}
		}

		xhr.open( method, 'http://local.exemple.bzh/services/' + url, true )
		xhr.setRequestHeader( 'Content-Type', 'application/json' )
		xhr.send( data ? JSON.stringify( data ) : null )
	})
}


function verifierFormulaire ( field, event ){
	const fname = services.name.toUpperCase()
	const form_name = event.target.form.id

	const pseudo_err_message = 'Pseudo > 5 caractères' 
	const email_err = 'Rentrez un email valide' 
	const mdp_err_message = 'Mot de Passe  > 5 caractères' 
	const mdp_differents = 'Les mots doivent correspondre' 

	let message = pseudo_err_message + "\n" + mdp_err_message

	let pseudo = document.getElementById( 'pseudo' ).value
	let mdp = document.getElementById( 'mdp' ).value

	let info = document.getElementById( 'info' )
	let classe_erreur = info.classList.contains( 'afficher_message_erreur' )
	
	console.log( classe_erreur, event ) 

	switch( form_name ) {
		case 'login':
			console.log( form_name ) 

			if( pseudo.length > 5 && mdp.length > 5 ){
				event.target.form[2].disabled = false

				info.innerText = null
				if( classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
			} else {
				console.error( "KO : [ " + fname + " ] Données invalides pour authentifier l'utilisateur" ) 

				event.target.form[2].disabled = true

				if( !classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
				info.innerText = message
			}

			break
		case 'creer_compte' :
			let email = document.getElementById( 'email' ).value
			let confirmer_mdp = document.getElementById( 'confirmer_mdp' ).value

			if( pseudo.length > 5 && mdp.length > 5 && verifierEmailFormat( email ) && mdp === confirmer_mdp ){
				event.target.form[5].disabled = false

				info.innerText = null
				if( classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
			} else {
				console.error( "KO : [ " + fname + " ] Données invalides pour la création du compte" ) 

				event.target.form[5].disabled = true

				if( !classe_erreur ) info.classList.toggle( 'afficher_message_erreur' )
				info.innerText = message + '\n' + email_err + '\n' + mdp_differents
			}

			break;
	}
}

function verifierEmailFormat( email ){
	let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regex.test( email )
}

function viderDiv( div_id ){
	let div = document.getElementById( div_id )

	while( div.firstChild ){
		div.removeChild( div.firstChild )
	}
}

