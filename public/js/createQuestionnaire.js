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


console.log("loaded");





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

$("#javascript_end").html("[OK] The end of your javascript file was reached. (meaning there were no huge errors) Hopefully your code works too! ");