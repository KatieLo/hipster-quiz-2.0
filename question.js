/*
Object representing a question and related functions
------
*/

function Question(theQuestion, theChoices, theCorrectAnswer, theIndex, theSelection) {
    // Initialize the instance properties​
    this.question = theQuestion;
    this.choices = theChoices; // Array
    this.correctAnswer = theCorrectAnswer;
    this.selection = theSelection;
    this.index = theIndex;
    var newDate = new Date(),
        QUIZ_CREATED_DATE = newDate.toLocaleDateString();

    this.getQuizDate = function () {
        return QUIZ_CREATED_DATE;
    };
    // A confirmation message that the question was created​
    console.log("Question Created On: " + this.getQuizDate());
}

// Define the prototype methods that will be inherited​
Question.prototype.getCorrectAnswer = function () {
    return this.correctAnswer;
};
Question.prototype.getUserAnswer = function () {
    return this.userAnswer;
};
// Display the on the page
Question.prototype.displayQuestion = function () {
    var navData = {
        "currentQuestionNumber":this.index + 1,
        "totalNumberOfQuestions":allQuestions.length
    };
    // Show nav header (Question x of y)
    $("#nav").html(navCompiledTemplate(navData));
    // Show question html
    $(".questionradios").html(questionCompiledTemplate(this));
    // Select checkbox if user has clicked before
    if(this.selection != -1) {
        $(":radio[value=" + this.selection +"]").prop("checked", true);
    }
};

// Save current question selection
Question.prototype.saveSelection = function() {
    // body...
    var selection = +$('input[name=q]:checked').val();
    allQuestions[this.index] = selection;
};