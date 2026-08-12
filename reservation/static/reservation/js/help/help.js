/**
 * this class is dedicated to manage the help information
 * this help is displayed in a modal dialog box
 * 8 May 2016 - Robert Pastor
 */


function Help () {

	this.helpArray = [];

	this.getSize = function() {
		return this.helpArray.length;
	};

	this.init = function() {

		var htmlContent = "Cette aide est visualisée à chque fois qu'un utilisation clique sur le bouton Point d'interrogation (en haut et à droite) dans la page des réservations ";
		htmlContent += '<img src="/static/reservation/images/question-mark.png" style="width:24px;height:24px;border:0">';
		htmlContent += "question mark available in the upper right corner of the page.<br>";
		this.helpArray.push(htmlContent);

		this.helpArray.push("<h3>Goals</h3>");
		this.helpArray.push("Le système permet de gérer les réservations de deux studios, d'une salle de piano et de la salle Galabru.<br>");
		
		this.helpArray.push("<h3>Changement de période</h3>");
		this.helpArray.push("Le système s'initialise toujours sur la semaine courante.<br>");

		htmlContent = "Les boutons en forme de flèches ";
		htmlContent += '<img src="/static/reservation/images/left-arrow.png" style="width:24px;height:24px;border:0">';
		htmlContent += ' et ';
		htmlContent += '<img src="/static/reservation/images/right-arrow.png" style="width:24px;height:24px;border:0">';
		htmlContent += ' permettent de changer de période (soit de semaine soit de mois).<br> ';
		this.helpArray.push(htmlContent);
		
		htmlContent = "Le bouton ";
		htmlContent += '<img src="/static/reservation/images/reload.jpg" style="width:24px;height:24px;border:0">';
		htmlContent += " permet de revenir à la periode courante.<br>";
		this.helpArray.push(htmlContent);
		
		this.helpArray.push("<h3>Vue hebdomadaire - vue mensuelle</h3>");
		
		htmlContent = "Placé en haut et à gauche de la page, le bouton ";
		htmlContent += '<img src="/static/reservation/images/toggle-mensuel.png" style="width:62px;height:21px;border:0">';
		htmlContent += " permet de passer de la vue hebdomadaire à la vue mensuelle.<br>";
		this.helpArray.push(htmlContent);
		
		this.helpArray.push("La vue mensuelle permet de créer, de déplacer ou de supprimer une réservation.<br>");
		this.helpArray.push("La vue mensuelle ne permet pas de re-dimensionner graphiquement une réservation.<br>");
		this.helpArray.push("Le re-dimensionnement graphique en étirant ou en réduisant la bordure supérieure ou inférieure d'une réservation est possible uniquement dans la vue hebdomadaire.<br>");

		this.helpArray.push("<h3>Gestion des réservations périodiques</h3>");
		
		this.helpArray.push("Les réservations périodiques pour une semaine standard sont définies, configurées et configurables dans le site d'administration.<br>");
		this.helpArray.push("Les réservations périodiques fonctionnent uniquement en mode de présentation du calendrier hebdomadaire.<br>");
		this.helpArray.push("Les réservations périodiques sont réservées aux membres du staff.<br>");
		this.helpArray.push("Un membre du staff a accès à une commande de génération des réservations périodiques de la semaine courante.<br>");
		htmlContent = "Pour cela, il dispose d'un bouton ";
		htmlContent += ' <img src="/static/reservation/images/piano.png" style="width:24px;height:24px;border:0" >';
		htmlContent += " qui lance la génération des réservations périodiques de la semaine en cours.<br>";
		this.helpArray.push(htmlContent);
		
		this.helpArray.push("<h3>Gestion des semaines</h3>");
		
		this.helpArray.push("Le système gère les semaines et les années selon le <a href='https://fr.wikipedia.org/wiki/Num%C3%A9rotation_ISO_des_semaines' target='_blank'>standard ISO</a>.<br>");
		this.helpArray.push("Le système parcourt en marche arrière les semaines et passe à l'année antérieure dès le passage de la <a href='https://fr.wikipedia.org/wiki/Num%C3%A9rotation_ISO_des_semaines' target='_blank'>semaine ISO</a> une.<br>");
		this.helpArray.push("Le système parcourt en marche avant les semaines et passe à l'année supérieure dès le passage de la dernière semaine ISO de l'année.<br>");

		this.helpArray.push("<h3>Jours fériés</h3>");
		
		this.helpArray.push("Si un jour de la semaine (ou du mois) est férié, en lieu et place du jour, le système affiche le nom du jour férié.<br>");
		
		this.helpArray.push("<h3>Création d'une réservation</h3>");
		
		this.helpArray.push("Dans une période de temps, cliquez dans une cellule vide pour créer une nouvelle réservation.<br>");
		this.helpArray.push("Au moment de la création, il est possible en maintenant le bouton de la souris enfoncé d'étendre la période à plusieurs tranches horaires.<br>");
		this.helpArray.push("Le bouton OUI permet de finaliser la création d'une réservation. Il devient actif lorsqu'un nom de chanson a été saisi et qu'un studio a été sélectionné.<br>");
		this.helpArray.push("Note: Il est possible de saisir des noms de chansons avec des caractères accentués.<br>");
		
		this.helpArray.push("<h3>Création d'une réservation périodique</h3>");
		
		this.helpArray.push("Les membres du staff du site ont la possibilité de créer des réservations périodiques hebdomadaires. <br>");
		this.helpArray.push("Une réservation périodique pourra être instanciée sur au plus 9 semaines.<br>");
		
		this.helpArray.push("<h3>Détails d'une réservation</h3>");
		
		this.helpArray.push("Pour connaître le détail d'une réservation, cliquez sur la réservation.<br>");
		this.helpArray.push("Un click droit sur une réservation permet d'accéder à un menu contextuel.<br>");
		this.helpArray.push("En maintenant la souris au-dessus d'une réservation, un popup apparaît donnant les heures et minutes de début et de fin de la réservation.<br>");
		
		this.helpArray.push("<h3>Suppression d'une réservation</h3>");
		
		this.helpArray.push("Pour supprimer une réservation, cliquez (click gauche) sur la réservation, puis cochez la case permettant d'effectuer la suppression, terminer en cliquant sur OUI.<br>");
		this.helpArray.push("Pour supprimer une réservation, cliquez (click droit) pour faire apparaître un menu contextuel, puis sélectionner l'entrée de menu supprimer la réservation.<br>");
		this.helpArray.push("Seul le propriétaire d'une réservation peut supprimer une de ses réservations.<br>");
		
		this.helpArray.push("<h3>Suppression des anciennes réservations</h3>");
		
		this.helpArray.push("Lorsque la semaine visualisée est passée, un membre du staff a accès à un bouton lui permettant de supprimer toutes les réservations de la semaine passée.<br>");
		htmlContent = "Pour cela, il dispose d'un bouton ";
		htmlContent += ' <img src="/static/reservation/images/trashBin.png" style="width:24px;height:24px;border:0" >';
		htmlContent += " qui lance la suppression des anciennes réservations de la semaine passée qui est visualisée.<br>";
		this.helpArray.push(htmlContent);
		
		this.helpArray.push("<h3>Modification d'une réservation</h3>");
		
		this.helpArray.push("Dans la vue hebdomadaire, lorsque l'utilisateur place le pointeur de la souris soit sur la bordure supérieure, soit sur la bordure inférieure d'une réservation, le curseur de la souris change d'aspect pour signifier que le re-dimensionnement de la réservation est possible.<br>");
		this.helpArray.push("Il est possible de modifier la durée d'une réservation en cliquant soit sur la bordure supérieure, soit sur la bordure inférieure, en déplaçant cette bordure puis finalement en la relâchant.<br>");
		this.helpArray.push("De cette façon, il est possible d'étendre ou de réduire la durée d'une réservation.<br>");
		this.helpArray.push("Si vous n'êtes pas le propriétaire d'une réservation et que vous cliquiez sur cette réservation, les saisies ne seront pas autorisées et le bouton OUI sera désactivé.<br>");
		
		this.helpArray.push("<h3>Déplacement d'une réservation</h3>");
		
		this.helpArray.push("Il est possible de déplacer une réservation en cliquant sur la réservation et en maintenant le bouton de la souris enfoncé.<br>");
		this.helpArray.push("Bouton de la souris enfoncé, il faut déplacer la réservation vers une autre période de la journée ou vers une autre journée de la semaine (ou du mois).<br>");
		this.helpArray.push("Le déplacement d'une réservation est possible dans la vue hebdomadaire et dans la vue mensuelle.<br>");
		
		this.helpArray.push("<h3>Sortie EXCEL</h3>");
		
		htmlContent = "L'utilisateur dispose d'un bouton ";
		htmlContent += '<img src="/static/reservation/images/Excel-icon.png" style="width:24px;height:24px;border:0">';
		htmlContent += " - situé dans le bandeau supérieur - pour générer un fichier EXCEL (au format 2003) contenant les réservations de la semaine visualisée (ou du mois visualisé).<br>";
		this.helpArray.push(htmlContent);

		this.helpArray.push("<h3>Ajout d'un utilisateur</h3>");

		this.helpArray.push("Tout membre du staff a la possibilité d'ajouter un nouvel utilisateur au site. <br>");
		this.helpArray.push("L'ajout s'effectue au travers du site d'administration. <br>");
		this.helpArray.push("Seuls les administrateurs voient le lien vers le site d'administration. <br>");
		this.helpArray.push("Dans le site d'administration, dans la section 'Authentification et autorisation', cliquer sur Utilisateurs. <br>");
		this.helpArray.push("Découvrir la liste des utilisateurs du site. <br>");

		htmlContent = "Les utilisateurs ayant le statut 'STATUT EQUIPE' avec une case cochée ";
		htmlContent += ' <img src="/static/reservation/images/ticked-box.png" style="width:24px;height:24px;border:0" >';
		htmlContent += " peuvent ajouter un utilisateur. <br>";
		this.helpArray.push(htmlContent);
		
		this.helpArray.push("La première étape de la création permet de fournir le nom de l'utilisateur (login) et le mot de passe du nouvel utilisateur. <br>");
		this.helpArray.push("Le mot de passe doit être fourni une deuxième fois. <br>");
		this.helpArray.push("Cliquer sur 'Enregistrer et Continuer les modifications' pour terminer la création du nouvel utilisateur. <br>");

		this.helpArray.push("Dans la section 'Informations personnelles', fournir le Nom (peut-être différent du login fourni en premier), le prénom et l'adresse électronique. <br>");
		this.helpArray.push("Attention : il est recommandé de fournir une adresse électronique privée et non pas une adresse électronique (email) en thalesgroup. <br>");
		this.helpArray.push("Si le nouvel utilisateur est amené à exercer des fonctions d'administration, alors cocher la case STATUT EQUIPE. <br>");

		this.helpArray.push("Ajouter le nouvel utilisateur au groupe 'simple user' pour lui attribuer les permissions de gestion des réservations et d'échange de partitions. <br>");
		this.helpArray.push("Ajouter le nouvel utilisateur au groupe 'Comzik Staff' pour lui attribuer les permissions des administrateurs. <br>");
		
		this.helpArray.push("En lieu et place d'une affectation à un groupe, il est possible d'attribuer des permissions dans la liste des permissions disponibles. <br>");
		this.helpArray.push("Attention : ne pas oublier d'utiliser les petites flèches pour transférer un groupe ou une permission à un utilisateur. <br>");
		this.helpArray.push("Conclusion : un groupe ou une permission est assigné lorsqu'il apparait dans la partie 'droite' des choix effectués. <br>");

	};

}

function show(help) {
	
	var divHelp = document.getElementById('helpDiv');
	if (divHelp == undefined) {
		console.log (' cannot display help - div not found!!! ');
		return;
	}
	var title = 'help';
	$("#helpDiv").dialog (
			{
				dialogClass : 'small',
				resizable	: true,
				modal		: true,
				title		: title,
				width 		: 'auto',
				position	: 'top',
				open: function() {
					var htmlContent = "";
					for (i = 0; i < help.getSize() ; i++) {
						htmlContent += help.helpArray[i];
					} 
					$(this).html(htmlContent);
				},
			}
		);
}
	

function showHelp() {
	//console.log ( ' show help !!! ');
	var help = new Help();
	help.init();
	show(help);
	
};