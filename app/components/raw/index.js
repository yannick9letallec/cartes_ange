import Vue from 'vue'

import { library, icon } from '@fortawesome/fontawesome-svg-core'
import { faTimes, faUser, faAngleRight, faMinusSquare, faPlusSquare, faCheckSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add( faTimes )
library.add( faUser )
library.add( faAngleRight )
library.add( faMinusSquare )
library.add( faPlusSquare )
library.add( faCheckSquare )

const times = icon( { prefix: 'fas', iconName: 'times' } )
const user = icon( { prefix: 'fas', iconName: 'user' } )
const angleRight = icon( { prefix: 'fas', iconName: 'angle-right' } )
const minusSquare = icon( { prefix: 'fas', iconName: 'minus-square' } )
const plusSquare = icon( { prefix: 'fas', iconName: 'plus-square' } )
const checkSquare = icon( { prefix: 'fas', iconName: 'check-square' } )

Vue.component( 'font-awesome-icon', FontAwesomeIcon )
Vue.config.productionTip = true
Vue.config.performance = true

let { services, verifierEmailFormat, verifierFormulaire, viderDiv } = require( './helpers.js' )
window.verifierFormulaire = verifierFormulaire
window.services = services
window.verifierEmailFormat = verifierEmailFormat
window.viderDiv = viderDiv


Vue.component( 'unlogged', require( './micro_components.js' ).unlogged )
Vue.component( 'logged', require( './micro_components.js' ).logged )
Vue.component( 'log_success', require( './micro_components.js' ).log_success )
Vue.component( 'bouton_fermeture_div', require( './micro_components.js' ).bouton_fermeture_div )
Vue.component( 'frequence_email', require( './micro_components.js' ).frequence_email )
Vue.component( 'se_souvenir_de_moi', require( './micro_components.js' ).se_souvenir_de_moi )

Vue.component( 'form_auth', require( './auth.js' ).form_auth )
Vue.component( 'form_creer_compte', require( './creer_compte.js' ).form_creer_compte )

Vue.component( 'group_ajout', require( './gestion_groupes.js' ).group_ajout )
Vue.component( 'group_ajout_wrapper', require( './gestion_groupes.js' ).group_ajout_wrapper )
Vue.component( 'groups_existant', require( './gestion_groupes.js' ).groups_existant )
Vue.component( 'group_ajouter_nom', require( './gestion_groupes.js' ).group_ajouter_nom )
Vue.component( 'group_ajouter_membres', require( './gestion_groupes.js' ).group_ajouter_membres )
Vue.component( 'group_ajouter_membre', require( './gestion_groupes.js' ).group_ajouter_membre )
Vue.component( 'group_afficher_membres', require( './gestion_groupes.js' ).group_afficher_membres )

Vue.component( 'message_modif_compte', require( './gestion_compte.js' ).message_modif_compte )
Vue.component( 'a_confirmer', require( './gestion_compte.js' ).a_confirmer )
Vue.component( 'permanent', require( './gestion_compte.js' ).permanent )
Vue.component( 'gestion_compte', require( './gestion_compte.js' ).gestion_compte )

Vue.component( 'contact', require( './main.js' ).contact )
Vue.component( 'index_cartouches', require( './main.js' ).index_cartouches )
Vue.component( 'index', require( './main.js' ).index )
Vue.component( 'confirmer_invitation', require( './main.js' ).confirmer_invitation )
Vue.component( 'confirmer_compte', require( './main.js' ).confirmer_compte )
Vue.component( 'introduction', require( './main.js' ).introduction )
Vue.component( 'historique', require( './main.js' ).historique )

Vue.component( 'liste_anges', require( './liste_anges.js' ).liste_anges )
Vue.component( 'carte', require( './carte.js' ).carte )

// VUE APP
let app = new Vue({
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
			statut: '',
			groups: [],
			history: []
		},
		main_page: 'index',
		cartes: [],
		mode_liste_anges: '',
		cartouches: [{
			text: 'Les Anges sont présents partout autour de vous. Intégrez les à votre quotidient, ils n\'attendent que ça !',
			img: ''
		}, {
			text: 'Avec des tirages réguliers et directement dans votre boîte email, entretenez votre spiritualité et votre lien au divin. Ils sont précieux.',
			img: ''
		},{
			text: 'Créez des groupes, pour partagez votre spiritualité et jouer entre proches',
			img: ''
		},{
			text: 'Archivez vos tirages et voyez votre progression sur l\'année.',
			img: ''
		}]
	},
	methods: {
		onModContenu( e ){
			this.log_state = 'creer_compte'
			console.log( "change contenu" ) 
		},
		showIdentificationDIV( ){
			let pop_up = document.getElementById( 'pop_up' ),
			 	info = document.getElementById( 'info' )

			info.innerText = null

			pop_up.classList.add( 'afficher_pop_up' )
			pop_up.classList.remove( 'afficher_none' )
		},
		showConnectedDiv(){
			let pop_up = document.getElementById( 'pop_up' )
			pop_up.classList.replace( 'afficher_none', 'afficher_pop_up' )
		},
		resetAuthVar( e ){
			this.log_state !== "logged" ? this.log_state = "unlogged" : null
		}, 
		deconnexion() {
			console.log( "DISCONENCT" ) 	

			this.cacherPopUpDiv() 

			this.log_state = 'unlogged'
			this.user = {
				pseudo:  '',
				email: '',
				groups: [],
				history: {}
			}
		},
		navigate( route, mode ){
			this.main_page = route
			this.mode_liste_anges = mode
		},
		verifierEmailFormat ( email ){
			let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
			return regex.test( email )
		},
		cacherPopUpDiv(){
			console.log( "CACHER POP UP" ) 
			let pop_up = document.getElementById( 'pop_up' )
			pop_up.classList.replace( 'afficher_pop_up', 'afficher_none' )
		},
		mockConnecter() {
			let pseudo = 'yannicko',
				email = 'yannick9letallec@gmail.com',
				mdp = '000000',
				that = this

			services( 'POST', 'verifierUtilisateur', { pseudo, mdp } ).then( function( value ){ 
				switch( value.data.response ){ 
					case 'utilisateur valide': 
						that._data.log_state = 'log_success' 
						that._data.connected = true 
						that._data.user = {
							pseudo: value.data.user.pseudo,
							email: value.data.user.email,
							groups: value.data.user.groups,
							statut: value.data.user.statut,
							ttl: value.data.user.ttl
						}

						setTimeout( function() { 
							document.getElementById( 'pop_up' ).classList.replace( 'afficher_pop_up', 'afficher_none' ) 
							that._data.log_state = 'logged' 
						}, 500 ) 
						break 
					case 'utilisateur invalide': 
						that._data.log_state = 'unlogged' 
						break 
				} 
			}) 
		},
		mockCreerInviterGroupe(){
			console.log( "MOCK ") 
			console.dir(this  ) 
			let data = {
				user: {
					pseudo: this.user.pseudo,
					email: this.user.email
				},
				group_name: 'test',
				group_members: [{
					pseudo: 'Anna',
					email: 'yannick9letallec@gmail.com'

				},{
					pseudo: 'Robert',
					email: 'yannick9letallec@gmail.com'
				}]
			}
			services( 'POST', 'creerInviterGroupe', data )
		},
		mockCreerCompte(){
			services( 'POST', 'creerCompte', { 
				pseudo: 'utilisateur_test', 
				email: 'test@email.commmm',
				mdp: '000000',
				confirmer_mdp: '000000',
				se_souvenir_de_moi: true,
				frequence_email: 'aucun'
			} )
		}
	},
	computed: {
		isConnected(){
			if( this.connected ){
				return 'logged'
			} else {
				return 'unlogged'
			}
		},
		choixAuthForm(){
			console.log( 'log_state : ' + this.log_state ) 
			switch( this.log_state ){
				// returns content for pop_uo
				case 'unlogged':
					return 'form_auth'	
					break
				case 'log_success':
					return 'log_success'	
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
	mounted(){
		// gestion des connexions indirectes
		console.log( 'HOOK VUE MOUNTED ' ) 

		let u = new URL( document.URL ),
			p = u.pathname,
			pseudo = u.searchParams.get( 'pseudo' ),
			group = u.searchParams.get( 'group' )

		switch( p ){
			case '/':
				console.log( "GET INDEX PAGE" ) 
				this._data.main_page = 'index'
				break
			case '/confirmer_invitation/' :
				console.info( "PAGE CONFIMER INVITATION" ) 

				this.user.pseudo = pseudo
				this._data.main_page = 'confirmer_invitation'
				break
			case '/confirmer_creation_compte/' :
				console.info( "PAGE CONFIMER COMPTE" ) 

				this.user.pseudo = pseudo
				this._data.main_page = 'confirmer_compte'
				break
			default :
				this._data.main_page = 'index'
				console.info( "GET NO RESULT PAGE" ) 
				break
		}

		let that = this
		services( 'GET', 'recuperer_liste_anges', {} ).then( function( value ){
			console.dir( value ) 
			that.cartes = value.data
		} )
	}
})
