//event triggered when document is ready
$(document).ready(init);

var APP = APP || {};
var APPdialogType = APPdialogType || {};


var studiosColors = [ {'pk': 1, 'backColor': 'blue'}, {'pk': 2, 'backColor': 'green'},{'pk': 3, 'backColor': 'chocolate'},{'pk': 4, 'backColor': 'brown'} ];
var studiosFullName = [ {'id': 'Studio1', 'name': 'Studio 1'}, {'id': 'Studio2', 'name': 'Studio 2'}, {'id': 'Piano', 'name': 'Piano'}, {'id': 'Galabru', 'name': 'Galabru'} ];
var frenchMonths = [ 'janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
//separator used between the studio name and the song content
var Dash = '-';

/**
 * This function shows or hides the two buttons related : 
 * 1) to create periodic weekly reservations
 * 2) to delete old reservations
 */
function showHideWeeklyButtons() {
	var element = undefined;
	//console.log("show hide weekly periodic insertion button");
	// check if current user is a super user
	var current_user_id = APP.current_user_id;
	if ( isStaffOrSuperUser(current_user_id) ) {
		//console.log("user is allowed to delete old reservations - or create periodic reservations");
		var dp = APP.dp;
		if (dp != undefined) {
			if (dp instanceof DayPilot.Calendar) {
				// weekly calendar -> show
				
				// get the displayed week
				var weekNumber = $("#weekNumber").text();
				//console.log("displayed week is= " + weekNumber)
				weekNumber = parseInt(weekNumber, 10);
				// get the displayed year
				var year = $("#year").text();
				//console.log("displayed year is= " + weekNumber)
				year = parseInt(year, 10);
				if ( ! isNaN( weekNumber ) && ! isNaN( year ) ) {
					// get the current week
					// function getWeek is defined in IsoWeek.js
					// get the ISO week of the current date
					var isoWeek = new Date().getWeek();
					//console.log("current week is= " + String(isoWeek));
					// 9th January 2022 - error cannot delete old reservation in previous year
					if ( ( ( year == new Date().getFullYear() )  && ( weekNumber < isoWeek ) ) || (  year < new Date().getFullYear() ) ) {
						// week number if before current week
						//console.log("it is possible to delete old reservations");
						element  = document.getElementById("deleteOldWeeklyReservationsDivId");
						if (element) {
							//console.log( dp.isoWeekHasEvents( weekNumber ) );
							if ( dp.isoWeekHasEvents( weekNumber ) ) {
								// calendar has events during the provided week number
								element.style.display = "block";
							} else {
								element.style.display = "none";
							}
						}
						//console.log("it is not possible to create periodic reservations");
						element  = document.getElementById("weeklyReservationsDivId");
						if (element) {
							element.style.display = "none";
						}
						
					} else {
						//console.log("it is not possible to delete old reservations");
						element  = document.getElementById("deleteOldWeeklyReservationsDivId");
						if (element) {
							element.style.display = "none";
						}
						//console.log("it is possible to create periodic reservations");
						element  = document.getElementById("weeklyReservationsDivId");
						if (element) {
							element.style.display = "block";
						}
					}
				}
				
			} else {
				// monthly calendar - id defined in reservations.html
				// in the monthly view - both buttons are not visible
				element  = document.getElementById("weeklyReservationsDivId");
				if (element) {
					element.style.display = "none";
				}
				element  = document.getElementById("deleteOldWeeklyReservationsDivId");
				if (element) {
					element.style.display = "none";
				}
			}
		}
	}
}

/**
 * This function is responsible for deleting old reservations.
 * @param dataJson
 */
function deleteCalendarOldReservations( dataJson ) {
	
	var dp = APP.dp;
	if (dp != undefined) {
		
		// create globals variables
		//APP.reservations = eval(dataJson['reservations']);
		// get all reservations
		var deletedReservations = eval(dataJson['deletedReservations']);
	
		// add the reservations
		for (var reservationId = 0; reservationId < deletedReservations.length; reservationId++ ) {
			//console.log(deletedReservations[reservationId].pk.toString());
			// the primary key of the reservation in DJANGO database is the id in the Calendar 
			if ( dp.find(deletedReservations[reservationId].pk.toString()) ) {
				// reservation has been found
				//console.log(deletedReservations[reservationId].pk.toString());
				// reservation no more in
				var event = dp.events.get(deletedReservations[reservationId].pk.toString());
				if (event != undefined) {
					dp.events.remove(event);
					dp.update();
				}
			} else {
				console.log("Error - pk id not found in calendar");
			}
		}
	}
}


/**
 * function called to delete old reservations
 * this feature is only applicable to staff or superuser
 * this feature is only available in the weekly presentation mode.
 * this feature is only available if the current week is behind in the past
 */
function deleteOldReservations() {
	
	// check if current user is a super user
	var current_user_id = APP.current_user_id;
	if ( isStaffOrSuperUser(current_user_id) ) {
		//console.log("user is allowed to delete old reservations");
		var dp = APP.dp;
		if (dp != undefined) {
			if (dp instanceof DayPilot.Calendar) {
				// weekly presentation mode
				// feature only accessible in weekly presentation mode
				//console.log("weekly calendar - delete old reservations is possible");
				// get the displayed week
				var weekNumber = $("#weekNumber").text();
				//console.log("displayed week is= " + weekNumber)
				weekNumber = parseInt(weekNumber, 10);
				// get the displayed year
				var year = $("#year").text();
				//console.log("displayed year is= " + weekNumber)
				year = parseInt(year, 10);
				if ( ! isNaN( weekNumber ) && ! isNaN( year ) ) {
					// get the current week
					// function getWeek is defined in IsoWeek.js
					// get the ISO week of the current date
					var isoWeek = new Date().getWeek();
					//console.log("current week is= " + String(isoWeek));
					// 9th January 2022 - error cannot delete old reservation in previous year
					if ( ( ( year == new Date().getFullYear() )  && ( weekNumber < isoWeek ) ) || (  year < new Date().getFullYear() ) ) {

						//console.log("it is possible to delete old reservations");
						
						// use ajax to get the data => after getting the html template
						$.ajax( {
							method: 'post',
							url :  "deleteOldBookings",
							data: 'year=' + year + '&week=' + weekNumber ,
							async : true,
							success: function(data, status) {
								
								//alert("Data: " + data + "\nStatus: " + status);
								var dataJson = eval(data);

								deleteCalendarOldReservations( dataJson );
								
							},
							error: function(data, status) {
								alert("Error - delete old bookings: " + status + " SVP veuillez contactez votre administrateur");
								loadReservations();
							},
							complete : stopBusyAnimation,
						} );
						
					} else {
						//console.log("it is not possible to delete old reservations");
					}
				}
			} else {
				//console.log("Monthly calendar - it is not possible to delete old reservations");
			}
		}
	}
}

/**
 * function called to generate weekly reservations
 * this feature is only applicable to staff or superuser
 * this feature is only available in the weekly presentation mode.
 */
function generateWeeklyReservations() {
	
	var current_user_id = APP.current_user_id;
	//var blockWeeklyReservations = true;
	//if  ( isStaffOrSuperUser(current_user_id) && ( blockWeeklyReservations == false) ) {
	if ( isStaffOrSuperUser(current_user_id) ) {
		//console.log("user is allowed to generate weekly reservations");
		
		var dp = APP.dp;
		if (dp != undefined) {

			if (dp instanceof DayPilot.Calendar) {
				// feature only accessible in weekly presentation mode
				var weekNumber = $("#weekNumber").text();
				var year = $("#year").text();

				if ((weekNumber.length>0) && (year.length>0)) {
					//console.log(' loadFirstListOfDays: week number is correctly defined ');

					// use ajax to get the data => after getting the html template
					$.ajax( {
						method: 'post',
						url :  "generateWeeklyReservations",
						data: 'year=' + year + '&week=' + weekNumber ,
						async : true,
						success: function(data, status) {
							
							//alert("Data: " + data + "\nStatus: " + status);
							var dataJson = eval(data);

							// update reservations
							insertReservations(dataJson);
							
						},
						error: function(data, status) {
							alert("Error - generate weekly bookings: " + status + " SVP veuillez contactez votre administrateur");
							loadReservations();
						},
						complete : stopBusyAnimation,
					} );
				}
			}
		}
	}
}

/**
 * function called to stop animated gif image when an ajax call ends 
 */
function stopBusyAnimation(){
	//console.log ( ' stop busy animation ');
	// all inputs enabled again
	/*	$('input').removeAttr('disabled');
	$('#form_message').hide();
	$('#td_form_message').hide();
	$('#form_message_text').html("");*/
	// manage both buttons related to create periodic reservations or to delete old reservations
	showHideWeeklyButtons();
}

/**
 * returns a string containing either the week number or a month number. 
 * Is used when a data set is prepared for an Ajax call.
 */
function getWeekOrMonthAjaxData() {

	var year = $("#year").text();
	var data = 'year=' + year;

	var dp = APP.dp;
	if (dp != undefined) {
		if (dp instanceof DayPilot.Calendar) {
			// it is a weekly calendar
			var weekNumber = $("#weekNumber").text();
			data += '&week=' + weekNumber;

		} else {
			// it is a monthly view => send a month number in a range 1..12 (instead of javascript range 0..11)
			var monthNumber = dp.startDate.getMonth()+1;
			data += '&month=' + monthNumber;
		}
	}
	return data;
}

/**
 * function called when the "reload current period" button is clicked. 
 * The period type - month or week does not change.
 */
function reloadCurrentPeriod() {

	var dp = APP.dp;
	if (dp != undefined) {
		if (dp instanceof DayPilot.Calendar) {
			// it is a weekly calendar
			var currentDate = new Date();
			//console.log ( ' current calendar start date ' + currentDate.toString());
			//console.log ( ' current calendar getDay ' + currentDate.getDay() );
			if (currentDate.getDay()==0){
				// we are a sunday -- find the previous monday
				var numDays = currentDate.getDate() - (6);
				currentDate.setDate(numDays);
			} else {
				var numDays = currentDate.getDate() - (currentDate.getDay() - 1);
				currentDate.setDate(numDays);
			}

			var isoYear = currentDate.getFullYear();
			$('#year').text(isoYear.toString());

			// fix the calendar starting date
			dp.startDate = currentDate;
			//console.log (' reload current week = ' + currentDate.toString() );
			dp.update();

			// function getWeek is defined in IsoWeek.js
			var isoWeek = new Date().getWeek();
			//console.log (' reload current week - iso week = ' + isoWeek ) ;
			$('#weekNumber').text(isoWeek.toString());

		} else {
			// it is a monthly calendar
			//console.log ( ' reload - it is a monthly calendar ');
			dp.startDate = new DayPilot.Date();
			dp.update();

			var month = dp.startDate.getMonth(); 
			//console.log ( ' reload - it is a monthly calendar - month = ' + month);
			$('#monthNumber').text(frenchMonths[month]);

			var isoYear = new Date().getFullYear();
			$('#year').text(isoYear.toString());

		}
	}
	// load reservations
	loadReservations();
}

/**
 * function called when the next Period button is clicked.
 */
function nextPeriod() {

	var dp = APP.dp;
	if (dp != undefined) {
		var url = "";
		if (dp instanceof DayPilot.Calendar) {

			var isoWeek = dp.startDate.weekNumberISO();
			//console.log (' next week - iso week = ' + isoWeek ) ;
			$('#weekNumber').text(isoWeek.toString());
			$('#weekNumber').show();
			$('#monthNumber').hide();

			var currentDate = new Date(dp.startDate.toString());
			var isoYear = currentDate.getFullYear();
			$('#year').text(isoYear.toString());

			// disable the buttons
			$("#btnPreviousPeriod").prop('disabled',true);
			$("#btnNextPeriod").prop('disabled',true);

			//alert (' click on next Week ' + weekNumber);
			$.ajax( { 	
				method: 'get',
				url :  "modifyPeriod",
				data: 'year=' + isoYear.toString() + '&week=' + isoWeek.toString() + '&action=inc',
				async : true,
				success: function(data, status) {
					//alert("Data: " + data + "\nStatus: " + status);
					var dataJson = eval(data);

					var dp = APP.dp;
					if (dp.viewType == 'WorkWeek') {
						dp.startDate = dp.startDate.addDays(7);
					} else {
						// it is a day view
						dp.startDate = dp.startDate.addDays(1);
					}

					var isoWeek = dp.startDate.weekNumberISO();
					//console.log (' next week - iso week = ' + isoWeek ) ;
					$('#weekNumber').html(isoWeek.toString());
					$('#weekNumber').show();
					$('#monthNumber').hide();

					var isoYear = dp.startDate.getYear();
					$('#year').html(isoYear.toString());

					// if change of year => update it
					dp.frenchBankHolidays = dataJson['frenchBankHolidays'];

					//  write existing reservations
					insertReservations(dataJson);
					// update the calendar
					dp.update();

					// enable buttons again
					$("#btnPreviousPeriod").prop('disabled',false);
					$("#btnNextPeriod").prop('disabled',false);
				} ,
				error: function(data, status) {
					alert("Error - next week : " + status + " SVP veuillez contactez votre administrateur"); 
				} ,
				complete : stopBusyAnimation ,
			} );

		} else {

			// it is a monthly view
			var month = dp.startDate.getMonth()+1;
			//console.log (' next month - month = ' + month.toString() ) ;
			//console.log (' next month - month = ' + frenchMonths[dp.startDate.getMonth()] ) ;

			var isoYear = dp.startDate.getYear();
			//console.log (' next month - year = ' + isoYear.toString() ) ;
			$('#year').text(isoYear.toString());

			// disable the buttons
			$("#btnPreviousPeriod").prop('disabled',true);
			$("#btnNextPeriod").prop('disabled',true);

			//alert (' click on next Week ' + weekNumber);
			$.ajax( { 	
				method: 'get',
				url :  "modifyPeriod",
				data: 'year=' + isoYear.toString() + '&month=' + month.toString() + '&action=inc',
				async : true,
				success: function(data, status) {
					//alert("Data: " + data + "\nStatus: " + status);
					var dataJson = eval(data);

					var dp = APP.dp;
					// move to next month
					dp.startDate = dp.startDate.addMonths(1);

					var month = dp.startDate.getMonth();
					//console.log(' next month ' + month.toString());
					//console.log(' next month ' + frenchMonths[month]);
					$('#monthNumber').html(frenchMonths[month]);
					$('#monthNumber').show();
					$('#weekNumber').hide();

					var isoYear = dp.startDate.getYear();
					$('#year').text(isoYear.toString());

					// if changes of year => update it
					dp.frenchBankHolidays = dataJson['frenchBankHolidays'];

					//  write existing reservations
					insertReservations(dataJson);
					dp.update();

					// enable buttons again
					$("#btnPreviousPeriod").prop('disabled',false);
					$("#btnNextPeriod").prop('disabled',false);
				} ,
				error: function(data, status) {
					alert("Error - next week : " + status + " SVP veuillez contactez votre administrateur"); 
				} ,
				complete : stopBusyAnimation ,
			} );
		}
	}
}

/**
 * function called when the previous period button is clicked.
 */
function previousPeriod() {
	var dp = APP.dp;
	if (dp != undefined) {

		if (dp instanceof DayPilot.Calendar) {
			// it is a weekly calendar

			var isoWeek = dp.startDate.weekNumberISO();
			//console.log (' previous week ' + isoWeek );

			var isoYear = dp.startDate.getYear();
			//console.log (' previous week ' + isoYear );

			$('#year').text(isoYear.toString());

			// disable the buttons
			$("#btnPreviousPeriod").prop('disabled',true);
			$("#btnPreviousPeriod").prop('disabled',true);

			//alert (' click on previous week ' + weekNumber);
			$.ajax( { 	method: 'get',
				url :  "modifyPeriod",
				data: 'year=' + isoYear.toString() + '&week=' + isoWeek.toString() + '&action=dec',
				async : true,
				success: function(data, status) {

					//alert("Data: " + data + "\nStatus: " + status);
					var dataJson = eval(data);

					var dp = APP.dp;
					if (dp.viewType == 'WorkWeek') {
						dp.startDate = dp.startDate.addDays(-7);
					} else {
						dp.startDate = dp.startDate.addDays(-1);
					}
					var isoWeek = dp.startDate.weekNumberISO();
					//console.log (' previous week - iso week = ' + isoWeek ) ;
					$('#weekNumber').text(isoWeek.toString());
					$('#weekNumber').show();
					$('#monthNumber').hide();

					var isoYear = dp.startDate.getYear();
					$('#year').text(isoYear.toString());

					// if changes of year => update it
					dp.frenchBankHolidays = dataJson['frenchBankHolidays'];

					// write new list of days and insert existing reservations
					insertReservations(dataJson);
					// update the calendar
					dp.update();

					// enable the buttons
					$("#btnNextPeriod").prop('disabled',false);
					$("#btnNextPeriod").prop('disabled',false);
				} ,
				error: function(data, status) {
					alert("Error - previous week : " + status + " SVP veuillez contactez votre administrateur"); 
				} ,
				complete : stopBusyAnimation ,
			} );

		} else {

			// it is a monthly view
			var month = dp.startDate.getMonth()+1;
			var isoYear = dp.startDate.getYear();
			$('#year').text(isoYear.toString());

			// disable the buttons
			$("#btnPreviousPeriod").prop('disabled',true);
			$("#btnPreviousPeriod").prop('disabled',true);

			//alert (' click on previous week ' + weekNumber);
			$.ajax( { 	method: 'get',
				url :  "modifyPeriod",
				data: 'year=' + isoYear.toString() + '&month=' + month.toString() + '&action=dec',
				async : true,
				success: function(data, status) {

					//alert("Data: " + data + "\nStatus: " + status);
					var dataJson = eval(data);

					// move to the previous month
					var dp = APP.dp;
					dp.startDate = dp.startDate.addMonths(-1);

					var month = dp.startDate.getMonth();
					//console.log(' previous month ' + month.toString());
					//console.log(' next month ' + frenchMonths[month]);

					$('#monthNumber').html(frenchMonths[month]);
					$('#monthNumber').show();
					$('#weekNumber').hide();

					var isoYear = dp.startDate.getYear();
					$('#year').html(isoYear.toString());

					// if changes of year => update it
					dp.frenchBankHolidays = dataJson['frenchBankHolidays'];

					// write new list of days and insert existing reservations
					insertReservations(dataJson);
					// update the calendar
					dp.update();

					// enable the buttons
					$("#btnNextPeriod").prop('disabled',false);
					$("#btnNextPeriod").prop('disabled',false);
				} ,
				error: function(data, status) {
					alert("Error - previous week : " + status + " SVP veuillez contactez votre administrateur"); 
				} ,
				complete : stopBusyAnimation ,
			} );
		}
	}
}

/**
 * function called to get the ISO week number.
 */
function fillIsoWeekAndYear() {

	// function getWeek is defined in IsoWeek.js
	var isoWeek = new Date().getWeek();
	//console.log (' previous week - iso week = ' + isoWeek ) ;
	$('#weekNumber').text(isoWeek.toString());

	var currentDate = new Date();
	//console.log ( ' current calendar start date ' + currentDate.toString());
	//console.log ( ' current calendar getDay ' + currentDate.getDay() );

	if (currentDate.getDay()==0){
		// we are a sunday -- find the previous monday
		var numDays = currentDate.getDate() - (6);
		currentDate.setDate(numDays); 
	} else {
		var numDays = currentDate.getDate() - (currentDate.getDay() - 1);
		currentDate.setDate(numDays); 
	}

	var isoYear = currentDate.getFullYear();
	$('#year').text(isoYear.toString());

}

/**
 * attach event to their handlers => manage period change buttons.
 */
function initPeriodChangeButtons() {

	//console.log (' init week next previous buttons ');
	// attach button to listener
	var btnNextPeriod = document.getElementById('btnNextPeriod'); 
	if (btnNextPeriod != undefined) {
		//console.log(' init: attach click event to next week button ');
		// function addEvent is defined in the toolBox.js
		addEvent( btnNextPeriod , 'click' , nextPeriod );
	}
	// find the button
	var btnPreviousPeriod = document.getElementById('btnPreviousPeriod');
	if (btnPreviousPeriod != undefined) {
		//console.log(' init: attach click event to previous week button ');
		// function addEvent is defined in the toolBox.js
		addEvent( btnPreviousPeriod , 'click' , previousPeriod );
	}
}

/**
 * is a song provided ?
 * @returns {Boolean}
 */
function isSongProvided() {
	// check if song provided
	var songProvided = false;
	try {
		var songProvided = ($("#songSelection").val().length > 0);
	}
	finally {
		// nothing
	}
	return songProvided;
}

/**
 * is a studio selected ?
 * @returns {Boolean}
 */
function isStudioSelected() {
	var studioSelected =  false;
	try {
		//console.log (' selected value = ' + $('#studioSelection').val() );
		if ($('#studioSelection').val() > 0){
			studioSelected =  true;
		}
	}
	finally {
		// do nothing
	}
	return studioSelected;
}

/**
 * function called when the studio changes.
 */
function studioSelectionChanged() {
	var dialogType = APPdialogType.dialogType;

	//console.log ( ' song provided: ' + songProvided );
	if (isStudioSelected() && isSongProvided() && checkHourMinutesStartvsHourMinutesEnd()) {
		// now programmatically get the OUI button and enable it
		enableOuiButton(dialogType);

	} else {
		// now programmatically get the OUI button and disable it
		disableOuiButton(dialogType);
	}
}

/**
 * disable the OUI button - depends upon the type of dialog
 * @param dialogType
 */
function disableOuiButton(dialogType) {
	// now programmatically get the OUI button and disable it
	var button = getDialogButton( '.' + dialogType.toString() , 'Oui' );
	if ( button ) 	{
		button.attr('disabled', 'disabled' ).addClass( 'ui-state-disabled' );
		button.removeClass('ui-state-enabled');
	}
}

/**
 * enable the OUI button - depends upon the type of dialog
 * @param dialogType
 */
function enableOuiButton(dialogType) {
	var button = getDialogButton( '.' + dialogType.toString() , 'Oui' );
	if ( button ) 	{
		button.removeAttr("disabled");
		button.removeClass( 'ui-state-disabled' );
		button.addClass( 'ui-state-enabled' );
	}
}

/**
 * called when the song HTML element is changed
 */
function songChanged() {
	var dialogType = APPdialogType.dialogType;
	//console.log ( ' song provided: ' + songProvided );
	if (isStudioSelected() && isSongProvided() && checkHourMinutesStartvsHourMinutesEnd()) {
		enableOuiButton(dialogType);
	} else {
		disableOuiButton(dialogType);
	}
}

/**
 * used when a date needs to be displayed in the dialog.
 */
function convertToDate(newDate) {
	// date format is yyyy-MM-dd
	var dp = APP.dp;
	var locale = DayPilot.Locale.find(dp.locale);
	//console.log ( newDate.value );
	var date = new Date(newDate);
	var monthName = locale.monthNames[date.getMonth()];
	var dayName = locale.dayNames[date.getDay()];
	var dayNumber = date.getDate().toString();
	var year = date.getFullYear().toString();
	return dayName + ' ' + dayNumber + '-' + monthName + '-' + year;
}

/**
 * get the studio primary key
 * @param studioName
 * @returns
 */
function getStudioPrimaryKey(studioClassName) {

	var studios = APP.studios;
	if (studios != undefined) {

		for (var idOne = 0; idOne < studiosFullName.length ; idOne++) {
			var studioFullName = studiosFullName[idOne];
			if (studioFullName.id == studioClassName) {

				for (var idTwo = 0 ; idTwo < studios.length ; idTwo++ ) {
					var studio = studios[idTwo];
					if (studio.fields.name === studioFullName.name) {
						return studio.pk.toString();
					}
				}
			}
		}
	}
	return "0";
}

/**
 * given a studio class name Studio1 (without space), Studio2 , returns "Studio 1", "Studio 2" with spaces
 * @param studioClassName
 * @returns the name of a studio
 */
function getStudioNameFromClassName(studioClassName) {

	var studios = APP.studios;
	if (studios != undefined) {

		for (var idOne = 0; idOne < studiosFullName.length ; idOne++) {
			var studioFullName = studiosFullName[idOne];
			if (studioFullName.id == studioClassName) {

				return studioFullName.name;					

			}
		}
	}
	return "undefined";
}

/**
 * check the starting hours and minutes versus the ending hours and minutes
 * ending hours and minutes must be greater to starting hours and minutes
 * @returns {Boolean}
 */
function checkHourMinutesStartvsHourMinutesEnd() {

	var startHourElem = document.getElementById("startHourSelection");
	if (startHourElem != undefined) {
		var hourStartSelectedValue = startHourElem.options[startHourElem.selectedIndex].text;
		//console.log ( ' start Hour selection changed = ' + hourStartSelectedValue );
	}

	var startMinutesElem = document.getElementById("startMinutesSelection");
	if (startMinutesElem != undefined) {
		var minutesStartSelectedValue = startMinutesElem.options[startMinutesElem.selectedIndex].text;
		//console.log ( ' start Minutes selection changed = ' + minutesStartSelectedValue );
	}

	var endHourElem = document.getElementById("endHourSelection");
	if (endHourElem != undefined) {
		var hourEndSelectedValue = endHourElem.options[endHourElem.selectedIndex].text;
		//console.log ( ' end Hour selection changed = ' + hourEndSelectedValue );
	}

	var endMinutesElem = document.getElementById("endMinutesSelection");
	if (endMinutesElem != undefined) {
		var minutesEndSelectedValue = endMinutesElem.options[endMinutesElem.selectedIndex].text;
		//console.log ( ' end Minutes selection changed = ' + minutesEndSelectedValue );
	}
	if ((hourStartSelectedValue.length>0) && (minutesStartSelectedValue.length>0) && (hourEndSelectedValue.length>0) && (minutesEndSelectedValue.length>0)){

		if  ( parseInt(hourEndSelectedValue, 10) > parseInt(hourStartSelectedValue, 10)) {
			return true;
		}
		if ( parseInt(hourEndSelectedValue, 10) == parseInt(hourStartSelectedValue, 10)) {

			if  ( parseInt(minutesEndSelectedValue, 10) > parseInt(minutesStartSelectedValue, 10)) {
				return true;
			}
		}
	}
	return false;
}

/**
 * called when end hour changes in the Reservation Dialog.
 */
function endHourSelectionChanged() {
	//console.log(' end Hour selection changed ');
	var dialogType = APPdialogType.dialogType;
	if (dialogType != undefined) {
		//console.log ( ' song provided: ' + songProvided );
		if (isStudioSelected() && isSongProvided() && checkHourMinutesStartvsHourMinutesEnd()) {
			enableOuiButton(dialogType);
		} else {
			disableOuiButton(dialogType);
		}
	}
}

/**
 * called when start hour changes in the Reservation Dialog.
 */
function startHourSelectionChanged() {
	//console.log(' start Hour selection changed ');
	var dialogType = APPdialogType.dialogType;
	if (dialogType != undefined) {
		//console.log ( ' song provided: ' + songProvided );
		if (isStudioSelected() && isSongProvided() && checkHourMinutesStartvsHourMinutesEnd()) {
			enableOuiButton(dialogType);
		} else {
			disableOuiButton(dialogType);
		}
	}
}

/**
 * called when start minutes changes in the Reservation Dialog.
 */
function startMinutesSelectionChanged() {
	//console.log(' start Minutes selection changed ');
	var dialogType = APPdialogType.dialogType;
	if (dialogType != undefined) {
		//console.log ( ' song provided: ' + songProvided );
		if (isStudioSelected() && isSongProvided() && checkHourMinutesStartvsHourMinutesEnd()) {
			enableOuiButton(dialogType);
		} else {
			disableOuiButton(dialogType);
		}
	}
}

/**
 * called when ending minutes changes in the Reservation Dialog.
 */
function endMinutesSelectionChanged() {
	//console.log ( ' end Minutes selection changed ');
	var dialogType = APPdialogType.dialogType;
	if (dialogType != undefined) {
		//console.log ( ' song provided: ' + songProvided );
		if (isStudioSelected() && isSongProvided() && checkHourMinutesStartvsHourMinutesEnd()) {
			enableOuiButton(dialogType);
		} else {
			disableOuiButton(dialogType);
		}
	}
}

/**
 * user clicks on the repetitive checkbox (appears only when dialog type = create).
 */
function toggleRepetitiveCheckbox() {
	//console.log("toggle repetitive check box");
	// if check box is checked then enable choice of number of weeks
	var repetitionSelectionItem = document.getElementById('repetitionSelection');
	var checkBoxRepetitiveItem = document.getElementById('checkBoxRepetitive');
	if ( (repetitionSelectionItem != 'undefined') && (checkBoxRepetitiveItem != 'undefined') && (checkBoxRepetitiveItem.checked == true) ) {
		//console.log(" Repetitive check box is checked ");
		// reset the selected option as the first value
		repetitionSelectionItem.options[0].selected = 'selected';
		// enable selection of the number of repetitions
		repetitionSelectionItem.disabled = false;
		
	} else {
		//console.log(" Repetitive check box is unchecked ");
		// disable the selection of the number of repetitions
		repetitionSelectionItem.disabled = true;
	}
}

/**
 * build the Reservation dialog 
 * used to confirm a creation, modify (resize or move) a reservation or delete it.
 * @param args
 * @param dialogType
 * @returns
 */
function buildEventDialogHtml(args, dialogType) {

	// global var to allow song changed to manage the correct OUI button
	APPdialogType.dialogType = dialogType;

	var fragment = document.createDocumentFragment();
	// ===============================================
	// the owner is displayed only when it is not a creation
	if (dialogType != 'dialogCreate') {

		var trOwner = document.createElement("tr");
		var tdOwner = document.createElement("td");
		tdOwner.colSpan = 2;

		var fieldSetOwner = document.createElement('fieldset') ;
		fieldSetOwner.className = "small";
		var legendOwner = document.createElement('legend');
		legendOwner.innerHTML = "Propriétaire de la réservation";
		fieldSetOwner.appendChild(legendOwner);

		var divOwner = document.createElement("div");
		var resaPk ;
		if (dialogType == 'dialogModify') {
			resaPk = args.data.id.toString();
		} else {
			resaPk = args.e.data.id.toString();
		}
		divOwner.innerHTML =  getFullNameOwnerOfReservation(resaPk);

		fieldSetOwner.appendChild(divOwner);

		tdOwner.appendChild(fieldSetOwner);
		trOwner.appendChild(tdOwner);
		//does not trigger reflow
		fragment.appendChild(trOwner);

	}

	// ================== tr with song and studio selection =============================
	var trOne = document.createElement("tr");
	var tdSong = document.createElement("td");

	var songInput = ' <fieldset class="small"> <legend>Réservation</legend> ';
	songInput += '<input id="songSelection" class="song" type="text" name="song" title="nom de la chanson" onmousedown="songChanged()" onclick="songChanged()" onpaste="songChanged()" onchange="songChanged()" onKeyUp="songChanged()"';
	var songTrimmed = "";
	if (dialogType === 'dialogCreate'){
		// song is empty
		songInput += ' >';
	}
	if 	((dialogType === 'dialogMove') || (dialogType === 'dialogResize') || (dialogType === 'dialogDelete')){
		// 	use specific song field
		songTrimmed = args.e.data.song;
		songInput += ' value="' + songTrimmed.trim() + '" >';
	}
	if (dialogType == 'dialogModify') {
		songTrimmed = args.data.song;
		songInput += ' value="' + songTrimmed.trim() + '" >';
	}
	songInput +=  ' </fieldset> ';

	tdSong.innerHTML = songInput;
	trOne.appendChild(tdSong);

	var tdStudio = document.createElement("td");
	var strStudioSelect = ' <fieldset class="small"> <legend>Studio</legend> ';
	strStudioSelect +=  '<select class="studioSelection" id="studioSelection" onchange="studioSelectionChanged()">';
	if (dialogType === 'dialogCreate') {
		// add empty choice in the first place
		strStudioSelect += ' <option selected></option> ;'
	}
	if ((dialogType === 'dialogMove') || (dialogType === 'dialogResize') || (dialogType === 'dialogDelete')){
		// the studio class does not contain WHITE SPACEs as it is used also as a css class
		strStudioSelect += ' <option value="' + getStudioPrimaryKey(args.e.data.cssClass) + '" selected>' + getStudioNameFromClassName(args.e.data.cssClass) + '</option> ;'
	}
	if (dialogType == 'dialogModify') {
		strStudioSelect += ' <option value="' + getStudioPrimaryKey(args.data.cssClass) + '" selected>' + getStudioNameFromClassName(args.data.cssClass) + '</option> ;'
	}
	// fill the studio options
	var studios = APP.studios;
	for (var id = 0; id < studios.length ; id++) {
		// here we use the studios as provided by the back-end
		strStudioSelect += ' <option value="' + studios[id].pk.toString() + '" >' + studios[id].fields.name + '</option> ';
	}
	strStudioSelect +=  ' </fieldset> ';
	tdStudio.innerHTML = strStudioSelect;
	trOne.appendChild(tdStudio);

	//does not trigger reflow
	fragment.appendChild(trOne);

	// ===== new date ===========
	if ((dialogType === 'dialogMove') || (dialogType === 'dialogCreate') || (dialogType === 'dialogResize') || (dialogType === 'dialogDelete') || (dialogType === 'dialogModify')) {
		// if dialog is move , the user might change only the hours but the date also
		var trNewDate = document.createElement("tr");
		var tdNewDate = document.createElement("td")
		tdNewDate.colSpan = "2";

		var eventNewDateStarts = ' <fieldset class="small"> <legend>Nouvelle Date Début</legend> ';
		if ((dialogType === 'dialogMove') || (dialogType === 'dialogResize')){
			eventNewDateStarts += ' <div class="song" title="début">' + convertToDate(args.newStart) + '</div>';
			eventNewDateStarts += ' <div id="newDate" class="hiddenDateDiv" title="début">' + (args.newStart) + '</div>';
		}
		if (dialogType === 'dialogCreate'){
			eventNewDateStarts += ' <div class="song" title="début">' + convertToDate(args.start) + '</div>';
			eventNewDateStarts += ' <div id="newDate" class="hiddenDateDiv" title="début">' +(args.start) + '</div>';
		}
		if (dialogType === 'dialogDelete'){
			eventNewDateStarts += ' <div class="song" title="début">' + convertToDate(args.e.data.start) + '</div>';
			eventNewDateStarts += ' <div id="newDate" class="hiddenDateDiv" title="début">' +(args.e.data.start) + '</div>';
		}
		if (dialogType == 'dialogModify') {
			eventNewDateStarts += ' <div class="song" title="début">' + convertToDate(args.data.start) + '</div>';
			eventNewDateStarts += ' <div id="newDate" class="hiddenDateDiv" title="début">' +(args.data.start) + '</div>';
		}
		eventNewDateStarts +=  ' </fieldset> ';
		tdNewDate.innerHTML = eventNewDateStarts;
		trNewDate.appendChild(tdNewDate);
		fragment.appendChild(trNewDate);
	}

	var hoursStart = "";
	var minutesStart = "";
	var hoursEnd = "";
	var minutesEnd = "";
	if (dialogType == 'dialogModify'){
		hoursStart = args.data.start.toString().split('T')[1].split(':')[0];
		hoursEnd = args.data.end.toString().split('T')[1].split(':')[0];
		minutesStart = args.data.start.toString().split('T')[1].split(':')[1];
		minutesEnd = args.data.end.toString().split('T')[1].split(':')[1];
	}
	if (dialogType === 'dialogCreate'){
		hoursStart = args.start.toString().split('T')[1].split(':')[0];
		hoursEnd = args.end.toString().split('T')[1].split(':')[0];
		minutesStart = args.start.toString().split('T')[1].split(':')[1];
		minutesEnd = args.end.toString().split('T')[1].split(':')[1];
	}
	if (dialogType === 'dialogDelete'){
		hoursStart = args.e.data.start.toString().split('T')[1].split(':')[0];
		hoursEnd = args.e.data.end.toString().split('T')[1].split(':')[0] ;
		minutesStart = args.e.data.start.toString().split('T')[1].split(':')[1];
		minutesEnd = args.e.data.end.toString().split('T')[1].split(':')[1];
	}
	if ((dialogType === 'dialogResize') || (dialogType === 'dialogMove')){
		hoursStart = args.newStart.toString().split('T')[1].split(':')[0];
		hoursEnd = args.newEnd.toString().split('T')[1].split(':')[0];
		minutesStart = args.newStart.toString().split('T')[1].split(':')[1];
		minutesEnd = args.newEnd.toString().split('T')[1].split(':')[1];
	}

	/*	console.log ( ' hours start ' + hoursStart);
	console.log ( ' hours end ' + hoursEnd);
	console.log ( ' minutes start ' + minutesStart);
	console.log ( ' minutes end ' + minutesEnd);*/

	// ======== new way to modify heure de début fin
	var trModifiableHoursMinutes = document.createElement("tr");
	// ------------- hours minutes start
	var tdHoursMinutesStart = document.createElement("td");

	// ----- create a field set
	var newFieldSetHoursMinutesStart = document.createElement('fieldset') ;
	newFieldSetHoursMinutesStart.className = "small";
	var newLegendHoursStart = document.createElement('legend');
	newLegendHoursStart.innerHTML = "Heure Début";
	newFieldSetHoursMinutesStart.appendChild(newLegendHoursStart);

	// inside the fieldset add a table
	var tableHoursMinutesStart = document.createElement("table");
	var trHoursMinutesStart = document.createElement("tr");

	var tdHoursStart = document.createElement("td");
	var divHoursStart = document.createElement("div");

	var strHoursStartSelect = '<select class="selectHour" id="startHourSelection" onchange="startHourSelectionChanged()">';
	// add empty choice in the first place
	strHoursStartSelect += ' <option value="' + hoursStart + '" selected>' + hoursStart + '</option> ;'
	for (var n = 0; n < 24; n++) {
		if (n < 10) {
			strHoursStartSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
		} else {
			strHoursStartSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
		}
	}
	divHoursStart.innerHTML = strHoursStartSelect;
	tdHoursStart.appendChild(divHoursStart);
	trHoursMinutesStart.appendChild(tdHoursStart);

	// - separator
	var tdHoursMinutesStartSeparator = document.createElement("td");

	var divHoursMinutesStartSeparator = document.createElement("div");
	divHoursMinutesStartSeparator.innerHTML = ':';
	tdHoursMinutesStartSeparator.appendChild (divHoursMinutesStartSeparator);
	trHoursMinutesStart.appendChild(tdHoursMinutesStartSeparator);

	// minutes
	var tdMinutesStart = document.createElement("td");
	var divMinutesStart = document.createElement("div");

	var strMinutesStartSelect = '<select class="selectHour" id="startMinutesSelection" onchange="startMinutesSelectionChanged()"> ';
	// empty selection to force user to select one
	strMinutesStartSelect += ' <option value="' + minutesStart + '" selected>' + minutesStart + '</option> ';
	for (var n = 0; n < 60; n++) {
		if (n < 10) {
			strMinutesStartSelect += ' <option value="' + (n).toString() +'">' + '0' + (n).toString() + '</option>';
		} else {
			strMinutesStartSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
		}
	}
	divMinutesStart.innerHTML = strMinutesStartSelect;
	tdMinutesStart.appendChild(divMinutesStart);
	trHoursMinutesStart.appendChild(tdMinutesStart);

	// add the tr to the table
	tableHoursMinutesStart.appendChild(trHoursMinutesStart);

	// add the table to the fieldset
	newFieldSetHoursMinutesStart.appendChild(tableHoursMinutesStart);
	// add the field set to the td
	tdHoursMinutesStart.appendChild(newFieldSetHoursMinutesStart);

	// add the td to the tr
	trModifiableHoursMinutes.appendChild(tdHoursMinutesStart);

	// ------------- hours minutes end
	var tdHoursMinutesEnd = document.createElement("td");

	// ----- create a field set
	var newFieldSetHoursMinutesEnd = document.createElement('fieldset') ;
	newFieldSetHoursMinutesEnd.className = "small";
	var newLegendHoursEnd = document.createElement('legend');
	newLegendHoursEnd.innerHTML = "Heure Fin";
	newFieldSetHoursMinutesEnd.appendChild(newLegendHoursEnd);

	// inside the fieldset add a table
	var tableHoursMinutesEnd = document.createElement("table");
	var trHoursMinutesEnd = document.createElement("tr");

	var tdHoursEnd = document.createElement("td");
	var divHoursEnd = document.createElement("div");

	var strHoursEndSelect = '<select class="selectHour" id="endHourSelection" onchange="endHourSelectionChanged()">';
	// add empty choice in the first place
	strHoursEndSelect += ' <option value="' + hoursEnd + '" selected>' + hoursEnd + '</option> ;'
	for (var n = 0; n < 24; n++) {
		if (n < 10) {
			strHoursEndSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
		} else {
			strHoursEndSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
		}
	}
	// select is innner of div
	divHoursEnd.innerHTML = strHoursEndSelect;
	tdHoursEnd.appendChild ( divHoursEnd );
	trHoursMinutesEnd.appendChild(tdHoursEnd );

	// - separator
	var tdHoursMinutesEndSeparator = document.createElement("td");
	var divHoursMinutesEndSeparator = document.createElement("div");

	divHoursMinutesEndSeparator.innerHTML = ':';
	tdHoursMinutesEndSeparator.appendChild (divHoursMinutesEndSeparator);
	trHoursMinutesEnd.appendChild(tdHoursMinutesEndSeparator);

	// minutes
	var tdMinutesEnd = document.createElement("td");
	var divMinutesEnd = document.createElement("div");

	var strMinutesEndSelect = '<select class="selectHour" id="endMinutesSelection" onchange="endMinutesSelectionChanged()"> ';
	// empty selection to force user to select one
	strMinutesEndSelect += ' <option value="' + minutesEnd + '" selected>' + minutesEnd + '</option> ';
	for (var n = 0; n < 60; n++) {
		if (n < 10) {
			strMinutesEndSelect += ' <option value="' + (n).toString() +'">' + '0' + (n).toString() + '</option>';
		} else {
			strMinutesEndSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
		}
	}
	divMinutesEnd.innerHTML = strMinutesEndSelect;
	tdMinutesEnd.appendChild(divMinutesEnd);
	trHoursMinutesEnd.appendChild(tdMinutesEnd);

	// add the tr to the table
	tableHoursMinutesEnd.appendChild(trHoursMinutesEnd);

	// add the table to the fieldset
	newFieldSetHoursMinutesEnd.appendChild(tableHoursMinutesEnd);
	// add field set to the td
	tdHoursMinutesEnd.appendChild(newFieldSetHoursMinutesEnd);

	// add the td to the tr
	trModifiableHoursMinutes.appendChild(tdHoursMinutesEnd);
	fragment.appendChild(trModifiableHoursMinutes);

	//========= need to store old start and old end in case the user clicks NON after a resize

	if (dialogType == 'dialogResize') {

		var trOldStartOldEnd = document.createElement("tr");

		var tdOldStart = document.createElement("td");
		var eventOldStart = ' <div id="oldHoursMinutesStart" class="hiddenDiv" >' +(args.e.part.start) + '</div>';
		tdOldStart.innerHTML = eventOldStart;
		trOldStartOldEnd.appendChild(tdOldStart);

		var tdOldEnd = document.createElement("td");
		var eventOldEnd = ' <div id="oldHoursMinutesEnd" class="hiddenDiv" >' +(args.e.part.end) + '</div>';
		tdOldEnd.innerHTML = eventOldEnd
		trOldStartOldEnd.appendChild(tdOldEnd);

		fragment.appendChild(trOldStartOldEnd);

	}
	// ========== add a check box to allow for deleting the reservation

	if ((dialogType === 'dialogDelete') && (dialogType != 'dialogModify')){
		var trDelete = document.createElement("tr");
		var tdDelete = document.createElement("td");
		tdDelete.colSpan = "2";
		var deleteCheckBox = ' <fieldset class="small"> <legend>Cochez la case pour supprimer la réservation</legend> ';
		deleteCheckBox += '<input id="checkBoxDelete" class="checkBoxDelete" type="checkbox" name="delete" >';
		deleteCheckBox +=  ' </fieldset> ';
		tdDelete.innerHTML = deleteCheckBox;
		trDelete.appendChild(tdDelete);
		fragment.appendChild(trDelete);

	}
	// for all dialogs except create - store the event id in a hidden div
	if (dialogType == 'dialogModify') {
		// add a hidden row with the event id
		var trEventId = document.createElement("tr");
		var tdEventId = document.createElement("td");
		tdEventId.setAttribute('id', args.data.id.toString());
		tdEventId.className = "hiddenEventId";
		tdEventId.innerHTML = args.data.id.toString();
		trEventId.appendChild(tdEventId);
		fragment.appendChild(trEventId);
		
	} else {
		if (dialogType != 'dialogCreate') {
			// add a hidden row with the event id
			var trEventId = document.createElement("tr");
			var tdEventId = document.createElement("td");
			tdEventId.setAttribute('id', args.e.data.id.toString());
			tdEventId.className = "hiddenEventId";
			tdEventId.innerHTML = args.e.data.id.toString();
			trEventId.appendChild(tdEventId);
			fragment.appendChild(trEventId);
		}
	}
	// 1st December 2017 - if dialog type is create and user belongs to staff => propose a repetitive periodic reservation
	if (dialogType == 'dialogCreate') {
		
		var current_user_id = APP.current_user_id;
		if (isStaffOrSuperUser(current_user_id) == true) {

			var trRepetitiveReservation = document.createElement("tr");
			
			// first td with check box
			var tdRepetitiveReservation = document.createElement("td");
			var divRepetitiveReservation = document.createElement("div");
			
			var repetitiveResaCheckBox = ' <fieldset class="small"> <legend>Réservation périodique hebdomadaire</legend> ';
			repetitiveResaCheckBox += '<input id="checkBoxRepetitive" class="checkBoxDelete" type="checkbox" name="repetitive" onchange="toggleRepetitiveCheckbox()" >';

			repetitiveResaCheckBox +=  ' </fieldset> ';
			divRepetitiveReservation.innerHTML = repetitiveResaCheckBox;
			tdRepetitiveReservation.appendChild(divRepetitiveReservation);
			
			// second td with number of repetitions
			var tdRepetitionNumber = document.createElement("td");
			var divRepetitionNumber = document.createElement("div");

			var strRepetitionNumberSelect = ' <fieldset class="small"> <legend>Nombre de semaines</legend> ';
			strRepetitionNumberSelect += '<select class="selectRepetition" id="repetitionSelection" disabled > ';
			// set selection to one by default 
			strRepetitionNumberSelect += ' <option value="1" selected>' + (1).toString() + '</option> ';
			for (var n = 2; n < 10; n++) {
				strRepetitionNumberSelect += ' <option value="' + (n).toString() +'">' + (n).toString() + '</option>';
			}
			strRepetitionNumberSelect +=  ' </fieldset> ';
			divRepetitionNumber.innerHTML = strRepetitionNumberSelect;
			tdRepetitionNumber.appendChild(divRepetitionNumber);
			
			trRepetitiveReservation.appendChild(tdRepetitiveReservation);
			trRepetitiveReservation.appendChild(tdRepetitionNumber);
			
			fragment.appendChild(trRepetitiveReservation);
		}
	}
	
	var table = document.createElement("table");
	table.appendChild(fragment);

	return table;
}

/**
 * if the current user is not the owner of the reservation and is not belonging to the staff then inputs are disabled.
 * @param resaPk
 * @param dialogType
 */
function disableInputs(resaPk, dialogType) {
	//console.log ( 'disable inputs - resa Pk = ' + resaPk.toString() );

	var current_user_id = APP.current_user_id;
	if ((isOwnerOfReservation(resaPk.toString(), current_user_id)==false) && (isStaffOrSuperUser(current_user_id)==false)) {
		// disable inputs
		$.each( ['songSelection', 'studioSelection', 'checkBoxDelete', 'startHourSelection', 'startMinutesSelection', 'endHourSelection', 'endMinutesSelection'], function(key, value ) {
			$("#"+value).attr('disabled', true);
		});
		// disable the OUI button
		disableOuiButton(dialogType);
	}
}

/**
 * be able to disable a dialog OK button.
 */
function getDialogButton( dialog_selector, button_name )
{
	var buttons = $( dialog_selector + ' .ui-dialog-buttonpane button' );
	for ( var i = 0; i < buttons.length; ++i )
	{
		var jButton = $( buttons[i] );
		if ( jButton.text() == button_name )
		{
			return jButton;
		}
	}
	return null;
}


/**
 * supprimer les dialogues de class ui-dialog créé par jquery pour afficher les détails.
 */
function removeUiDialogs(){
	// remove all divs with class dialog ui
	var htmlCollection = document.getElementsByClassName("ui-dialog");
	if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
		// remove all divs with class = ui-dialog
		$("div.ui-dialog").remove();
	}
	var dialogArray = ['dialogCreate', 'dialogResize', 'dialogMove', 'dialogDelete', 'dialogModify'];
	for (var index = 0 ; index < dialogArray.length ; index++ ) {
		var dialogType = dialogArray[index];
		var dialog = document.getElementById(dialogType);
		if (dialog != undefined ) {
			// remove all divs with class = ui-dialog
			$("#"+dialogType).html('');
		}
	}
	var dp = APP.dp;
	// erase selection due to the click DayPilot object
	dp.clearSelection();
}

