$(document).ready(function() 
    { 
        // apply the table sorter on the table with id = partitions
		if (!document.getElementById('partitions')){
		    alert('partitions id Does not exist!');
		} else {
			$("#partitions").tablesorter();
        //console.log ( ' partitions init ');
        init();
		}
    } 
); 

function stopBusyAnimation() {
	// do nothing
}

function init() {
	// hide the table presenting the inputs for a new partition
	$("#table_new_partition").hide();
	$("#button_new_partition").show();
	$("#button_record_new_partition").hide()
	// hook ajax events
	hookAjaxEvents();
}

/**
 * when an Ajax event starts or ends, the whole window is covered by a greyed area.
 */
function hookAjaxEvents() {

	$(document).ajaxSend(function(event, request, settings) {
		$('#overlay').show();
	});
	$(document).ajaxComplete(function(event, request, settings) {
		$('#overlay').hide();
	});
}

/*
 * this function filters the main table when a user inputs a content in the partition artist or in the partition name cells of the new partition
 * 
 */
function filterPartitionsTable() {
	//console.log ("filter partitions table ");
	var partitionsTable = document.getElementById("partitions");
	// get all rows
	var rows = partitionsTable.getElementsByTagName("tr");
	//console.log("there are " + rows.length + " rows");
	for (var i = 0; i < rows.length ; i++) {
		
		//console.log ("============== row --- " + i + " =============");
		var row = partitionsTable.rows[i];
		
		// start with row is shown
		row.classList.remove("hidden");
		var row_artist_is_hidden = false;
		var row_name_is_hidden = false;
		
		var tds = row.getElementsByTagName("td");
		//console.log("there are " + tds.length + " td(s)");
		// loop through the tds
		for (var j = 0; j < tds.length; j++) {
			var td = tds[j];
			if (td.id == "td_partition_artist_filter") {
				//console.log("td with partition artist filter found");
				var spans = td.getElementsByTagName("span");
				for (var k=0; k<spans.length; k++) {
				    //console.log(spans[k].textContent);
				    var table_artist = spans[k].textContent.toLowerCase();
				    var filtered_artist = getNewPartitionArtist().toLowerCase();
				    if (filtered_artist.length > 0) {
				    	if (table_artist.indexOf(filtered_artist) == -1) {
					    	//console.log("----------- row is hidden ------------");
					    	row_artist_is_hidden = true;
					    } else {
					    	//console.log("----------- row is shown -------------");
					    	row_artist_is_hidden = false;
					    }
				    } 
				}
			}
			if (td.id == "td_partition_name_filter") {
				//console.log("td with partition name filter found");
				var spans = td.getElementsByTagName("span");
				for (var k=0; k<spans.length; k++) {
				    //console.log(spans[k].textContent);
				    var table_name = spans[k].textContent.toLowerCase();
				    var filtered_name = getNewPartitionName().toLowerCase();
				    if (filtered_name.length > 0) {
				    	if (table_name.indexOf(filtered_name) == -1) {
				    		row_name_is_hidden = true;
					    	//console.log("------------ row is hidden -----------");
					    } else {
					    	row_name_is_hidden = false;
					    	//console.log("------------ row is shown ------------");
					    }
				    } 
				}
			}
		}
		// si l'une des deux conditions est réunie alors la ligne est cachée
		if (row_artist_is_hidden || row_name_is_hidden) {
	    	row.classList.add("hidden");
		} else {
	    	row.classList.remove("hidden");
		}
	}
}
/**
 * called when the user modifies an element of a new partition
 */
function newPartitionOnChange() {
	//console.log ( ' new partition - something has changed ');
	// set the record button disabled
	$('#button_record_new_partition').prop('disabled', true);
	// filter the table with the patterns of the artist name and song name
	filterPartitionsTable();
	// check if at least two inputs are provided
	if ( isArtistNameProvided () && isSongNameProvided() ) {
		// record button is enabled
		$('#button_record_new_partition').prop('disabled', false);
	}
}

