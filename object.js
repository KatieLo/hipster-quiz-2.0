
function inheritPrototype(childObject, parentObject) {
    // As discussed above, we use the Crockford’s method to copy the properties and methods from the parentObject onto the childObject​
​    // So the copyOfParent object now has everything the parentObject has ​
    var copyOfParent = Object.create(parentObject.prototype);
​
    //Then we set the constructor of this new object to point to the childObject.​
​    // Why do we manually set the copyOfParent constructor here, see the explanation immediately following this code block.​
    copyOfParent.constructor = childObject;
​
    // Then we set the childObject prototype to copyOfParent, so that the childObject can in turn inherit everything from copyOfParent (from parentObject)​
   childObject.prototype = copyOfParent;
}

​function Question(theQuestion, theChoices, theCorrectAnswer) {
    // Initialize the instance properties​
    this.question = theQuestion;
    this.choices = theChoices;
    this.correctAnswer = theCorrectAnswer;
    this.userAnswer = "";
​
    var newDate = new Date(),
        QUIZ_CREATED_DATE = newDate.toLocaleDateString();
    this.getQuizDate = function () {
        return QUIZ_CREATED_DATE;
    };
​
​// A confirmation message that the question was created​
    console.log("Quiz Created On: " + this.getQuizDate());
​
}

// Define the prototype methods that will be inherited​
Question.prototype.getCorrectAnswer = function () {
    return  this.correctAnswer;
};
​
Question.prototype.getUserAnswer = function () {
    return this.userAnswer;
};
​
Question.prototype.displayQuestion = function () {
    var questionToDisplay = "<div class='question'>" + this.question + "</div><ul>";
        choiceCounter = 0;
​
    this.choices.forEach(function (eachChoice)  {
        questionToDisplay += '<li><input type="radio" name="choice" value="' + choiceCounter + '">' + eachChoice + '</li>';
        choiceCounter++;
    });
    questionToDisplay += "</ul>";
​
    console.log (questionToDisplay);

    /*var navData = {
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
    }*/
}; 

Child Questions

// Create the MultipleChoiceQuestion​
​function MultipleChoiceQuestion(theQuestion, theChoices, theCorrectAnswer){
​// For MultipleChoiceQuestion to properly inherit from Question, here inside the MultipleChoiceQuestion constructor, we have to explicitly call the Question constructor​
​// passing MultipleChoiceQuestion as the this object, and the parameters we want to use in the Question constructor:​
    Question.call(this, theQuestion, theChoices, theCorrectAnswer);
};
inheritPrototype(MultipleChoiceQuestion, Question);

// Create the DragDropQuestion​
​function DragDropQuestion(theQuestion, theChoices, theCorrectAnswer) {
    Question.call(this, theQuestion, theChoices, theCorrectAnswer);
}
​
​// inherit the methods and properties from Question​
​inheritPrototype(DragDropQuestion, Question);

// Override the displayQuestion method it inherited​
DragDropQuestion.prototype.displayQuestion = function () {
    // Just return the question. Drag and Drop implementation detail is beyond this article​
    console.log(this.question);
};

// Initialize some questions and add them to an array​
​var allQuestions = [
​new MultipleChoiceQuestion("Who is Prime Minister of England?", ["Obama", "Blair", "Brown", "Cameron"], 3),
   
​new MultipleChoiceQuestion("What is the Capital of Brazil?", ["São Paulo", "Rio de Janeiro", "Brasília"], 2),
   
​new DragDropQuestion("Drag the correct City to the world map.", ["Washington, DC", "Rio de Janeiro", "Stockholm"], 0)
];
​
​// Display all the questions​
allQuestions.forEach(function (eachQuestion)  {
    eachQuestion.displayQuestion();
});

