var currentQuestionIndex = 0;
var allQuestions;
var name;

loadQuiz();
allowLogin();

$(document).ready(function(){
	$("#totalQuestions").html(allQuestions.length);

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
				var scoreHTML = "Your score is " + score + ".";
				var hashtag = "";
				if(score >= 5){
					$('.container').html(scoreHTML + " You're so hipster, your wayfarers are melting!" + "<img src='img/hipsterHigh5.jpeg'>");
					hashtag = "soHipsterNotEvenHipster";
				} else if( score >= 3){
					$('.container').html(scoreHTML + " Ooh. It's a close call, man. " + "<img src='img/Ooh.gif'>");
					hashtag = "HipsterAppreciationSociety";
				} else {
					$('.container').html(scoreHTML + " Seems you're pretty normcore. " + "<img src='img/normcore.jpg'>");
					hashtag = "normcore";
				}
				var URLtoShare = "http://localhost:8888/Hipster-Quiz2.0/";
				var textToShare = "I scored " + score + " on the Cape Town Hipster Quiz!";
				var tweetButton = '<a id="tweet-score" target="_blank" href="https://twitter.com/share?url=' + encodeURIComponent(URLtoShare) + '&hashtags=' + encodeURIComponent(hashtag) + '&text=' + encodeURIComponent(textToShare) + '">Tweet Your Score</a>';
				$('.container').after('<button id="save-quiz">Save my results</button>' + tweetButton);

				$("#save-quiz").on("click", function(){
					var saveHTML = '<div id="save-user"><input type="email" value="" placeholder="Email address" id="email"><input type="text" value="" placeholder="Password" id="password"><button id="save-button">Save Results</button></div>';
					$(this).after(saveHTML);
					$("#save-button").on("click", function(){
						saveQuiz($("#email").val(), $("#password").val());
						$("#save-user").html("<div id='save-success'>Quiz results saved!</div>");
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
		var saveHTML = '<div id="save-user"><input type="text" value="' + name + '" placeholder="Your name" id="user-name"><button id="save-button">Save Quiz</button></div>';
		$(this).after(saveHTML);
		$("#save-button").on("click", function(){
			saveUser($("#user-name").val());
			$(this).parent().hide();
			$(this).parent().after("<div id='save-success'>Quiz saved!</div>");
			$("#save-success").delay(2000).fadeOut(400);
			$("#save").delay(2000).fadeIn(400);
		});
	});

	$("#login-link").on("click", function(){
		
		$(this).parent().html("<input id='user-email' type='email' placeholder='Email address'><input id='user-password' type='password' placeholder='password'><button id='login-button' type='submit'>Login</button>");
		$("#login-button").on("click", function(e){
			e.preventDefault();
			var score = loginUser($("#user-email").val(), $("#user-password").val());
			var loginGreetingHTML = "<h3> Your previous score was " + score + "</h3>";
			if(score != undefined){
				$(this).parent().html(loginGreetingHTML);
			}
			
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
		name = cookieValue.name;
		allQuestions = cookieValue.quiz;
		var greetingHTML = "<h3 id='greeting'>Hi " + name + ". Welcome back to Hipster Quiz 2.0! <a href='#'> Not " + name +" ? Reset Quiz</a></h3>";
		$("h3").after(greetingHTML);

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