/**
 * get the HourStart from the selection
 * returned format needs to be 13:00:00 or 12:15:00
 * seconds are discarded
 */
function getHourStart() {

	var hourMinutesStart = "";
	var startHourElem = document.getElementById("startHourSelection");
	if (startHourElem != undefined) {
		hourMinutesStart += startHourElem.options[startHourElem.selectedIndex].text;
		hourMinutesStart += ":";
	} else {
		hourMinutesStart = "00:";
	}
	var startMinutesElem = document.getElementById("startMinutesSelection");
	if (startMinutesElem != undefined){
		hourMinutesStart += startMinutesElem.options[startMinutesElem.selectedIndex].text;
		hourMinutesStart += ":00";

	} else {
		hourMinutesStart += "00:00";
	}
	//console.log (hourMinutesStart );
	return hourMinutesStart;
}

/**
 * returns the event end hours and end minutes
 * returned format needs to be 11:30:00
 * @returns {String}
 */
function getHourEnd() {

	var hourMinutesEnd = "";
	var endHourElem = document.getElementById("endHourSelection");
	if (endHourElem != undefined) {
		hourMinutesEnd += endHourElem.options[endHourElem.selectedIndex].text;
		hourMinutesEnd += ":";
	} else {
		hourMinutesEnd = "00:";
	}	
	var endMinutesElem = document.getElementById("endMinutesSelection");
	if (endMinutesElem != undefined){
		hourMinutesEnd += endMinutesElem.options[endMinutesElem.selectedIndex].text;
		hourMinutesEnd += ":00";

	} else {
		hourMinutesEnd += "00:00";
	}
	//console.log (hourMinutesEnd );
	return hourMinutesEnd;

}

