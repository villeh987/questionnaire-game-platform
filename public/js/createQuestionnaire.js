'use strict';

// This file contains javascript

$("#javascript_start").html("[OK] Started executing the javascript file");
$("#javascript_end").html("[WAITING]...this far we haven't reached the end... Maybe you should check dev tools?");

var question_number = 2;
var option_number = 3;
var parent_question_number = 1;

function getQuestionNumber() {

	let question_id =  $("#questions").children().last().attr("id");
	question_number = Number(question_id.slice(question_id.length - 1)) + 1;


	console.log( $("#questions").children().last().attr("id") );
	console.log( question_number );
	//question_number += 1;
}

function incrementOption() {
	question_number += 1;
}

function getParentQuestionNumber(element) {
	let parent_question_id = element.parentElement.parentElement.id;
	parent_question_number = parent_question_id.slice(parent_question_id.length - 1);
}

function getOptionNumber(element) {
	let parent_option_id = element.parentElement.id;
	option_number = Number(parent_option_id.slice(parent_option_id.length - 1)) + 1;
}




function addNewQuestion() {


	getQuestionNumber();
	const add = `	<div class="form-group" id="question${question_number}">
				    <label for="questionInput${question_number}"><b>Question ${question_number}</b></label>
			  		<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter question" name="questions[${question_number}][title]" id="questionInput${question_number}">  

			  		<br>
					<div class="form-group ml-3">
					    <label for="max_points">Max Points</label>
					    <input type="number" value="2" min="1" class="form-control" name="questions[${question_number}][maxPoints]" id="max_points" required="true">
					</div>

					<div class="form-group ml-5">
						<label for="optionInput1">Option 1</label>
						<div class="input-group mb-3">
						  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${question_number}][options][1][option]" id="optionInput1">
							<div class="input-group-append">
							  	<div class="input-group-text"> 		
							    	<input type="checkbox" name="questions[${question_number}][options][1][correctness]" id="correctAnswerCheckbox" aria-label="Checkbox for text input">
									<label for="correctAnswerCheckbox">Correct</label>
								</div>
							</div>
						</div>	
						<label for="hint">Hint (optional):</label>
						<input type="text" class="form-control "name="questions[${question_number}][options][1][hint]" placeholder="Enter hint" id="hint">  
					</div>

					<div class="form-group ml-5" id="option2">
						<label for="optionInput2">Option 2</label>
						<div class="input-group mb-3">
						  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${question_number}][options][2][option]" id="optionInput2">
							<div class="input-group-append">
							  	<div class="input-group-text"> 		
							    	<input type="checkbox" name="questions[${question_number}][options][2][correctness]" id="correctAnswerCheckbox" aria-label="Checkbox for text input">
									<label for="correctAnswerCheckbox">Correct</label>
								</div>
							</div>
						</div>	
						<label for="hint">Hint (optional):</label>
						<input type="text" class="form-control "name="questions[${question_number}][options][2][hint]" placeholder="Enter hint" id="hint">
						<button type="button" class="btn btn-primary" onclick="addNewOption(this)">Add option</button>
					</div>
				</div>`


	$("#questions").append(add);

};

function addNewOption(element) {
	getParentQuestionNumber(element);
	getOptionNumber(element);

	const add2 = `
			<div class="form-group ml-5" id="option${option_number}">
				<label for="optionInput${option_number}">Option ${option_number}</label>
				<div class="input-group mb-3">
				  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${parent_question_number}][options][${option_number}][option]">
					<div class="input-group-append">
					  	<div class="input-group-text"> 		
					    	<input type="checkbox" name="questions[${parent_question_number}][options][${option_number}][correctness]" id="correctAnswerCheckbox" aria-label="Checkbox for text input">
							<label for="correctAnswerCheckbox">Correct</label>
						</div>
					</div>
				</div>	
				<label for="hint">Hint (optional):</label>
				<input type="text" class="form-control "name="questions[${parent_question_number}][options][${option_number}][hint]" placeholder="Enter hint" id="hint">
				<button type="button" class="btn btn-primary" onclick="addNewOption(this)">Add option</button>
			</div>`



	$(element.parentElement.parentElement).append(add2);
	element.remove();

};

function removeQuestion(element) {

	
	$(element).parent().nextAll().each( (i, el) => {
		let question_id_number = Number($(el).attr("id").slice($(el).attr("id").length - 1));
		question_id_number -= 1;
		$(el).attr("id", `question${question_id_number}`)
		$(el).children().find("b").text(`Question ${question_id_number}`);
		$(el).find("label").first().attr("for", `questionInput${question_id_number}`);
		$(el).find("input").first().attr("name", `questions[${question_id_number}][title]`);
		$(el).find("input").first().attr("id", `questionInput${question_id_number}`);
		$(el).find("div").first().find("input").attr("name", `questions[${question_id_number}][maxPoints]`);

		$(el).children().each( (i, option) => {
			if (i > 5 && $(option).is("div")) {
				//console.log(option);

				// Option Name

				let old_name = $(option).find("div").first().find("input").first().attr("name");
				//console.log(old_name);
				let name_pt1 = `questions[${question_id_number}]`;
				let name_pt2 = old_name.slice(12, old_name.length);
				let new_name = name_pt1 + name_pt2;
				$(option).find("div").first().find("input").first().attr("name", new_name);


				// Correctness name

				let old_corretness = $(option).find("#correctAnswerCheckbox").attr("name");
				//console.log(old_corretness);
				let corr_name_pt1 = `questions[${question_id_number}]`;
				let corr_name_pt2 = old_corretness.slice(12, old_corretness.length);
				let new_correctness = corr_name_pt1 + corr_name_pt2;
				$(option).find("#correctAnswerCheckbox").attr("name", new_correctness);

				// Hint name

				let old_hint_name = $(option).find("input").last().attr("name");
				//console.log(old_hint_name);
				let hint_name_pt1 = `questions[${question_id_number}]`;
				let hint_name_pt2 = old_hint_name.slice(12, old_hint_name.length);
				let new_hint_name = hint_name_pt1 + hint_name_pt2;
				$(option).find("input").last().attr("name", new_hint_name);
			}
		})


	}); 

	

	/*$("div[id^='question']").each( (i, el) => {
		if ( Number(el.attr("id").slice(el.attr("id").length - 1)) > element.parentElement.id) 
	}) */
	element.parentElement.remove();
}

function removeOption (element) {

}

$("#javascript_end").html("[OK] The end of your javascript file was reached. (meaning there were no huge errors) Hopefully your code works too! ");