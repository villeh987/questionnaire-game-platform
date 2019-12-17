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
	let parent_question = $(element).parent();

	let counter = 0;

	$(parent_question).children().each( (i, child) =>{
		if ($(child).is("div") && $(child).find("label").first().text() !== "Max Points") {
			counter += 1;
			if (element == child) {
				return false;
			}
		}
	} )

	return counter - 1;
}

function getNewQuestionNumberOnRemove(element) {

    let questions = $(element).parent();
    let counter = 0;
    $(questions).children().each( (i, child) =>{
        if ($(child).is("div")) {
            counter += 1;
            
            if (element == child) {
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
					    <input type="number" value="2" min="1" class="form-control" name="questions[${question_number}][maxPoints]" required="true">
					</div>

					<div class="form-group ml-5">
						<label for="optionInput1">Option 1</label>
						<div class="input-group mb-3">
						  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${question_number}][options][1][option]" id="optionInput1" required="true">
							<div class="input-group-append">
							  	<div class="input-group-text"> 		
							    	<input class="correct-answer-checkbox" type="checkbox" name="questions[${question_number}][options][1][correctness]" aria-label="Checkbox for text input">
									<label for="correctAnswerCheckbox">Correct</label>
								</div>
							</div>
						</div>	
						<label for="hint">Hint (optional):</label>
						<input type="text" class="form-control option-hint" name="questions[${question_number}][options][1][hint]" placeholder="Enter hint">  
					</div>

					<div class="form-group ml-5" id="option2">
						<label for="optionInput2">Option 2</label>
						<div class="input-group mb-3">
						  	<input type="text" class="form-control" aria-label="Text input with checkbox" placeholder="Enter option" name="questions[${question_number}][options][2][option]" id="optionInput2" required="true">
							<div class="input-group-append">
							  	<div class="input-group-text"> 		
							    	<input class="correct-answer-checkbox" type="checkbox" name="questions[${question_number}][options][2][correctness]" aria-label="Checkbox for text input">
									<label for="correctAnswerCheckbox">Correct</label>
								</div>
							</div>
						</div>	
						<label for="hint">Hint (optional):</label>
						<input type="text" class="form-control option-hint" name="questions[${question_number}][options][2][hint]" placeholder="Enter hint">
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
					    	<input class="correct-answer-checkbox" type="checkbox" name="questions[${parent_question_number}][options][${option_number}][correctness]" aria-label="Checkbox for text input">
							<label for="correctAnswerCheckbox">Correct</label>
						</div>
					</div>
				</div>	
				<label for="hint">Hint (optional):</label>
				<input type="text" class="form-control option-hint" name="questions[${parent_question_number}][options][${option_number}][hint]" placeholder="Enter hint">
			</div>
			<button type="button" class="btn btn-primary" onclick="addNewOption(this)">Add option</button>`



	$(element).after(add2);
	element.remove();

};

function removeQuestion(element) {

	
	$(element).parent().nextAll().each( (i, el) => {
		//console.log(el);
		let question_id_number = getNewQuestionNumberOnRemove(el);  // TODO: laske optionit
		//question_id_number -= 1;
		$(el).attr("id", `question${question_id_number}`)
		$(el).children().find("b").text(`Question ${question_id_number}`);
		$(el).find("label").first().attr("for", `questionInput${question_id_number}`);
		$(el).find("input").first().attr("name", `questions[${question_id_number}][title]`);
		$(el).find("input").first().attr("id", `questionInput${question_id_number}`);
		$(el).find("div").first().find("input").attr("name", `questions[${question_id_number}][maxPoints]`);

		$(el).children().each( (i, option) => {
			//console.log("optio", option);
			if ($(option).is("div") && $(option).find("label").first().text() !== "Max Points") {
				

				// Option Name

				let option_name = $(option).find("div").first().find("input").first().attr("name");
                option_name = option_name.replace(/questions\[\d*\]/, `questions[${question_id_number}]`);
				$(option).find("div").first().find("input").first().attr("name", option_name);


				// Correctness name

				let correctness_name = $(option).find($(".correct-answer-checkbox")).attr("name");
				correctness_name = correctness_name.replace(/questions\[\d*\]/, `questions[${question_id_number}]`);
				$(option).find($(".correct-answer-checkbox")).attr("name", correctness_name); 

				// Hint name

				let hint_name = $(option).find($(".form-control.option-hint")).attr("name");
				hint_name = hint_name.replace(/questions\[\d*\]/, `questions[${question_id_number}]`);
				$(option).find($(".form-control.option-hint")).attr("name", hint_name);
			}
		})


	}); 

	
	element.parentElement.remove();

}

function removeOption (element) {

	

	let following_options = $(element).parent().parent().parent().nextAll();
	following_options.each( (i, option) => {
		if ($(option).is("div") && $(option).attr("id").includes("option")) {


			let new_option_number = getNewOptionNumberOnRemove(option);
            //console.log(new_option_number);
			$(option).attr("id", `option${new_option_number}`);
			$(option).find("label").first().text(`Option ${new_option_number}`);
			$(option).find("label").first().attr("for", `optionInput${new_option_number}`);
			$(option).find("input").first().attr("id", `optionInput${new_option_number}`);

			// Option Name

			let option_name = $(option).find("div").first().find("input").first().attr("name");
			option_name = option_name.replace(/\[\d*\]\[option\]/, `[${new_option_number}][option]`); 
			$(option).find("div").first().find("input").first().attr("name", option_name);

			// Correctness name

			let correctness_name = $(option).find($(".correct-answer-checkbox")).attr("name");
			correctness_name = correctness_name.replace(/\[\d*\]\[correctness\]/, `[${new_option_number}][correctness]`); 
			$(option).find($(".correct-answer-checkbox")).attr("name", correctness_name); 

			// Hint name

			let hint_name = $(option).find($(".form-control.option-hint")).attr("name");
			hint_name = hint_name.replace(/\[\d*\]\[hint\]/, `[${new_option_number}][hint]`)
			$(option).find($(".form-control.option-hint")).attr("name", hint_name);
		}
	})

	element.parentElement.parentElement.parentElement.remove();
}

$("#javascript_end").html("[OK] The end of your javascript file was reached. (meaning there were no huge errors) Hopefully your code works too! ");