/**
 * this is the date inside the dialog - used when a reservation is moved from one date to another date.
 * @returns
 */
function getNewDate() {
	var newDate = document.getElementById("newDate");
	if (newDate !=  undefined) {
		//console.log (' hour start = ' + newDate.innerHTML );
		return newDate.innerHTML;
	}
	return "";
}

/**
 * undo a resize when the user clicks NON or closes the dialog.
 */
function undoResize() {

	var htmlCollection = document.getElementsByClassName("hiddenEventId");
	if ((htmlCollection != undefined) && (htmlCollection.length>0)) {

		var eventId = htmlCollection[0].getAttribute('id');
		var oldStart = document.getElementById("oldHoursMinutesStart");
		var oldEnd = document.getElementById("oldHoursMinutesEnd");
		if ((eventId != undefined) && (oldStart != undefined) && (oldEnd != undefined)){
			var dp = APP.dp;
			if (dp != undefined){
				if (dp.find(eventId.toString())) {
					// event found
					var event = dp.events.get(eventId.toString());
					event.data.start = new DayPilot.Date(oldStart.innerHTML);
					event.data.end = new DayPilot.Date(oldEnd.innerHTML)
					if (event != undefined) {
						dp.events.update(event);
						dp.update();
					}
				}
			}
		}
	}
}

