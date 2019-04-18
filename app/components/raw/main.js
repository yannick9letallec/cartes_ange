module.exports = {
	index: {
		props: [ 'user' ],
		data: function(){
			return {
				args: [{
					titre: 'Ils sont partout !',
					img: './app/img/ange.jpg',
					bg_color: 'black',
					text: 'Les anges sont partout autour de nous. Créez, et entretenez le lien avec eux, savourez la puissance de leur message !'
				}, {
					titre: 'Spiritualité entre Amis :)',
					img: './app/img/partager.jpeg',
					bg_color: 'darkgoldenrod',
					text: 'Partagez votre spiritualité par un tirage des cartes avec un, ou des groupes d\'amis.'
				}, {
					titre: 'Historisez !',
					img: './app/img/archive.jpeg',
					bg_color: 'powderblue',
					text: 'Grace à l\'historique, suivez votre évolution sur une période indéterminée. Quel sera votre chemin avec les Anges ?'
				}, {
					titre: 'Tirage par Email.',
					img: './app/img/email.jpeg',
					bg_color: 'chocolate',
					text: 'Recevez par email, à la fréquence que vous préférez, un tirage. Quoi de mieux pour commencer la journée que la lecture d\'un thème Angellique ?'
				},{
					titre: 'Partagez sur Facebook',
					img: './app/img/facebook.png',
					bg_color: 'black',
					text: 'Partagez le résultat de votre tirage via Facebook'
				},{
					titre: 'Et plus à venir ...',
					img: './app/img/fountain.jpeg',
					bg_color: 'gold',
					text: 'Vos idées et remarques sont bienvenues ! Elles peuvent même donner lieux à de nouvelles fonctionnalités dans cette application.'
				}]
			}
		},
		template: `<div>
				<div class='index'>
					<p class='hero_text'> Les Anges, Vos Compagnons Spirituels </p>
				</div>
				<div class='separateur'></div>
				<section class='args'>
					<article class='wrapper' :style="'background-color: ' + arg.bg_color" v-for='arg, index in args' :key='index'>
						<figure class='img'>
							<img alt='' :src='arg.img' width='100%' />
						</figure>
						<div class='content'>
							<div class='titre'>
								{{ arg.titre }}
							</div>
							<div class='text'>
								{{ arg.text }}
							</div>
						</div>
					</article>
				</section>
				<div class='separateur'></div>
				<contact :user='user'></contact>
			</div>
			</div>`,
		mounted(){
			/*
			let el = document.getElementsByClassName( 'hero_text' )[ 0 ],
				ref = document.getElementById( 'hero_img' )

			let H1 = ref.clientHeight,
				L1 = ref.clientWidth,
				H2 = el.clientHeight,
				L2 = el.clientWidth,
				offset_x, 
				offset_y

			offset_y = ( H1 - H2 ) / 2
			offset_x = ( L1 - L2 ) / 2

			console.log( H1, H2, L1, L2, offset_x, offset_y ) 

			el.style.top = ( offset_y + 200 ) + 'px'
			el.style.left = offset_x + 'px'
			*/
		}
	},
	confirmer_compte: {
		data: function(){
			return {
				pseudo: ''
			}
		},
		template: `<div>
				CONFIRMER CREATION COMPTE
			</div>`,
		mounted() {
			services( 'POST', 'confirmerCreationCompte', { pseudo } )
		}
	},
	confirmer_invitation: {
		props: [ 'user' ],
		data: function(){
			return {
				group_name: '',
				pseudo: '',
				mdp: '',
				frequence_email: '',
				se_souvenir_de_moi: false
			}
		},
		template: `<div>
				{{ this.pseudo.toUpperCase() }}, VALIDEZ VOTRE INVIATTION A PARTICIPER AU GROUPE {{ this.group_name.toUpperCase() }}
				<form id='confirmer_invitation' method='post' enctype='multipart/form-data' @submit.prevent='submit' novalidate>
				<div>
					<label for='mdp_inv'> Mot de Passe : </label>
					<input id='mdp_inv' type='password' placeholder='12345' autocomplete='on' autofocus
						@input='verifierFormulaire'>
				</div>
				<div>
					<label for='confirmer_mdp_inv'> Confirmer le Mot de Passe : </label>
					<input id='confirmer_mdp_inv' type='password' placeholder='Votre mot de passe...' autocomplete='on'
						@input='verifierFormulaire'>
				</div>
				<br />
				<frequence_email @change_frequence_email='frequenceEmail'> Souhaitez recevoir un tirage personnel ? </frequence_email>
				<hr />
				<se_souvenir_de_moi @se_souvenir_de_moi='seSouvenirDeMoi'></se_souvenir_de_moi>
				<div class='form_creer-compte-button'>
					<button type='reset'> Annuler </button>
					<button type='submit' disabled> Créer votre compte ! </button>
				</div>
				</form>
			</div>`,
		methods: { 		
			frequenceEmail: function (){
				console.dir( event ) 
				this.frequence_email = event.target.id.split( ':' )[1]
				console.log( this.frequence_email ) 
			},
			seSouvenirDeMoi: function() {
				console.log( "se_souvenir_de_moi : " + event.target.checked ) 
				this.se_souvenir_de_moi = event.target.checked
			},	
			verifierFormulaire: function( ){
				verifierFormulaire( event )
			},
			submit: function() {
				console.log( "SUBMIT CONFIRME INVITATION " + this.pseudo + ' group: ' + this.user.group + ', frequence : ' + this.frequence_email ) 

				let confirmer_mdp_inv = document.getElementById( 'confirmer_mdp_inv' ).value
				let mdp_inv = document.getElementById( 'mdp_inv' ).value
				this.mdp = mdp_inv
				let that = this

				// enregistrer validation invitation 
				services( 'POST', 'confirmerInvitation', { pseudo: this.pseudo, group_name: this.user.group, mdp_inv, confirmer_mdp_inv, se_souvenir_de_moi: this.se_souvenir_de_moi, frequence_email: this.frequence_email } ).then( function( value ){
					
					// auto log user
					services.call( that, 'POST', 'verifierUtilisateur', { pseudo: that.user.pseudo, mdp: that.mdp } ).then( function( value ){ 
						console.dir( value ) 
						switch( value.data.response ){ 
							case 'utilisateur valide': 
								value.vueComponent.$root._data.log_state = 'log_succes' 
								value.vueComponent.$root._data.connected = true 
								value.vueComponent.$root._data.user = {
									pseudo: value.data.user.pseudo,
									email: value.data.user.email,
									groups: value.data.user.groups,
									ttl: value.data.user.ttl
								}

								setTimeout( function() { 
									document.getElementById( 'pop_up' ).classList.replace( 'afficher_pop_up', 'afficher_none' ) 
									value.vueComponent.$root._data.log_state = 'logged' 
								}, 500 ) 
								break 
							case 'utilisateur invalide': 
								value.vueComponent.$root._data.log_state = 'unlogged' 
								break 
						} 
						// afficher la home page
						value.vueComponent.$root._data.main_page = 'index'
					}) 
				})
			}
		},
		beforeMount: function(){
			console.log( 'Before Mount COnfirmer Invitation' ) 

			let params = new URL( document.URL ).searchParams
			this.pseudo = params.get( 'pseudo' )
			this.group_name = params.get( 'group' )
		}
	},
	afficher_menu_navigation: {
		props: [ 'message', 'afficher_menu_navigation' ],
		template: `<transition name='afficher_menu_navigation'>
			<div class='afficher_menu_navigation'>
				<section class='clickable'>
					<div id='logo'> 
						<a @click.prevent="redirectNavigate( 'index' )"> {{ message }} </a>
					</div> 
					<div> <a @click.prevent="redirectNavigate( 'introduction' )"> Introduction </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'liste_anges', 'explorer' )"
						:mode='mode_liste_anges'> Explorer Les Anges </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'historique' )"> Historique </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'liste_anges', 'manuel' )"> Tirage Manuel </a> </div>
					<div> <a @click.prevent="redirectNavigate( 'liste_anges', 'aleatoire' )"> Tirage Aléatoire </a> </div>
				</section>
				<section>
					<img alt='image d ambiance, hello !' src='./app/img/hello.jpeg' width='100%' />
					<div class='clickable' style='text-align: center;' @click='fermerMenuNavigationMobile'>
						<img alt='image de fermeture du menu de navigation' src='./app/img/croix_fermer.png' width='100%' />
					</div>
				</section>
			</div>
			</transition>`,
		methods: {
			fermerMenuNavigationMobile(){
				console.log( "FERMER MENU NAVIGATION MOBILE" ) 
				this.$root.$data.afficher_menu_navigation = false
			},
			redirectNavigate( link, mode ){
				this.$root.navigate( link, mode )
				this.fermerMenuNavigationMobile()
			}
		},
		mounted(){
			/*
			let target = document.getElementsByClassName( 'afficher_menu_navigation' )[ 0 ]
				el = document.getElementsByTagName( 'header' )[ 0 ],
				h = el.getClientRects()[ 0 ].height

			target.style.top = h + 'px'
			console.log( h ) 
			*/
		}
	},
	contact: {
		props: [ 'user' ],
		data(){
			return {
				message_contact: false,
				message: null,
				message_ok: false,
				message_erreur: false
			}
		},
		template: `<div class='contact_form'>
				<div class='form_title'>
					Pour nous contacter :
				</div>
				<form @submit.prevent='demandeContact'>
					<div class='email_line'>
						<label for='email_contact_form'> Votre Email : </label>
						<input type='email' id='email_contact_form' :value='user.email' width='100%'/>
					</div>
					<div class='message_line'>
						<label for='message_contact_form'> Votre Message : </label>
						<textarea id='message_contact_form' value='' width='100%'></textarea>
					</div>
					<div class='buttons_line'>
						<button type='reset'> Annuler </button>
						<button type='submit'> Envoyer ! </button>
					</div>
					<message_modif_compte :class='{ message_ok: message_ok, message_erreur: message_erreur }' 
						v-if='message_contact'> 
							{{ message }} 
					</message_modif_compte>
				</form>
			</div>`,
		methods: {
			demandeContact(){
				console.log( "CONTACT : SUBMIT" ) 
				console.dir( event )

				let email = document.getElementById( 'email_contact_form' ).value.trim(),
					message = document.getElementById( 'message_contact_form' ).value.trim(),
					that = this,
					data = {}

				function resetMessages(){
					setTimeout( function(){
						that.$data.message_contact = false
						that.$data.message_erreur = false
						that.$data.message_ok = false
					}, 3000 )
				}

				if( verifierEmailFormat && message.length > 0 ){
					data = {
						date: new Date(),
						email,
						message
					}
					services( 'POST', 'demandeContact', data ).then( function( value ){
						if( value.data.response === 'ok' ){
							that.message_contact = true
							that.message = 'Votre demande est en cours de traitement. Merci de votre interet !'
							that.message_ok = true

							document.getElementById( 'message_contact_form' ).value = '' 
							resetMessages()
						} else {
							throw 'Demande impossible à traiter'
						}
					} ).catch( function( err ){
						that.message_contact = true
						that.message_erreur = true
						that.message = err
					} ).finally( function() {
						resetMessages()
					})
				} else {
					that.message_contact = true
					that.message = 'Merci de renseigner : \nun email valide \n un message non nul !'
					that.message_erreur = true

					resetMessages()
					
				}
			}
		},
		updated(){
			console.log( "CONTACT UPDATE HOOK :" ) 
			console.dir( this.user ) 
			console.log( !!this.user.email ) 

			let el = document.getElementById( 'email_contact_form' )
			if( this.user.email ){
				el.disabled = true
			} else {
				el.disabled = false
			}
			console.log( "------" ) 
		}
	},
	introduction: {
		template: `<section id='introduction'>
				<article id='ange'>
					<h1> Ange </h1>
					<div>
						<p> 
							A peine le mot est-il écrit ou prononcé qu’il se déploie sous la forme d’un étre lumineux, gracieux et bienveillant. <br />
							D’ailleurs, les anges ne cessent de fasciner: peinture, littérature, cinéma, photographie, toutes les formes d’art essaient de fixer leur mystérieuse beauté. <br />
							Depuis ces derniéres années, le nombre de livres à leur propos - récits, témoignages, guides - ne cesse d\'augmenter. <br />
							Une science - l\'angeologie revit et se développe, avec ses spécialistes.<br />
							Souvent, l\'information est contradictoire, quand elle n’est pas radicalement différente, et on ne sait plus à quel ange se vouer. <br />
							Alors, qu’en est-il vraiment des anges ? <br />
							Quelle est la vérité à leur propos, si tant est qu’il y en ait une ? <br />
							Nous essaierons de répondre clairement et simplement, avec l’aide des anges...
						</p>
					</div>
				</article>
				<article id='origines'>
					<h1> Les Origines </h1>
					<h3> La littérature mystique </h3>
					
					<div>
						<p> 
							Avant de s’interroger sur la nature des anges, il est nécessaire de planter 1e décor. La plupart des livres publiés aujourd’hui sont inspirés de la <a href='#note_1'> Cabale </a> chrétienne qui a elle-même puisé dans la Kabbale juive, courant ésotérique de la religion juive. <br />
							Bien qu\'ils soient mentionnés dans les textes sacrés traditionnels, les anges apparaissent aux environs du VII<sup>e</sup> siécle dans les ouvrages kabbalistiques qui leur accordent alors une place importante. Les cabalistes chrétiens du Moyen Age réinterpréteront ces « concepts » que leur postérité reprendra sans cesse en y ajoutant une dimension occulte jusqu’au xx<sup>e</sup> siécle. <br />
							Aujourd’hui encore, ce sont sur ces mêmes concepts que s’appuient la plupart des ouvrages <a href='#note_2'> contemporains </a> avec la malheureuse tendance à reproduire la même information en omettant de citer leurs sources on de les vérifier. Or il convient d’étre prudent lorsque l’on utilise des sceaux ou des talismans construits avec des <a href='#note_3'> symboles </a>  ou des mots dont on me maîtrise ni le	sens ni les pouvoirs... 
						</p>
					</div>
				</article>
				<article id='nature'>
					<h1> La Nature des Anges </h1>
					<h3> Qui sont les anges ? </h3>
					
					<div>
						<p> 
							Les textes kabbalistiques affirment que les anges sont des créatures célestes, créées par la volonté divine dans le but d\’accomplir des tâches précises. Toutefois, ce sont avant tout des messagers, des envoyés, comme l’attestent les mots « aggelos » en grec et « malakh » en hébreu. <br />
							En ce sens, ils communiquent la parole divine à l\’être humain. Ce dernier peut, en retour, confier ses priéres aux anges afm qu\'ils les présentent à Dieu. <br />
							Cependant, si les anges sont avant tout des entités bienveillantes non incarnées, ils existent également sous une forme incarnée : ce sont des étres humains que l’on appelle « anges terrestres ». Mais dans tous les cas,1es anges sont nos guides et nos amis. 
						</p>
					</div>
					
					<h3> Que sont-ils ? </h3>
					
					<div>
						<p> 
							Flammes, lumiéres éblouissantes, roues étincelantes, animaux ailés : ainsi apparaissent les anges aux prophétes qui tentent, tant bien que mal, de les décrire dans leurs mots. <br />
							Pour les kabbalistes, les anges sont avant tout des énergies, des <a href='note_4'> « souffles » </a>. <br />
							Plus tard, l’Eglise et les cabalistes en feront les êtres que nous connaissons: ils christianisent les anges en les faisant d’abord à l’image de l’homme, tout en leur attribuant les ailes et l’auréole exprimant la fois leur caractére saint et céleste. 
						</p>
					
					</div>
					
					<h3> Combien sont-ils ? </h3>
					
					<div>
						<p> 
							Soixante-douze, selon les cabalistes. Une multitude, dans la Kabbale : car non seulement Dieu a créé ceux destinés à accomplir des tâches précises, mais on compte aussi ceux créés par les priéres des justes, auxquels il faut ajouter ceux engendrés par le résultat des actions pures ou impures de l’homme et ceux chargés de protéger les nations. Ces derniéres sont au nombre de soixante-dix ou <a href='#note_5'> soixante-douzes </a>, chiffre récurrent dans plusieurs textes parce que les kabbalistes ont une conception magique du langage et des nombres. C\'est la raison pour laquelle certains attribuent soixante-douze lettres au <a href='#note_6'> nom divin </a>. D'ailleurs, le <i> Livre de la Splendeur </i> ou <i> Zohar </i> évoquera soixante-douze noms composés de <a href='#note_7'> trois lettres. </a> 
						</p>
					</div>
					
					<h3> Comment s’appellent-ils ? </h3>
					
					<div>
						<p> 
							Les noms des soixante-douze « souffles » ont été créés d’aprés les versets 19, 20 et 21 du livre de l’Exode selon une méthode que nous ne détaillerons pas ici. Le résultat donne soixante-douze noms de trois lettres possédant chacune une force littérale et <a href='#note_8'> numériques </a>. <br />
							Les cabalistes ont transformé ces « puissances » en anges et ont rajouté le suffixe « e1 » ou « iah » à leur nom pour indiquer une sensibilité tantôt masculine, tantôt féminine puisque pour les kabbalistes, Dieu représente à la fois les principes masculin et <a href='#note_9'> féminin. </a> <br />
							Toutefois, sur les cartes, nous avons préféré indiquerla forme originelle de leur nom, composé de trois lettres hébraïques, afin d\'en préserver toute la puissance numérique. <br />
							Enfin, si les anges sont méconnus dans leur « individualité », on connait surtout les archanges Michaél, Gabriel et Raphaél, les seuls à avoir été légitimés par la religion catholique. 
						</p>
					</div>
					
					<h3> Communiquer avec eux : où ? Quand ? Comment ? </h3>
						
					<div>
						<p> 
							Si, comme nous l\'avons déjé dit plus tôt, les prophétes les percevaient sous des formes bien particuliéres, aujourd\'hui certains auteurs affirment que les anges communiquent à travers certains signes.<br />
							Ce peut étre une plume qui volette, une douce chaleur réconfortante, une présence ou un frôlement amicaux, ou encore un oiseau frappant à la fenétre. <br />
							Bref, autant de signes qui nous surprennent tant ils ne sont pas anodins. Par ailleurs, les « synchronicités où « coincidences » sont souvent des signes : telle chanson qui, soudainement, répond à une question ; un inconnu ou un ami dont les paroles, d’abord banales, prennent tout leur sens quelques jours plus tard... 
						</p>
					</div>
					
					<h3> Où et quand communiquer avec eux ? </h3>
					
					<div>
						<p> 
							Les anges sont partout, tout le temps. Par conséquent, vous pouvez leur parler à haute voix ou mentalement, où que vous soyez. <br />
							Toutefois, il est préférable de favoriser un endroit et un moment paisibles. Si vous allez dans la nature, peu importe le moment, dans la mesure où 1e bruit et l\’activité humaine ne sont pas (ou trés peu) présents. <br />
							Ainsi, foréts, jardins, parcs, campagnes sont des lieux privilégiés pour se connecter aux anges. Si vous habitez en ville, choisissez une période calme : trés tôt le matin ou tard 1e soir ; bref, au moment où: la ville est encore endormie et les énergies plus calmes. 
						</p>
					</div>
					
					<h3> Comment communiquer avec <a href='#note_10'> eux </a> ? </h3>
					
					<div>
						<p> 
							La méditation est le moyen privilégié pour communiquer avec eux. Installez-vous dans un endroit calme. Fermez les yeux et respirez tranquillement, sans forcer. <br />
							Il est normal que toutes sortes de pensées viennent à votre esprit. Ne les combattez pas, et centrez vous sur votre respiration. <br />
							Visualisez une lumiére, bienfaisante vous entourant ; vous pouvez même « respirer » cette lumiére et vous fondre avec elle. <br />
							Quand vous atteindrez un moment de calme et de lécher-prise complet, adressez-vous à votre ange. Il ne se manifestera peut-être pas tout de suite, mais soyez assuré que votre demande a été entendue. Dans tous les cas, n’oubliez pas de remercier. 
						</p> 
					</div>
					
					<h3> Comment sont-ils organisés ? </h3>
					
					<div>
						<p> 
							Pour bien répondre à cette question, il convient de s\'arréter quelques instants sur la « géographie cosmique » de la Kabbale dont il faudra emprunter ici quelques-uns des nombreux concepts.
						</p>
					</div>
				</article>
				<article id='geographie'>
					<h1> Géographie cosmique et céleste </h1>
					<div>
						<p> 
							Les kabbalistes sont mus par leur désir de connaitre et d\'expliquer l\'origine du monde. A cet égard, ils ont développé de fagon minutieuse et complexe de nombreux concepts. Nous n\'évoquerons ici, de fagon trés simplifiée, que certains d’entre eux. 
						</p>
					</div>

					<h3> L’arbre des Sephiroth </h3>
		
					<div>
						<p> 
							Au commencement est le Dieu infini, caché, illimité ( Ein Sof ) dont nait le désir de créer un univers. <br />
							De par Sa volonté, I1 se contracte en lui-méme pour faire la place à ce monde. De sa puissance émanent les Sephiroth, étapes du processus de création divin ; toutes connectées à l\’essence infinie, elles traversent la création et ses créatures avec plus ou moins de force tout en interagissant aussi entre elles. <br />
							Ainsi, l\'arbre des Sephiroth est la présence du Divin dans le monde, mais aussi dans l’humain. <br />
							Les Sephiroth sont toutes reliées à l\‘essence primordiale dont la manifestation variera selon la proximité ou l\’éloignement de chacune d\'elles. <br />
							Aussi, compte tenu du fait que la Cabale lie les humains à une Sephira particulière selon leur date de naissance, ces derniers sont connectés à l\’essence divine qu\’ils ressentent selon la vibration particuliére de leur « Sephira de naissance ». <br />
							Néanmoins, les humains sont traversés, avec plus ou moins de force, par l’énergie de toutes les Sephiroth. Ainsi, les Sephiroth sont, en quelque sorte, 1e cordon ombilical nous reliant au Divin dont nous ne sommes jamais séparés et avec lequel nous aspirons à nous réunir. <br />
							C\’est sans doute la raison pour laquelle 1a Cabale dit que l\’humain se réincarne successivement sur les différentes Sephiroth jusqu\'à ce qu’il atteigne Kéter, pour ensuite retrouver l\'infmité divine. 
						</p>
					</div>
					
					<h3> Structure de l’arbre </h3>
					
					<div>
						<p> 
							Dans la Kabbale, l\’arbre se structure selon trois « piliers ». A droite, celui de la miséricorde, de la compassion. Hohmah, Hesed et Netzah en sont les forces masculines actives, contribuant à l\'action et marquant l\’expansion. <br />
							Le pilier de gauche est celui de la rigueur, limitant l\'action du pilier de droite en freinant son expansion parfois illimitée. Il est formé par les Sephiroth féminines Binah, Guevurah et Hod. <br />
							Le pilier du milieu est celui de l\'équilibre, la synthèse harmonieuse des forces contraires et est formé des Sephiroth <i> Tipheret </i> et <i> Yesod </i>. <br />
							La derniére Sephira, Malkhout, reçoit l\’énergie de toutes les autres. <br />
							<br />
							Le flux de la création passe, tel un éclair, à travers chaque Sephira qui posséde une énergie différente selon sa proximité avec l’ <i>Ein Sof </i> (Dieu illimité) : 
						</p>
					</div>

					<div class='line_height'> &nbsp; </div>
		
					<p> 	
						<strong> Kéter </strong> - <i> La couronne </i> - est la premiére émanation du Divin, Son désir de création qu’elle déverse en...  
					</p>
					
					<ul> 
						<li> 
							<strong> ... Hohmah </strong> - <i> La sagesse </i> - dans laquelle se forme l\’inspiration. L\'idée de créer devient ici un germe prenant forme en... 
						</li>
						<li> 
							<strong> ...Binah </strong> - <i> L’intelligence </i> développant l\'idée, lui donnant forme, structure, afin qu\'elle devienne plus concrète en Daa’t (Sephira cachée). Le flux quitte alors le domaine de l\’abstraction et se dirige vers la premiére Sephira des <i> émotions </i> ... 
						</li>
						<li> 
							<strong> ... Hesed </strong> - <i> La compassion, l\'amour, la bonté infinie </i> -, Sephira de l\'expansion illimitée et totale ; elle marque le premier jour de la création. 
						</li>
					</ul>
						
					<div class='line_height'> &nbsp; </div>

					<p> <strong> Guevurah </strong> - <i> La rigueur, la sévérité, le jugement - </i> 1imite l\'expansion de Hesed, en la contrebalangant parfois à l\’extrême. L\'union des deux Sephiroth a lieu en... </p>
					<ul>
						<li> 
							<strong> ... Tipheret </strong> - <i> La beauté, l\’harmonie </i> qui est le point d\’équilibre de l\'arbre, en tant qu\'elle est reliée à toutes les autres Sephiroth; de là on passe dans le domaine des <i> relations </i> , là où les émotions sont partagées avec... 
						</li>
						<li> 
							<strong> ... Netzah </strong> - <i> La victoire </i> donnant l\’impulsion d\'agir, le courage de se dépasser pour aller vers l\’autre, se connecter à lui, ce qui peut devenir parfois envahissant; à l\’opposé, 
						</li>
						<li> 
							<strong> ... Hod </strong> - <i> La splendeur, la gloire </i> - représente la retenue, 1e silence poussant même au mutisme. Encore une fois, la synthèse des deux s\’opére en... 
						</li>
						<li> 
							<strong> ... Yesod </strong> - <i> Le fondement </i> -, soutien de l\'arbre ; elle redistribue les énergies regues à la derniére des Sephiroth avec laquelle elle a un lien d\'amour et de compréhension. Il s’agit de... 
						</li>
						<li> 
							<strong> ... Malkhout </strong> - <i> Le royaume </i> -, lieu des hommes, produit final de l\’intention formulée en Kéter ; elle reçoit toutes les influences des autres Sephiroth. 
						</li>
					</ul>

					<div class='arbre'> <img alt='arbre des Sephirots' src='app/img/arbre_ange.jpg' width='75%'/> </div>
		
					<h3> Sephiroth et hiérarchies célestes </h3>

					<div>
						<p> 
							Les dix Sephiroth sont associées à dix « catégories » d\'anges dont la traduction des noms hébreux est indiquée au fil des chapitres. <br />
							Chaque Sephira se voit attribuer un archange qui, selon les traditions, est susceptible d\’occuper une place ou une autre. C\’est, par exemple, le cas pour les archanges Michaél et Raphaél qui, alternativement sont placés soit en Tipheret soit en Hod. <br />
							Chaque archange régit respectivement huit anges à l\'exception de Sandalphon et Melchisedech. Le premier serait le frére de Métatron deux archanges qui, à l\’origine, étaient respectivement les prophétes Enoch et Elie. <br />
							II veille sur les humains de Malkhout. Quant à Melchisedech, sa nature d\'archange n\’est pas attestée par la Kabbale. Néanmoins, il joue un rôle important au sein de la Cabale chrétienne.
						</p>
					</div>
				</article>
				<article id='structure'>
					<h3> Nous retiendrons toutefois la structure <a href='#note_11'> suivante </a> : </h3>
					<div class='structure_des_anges'>
						<table> 
							<caption align='bottom'> * Uriel - Lumière de Dieu - peut aussi être remplacé en Guevurah </caption>
							<thead>
								<tr>
									<th rowspan='2'> SEPHIRA </th>
									<th colspan='2'> ARCHANGE </th>
									<th colspan='2'> HIERARCHIE </th>
								</tr>
								<tr>
									<th> Nom </th>
									<th> Qualité </th>
									<th> Kabbale </th>
									<th> Cabale </th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td> Keter </td>
									<td> Métatron </td>
									<td> Prince de la face </td>
									<td> Hayoth Ha Kodesh </td>
									<td> Séraphins </td>
								</tr>
								<tr>
									<td> Hohmah </td>
									<td> Raziel </td>
									<td> Secret de Dieu </td>
									<td> Ophanim </td>
									<td> Chérubins </td>
								</tr>
								<tr>
									<td> Binah </td>
									<td> Tsaphkiel </td>
									<td> Beauté de Dieu </td>
									<td> Erelim </td>
									<td> Trônes </td>
								</tr>
								<tr>
									<td> Hesed </td>
									<td> Tsadkiel </td>
									<td> Justice de Dieu </td>
									<td> Hasmalin </td>
									<td> Dominations </td>
								</tr>
								<tr>
									<td> Guevurah </td>
									<td class='captionned'> Camaël* </td>
									<td> Celui qui voit Dieu </td>
									<td> Seraphim </td>
									<td> Puissances </td>
								</tr>
								<tr>
									<td> Tipheret </td>
									<td> Raphël </td>
									<td> Dieu guérit </td>
									<td> Malachim </td>
									<td> Vertus </td>
								</tr>
								<tr>
									<td> Netzah </td>
									<td> Haniel </td>
									<td> Grâce de Dieu </td>
									<td> Elohim </td>
									<td> Principautés</td>
								</tr>
								<tr>
									<td> Hod </td>
									<td> Michaël </td>
									<td> Qui est comme Dieu </td>
									<td> Beni Elohim </td>
									<td> Archanges </td>
								</tr>
								<tr>
									<td> Yesod </td>
									<td> Gabriel </td>
									<td> Force de Dieu </td>
									<td> Cherubim </td>
									<td> Anges </td>
								</tr>
								<tr>
									<td> Malkhout </td>
									<td> Sandalphon </td>
									<td> Frère de Métatron </td>
									<td> Ishim </td>
									<td> </td>
								</tr>
								<tr>	
									<td> </td>
									<td> Melchisedech </td>
									<td> Roi de la Droiture </td>
									<td> </td>
									<td> </td>
								</tr>
							</tbody>
						</table>
					</div>
				</article>
				<article id='combien'>
					<div>
						<h3> Combien a-t-on d\'anges ? </h3>
						<p> 	
							La plupart des ouvrages contemporains traitant d’angéologie assignent à chaque humain trois anges, présidant respectivement aux domaines physique, émotionnel et spirituel. <br />
							Ces anges sont fonction de la date et de l\'heure de naissance. La Kabbale ne mentionne pas la présence de ces trois anges ; par contre, elle s\’attarde sur les différents aspects de l'âme - de l’âme animale habitant 1e corps jusqu\’à l’âme spirituelle la plus pure qui réside toujours dans le Divin. <br />
							D\’ailleurs, dans son ouvrage cité plus avant, Georges Lahy détaille l\’influence de chaque souffle sur les trois premiers degrés de l’âme. <br /><br />
							Cela étant, tous les anges sont au service de l\’étre humain : néanmoins, certains peuvent se sentir plus à l\'aise de communiquer avec « leur » ange de naissance. Toutefois, nous les invitons à s\’ouvrir à tous les messages qu\'ils recevront au fil des cartes.
						</p>
					</div>
				</article>
				<footer>
					<h2> NOTES : </h2>
					<p id='note_1'> 
						<mark> 1. </mark> - Afin de distinguer les deux courants, une orthographe différente sera utilisée dépendamment qu\'il est question de la tradition ésotérique chrétienne (« Cabale ») ou juive (« Kabbale », c\’est-à-dire la « réception »). 
					</p>
					<p id='note_2'> 
						<mark> 2. </mark> La Cabale chrétienne apparait en pays catalan à la fin du XIII<sup>e</sup> siécle avec Raymond Lulle qui la teinte de plusieurs influences culturelles et religieuses ; elle se développe à la Renaissance (Pic de la Mirandole. Reuchlin, Von Nettesheim) et au XVII<sup>e</sup> (Kircher) Après une pause, elle est de nouveau plébiscitée aux XIX<sup>e</sup> et XX<sup>e</sup> siécles par des auteurs lui dormant une saveur plus occulte (Lévi, Papus, Lenain, Ambelain, etc.).
					</p>
					<p id='note_3'> 
						<mark> 3. </mark> A cet égard, Robert Ambelain s\'est rétracté quant au caractére angélique des sceaux qu\‘il recopie d\'aprés Lenain qui avait lui-même retranscrit la traduction du manuscrit du mage Abramelin... 
					</p> 
					<p id='note_4'> 
						<mark> 4. </mark> L\'expression est de Georges Lahy, Les Soixante-douze Puissances de la Kabbale, éditions Lahy, 1998. 
					</p> 
					<p id='note_5'> 
						<mark> 5. </mark> Livre d’Enoch, Ill. 
					</p> 
					<p id='note_6'> 
						<mark> 6. </mark> Notamment le commentaire rabbinique appelé « Midrash Rabba » portant sur le Lévitique évoqué par Maurice=Ruben Hayoun, La Kabbale, Ellipses, p. 74. 
					</p> 
					<p id='note_7'> 
						<mark> 7. </mark> A ce propos, nous ne pouvons que suggérer la lecture du livre de Georges Lahy, <i> Les Soixante-douze Puissances de la Kabbale </i>, cité précédemment.
					</p>
					<p id='note_8'> 
						<mark> 8. </mark> Nous avons voulu conserver l\'énergie du nom sur les cartes en y inscrivant le nom hébreu du génie. 
					</p>
					<p id="note_9'> 
						<mark> 9. </mark> Certains ouvrages adjoignent parfois un nom latin à chacun des anges. Par exemplet Vehuiah - Deus Exaltator - Dieu élevé et exalté au-dessus de toutes choses. En cela, ils reprenncnt I‘interprétation du jésuite Athanasius Kircher qui traduisit, dans son Oedipus Aegyptiacus, les versets évoqués plus haut en latin et « synthétisa » le sens de chacun d\'eux en une « qualité-clé » divine. 
					</p>
					<p id='note_10'> 
						<mark> 10. </mark> Bien que plusieurs ouvrages fassent mention d\‘alphabets ou de sceaux angéliques, nous ne les utiliserons pas ici, leur origine et leur « sens » véritable n’étant pas attestés. En ce sens, ils sont parfois repris et utilisés " à l\'aveuble " par des gens ignorants l'hébreu ancien et la puissance de son alphabet. Ceci aboutit à la confection de talismans incohérents dont la seule utilité est d\'ordre décoratif. 
					</p>
					<p id='note_11'> 
						<mark> 11. </mark> La traduction des noms hébreux est donnée dans la description détaillée des Sephiroth. 
					</p>
				</footer>
			</section>` 
		},
		historique: {
			template: `<div>
				PAGE EN CONSTRUCTION
				</div>`
		},
		partager: {
			template: ``
		},
		faire_un_don: {
			template: `<a class="dbox-donation-button" href="https://donorbox.org/soutenez-le-message-des-anges" style="background:#5cb85c url(https://d1iczxrky3cnb2.cloudfront.net/white_logo.png) no-repeat 37px center; color: #fff;text-decoration: none;font-family: Verdana,sans-serif;display: inline-block;font-size: 16px;padding: 15px 38px 15px 75px; -webkit-border-radius: 2px; -moz-border-radius: 2px; border-radius: 2px; box-shadow: 0 1px 0 0 #408040; text-shadow: 0 1px rgba(0, 0, 0, 0.3);" > Faire Un Don </a>`
		}
	}
