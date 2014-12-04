var currentQuestionIndex = 0;

$(document).ready(function(){
	console.log("doc ready");
	showCurrentQuestion(currentQuestionIndex);
	
	$("#next").on("click", function(e){
		e.preventDefault();
		
		if(isValid()){
			$('#alert').hide();

			gradeCurrentQuestion();
			
			if(currentQuestionIndex < allQuestions.length - 1 ){
				currentQuestionIndex++;
				console.log("current index is " + currentQuestionIndex);
				showCurrentQuestion(currentQuestionIndex);
			} else {
				var score = calculateScore();
				var scoreHTML = "Your score is " + score + ".";
				
				if(score >= 5){
					$('.container').html(scoreHTML + " You're so hipster, your wayfarers are melting!" + "<img src='img/hipsterHigh5.jpeg'>");
				} else if( score >= 3){
					$('.container').html(scoreHTML + " Ooh. It's a close call, man. " + "<img src='img/Ooh.gif'>");
				} else {
					$('.container').html(scoreHTML + " Seems you're pretty normcore. " + "<img src='img/normcore.jpg'>");
				}
			}	
		} else {
			// tell user to select an option 
			$('#alert').html("You need to choose an option to continue.");
			$('#alert').show();
			showCurrentQuestion(currentQuestionIndex);
		}
	});

	$('#back').on("click", function(e){
		e.preventDefault();
		gradeCurrentQuestion();
		if(currentQuestionIndex > 0){
			currentQuestionIndex = currentQuestionIndex - 1;
			showPreviousQuestion(currentQuestionIndex, allQuestions[currentQuestionIndex].selection);
		}
		
	});
	
});

function showCurrentQuestion(index){
	var questionHTMl = "<legend>" + allQuestions[index].question +"</legend>";
	var choicesHTML = '';
	for(var i = 0; i <  allQuestions[index].choices.length; i++){
		choicesHTML += '<label><input type="radio" name="q" value=' + i + '>' + allQuestions[index].choices[i] + '</label>';
	}
	$('.questionradios').html(questionHTMl + choicesHTML);
	if(allQuestions[currentQuestionIndex].selection != -1){
		$(":radio[value=" + allQuestions[currentQuestionIndex].selection +"]").prop("checked", true);
	}
}

function gradeCurrentQuestion(){
	allQuestions[currentQuestionIndex].selection = +$('input[name=q]:checked').val();
	if(allQuestions[currentQuestionIndex].selection == allQuestions[currentQuestionIndex].correctAnswer){
	}
}

function showPreviousQuestion(index, choice){
	showCurrentQuestion(index); // display the question
	$(":radio[value=" + choice +"]").prop("checked", true); // select the radio button the user chose
};

function isValid(){
	//checks if a radio button is selected; returns boolean value 
	if($('input[name=q]:checked').val()){
		return true;
	} else {
		return false;
	}
}

function calculateScore(){
	var score = 0;
	for(var i = 0; i <  allQuestions.length; i++){
		if(allQuestions[i].selection == allQuestions[i].correctAnswer){
			score++;
		}
	}
	return score;
}

var allQuestions = [{question: "Are you a hipster?", choices: ["Yes", "No", "What is a hipster?", "I don't do labels."], correctAnswer:3, selection:-1}, {question: "How do you get around?", choices: ["Car", "Taxi.", "MyCiti bus", "Fixie"], correctAnswer:3, selection:-1}, {question: "When was your last cigarette?", choices: ["I'm smoking one right now.", "I don't smoke", "A few days ago - I only smoke socially", "I don't support the political-industrial cigarette manufacturing complex."], correctAnswer:3, selection:-1}, {question: "Coffee time! Where are you headed?", choices: ["The office kitchen for Ricoffy and Cremora", "The nearest Vida for a skinny mocha frappacino with non-fat whip", "Loading Bay for a flat white", "Deluxe Coffee Works behind the mechanic on Roodehoek st."], correctAnswer:3, selection:-1}, {question: "Did you go to art school?", choices: ["Yes", "no.", "I went to school but dropped out to focus on my craft.", "Who goes to art school?"], correctAnswer:2, selection:-1}, {question: "The word 'deck' means:", choices: ["A wooden stoop.", "A presentation about your company usually given to potential investors.", "Cuttig edge, cool or hip.", "To knock someone out."], correctAnswer:2, selection:-1}];