/**
 * event fired when the event is resized.
 * this event is fired only in weekly mode (not available in monthly mode).
 * @param event
 */
function onEventResized (event) {

	var title = 'SVP veuillez confirmer les changements';
	$("#dialogResize").dialog (
			{
				dialogClass : 'dialogResize',
				resizable	: false,
				modal		: true,
				title		: title,
				width		: 400,
				height		: 400,
				open: function() {
					var htmlContent = buildEventDialogHtml(event , 'dialogResize' );
					$(this).html(htmlContent);

					var htmlCollection = document.getElementsByClassName("hiddenEventId");
					if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
						var eventId = htmlCollection[0].getAttribute('id');
						disableInputs(eventId, 'dialogResize');
					}
				},
				close: function() {

					undoResize();
					removeUiDialogs();
					reloadReservations();

				} ,
				buttons: {
					"Oui": function () {
						// get all elements with class name hiddenEventId
						var htmlCollection = document.getElementsByClassName("hiddenEventId");
						if ((htmlCollection != undefined) && (htmlCollection.length>0)) {

							var eventId = htmlCollection[0].getAttribute('id');
							//console.log (' event resize - button OK - id = ' + eventId.toString() );

							var data = getWeekOrMonthAjaxData();

							//console.log (' studio selected id = ' + $('#studioSelection').val() );
							var studioPrimaryKey = $('#studioSelection').val();
							data += '&studio=' + studioPrimaryKey ;

							//console.log ( ' song value = ' + $("#songSelection").val() );
							var song = $("#songSelection").val();
							data += '&song=' + encodeURIComponent(song);

							//console.log ( ' hour start = ' + getHourStart() );
							var startingHour = getHourStart();
							data += '&start=' + startingHour ;

							//console.log ( ' hour end = ' + getHourEnd() );
							var endingHour = getHourEnd();
							data += '&end=' + endingHour ;

							//console.log ( ' new date = ' + getNewDate() );
							var selectedDate =  getNewDate();
							data += '&date=' + selectedDate ;

							// add the event primary key = reservation primary key
							// the event id in the calendar is the primary key of the DJANGO reservation database entry
							data += "&pk=" + eventId.toString();

							// start sending to the server a modification of a booking - the song is changed
							$.ajax( { 	
								method: 'post',
								url :  "modifyBooking",
								data: data,
								async : true,
								success: function(data, status) {
									//console.log ("Data: " + data + "\nStatus: " + status);
									var dataJson = eval(data);

									// delete the old event
									var dp = APP.dp;
									if (dp != undefined){
										if (dp.find(eventId.toString())) {
											var event = dp.events.get(eventId.toString());
											if (event != undefined) {
												dp.events.remove(event);
												dp.update();
											}
										}
									}
									// update reservations
									insertReservations(dataJson);
								},
								error: function(data, status) {
									alert("Error - modify booking: " + status + " SVP veuillez contactez votre administrateur");
									loadReservations();
								},
								complete: stopBusyAnimation,
							} );

						}
						$(this).dialog('close');
					},

					"Non": function () {
						// need to resize the event to its initial size before the resizing
						undoResize();
						$(this).dialog('close');
						$("#dialog-confirm").html('');
						reloadReservations();
					}
				}
			});
}

