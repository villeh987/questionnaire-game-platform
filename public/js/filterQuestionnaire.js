'use strict';


// Search, where all Questionnaire cards are filtered based on given string.
// Only those Questionnaires that contain given search string are shown.
$(document).ready( ()=> {
	$("#questionnaireSearch").on("keyup", function() {
		let search = $(this);
		let criteria = search.val().toLowerCase();
		$(".card").filter( function() {
			$(this).toggle($(this).text().toLowerCase().indexOf(criteria) > -1);
		});
	});
});