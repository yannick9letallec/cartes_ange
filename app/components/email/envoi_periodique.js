module.exports.envoi_periodique = {
	props: [ 'carte', 'carte_nom' ],
	template: ` <div> 
			<div class='masque'></div> 
			<div class='container'> 
				<section id='carte'> 
					<font-awesome-icon id='close_div' icon='times' @click="$emit( 'close_div' )" style='float: right;' /> 
					<article> 
						<header> 
							<span> {{ carte_nom.toUpperCase() }} </span> <span> Dates : {{ carte.Dates }} </span> 
							<br > 
							<span> Ange : {{ carte.Ange }} </span> <span> Sephirot : {{ carte.Sephirot }} </span> 
						</header> 
						<div class='carte_afficher_detail'> 
							<span class='carte_ange_grand_format'> 
								<img :alt="'Carte dédiée à l ange : ' + carte.Ange + ', et à son message'"
									:src="'http://www.messages-des-anges.fr/app/img/cartes/PNG/' + this.carte_nom + '.png'" />
							</span>

							<span>
								<span> <mark> Message : </mark> {{ carte.text }} </span><br /><br /> 
								<span> <mark> Plan Physique : </mark> {{ carte[ 'Plan physique' ] }} </span><br /><br /> 
								<span> <mark> Plan Emotionnel : </mark> {{ carte[ 'Plan émotionnel' ] }} </span><br /><br /> 
								<span> <mark> Plan Spirituel : </mark> {{ carte[ 'Plan spirituel' ] }} </span><br /><br /> 
							</span> 
						</div> 
					</article> 
				</section> 
			</div> 
			</div> 
		</div>`,
		methods: {
			base64Encode( ){
				// 'data:image/png;charset=utf-8;base64,' +
				let path = 'http://www.messages-des-anges.fr/app/img/cartes/PNG/' + this.carte_nom + '.png'

				let encoded = btoa( path )
				console.dir( encoded ) 
				return path
			}
		},
		mounted(){
		}
}