/**
 * function called by DayPilot when an event is moved
 * this event is possible in both weekly and monthly presentation mode.
 * @param event
 */
function onEventMoved(event) {

	var title = 'SVP veuillez confirmer les changements';
	$("#dialogMove").dialog(
			{
				dialogClass : 'dialogMove',
				resizable	: false,
				modal		: true,
				title		: title,
				width		: 400,
				height		: 400,
				open: function() {
					var htmlContent = buildEventDialogHtml(event , 'dialogMove' );
					$(this).html(htmlContent);
					// if user is not the owner and not a staff member then disable inputs
					var htmlCollection = document.getElementsByClassName("hiddenEventId");
					if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
						var eventId = htmlCollection[0].getAttribute('id');
						disableInputs(eventId, 'dialogMove');
					}
				},
				close: removeUiDialogs,
				buttons: {
					"Oui": function () {

						// get all elements with class name hiddenEventId
						var htmlCollection = document.getElementsByClassName("hiddenEventId");
						if ((htmlCollection != undefined) && (htmlCollection.length>0)) {

							var eventId = htmlCollection[0].getAttribute('id');
							//console.log (' event Moved - button OK - id = ' + eventId.toString() );

							var data = getWeekOrMonthAjaxData();

							var studioPrimaryKey = $('#studioSelection').val();
							data += '&studio=' + studioPrimaryKey ;

							var song = $("#songSelection").val();
							data += '&song=' + encodeURIComponent(song);

							//console.log ( ' hour start = ' + getHourStart() );
							var startingHour = getHourStart();
							data += '&start=' + startingHour ;

							//console.log ( ' hour end = ' + getHourEnd() );
							var endingHour = getHourEnd();
							data += '&end=' + endingHour ;

							//console.log ( ' new date = ' + getNewDate() );
							var selectedDate =  getNewDate();
							data += '&date=' + selectedDate ;

							// add the reservation primary key
							// the event id of the Calendar is the primary key of the DJANGO reservation model instance
							data += "&pk=" + eventId.toString();

							// start sending to the server a modification of a booking - the song is changed
							$.ajax( { 	
								method: 'post',
								url :  "modifyBooking",
								data: data,
								async : true,
								success: function(data, status) {
									//console.log ("Data: " + data + "\nStatus: " + status);
									var dataJson = eval(data);

									var dp = APP.dp;
									if (dp != undefined){
										if (dp.find(eventId.toString())) {
											var event = dp.events.get(eventId.toString());
											if (event != undefined) {
												dp.events.remove(event);
												dp.update();
											}
										}
									}
									// update reservations
									insertReservations(dataJson);
								},
								error: function(data, status) {
									alert("Error - modify booking: " + status + " SVP veuillez contactez votre administrateur");
									loadReservations();
								},
								complete: stopBusyAnimation,
							} );

						}
						$(this).dialog('close');
					},
					"Non": function () {
						$(this).dialog('close');
						//console.log ( 'suppression was cancelled !!!');
						$("#dialog-confirm").html('');
						//$(this).remove();
					}
				}
			});
}

