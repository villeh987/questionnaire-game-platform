'use strict';

// This file contains javascript

$("#javascript_start").html("[OK] Started executing the javascript file");
$("#javascript_end").html("[WAITING]...this far we haven't reached the end... Maybe you should check dev tools?");

var question_number = 2;
var option_number = 3;
var parent_question_number = 1;

function incrementQuestionNumber() {

	//let question_id =  
	question_number = $("#questions").children().length + 1;


	//console.log( $("#questions").children().last().attr("id") );
	//console.log( question_number );
	//question_number += 1;
}

function getParentQuestionNumber(element) {

	parent_question_number = $("#questions").children().length;
	/*
	let parent_question_id = element.parentElement.id;
	parent_question_number = parent_question_id.slice(parent_question_id.length - 1); */
}

function getOptionNumber(element) {

	let counter = 0;
	$(element).parent().children().each( (i, child) =>{
		if ($(child).is("div") && $(child).find("label").first().text() !== "Max Points") {
			counter += 1;
		}
	} )
	//let last_option_id = $(element).prev().attr("id");
	//option_number = Number(last_option_id.slice(last_option_id.length - 1)) + 1;
	option_number = counter + 1;
}


function getNewOptionNumberOnRemove(element) {
	let parent_question = $(element).parent();;

	let counter = 0;

	$(parent_question).children().each( (i, child) =>{
		if ($(child).is("div") && $(child).find("label").first().text() !== "Max Points") {
			counter += 1;
			if ($(element).attr("id") == $(child).attr("id")) {
				return false;
			}
		}
	} )

	return counter - 1;
}



function addNewQuestion() {


	incrementQuestionNumber();
	const add = `<div class="form-group" id="question${question_number}">
				    <label for="questionInput${question_number}"><b>Question ${question_number}</b></label><span> </span><button type="button" class="btn btn-primary" onclick="removeQuestion(this)"><i class="fas fa-trash-alt"></i></button>
			  		<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter question" name="questions[${question_number}][title]" id="questionInput${question_number}" required="true">  

			  		<br>
					<div class="form-group ml-3">
					    <label for="max_points">Max Points</label>
					    <input type="number" value="2" min="1" class="form-control" name="questions[${question_number}][maxPoints]" id="max_points" required="true">
					</div>

					<div class="form-group ml-5">
						<label for="optionInput1">Option 1</label>
						<div class="input-group mb-3">
						  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${question_number}][options][1][option]" id="optionInput1" required="true">
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
						  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${question_number}][options][2][option]" id="optionInput2" required="true">
							<div class="input-group-append">
							  	<div class="input-group-text"> 		
							    	<input type="checkbox" name="questions[${question_number}][options][2][correctness]" id="correctAnswerCheckbox" aria-label="Checkbox for text input">
									<label for="correctAnswerCheckbox">Correct</label>
								</div>
							</div>
						</div>	
						<label for="hint">Hint (optional):</label>
						<input type="text" class="form-control "name="questions[${question_number}][options][2][hint]" placeholder="Enter hint" id="hint">
					</div>
					<button type="button" class="btn btn-primary" onclick="addNewOption(this)">Add option</button>
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
					<span><button type="button" class="btn btn-primary" onclick="removeOption(this)"><i class="fas fa-times-circle"></i></button></span>
				  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${parent_question_number}][options][${option_number}][option]" required="true">
					<div class="input-group-append">
					  	<div class="input-group-text"> 		
					    	<input type="checkbox" name="questions[${parent_question_number}][options][${option_number}][correctness]" id="correctAnswerCheckbox" aria-label="Checkbox for text input">
							<label for="correctAnswerCheckbox">Correct</label>
						</div>
					</div>
				</div>	
				<label for="hint">Hint (optional):</label>
				<input type="text" class="form-control "name="questions[${parent_question_number}][options][${option_number}][hint]" placeholder="Enter hint" id="hint">
			</div>
			<button type="button" class="btn btn-primary" onclick="addNewOption(this)">Add option</button>`



	$(element).after(add2);
	element.remove();

};

function removeQuestion(element) {

	
	$(element).parent().nextAll().each( (i, el) => {
		console.log(el);
		let question_id_number = Number($(el).attr("id").slice($(el).attr("id").length - 1));  // TODO: laske optionit
		question_id_number -= 1;
		$(el).attr("id", `question${question_id_number}`)
		$(el).children().find("b").text(`Question ${question_id_number}`);
		$(el).find("label").first().attr("for", `questionInput${question_id_number}`);
		$(el).find("input").first().attr("name", `questions[${question_id_number}][title]`);
		$(el).find("input").first().attr("id", `questionInput${question_id_number}`);
		$(el).find("div").first().find("input").attr("name", `questions[${question_id_number}][maxPoints]`);

		$(el).children().each( (i, option) => {
			//console.log(option);
			if ($(option).is("div") && $(option).find("label").first().text() !== "Max Points") {
				

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

	

	let following_options = $(element).parent().parent().parent().nextAll();
	following_options.each( (i, option) => {
		if ($(option).is("div") && $(option).attr("id").includes("option")) {

			let new_option_number = getNewOptionNumberOnRemove(option);
			$(option).attr("id", `option${new_option_number}`);
			$(option).find("label").first().text(`Option ${new_option_number}`);
			$(option).find("label").first().attr("for", `optionInput${new_option_number}`);
			$(option).find("input").first().attr("id", `optionInput${new_option_number}`);

			// Option Name

			let old_name = $(option).find("div").first().find("input").first().attr("name");
			//console.log(old_name);
			let name_pt1 = old_name.slice(0, 21); 
			let name_pt2 = `[${new_option_number}][option]`;
			let new_name = name_pt1 + name_pt2;
			$(option).find("div").first().find("input").first().attr("name", new_name);

			// Correctness name

			let old_corretness = $(option).find("#correctAnswerCheckbox").attr("name");
			//console.log(old_corretness);
			let corr_name_pt1 = old_corretness.slice(0, 21);
			let corr_name_pt2 = `[${new_option_number}][correctness]`;
			let new_correctness = corr_name_pt1 + corr_name_pt2;
			$(option).find("#correctAnswerCheckbox").attr("name", new_correctness);

			// Hint name

			let old_hint_name = $(option).find("input").last().attr("name");
			//console.log(old_hint_name);
			let hint_name_pt1 = old_hint_name.slice(0, 21);
			let hint_name_pt2 = `[${new_option_number}][hint]`;
			let new_hint_name = hint_name_pt1 + hint_name_pt2;
			$(option).find("input").last().attr("name", new_hint_name);
		}
	})

	element.parentElement.parentElement.parentElement.remove();
}

$("#javascript_end").html("[OK] The end of your javascript file was reached. (meaning there were no huge errors) Hopefully your code works too! ");