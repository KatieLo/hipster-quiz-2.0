var currentQuestionIndex = 0;
var score = 0;

$(document).ready(function(){
	showCurrentQuestion(currentQuestionIndex);
	$("button").on("click", function(e){
		e.preventDefault();
		gradeCurrentQuestion();
		if(currentQuestionIndex < allQuestions.length - 1 ){
			currentQuestionIndex++;
			showCurrentQuestion(currentQuestionIndex);
		} else {
			var scoreHTML = "Your score is " + score + ".";
			
			if(score == 6){
				$('.container').html(scoreHTML + " You're so hipster, your wayfarers are melting!" + "<img src='img/hipsterHigh5.jpeg'>");
			} else if( score >= 3){
				$('.container').html(scoreHTML + " Ooh. It's a close call, man. " + "<img src='img/Ooh.gif'>");
			} else {
				$('.container').html(scoreHTML + " Seems you're pretty normcore. " + "<img src='img/normcore.jpg'>");
			}
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
}

function gradeCurrentQuestion(){
	if(+$('input[name=q]:checked').val() == allQuestions[currentQuestionIndex].correctAnswer){
		score++;
		console.log(score);
	}
}

var allQuestions = [{question: "Are you a hipster?", choices: ["Yes", "No", "What is a hipster?", "I don't do labels."], correctAnswer:3}, {question: "How do you get around?", choices: ["Car", "Taxi.", "MyCiti bus", "Fixie"], correctAnswer:3}, {question: "When was your last cigarette?", choices: ["I'm smoking one right now.", "I don't smoke", "A few days ago - I only smoke socially", "I don't support the political-industrial cigarette manufacturing complex."], correctAnswer:3}, {question: "Coffee time! Where are you headed?", choices: ["The office kitchen for Ricoffy and Cremora", "The nearest Vida for a skinny mocha frappacino with non-fat whip", "Loading Bay for a flat white", "Deluxe Coffee Works behind the mechanic on Roodehoek st."], correctAnswer:3}, {question: "Did you go to art school?", choices: ["Yes", "no.", "I went to school but dropped out to focus on my craft.", "Who goes to art school?"], correctAnswer:2}, {question: "The word 'deck' means:", choices: ["A wooden stoop.", "A presentation about your company usually given to potential investors.", "Cuttig edge, cool or hip.", "To knock someone out."], correctAnswer:2}];





