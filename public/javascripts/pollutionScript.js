let questions = [];
const questionElement = document.getElementById('question');
const answerButton = document.getElementById('answer-button');
const validateButton = document.getElementById('validation-button');

let currentQuestionIndex = 0;
let score = 0;

// Load questions from the API
fetch('/api/quiz/pollution')
    .then(response => response.json())
    .then(data => {
        questions = data;
        startQuiz();
    })
    .catch(() => {
        questionElement.innerHTML = 'Error loading quiz.';
    });

// Initialize the quiz
function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    validateButton.innerHTML = 'Validate';
    showQuestion();
}

// Show the current question
function showQuestion() {
    resetQuiz();
    const currentQuestion = questions[currentQuestionIndex];
    questionElement.innerHTML = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;

    // Display all answer options
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn');
        answerButton.appendChild(button);
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
    });
}

// Clear current question and answers
function resetQuiz(){
    validateButton.style.display = 'none';
    while(answerButton.firstChild){
        answerButton.removeChild(answerButton.firstChild);
    }
}

// Handle answer selection
function selectAnswer(element){
    const selectedButton = element.target;
    const isCorrect = selectedButton.dataset.correct === 'true';
    if(isCorrect){
        selectedButton.classList.add('correct');
        score++;
    }else{
        selectedButton.classList.add('incorrect');
    }
    Array.from(answerButton.children).forEach(button => {
        button.disabled = true;
    })
    validateButton.style.display = 'block';
}

// Display final score
function showScore(){
    resetQuiz();
    if (score < questions.length){
        questionElement.innerHTML = `${score} out of ${questions.length} - Too bad, not perfect.`;
        validateButton.innerHTML = 'Try Again';
        validateButton.style.fontSize = '20px'; 
        validateButton.style.display = 'block';
    }else{
        questionElement.innerHTML = `[${score} out of ${questions.length}] PERFECT!`;
    }
    
    // Send score to server if user is logged in
    if (document.cookie.includes('userId')) {
        sendScoreToServer(score);
    }
}

// Send score if user is logged in
function sendScoreToServer(score) {
    if (document.cookie.includes('userId')) {
        fetch('/updatePoints', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ score }),
            credentials: 'include'
        });
    }
}

// Move to next question
function handleNextButton(){
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

// Button click handler
validateButton.addEventListener('click', ()=>{
    if (currentQuestionIndex < questions.length){
        handleNextButton();
    }else{
        startQuiz();
    }
});

// Load questions when the page loads
document.addEventListener('DOMContentLoaded', fetchQuestions);

