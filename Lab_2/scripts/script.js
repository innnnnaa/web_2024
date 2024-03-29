const form = document.getElementById('surveyForm');
const surveysKey = 'surveys';

form.addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData(form);
    let data = {};

    for (const [key, value] of formData.entries()) {
        data[key] = value;
    }

    let surveys = JSON.parse(localStorage.getItem('surveys')) || [];
    surveys.push(data);
    localStorage.setItem('surveys', JSON.stringify(surveys));

    form.reset();
    displaySurveyResults();
});

function getAllSurveys() //отримання всіх опитувань, що зберігаються в локальному сховищі
{ 
    return JSON.parse(localStorage.getItem(surveysKey)) || [];
}

function displaySurveyResults() //відображення статистики опитування на веб-сторінці
{
    const surveys = getAllSurveys();
    const footballLovers = surveys.filter(survey => survey.favoriteSport && survey.favoriteSport.includes('Football')).length;
    const sportered = surveys.filter(survey => parseInt(survey.timeSpentOnSports) > 5).length;
    const totalRespondents = surveys.length;

    const resultsDiv = document.getElementById('surveyResults');
    resultsDiv.innerHTML = `
        <p>Football lovers: ${footballLovers}</p>
        <p>The most sporty: ${sportered}</p>
        <p>Total respondents: ${totalRespondents}</p>
      `;
}

displaySurveyResults(); 

document.addEventListener('DOMContentLoaded', function () {
    fetch('scripts/test.json')
        .then(response => response.json())
        .then(data => {
            buildQuiz(data.questions);
            document.getElementById('submitBtn').addEventListener('click', () => showResults(data.questions));
        })
        .catch(error => console.error('Error fetching quiz data:', error));
});

function buildQuiz(questions) {
    const quizContainer = document.getElementById('quiz');
    let output = '';

    questions.forEach((question, index) => {
        output += `<div class="question">${index + 1}. ${question.question}</div>`;
        output += `<div class="options">`;

        question.answers.forEach(answer => {
            output += `<label><input type="radio" name="question${index}" value="${answer.answer}">${answer.answer}</label>`;
        });

        output += `</div>`;
    });

    quizContainer.innerHTML = output;
}

function showResults(questions) {
    const resultContainer    = document.getElementById('result');
    const answerContainers = document.querySelectorAll('.options');
    let correctAnswers = 0;

    questions.forEach((question, index) => {
        const userAnswer = Array.from(answerContainers[index].querySelectorAll('input[name="question' + index + '"]')).find(input => input.checked)?.value;
        const correctAnswer = question.answers.find(answer => answer.isCorrect)?.answer;
        if (userAnswer === correctAnswer) {
            correctAnswers++;
            answerContainers[index].style.color = 'green';
        } else {
            answerContainers[index].style.color = 'red';
        }
    });

    resultContainer.textContent = `You got ${correctAnswers} out of ${questions.length} questions correct!`;
}

function toggleMenu() {
    let navbar = document.querySelector('.navbar');
    navbar.classList.toggle('active');
}