/**
 * this function returns True if the name of a song is provided in the new partition table
 * this function is used to enable the button allowing to record a new partition
 * @returns {Boolean}
 */
function isSongNameProvided() {
	// check if song provided
	var songNameProvided = false;
	try {
		var songNameProvided = ($("#new_partition_name").val().length > 0);
	}
	finally {
		// nothing
	}
	return songNameProvided;
}

/**
 * get the name of the partition
 * 
 */
function getNewPartitionName() {
	var partitionName = "";
	try {
		var partitionName = $("#new_partition_name").val();
	}
	finally {
		// nothing
	}
	return partitionName;
}

/**
 * erase the content of the new partition name
 */

function eraseNewPartitionName(){
	try {
		$("#new_partition_name").val("");
		document.getElementById("new_partition_name").value = "";
	} finally {
		// nothing
	}
}

/**
 * get the name of the artist
 */
function getNewPartitionArtist() {
	var partitionArtist = "";
	try {
		var partitionArtist = $("#new_partition_artist").val();
	}
	finally {
		// nothing
	}
	return partitionArtist;
}

/**
 * erase the content of the new partition artist
 */
function eraseNewPartitionArtist() {
	try {
		$("#new_partition_artist").val("");
		document.getElementById("new_partition_artist").value = "";
	} finally {
		// nothing
	}
}

/**
 * this function returns True if the name of an artist is provided in the new partition table
 * @returns {Boolean}
 */
function isArtistNameProvided() {
	// check if artist name is provided
	var artistNameProvided = false;
	try {
		var artistNameProvided = ($("#new_partition_artist").val().length > 0);
	}
	finally {
		// nothing
	}
	return artistNameProvided;
}

/**
 * get the comments of the partition
 * 
 */
function getNewPartitionComments() {
	var partitionComments = "";
	try {
		var partitionComments = $("#new_partition_comments").val();
	}
	finally {
		// nothing
	}
	return partitionComments;
}

function eraseNewPartitionComments() {
	try {
		$("#new_partition_comments").val("");
		document.getElementById("new_partition_comments").value = "";
	}
	finally {
		// nothing
	}
}

/**
 * get the URL of the partition
 * 
 */
function getNewPartitionURL() {
	var partitionURL = "";
	try {
		var partitionURL = $("#new_partition_url").val();
	}
	finally {
		// nothing
	}
	return partitionURL;
}

function eraseNewPartitionURL() {
	try {
		$("#new_partition_url").val("");
		document.getElementById("new_partition_url").value = "";
	}
	finally {
		// nothing
	}
}

/**
 * function triggered when the user clicks on the button allowing to create a new partition
 * this button is showing a table where all attributes of a new partition need to be provided
 */
function add_new_partition() {
	//console.log ( ' ajouter une nouvelle partition ');
	// show the table allowing to enter the new partition
	$("#table_new_partition").show();
	// hide the button
	$("#button_new_partition").hide();
	// show the button to record a new partition
	$("#button_record_new_partition").show();
	// disable the button to record a new partition
	$('#button_record_new_partition').prop('disabled', true);
	// check if at least two inputs are provided
	if ( isArtistNameProvided () && isSongNameProvided() ) {
		// record button is enabled
		$('#button_record_new_partition').prop('disabled', false);
	}
}

/**
 * retrieve the value True False of the Paper check box
 */
function getNewPartitionPaper() {
	var partitionPaper = 'false';
	try {
		// get the value of a check box given its id
		partitionPaper = $("#new_partition_paper").is(":checked").toString();
		//console.log(' partition paper = ' + $("#partition_paper").is(":checked") );
	} finally {
	}
	return partitionPaper; 
 }


/**
 * retrieve the value True False of the Electronic check box
 */
function getNewPartitionElectronic() {
	var partitionElectronic = 'false';
	try {
		// get the value of a check box given its id
		partitionElectronic = $("#new_partition_electronic").is(":checked").toString();
		//console.log(' partition electronic = ' + $("#partition_electronic").is(":checked") );
	} finally {
	}
	return partitionElectronic; 
 }