/**
 * event raised when the user creates a new event. 
 * This event is fired in both monthly and weekly mode.
 */
function onTimeRangeSelected (event) {

	var title = 'SVP veuillez confirmer la création';
	$("#dialogCreate").dialog(
			{
				dialogClass : 'dialogCreate',
				resizable	: false,
				modal		: true,
				title		: title,
				width		: 400,
				height		: 350,
				open: function() {
					var htmlContent = buildEventDialogHtml(event, 'dialogCreate' );
					$(this).html(htmlContent);
				},
				close: function() {
					removeUiDialogs();
					var dp = APP.dp;
					if (dp != undefined) {
						// erase the selection
						dp.clearSelection();
					}
				},
				buttons: {
					"Oui": function () {

						// start URL related data with year and week or month
						var data = getWeekOrMonthAjaxData();

						//console.log (' studio selected id = ' + $('#studioSelection').val() );
						var studioPrimaryKey = $('#studioSelection').val();
						data += '&studio=' + studioPrimaryKey ;

						//console.log ( ' song value = ' + $("#songSelection").val() );
						var song = $("#songSelection").val();
						data += '&song=' + encodeURIComponent(song);

						//console.log ( ' hour start = ' + getHourStart() );
						var startingHour = getHourStart();
						data += '&start=' + startingHour ;

						//console.log ( ' hour end = ' + getHourEnd() );
						var endingHour = getHourEnd();
						data += '&end=' + endingHour ;

						//console.log ( ' new date = ' + getNewDate() );
						var selectedDate =  getNewDate();
						data += '&date=' + selectedDate ;
						
						// 2nd December 2017 - manage repetitive reservation
						// if repetitive selection is not available then user is not a superuser or not belonging 
						var repetitionSelectionItem = document.getElementById('repetitionSelection');
						if (repetitionSelectionItem != null) {
							// user is superuser or is belonging to staff
							//console.log("create a reservation => user is superuser or belongs to staff");
							data += '&repetition=' + String(repetitionSelectionItem.value);
						} else {
							// default number of reservation
							data += '&repetition=' + String(1);
						}

						$.ajax( { 	
							method: 'post',
							url :  "addBooking",
							data: data ,
							async : true,
							success: function(data, status) {
								//alert("Data: " + data + "\nStatus: " + status);
								var dataJson = eval(data);

								// update reservations
								insertReservations(dataJson);
							} ,
							error: function(data, status) {
								alert("Error - modify booking: " + status + " SVP veuillez contactez votre administrateur");
								loadReservations();
							},
							complete: stopBusyAnimation ,
						} );

						$(this).dialog('close');
					},
					"Non": function () {
						$(this).dialog('close');
						//console.log ( 'suppression was cancelled !!!');
						$("#dialog-confirm").html('');
						//$(this).remove();
					}
				}
			});

	// now programmatically get the OUI button and disable it
	var button = getDialogButton( '.dialogCreate', 'Oui' );
	if ( button ) 	{
		button.attr('disabled', 'disabled' ).addClass( 'ui-state-disabled' );
	}
}

/**
 * this function is called when the user selects modify event (modifier une réservation ) using a context menu.
 */
function onContextMenuEventModify ( event ) {

	var title = 'SVP veuillez confirmer les modifications ';
	$("#dialogModify").dialog(
			{
				dialogClass : 'dialogModify',
				resizable	: false,
				modal		: true,
				title		: title,
				width		: 550,
				height		: 350,
				open: function() {
					var htmlContent = buildEventDialogHtml(event , 'dialogModify');
					$(this).html(htmlContent);
					var htmlCollection = document.getElementsByClassName("hiddenEventId");
					if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
						var eventId = htmlCollection[0].getAttribute('id');
						disableInputs(eventId, 'dialogModify');
					}
				},
				close: removeUiDialogs,
				buttons: {
					"Oui": function () {
						// get all elements with class name hiddenEventId
						var htmlCollection = document.getElementsByClassName("hiddenEventId");
						if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
							// read the id of the first element in the collection
							var eventId = htmlCollection[0].getAttribute('id');
							//console.log (' event clicked - button OK - id = ' + eventId.toString() );

							// start URL related data with year and week or month
							var data = getWeekOrMonthAjaxData();

							//console.log (' studio selected id = ' + $('#studioSelection').val() );
							var studioPrimaryKey = $('#studioSelection').val();
							data += '&studio=' + studioPrimaryKey ;

							//console.log ( ' song value = ' + $("#songSelection").val() );
							var song = $("#songSelection").val();
							data += '&song=' + encodeURIComponent(song);

							//console.log ( ' hour start = ' + getHourStart() );
							var startingHour = getHourStart();
							data += '&start=' + startingHour;

							//console.log ( ' hour end = ' + getHourEnd() );
							var endingHour = getHourEnd();
							data += '&end=' + endingHour ;

							//console.log ( ' new date = ' + getNewDate() );
							var selectedDate =  getNewDate();
							data += '&date=' + selectedDate ;

							data += "&pk=" + eventId.toString();

							// start sending to the server a modification of a booking - the song is changed
							$.ajax( { 	
								method: 'post',
								url :  "modifyBooking",
								data: data,
								async : true,
								success: function(data, status) {
									//console.log ("Data: " + data + "\nStatus: " + status);
									var dataJson = eval(data);

									var dp = APP.dp;
									if (dp != undefined){
										if (dp.find(eventId.toString())) {
											var event = dp.events.get(eventId.toString());
											if (event != undefined) {
												// suppress the event
												dp.events.remove(event);
												dp.update();
											}
										}
									}
									// update reservations
									insertReservations(dataJson);
								},
								error: function(data, status) {
									alert("Error - modify booking: " + status + " SVP veuillez contactez votre administrateur"); 
									loadReservations();
								},
								complete: stopBusyAnimation,
							} );

						}
						$(this).dialog('close');

					},
					"Non": function () {
						$(this).dialog('close');
						//console.log ( 'suppression was cancelled !!!');
						$("#dialog-confirm").html('');
						//$(this).remove();
					}
				}
			} );
}


/**
 * this function is responsible for modifying or deleting an event.
 * @param event
 */
function onEventClicked (event) {

	var title = 'SVP veuillez confirmer les modifications ou la suppression';
	$("#dialogDelete").dialog(
			{
				dialogClass : 'dialogDelete',
				resizable	: false,
				modal		: true,
				title		: title,
				width		: 550,
				height		: 400,
				open: function() {
					var htmlContent = buildEventDialogHtml(event , 'dialogDelete');
					$(this).html(htmlContent);
					var htmlCollection = document.getElementsByClassName("hiddenEventId");
					if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
						var eventId = htmlCollection[0].getAttribute('id');
						disableInputs(eventId, 'dialogDelete');
					}
				},
				close: removeUiDialogs,
				buttons: {
					"Oui": function () {
						// get all elements with class name hiddenEventId
						var htmlCollection = document.getElementsByClassName("hiddenEventId");
						if ((htmlCollection != undefined) && (htmlCollection.length>0)) {
							// read the id of the first element in the collection
							var eventId = htmlCollection[0].getAttribute('id');
							//console.log (' event clicked - button OK - id = ' + eventId.toString() );

							if (document.getElementById('checkBoxDelete').checked) {
								//console.log (' event clicked - check box is checked => it is a deletion');

								// start URL related data with year and week or month
								var data = getWeekOrMonthAjaxData();

								// add the reservation primary key
								// the event id of the Calendar event is the primary key of the DJANGO reservation database record
								data += '&pk=' + eventId.toString();

								// send ajax to delete
								$.ajax( {
									method: 'post',
									url :  "deleteBooking",
									data: data ,
									async : true,
									success: function(data, status) {
										//console.log ("Data: " + data + "\nStatus: " + status);
										var dataJson = eval(data);

										// remove the event in the daypilot calendar
										var dp = APP.dp;
										if (dp != undefined){
											if (dp.find(eventId.toString())) {
												var event = dp.events.get(eventId.toString());
												if (event != undefined) {
													dp.events.remove(event);
													dp.update();
												}
											}
										}
										// update reservations
										insertReservations(dataJson);
									},
									error: function(data, status) { 
										alert("Error - delete booking: " + status + " SVP veuillez contactez votre administrateur"); 
										loadReservations();
									},
									complete: stopBusyAnimation,
								} );


							} else {
								//console.log ( ' event clicked - it is a modification of a reservation ' );

								var eventId = htmlCollection[0].getAttribute('id');
								//console.log (' event Moved - button OK - id = ' + eventId.toString() );

								// start URL related data with year and week or month
								var data = getWeekOrMonthAjaxData();

								//console.log (' studio selected id = ' + $('#studioSelection').val() );
								var studioPrimaryKey = $('#studioSelection').val();
								data += '&studio=' + studioPrimaryKey ;

								//console.log ( ' song value = ' + $("#songSelection").val() );
								var song = $("#songSelection").val();
								data += '&song=' + encodeURIComponent(song);

								//console.log ( ' hour start = ' + getHourStart() );
								var startingHour = getHourStart();
								data += '&start=' + startingHour;

								//console.log ( ' hour end = ' + getHourEnd() );
								var endingHour = getHourEnd();
								data += '&end=' + endingHour ;

								//console.log ( ' new date = ' + getNewDate() );
								var selectedDate =  getNewDate();
								data += '&date=' + selectedDate ;

								// the event id of the Calendar event is the primary key of the DJANGO reservation database record
								data += "&pk=" + eventId.toString();

								// start sending to the server a modification of a booking - the song is changed
								$.ajax( { 	
									method: 'post',
									url :  "modifyBooking",
									data: data,
									async : true,
									success: function(data, status) {
										//console.log ("Data: " + data + "\nStatus: " + status);
										var dataJson = eval(data);

										var dp = APP.dp;
										if (dp != undefined){
											if (dp.find(eventId.toString())) {
												var event = dp.events.get(eventId.toString());
												if (event != undefined) {
													dp.events.remove(event);
													dp.update();
												}
											}
										}
										// update reservations
										insertReservations(dataJson);
									},
									error: function(data, status) {
										alert("Error - modify booking: " + status + " SVP veuillez contactez votre administrateur"); 
										loadReservations();
									},
									complete: stopBusyAnimation,
								} );

							}							
						}
						$(this).dialog('close');
						// if the checkbox is checked then sent delete to the server

					},
					"Non": function () {
						$(this).dialog('close');
						//console.log ( 'suppression was cancelled !!!');
						$("#dialog-confirm").html('');
						//$(this).remove();
					}
				}
			});
}

