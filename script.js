var currentQuestionIndex = 0;
var allQuestions;
var name;

loadQuiz();

$(document).ready(function(){
	$("#totalQuestions").html(allQuestions.length);
	showCurrentQuestion(currentQuestionIndex);
	
	$("#next").on("click", function(e){
		e.preventDefault();
		
		if(isValid()){
			$('#alert').html("");

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
			$('#alert').hide().html("You need to choose an option to continue.").fadeIn('slow ');
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

	$("#save").on("click", function(){
		var saveHTML = '<div id="save-user"><input type="text" value="' + name + '" placeholder="Your name" id="user-name"><button id="save-button">Save Quiz</button></div>';
		$(this).after(saveHTML);
		$("#save-button").on("click", function(){
			saveUser($("#user-name").val());
		});
	});

	
	
});

function showCurrentQuestion(index){
	$("#currentQuestion").html(index + 1);
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

function saveUser(name){
	gradeCurrentQuestion();
	var cookieData = {
		"name": name,
		"quiz": allQuestions
	}
	var cookieString = JSON.stringify(cookieData);
	$.cookie("data", cookieString);
}

function loadQuiz(){
	if($.cookie("data")){
		var cookieValue = JSON.parse($.cookie("data"));
		name = cookieValue.name;
		allQuestions = cookieValue.quiz;
		$("h3").after("Hi " + name + ". Welcome back to Hipster Quiz 2.0!");
	} else {
		loadFromData();
	}
}


function loadFromData() {
	allQuestions = (function () {
	    var json = null;
	    $.ajax({
	        'async': false,
	        'global': false,
	        'url': "questions.json",
	        'dataType': "json",
	        'success': function (data) {
	            json = data;
	        }
	    });
	    return json;
	})(); 	
}