/**
 * retrieve the value of a select with options
 */
function getNewPartitionType() {
	var partitionType = 'PVG';
	try {
		partitionType = $( "#new_partition_type" ).val();
	} finally {
	}
	return partitionType;
}


function record_new_partition() {
	//console.log ( ' enregistrer une nouvelle partition ');
	$("#new").hide();
	
	var data = 'artist=' + getNewPartitionArtist();
	data += '&name=' + getNewPartitionName();
	data += '&paper=' + getNewPartitionPaper();
	data += '&electronic=' + getNewPartitionElectronic();
	data += '&type=' + getNewPartitionType();
	data += '&comments=' + getNewPartitionComments();
	// convert & ampersand
	data += '&url=' + encodeURIComponent(getNewPartitionURL());
	
	// start sending to the server a modification of a booking - the song is changed
	$.ajax( { 	
		method: 'post',
		url :  "recordNewPartition",
		data: data,
		async : true,
		success: function(data, status) {
			//console.log ("Data: " + data + "\nStatus: " + status);
			// effacer le contenu des champs New partition artist et new partition name
			eraseNewPartitionArtist();
			eraseNewPartitionName();
			eraseNewPartitionComments();
			eraseNewPartitionURL();
			// reload the page
			window.location.reload();
		},
		error: function(data, status) {
			alert("Error - add partition: " + status + " SVP veuillez contactez votre administrateur");
		},
		complete: stopBusyAnimation,
	} );
}

/**
 * delete a partition
 * @param selection
 */
function delete_partition(selection) {
	//console.log (' delete partition ');
	var partition_pk = $(selection).closest('tr').attr('id');
	//console.log ( 'partition primary key = ' + partition_pk );
	var data = "pk=" + partition_pk;
	// send delete request to the server
	$.ajax( { 	
		method	: 'post',
		url 	:  "deletePartition",
		data	: 	data,
		async 	: 	true,
		success	: 	function(data, status) {
			//console.log ("Data: " + data + "\nStatus: " + status);
			// reload the page
			window.location.reload();
		},
		error: function(data, status) {
			alert("Error - add partition: " + status + " SVP veuillez contactez votre administrateur");
		},
		complete: stopBusyAnimation,
	} );
}


/**
 * change the content of one attribute of a partition
 * @param selection
 */
function detail_change(selection) {
	// find the id
	var selection_id = $(selection).attr('id');
	//console.log ( 'selection id= ' + selection_id );
	// compute the value
	var value = "";
	try {
		if ( (selection_id == 'partition_paper') || (selection_id == 'partition_electronic') ) {
			if ($(selection).is(':checked')) {
				value = 'true';
			} else {
				value = 'false';
			}
		} else {
			if (selection_id == 'partition_url') {
				value = (selection.value) ? selection.value : selection.val();
				value = encodeURIComponent(value);
			} else {
				value = (selection.value) ? selection.value : selection.val();
			}
		}
        //console.log ( 'value = ' + value );
	} catch (e) {
        alert('detail change: err: ' + e.message);
        value = '';
	}

	var partition_pk = $(selection).closest('tr').attr('id');
	//console.log ( 'partition primary key = ' + partition_pk );
	
	var data = "pk=" + partition_pk;
	// find the name of attribute that is changed
	data += '&' + selection_id.split('_')[1];
	data += '=' + value;
	
	$.ajax( {
		method	: 	'post',
		url		:	'modifyPartition',
		data 	:	data,
		async	:	true,
		success	: 	function(data, status) {
			//console.log ("Data: " + data + "\nStatus: " + status);
			// reload the page
			window.location.reload();
		},
		error: function(data, status) {
			alert("Error - modify partition: " + status + " SVP veuillez contactez votre administrateur");
		},
		complete: stopBusyAnimation,
	} );
	

}