/**
 * check if a user is the owner of a reservation
 * @param resaPk
 * @param userId
 * @returns {Boolean}
 */
function isOwnerOfReservation(resaPk, userId) {

	var reservation = getReservation(resaPk);
	if (reservation.fields.made_by === userId) {
		return true;
	}
	return false;
}

/**
 * check if a user is belonging to the staff or is a superuser
 * @param userId
 * @returns {Boolean}
 */
function isStaffOrSuperUser(userId) {

	var user = getUser(userId);
	if (user != undefined) {
		if ((user.fields.is_staff) || (user.fields.is_superuser)) {
			return true;
		}
	}
	return false;
}

/**
 * returns the user (full object) related to a user identifier.
 * user identifier are primary keys from the django backend.
 * @param userId
 * @returns
 */
function getUser(userId) {

	var users = APP.users;
	if (users != undefined) {
		for (var id = 0; id < users.length; id++) {
			var user = users[id];
			if (user.pk == userId) {
				return user;
			}
		}
	}
	return null;
}

/**
 * return the owner of a reservation - providing the reservation Primary Key.
 * The reservation primary key is provided by the django backend.
 * @param resaPk
 * @returns
 */
function getFullNameOwnerOfReservation(resaPk) {

	var userFullName = "";
	var reservation = getReservation(resaPk);
	if (reservation != undefined) {
		var userPk = reservation.fields.made_by;
		userFullName = getUserFullName(userPk);
	}
	return userFullName;
}

/**
 * get the name of the user having a user primary key.
 * The user primary key is provided by the django backend.
 * @param userPk
 * @param users
 * @returns {String}
 */
function getUserFullName(userPk){

	var userFullName = "";
	var users = APP.users;
	if (users != undefined){
		for (var userId = 0; userId < users.length; userId++) {
			var user = users[userId];
			if (user.pk == userPk) {
				userFullName = user.fields.first_name + ' ' + user.fields.last_name;
			}
		}
	}
	return userFullName;
}

/**
 * get the reservation with the given primary key.
 * The reservation primary key is provided by the django backend.
 */
function getReservation(resaPk) {
	//console.log ( ' find reservation with pk = ' + resaPk );
	for (var id = 0 ; id < APP.reservations.length ; id++) {
		if (resaPk == APP.reservations[id].pk ) {
			//console.log (' reservation found ');
			return APP.reservations[id];
		}
	}
	return undefined;
}

/**
 * get the color of a studio
 * @param studioId
 * @returns the background color related to a studio
 */
function getStudioBackColor(studioId) {
	for (var id = 0; id < studiosColors.length ; id++) {
		var studioColor = studiosColors[id];
		if ( studioColor.pk === studioId ) {
			//console.log(' get Studio BackColor = ' + studioColor.backColor);
			return studioColor.backColor;
		}
	}
	return "yellow";
}

/**
 * using the studio name as received from python-django
 * @param studioId
 * @returns
 */
function getStudioName(studioId) {

	var studios = APP.studios;
	if (studios != undefined) {
		for (var id = 0; id < studios.length ; id++) {
			var studio = studios[id];
			if ( studio.pk === studioId ) {
				//console.log(' get Studio name = ' + studio.fields.name);
				return studio.fields.name;
			}
		}
	}
	return "not found";
}

/**
 * this function is responsible for creating the daypilot events.
 */
function addOneReservation( reservation ) {

	var users = APP.users;
	var studios = APP.studios;
	var reservations = APP.reservations;
	var current_user_id = APP.current_user_id;

	//console.log ( ' reservation id= ' + reservations[reservation].pk );
	// for each reservation we add a new row to the table that is inside a Day-Hour cell
	//console.log (reservations[reservation].fields.date_start.toString());

	var date_start = new DayPilot.Date(reservations[reservation].fields.date_start, true);
	var date_end = new DayPilot.Date(reservations[reservation].fields.date_end, true);

	var hours = date_start.getHours();
	//console.log ( ' reservation is at = '+ hours +  ' hours' );

	var studioId = reservations[reservation].fields.studio_key;
	// assume that the id from PostGres are matching the table studioNames defined at the top of this js file
	var studioName = getStudioName(studioId);
	//console.log ( ' studio name = ' + studioName);

	var made_by_id = reservations[reservation].fields.made_by;
	// made_by identifiers are starting at 1 .. n => no need to modify the identifiers
	//var made_by = users[made_by_id].fields.first_name + ' ' + users[made_by_id].fields.last_name;
	var made_by = getUserFullName(made_by_id);

	// use owner of the reservation - to allow modifying a reservation
	// need to strip the name of the studio to suppress space and get a class name
	// need to add a dash between the studio and the reservation name
	// the event id in the Calendar is the primary key of the DJANGO reservation database record
	var event = new DayPilot.Event({
		start: date_start,
		end: date_end,
		id: reservations[reservation].pk.toString(),
		text:  getStudioName(studioId) + ' ' + Dash + ' ' + reservations[reservation].fields.song,
		backColor: getStudioBackColor(studioId),
		cssClass : studioName.replace(" ", ""),
		toolTip: made_by_id,
		barColor: 'yellow',
		resource: studioId,
		song: reservations[reservation].fields.song,
	});

	// update the daypilot
	var dp = APP.dp;
	if (dp != undefined) {
		if (dp.find(reservations[reservation].pk.toString())) {
			dp.events.update(event);
		} else {
			dp.events.add(event);
		}
		dp.update();
	}
}

/**
 * the EXCEL command shall contain year and week or year and month. 
 * This href is related to a django URL (see reservations URLs).
 */
function modifyExcelHref() {
	var dp = APP.dp;
	if (dp != undefined) {
		if (dp instanceof DayPilot.Calendar) {
			// it is a weekly calendar
			var weekNumber = dp.startDate.weekNumberISO();
			var year = $("#year").html();
			var hrefText = "/reservation/excel?year=" + year + "&week=" + weekNumber;
			//console.log( hrefText );
			$("#excel").attr("href", hrefText);

		} else {
			// it is a monthly calendar
			var monthNumber = dp.startDate.getMonth();
			var year = $("#year").html();
			// javascript month 0..11 - python month 1..12
			var hrefText = "/reservation/excel?year=" + year + "&month=" + (monthNumber+1).toString();
			//console.log( hrefText );
			$("#excel").attr("href", hrefText);
		}
	}
}

/**
 * reload existing reservations.
 */
function reloadReservations() {

	// get all reservations
	if (APP.reservations != undefined) {
		var reservations = APP.reservations;

		// add the reservation	
		for (var reservationId = 0; reservationId < reservations.length; reservationId++ ) {
			//alert ( 'studio= ' + reservations[reservation].fields.studio_key + ' date start= ' + reservations[reservation].fields.date_start );
			addOneReservation( reservationId );
		}
	}
	// modify the EXCEL href content => used to launch the creation of an EXCEL file
	modifyExcelHref();
	// update the calendar
	// clear previous reservations -  clear events
	var dp = APP.dp;
	if (dp != undefined) {
		dp.update();
	}
}


/**
 * this function is responsible for managing the insertion of all the reservations
 * with the data received in the Json structure.
 */
function insertReservations(dataJson) {

	// create globals variables
	APP.studios = eval(dataJson['studios']);
	APP.reservations = eval(dataJson['reservations']);
	APP.users = eval(dataJson['users']);
	APP.current_user_id = eval(dataJson['current_user_id']);

	// get all reservations
	var reservations = eval(dataJson['reservations']);

	// add the reservations
	for (var reservationId = 0; reservationId < reservations.length; reservationId++ ) {
		// insert one reservation
		addOneReservation( reservationId );
	}
	// modify the EXCEL href content => used to launch the creation of an EXCEL file
	modifyExcelHref();
	// update the calendar
	// clear previous reservations -  clear events
	var dp = APP.dp;
	if (dp != undefined) {
		dp.update();
	}
	// show hide - periodic weekly reservations insertion button
	// show hide - delete old weekly reservations button
	//showHideWeeklyButtons();
}

/**
 * send request to the server to get list of reservations.
 */
function loadReservations() {

	//console.log ( ' load first list of days ');
	// get the content of the week number
	var dp = APP.dp;
	if (dp != undefined) {

		if (dp instanceof DayPilot.Calendar) {
			// weekly calendar
			var weekNumber = $("#weekNumber").text();
			var year = $("#year").text();

			if ((weekNumber.length>0) && (year.length>0)) {
				//console.log(' loadFirstListOfDays: week number is correctly defined ');

				// use ajax to get the data => after getting the html template
				$.ajax( { 	
					method: 'get',
					url :  "modifyPeriod",
					data: 'year=' + year + '&week=' + weekNumber + '&action=first',
					async : true,
					success: function(data, status) {

						var dataJson = eval(data);
						// initialize only when request is modifyPeriod and action=first
						var dp = APP.dp;
						dp.frenchBankHolidays = dataJson['frenchBankHolidays'];

						$("#weekNumber").text(dataJson['week_number']);
						$("#year").text(dataJson['year']);

						insertReservations(dataJson);
					},
					complete : stopBusyAnimation,
				} );
			}

		} else {
			// monthly calendar
			// get the month - month sent to the server are starting 1 for January - instead of 0 for javascript month
			var monthNumber = dp.startDate.getMonth()+1;
			var year = $("#year").text();

			if ((monthNumber>0) && (year.length>0)) {
				//console.log(' loadFirstListOfDays: week number is correctly defined ');

				// use ajax to get the data => after getting the html template
				$.ajax( { 	
					method: 'get',
					url :  "modifyPeriod",
					data: 'year=' + year + '&month=' + monthNumber.toString() + '&action=first',
					async : true,
					success: function(data, status) {

						var dataJson = eval(data);
						// initialise only when request is modifyPeriod and action=first
						var dp = APP.dp;
						dp.frenchBankHolidays = dataJson['frenchBankHolidays'];

						$("#monthNumber").text(frenchMonths[dataJson['month_number']-1]);
						$("#year").text(dataJson['year']);

						insertReservations(dataJson);
					},
					complete : stopBusyAnimation,
				} );
			}
		}
		// show hide - periodic weekly reservations insertion button
		// show hide - delete old weekly reservations button
		//showHideWeeklyButtons();
	}
}

/**
 * function to toggle from month to week. 
 * Currently this function loads the reservations from the back-end - the server.
 */
