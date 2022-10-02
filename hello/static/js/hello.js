
//event triggered when document is ready
$(document).ready(init);

var frenchMonths = [ 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

function init() {
	//console.log(' window loaded -- init ');
	//console.log ( eval(siteMessages) );
	for (var index = 0 ; index < siteMessages.length ; index++ ) {
		//console.log ( siteMessages[index] );
		var newRowContent = $('<tr>');
		newRowContent.addClass('information');
		
		var dateTxt = "";
		try {
			var messageDate = new Date ( siteMessages[index].fields.event_date );
			var dateTxt = messageDate.getDate().toString();
			dateTxt += '-' + frenchMonths[messageDate.getMonth()];
			dateTxt += '-' + messageDate.getFullYear().toString();
		}
		catch(err) {
			dateTxt = err.message;
		}
		newRowContent.append( $('<td class="padding nobold">').html( siteMessages[index].fields.message ) ); 
		newRowContent.append( $('<td class="padding nobold">').html( dateTxt ) ); 
		
		// add the row to the internal table
		$("#informations tbody").append(newRowContent);
	}
}