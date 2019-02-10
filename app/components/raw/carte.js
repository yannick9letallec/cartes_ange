module.exports = {
	carte: {
		props: [ 'carte', 'carte_nom' ],
		template: `<div> 
			<div class='masque'></div> 
			<div class='container'> 
				<section id='carte'> 
					<font-awesome-icon id='close_div' icon='times' @click="$emit( 'close_div' )" style='float: right;' /> 
					<article> 
						<header> 
							<span> {{ this.carte_nom.toUpperCase() }} </span> <span> {{ this.carte.Dates }} </span> 
							<br > 
							<span> {{ this.carte.Ange }} </span> <span> {{ this.carte.Sephirot }} </span> 
						</header> 
						<main> 
							<div> 
								<img /> 
							</div> 
							<div> 
								<div> {{ this.carte.text }} </div> 
								<div> Plan Physique : {{ this.carte[ 'Plan physique' ] }} </div> 
								<div> Plan Emotionnel : {{ this.carte[ 'Plan émotionnel' ] }} </div> 
								<div> Plan Spirituel : {{ this.carte[ 'Plan spirituel' ] }} </div> 
							</div> 
						</main> 
					</article> 
				</section> 
			</div> 
			</div> 
		</div>`
	}
}