function monthWeekToggler() {

	$('a.toggler').click(function(){
		$(this).toggleClass('off');
		if ($(this).hasClass("toggler") && $(this).hasClass("off")) {
			// toggle to month
			var divLabelWeekMonth = document.getElementById("labelWeekMonth");
			if (divLabelWeekMonth != undefined) {
				divLabelWeekMonth.innerHTML = "Mois";
			}

			$("#weekNumber").hide();
			$("#monthNumber").show();

			$(this).html("Hebdomadaire");
			initMonthlyCalendar();

			var dp = APP.dp;
			if (dp != undefined){
				//console.log ( dp.startDate.toString() );
				var monthDiv = document.getElementById("monthNumber");
				if (monthDiv != undefined) {

					monthDiv.innerHTML = frenchMonths[new Date(dp.startDate.toString()).getMonth()];
				}
			}

		} else {
			// toggle to week
			var divLabelWeekMonth = document.getElementById("labelWeekMonth");
			if (divLabelWeekMonth != undefined) {
				divLabelWeekMonth.innerHTML = "Semaine";
			}

			$("#weekNumber").show();
			$("#monthNumber").hide();

			$(this).html("Mensuel");
			initWeeklyCalendar();

			var dp = APP.dp;
			if (dp != undefined){
				//console.log ( dp.startDate.toString() );
				var weekDiv = document.getElementById("weekNumber");
				if (weekDiv != undefined) {

					weekDiv.innerHTML = new Date(dp.startDate.toString()).getWeek();
				}
			}
		}
	});
}

/**
 * delete a reservation as done from context Menu
 * EventId = Id or primary key of the reservation in the django back-end
 */
function deleteReservation (eventId) {

	var dp = APP.dp;
	if (dp != undefined) {

		// start URL related data with year and (week or month)
		var data = getWeekOrMonthAjaxData();

		// add the reservation primary key
		// the event id in the Calendar is the primary key of the DJANGO reservation database record
		data += '&pk=' + eventId.toString();

		// send ajax to delete
		$.ajax( {
			method: 'post',
			url :  "deleteBooking",
			data: data,
			async : true,
			success: function(data, status) {
				//console.log ("Data: " + data + "\nStatus: " + status);
				var dataJson = eval(data);

				// remove the event in the daypilot calendar
				var dp = APP.dp;
				if (dp != undefined){
					if (dp.find(eventId.toString())) {
						var event = dp.events.get(eventId.toString());
						if (event != undefined) {
							dp.events.remove(event);
							dp.update();
						}
					}
				}
				// update other reservations
				insertReservations(dataJson);
			},
			error: function(data, status) { 
				alert("Error - delete booking: " + status + " SVP veuillez contactez votre administrateur"); 
				loadReservations();
			},
			complete: stopBusyAnimation,
		} );
	}
}

/**
 * function used to desable the delete booking in the context menu
 */
function checkUserCanDeleteReservation ( resaPk ){

	var current_user_id = APP.current_user_id;
	if ((isOwnerOfReservation(resaPk.toString(), current_user_id)==false) && (isStaffOrSuperUser(current_user_id)==false)) {
		// delete is not authorised - context menu will be disabled
		return true;
	}
	// context Menu will be enabled
	return false;
}

/**
 * context menu to paste an event whose identifier has been already copied
 * @param cssClassName
 */
function initCalendarPasteContextMenu(cssClassName) {
	//console.log ( ' init weekly or monthly calendar Paste Special Context Menu ');
	
	// Robert - 28 may 2016 - attach context menu
	$.contextMenu( {
		selector 	: 	cssClassName,
		trigger 	: 	'right',
		callback 	: 	function(key, options) {
			var m = "clicked: " + key;
			//window.console && console.log(m) || alert(m);
		},
		items : {
			"modifier" : {
				name : "modifier la réservation",
				icon : "edit",
				disabled : function() {
						return true;
				},
			},
			"sep1" : "---------",
			"copier" : {
				name : "copier la réservation",
				icon : "copy",
				disabled: function(){
					return true;
				},
			},
			"coller" : {
				name : "coller la réservation",
				icon : "paste",
				disabled: function() {
					var eventId = APP.copied_event_id;
					if ((eventId != null) && (eventId != undefined)) {
						var dp = APP.dp;
						if (dp != undefined) {
							if (dp.find(eventId.toString())) {
								var event = dp.events.get(eventId.toString());
								if (event != undefined) {
									//console.log ( ' event id = ' + eventId + ' found...' );
									// return false => disabled = false => menu entry is enabled !!!
									return true;
								}
							}
						}
					}
					// return true => menu disabled = true => menu entry is disabled !!!
					return true;
				},
				callback: function() {
					//console.log( ' create new reservation using copied one= ' + APP.copied_event_id );
				}
			},
			"sep2" : "---------",
			"supprimer" : {
				name : "supprimer la réservation",
				icon : "delete",
				disabled: function() {
					return true;
				}
			},
		},
	} );
}
/**
 * context menu for events of a weekly calendar
 * or of a monthly calendar.
 */
function initCalendarContextMenu(cssClassName){

	// remove previous context menu elements
	$.contextMenu( 'destroy' );

	// Robert - 28 may 2016 - attach context menu
	$.contextMenu( {
		selector 	: 	cssClassName,
		trigger 	: 	'right',
		callback 	: 	function(key, options) {
			var m = "clicked: " + key;
			//window.console && console.log(m) || alert(m);
		},
		items : {
			"modifier" : {
				name : "modifier la réservation",
				icon : "edit",
				callback: function(){
					var dp = APP.dp;
					if (dp != undefined) {
						var eventId = null;
						if ( dp instanceof DayPilot.Calendar) {
							eventId = this.context.offsetParent.data.data.id;
						} else {
							eventId = this.context.offsetParent.event.data.id;
						}
						//console.log ( ' event id = ' + eventId );
						if (dp.find(eventId.toString())) {
							var event = dp.events.get(eventId.toString());
							if (event != undefined) {
								onContextMenuEventModify(event);
							}
						}				
						return true;
					}
				}
			},
			"sep1" : "---------",
			"copier" : {
				name : "copier la réservation",
				icon : "copy",
				disabled: function(){
					var dp = APP.dp;
					if (dp != undefined) {
						var eventId = null;
						if ( dp instanceof DayPilot.Calendar) {
							//console.log ( ' weekly calendar ');
							eventId = this.context.offsetParent.data.data.id;
						} else {
							//console.log ( ' monthly calendar ');
							eventId = this.context.offsetParent.event.data.id;
						}
						//console.log ( ' event id = ' + eventId );
						if (dp.find(eventId.toString())) {
							var event = dp.events.get(eventId.toString());
							if (event != undefined) {
								//console.log ( ' event with id = ' + eventId + ' found !!!');
								APP.copied_event_id = eventId;
								// return false => disabled = false => menu entry is enabled !!!
								// return true => disabled = true => menu entry is disabled !!!
								return true;
							}
						}				
					}
					// return true => disabled = true => menu entry is disabled !!!
					return true;
				}
			},
			"coller" : {
				name : "coller la réservation",
				icon : "paste",
				disabled: function() {
					
					// return true => menu disabled = true => menu entry is disabled !!!
					return true;
				},
				
			},
			"sep2" : "---------",
			"supprimer" : {
				name : "supprimer la réservation",
				icon : "delete",
				disabled: function() {
					var dp = APP.dp;
					if (dp != undefined) {
						var eventId = null;
						if ( dp instanceof DayPilot.Calendar) {
							eventId = this.context.offsetParent.data.data.id;
						} else {
							eventId = this.context.offsetParent.event.data.id;
						}
						// returns true or false and enable or disable the menu item
						return checkUserCanDeleteReservation(eventId);
					}
					return true;
				},
				callback: function(){
					var dp = APP.dp;
					if (dp != undefined) {
						var eventId = null;
						if ( dp instanceof DayPilot.Calendar) {
							eventId = this.context.offsetParent.data.data.id;
						} else {
							eventId = this.context.offsetParent.event.data.id;
						}
						deleteReservation(eventId);
					}
					// return true to close the context menu
					return true; 
				}
			},
		}
	} );
}

/**
 * init a monthly calendar
 */
function initMonthlyCalendar() {

	if (APP.dp != undefined) {
		var dp = APP.dp;
		if (dp != undefined) {
			//console.log( ' dayPilot dispose ');
			$("#dp").empty();
		}
		var dp = new DayPilot.Month("dp");
		dp.startDate = new DayPilot.Date();
		dp.theme = "month_green";
		dp.locale = 'fr-fr';
		dp.api = 2;

		dp.eventMoveHandling = "JavaScript";
		dp.eventMoveToPosition  = true;

		dp.init();
		// define a function that will be called when the event fires
		dp.onEventMoved = onEventMoved;

		// define a function that will be called when the event fires => resize not allowed in monthly
		//dp.onEventResized = onEventResized;

		// event creating
		dp.onTimeRangeSelected = onTimeRangeSelected;

		dp.onEventClicked = onEventClicked;
		//dp.onHeaderClicked = onHeaderClicked;
		// make global variable
		APP.dp = dp;
		loadReservations();
		initCalendarContextMenu('.month_green_event_inner');
		// init monthly calendar for the paste part
		//initCalendarPasteContextMenu('.month_green_cell_inner');
	}
}

/**
 * init a weekly calendar. 
 * This method calls load reservations.
 */
function initWeeklyCalendar() {

	if (APP.dp != undefined) {
		var dp = APP.dp;
		if (dp != undefined) {
			//console.log( ' dayPilot dispose ');
			$("#dp").empty();
		}
		var dp = new DayPilot.Calendar("dp");
		dp.viewType = 'WorkWeek';
		dp.startDate = new DayPilot.Date();

		dp.theme = "calendar_green";
		dp.heightSpec = "BusinessHours";
		//dp.heightSpec = "Full";
		dp.businessBeginsHour = 9;
		//dp.businessBeginsHour = 11;
		dp.businessEndsHour = 19;
		//dp.businessEndsHour = 15;
		dp.headerDateFormat = "dddd dd MMMM yyyy"; // day of week, long format (e.g. "Monday")

		dp.HoverColor = "#FFED95";

		dp.locale = 'fr-fr';
		dp.cellHeight = 20;
		dp.ShowToolTip = true;
		dp.api = 2;

		dp.eventMoveHandling = "JavaScript";
		dp.eventMoveToPosition  = true;

		dp.init();
		// define a function that will be called when the event fires
		dp.onEventMoved = onEventMoved;

		// define a function that will be called when the event fires
		dp.onEventResized = onEventResized;

		// event creating
		dp.onTimeRangeSelected = onTimeRangeSelected;

		dp.onEventClicked = onEventClicked;
		//dp.onHeaderClicked = onHeaderClicked;
		// make global variable
		APP.dp = dp;
		loadReservations();
		// weekly calendar event context menu
		initCalendarContextMenu('.calendar_green_event_inner');
		// init weekly calendar for the paste part
		//initCalendarPasteContextMenu('.calendar_green_cell_inner');
	}
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

/**
 * function called when the document is loaded
 */
function init(){
	//console.log( ' init ' );

	fillIsoWeekAndYear();
	initPeriodChangeButtons();
	monthWeekToggler();

	// hook ajax events
	hookAjaxEvents();

	// save as global variable
	var dp = new DayPilot.Calendar("dp");
	APP.dp = dp;
	initWeeklyCalendar();
}

