var currentQuestionIndex = 0;
var allQuestions;
var name;

 var navCompiledTemplate = Handlebars.compile($("#nav-template").html());  
 var questionCompiledTemplate = Handlebars.compile($("#questions-template").html());  
var resultsCompiledTemplate = Handlebars.compile($("#results-template").html());  
var tweetButtonCompiledTemplate = Handlebars.compile($("#tweet-button-template").html());  
var saveQuizCompiledTemplate = Handlebars.compile($("#save-quiz-template").html());  
var saveSuccessCompiledTemplate = Handlebars.compile($("#save-success-template").html());  
var partialSaveCompiledTemplate = Handlebars.compile($("#partial-quiz-save-template").html());  
var loginCompiledTemplate = Handlebars.compile($("#login-template").html());  
var loginGreetingCompiledTemplate = Handlebars.compile($("#login-greeting-template").html());  
var loadQuizCompiledTemplate = Handlebars.compile($("#load-quiz-template").html());  

loadQuiz();
allowLogin();	

$(document).ready(function(){

	showCurrentQuestion(currentQuestionIndex);

	$("#next").on("click", function(e){
		e.preventDefault();
		$("#greeting").remove();
		if(isValid()){
			$('#alert').html("");

			gradeCurrentQuestion();
			
			if(currentQuestionIndex < allQuestions.length - 1 ){
				currentQuestionIndex++;
				showCurrentQuestion(currentQuestionIndex);
			} else {
				var score = calculateScore();
				var hashtag = "";
				var message = "";
				var imagePath = "";

				if(score >= 5){
					message = "You're so hipster, your wayfarers are melting!";
					imagePath = "img/hipsterHigh5.jpeg";
					hashtage = "SoHipsterNotEvenHipster";
					
				} else if( score >= 3){
					message = "Ooh. It's a close call, man.";
					imagePath = "img/Ooh.gif";
					hashtag = "HipsterAppreciationSociety";
				} else {
					message = "Seems you're pretty normcore.";
					imagePath = "img/normcore.jpg";
					hashtag = "Normcore";
				}

				var resultsData = {
					"score": calculateScore(),
					"message": message,
					"image": imagePath
				}
				$(".container").html(resultsCompiledTemplate(resultsData));

				var URLtoShare = "http://localhost:8888/Hipster-Quiz2.0/";
				var textToShare = "I scored " + score + " on the Cape Town Hipster Quiz!";

				var tweetButtonData = {
					"URL": encodeURIComponent(URLtoShare),
					"text": encodeURIComponent(textToShare),
					"hashtag": encodeURIComponent(hashtag)
				}
				$(".container").after(tweetButtonCompiledTemplate(tweetButtonData));


				$("#save-quiz").on("click", function(){
					$(this).after(saveQuizCompiledTemplate());

					$("#save-button").on("click", function(){
						saveQuiz($("#email").val(), $("#password").val());
						$("#save-user").html(saveSuccessCompiledTemplate());
						$("#save-user").delay(2000).fadeOut(400);
					});
				});
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
		$(this).hide();
		var partialSaveData = {
					"name": name,
				}
		$(this).after(partialSaveCompiledTemplate(partialSaveData));
		
		$("#save-button").on("click", function(){
			saveUser($("#user-name").val());
			$(this).parent().hide();
			$(this).parent().after(saveSuccessCompiledTemplate());
			$(".save-success").delay(2000).fadeOut(400);
			$("#save").delay(2000).fadeIn(400);
		});
	});

	$("#login-link").on("click", function(){
		$(this).parent().html(loginCompiledTemplate());
		$("#login-button").on("click", function(e){
			e.preventDefault();
			var score = loginUser($("#user-email").val(), $("#user-password").val());
			var loginGreetingData = {
				"score": score
			}
			if(score != undefined){
				$(this).parent().html(loginGreetingCompiledTemplate(loginGreetingData));
			}
			
		});
	});

	
	
});

function showCurrentQuestion(index){
	var navData = {
		"currentQuestionNumber":index + 1,
		"totalNumberOfQuestions":allQuestions.length
	};
	// Show nav header (Question x of y)
	$("#nav").html(navCompiledTemplate(navData));
	// Show question html
	$(".questionradios").html(questionCompiledTemplate(allQuestions[index]));
	// Select checkbox if user has clicked before
	if(allQuestions[currentQuestionIndex].selection != -1) {
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

function saveQuiz(email, password){
	if (typeof window.localStorage != "undefined"){
		 var quizResults = {
		 	"email": email,
		 	"password": password,
		 	"quiz": allQuestions
		 }
		 var quizResultsString = JSON.stringify(quizResults);
		 localStorage.setItem("results", quizResultsString);
		 var quizResultsParsed = JSON.parse(localStorage.getItem("results"));		 
	}
}

function allowLogin(){
	if(localStorage.getItem("results") !== null){
		$("#login").show();
	}
}

// function logs user in and returns true when user is logged in 
function loginUser(email, password){
	var quizResultsParsed = JSON.parse(localStorage.getItem("results"));

	if(email == quizResultsParsed.email && password == quizResultsParsed.password){
		allQuestions = quizResultsParsed.quiz;
		var score = calculateScore();
		return score;
	}	
}

function loadQuiz(){
	if($.cookie("data")){
		var cookieValue = JSON.parse($.cookie("data"));
		allQuestions = cookieValue.quiz;
		var loadQuizData = {
			"name": cookieValue.name
		}
		$("h3").after(loadQuizCompiledTemplate(loadQuizData));

		$("h3").find("a").on("click", function(){
			$.removeCookie("data");
			localStorage.removeItem("results");
			location.reload();
		});
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




