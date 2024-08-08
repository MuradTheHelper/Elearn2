let questions = [];
let currentQuestion = 0;
let score = 0;

async function loadQuestions() {
    const response = await fetch('questions.json');
    questions = await response.json();
    shuffleArray(questions);
    showQuestion();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function showQuestion() {
    const question = questions[currentQuestion];
    document.getElementById('question').textContent = question.question;
    
    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.onclick = () => selectOption(index);
        optionsContainer.appendChild(button);
    });
    
    document.getElementById('submit-btn').style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
    document.getElementById('next-btn').style.display = 'none';
    document.getElementById('finish-btn').style.display = 'none';
    document.getElementById('result').textContent = '';
    document.getElementById('progress').textContent = currentQuestion + 1;
}

function selectOption(index) {
    const options = document.getElementById('options').children;

    // Hapus semua kelas yang dipilih sebelumnya
    for (let i = 0; i < options.length; i++) {
        options[i].classList.remove('selected');
    }

    // Tambahkan kelas 'selected' pada opsi yang dipilih
    options[index].classList.add('selected');

    // Nonaktifkan tombol Submit hanya jika opsi belum dipilih
    document.getElementById('submit-btn').disabled = false;
}


function submitAnswer() {
    const selectedOption = document.querySelector('#options button.selected');
    if (!selectedOption) {
        alert('Please select an answer');
        return;
    }
    
    const question = questions[currentQuestion];
    const userAnswer = selectedOption.textContent;
    const isCorrect = userAnswer === question.correctAnswer;
    
    if (isCorrect) {
        score++;
        document.getElementById('result').textContent = 'Correct!';
        document.getElementById('result').style.color = '#27ae60';
        selectedOption.style.backgroundColor = '#a9dfbf';
    } else {
        document.getElementById('result').textContent = `Incorrect. The correct answer is: ${question.correctAnswer}`;
        document.getElementById('result').style.color = '#c0392b';
        selectedOption.style.backgroundColor = '#f5b7b1';
        
        const options = document.getElementById('options').children;
        for (let i = 0; i < options.length; i++) {
            if (options[i].textContent === question.correctAnswer) {
                options[i].style.backgroundColor = '#a9dfbf';
                break;
            }
        }
    }
    
    const options = document.getElementById('options').children;
    for (let i = 0; i < options.length; i++) {
        options[i].disabled = true;
    }
    
    document.getElementById('submit-btn').style.display = 'none';
    
    if (currentQuestion < 9) {
        document.getElementById('next-btn').style.display = 'block';
    } else {
        document.getElementById('finish-btn').style.display = 'block';
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < 10) {
        showQuestion();
    } else {
        showSummary();
    }
}

function showSummary() {
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('progress-container').style.display = 'none';
    document.getElementById('summary-container').style.display = 'block';
    document.getElementById('score').textContent = score;
    
    const recommendation = document.getElementById('recommendation');
    if (score < 6) {
        recommendation.textContent = 'You should focus on improving your overall English skills. Try reviewing basic grammar rules, vocabulary, and practicing more.';
    } else if (score < 9) {
        recommendation.textContent = 'Good job! To improve further, practice more complex sentence structures, expand your vocabulary, and challenge yourself with advanced English materials.';
    } else {
        recommendation.textContent = 'Excellent work! Keep challenging yourself with advanced English materials and practice speaking regularly to maintain your proficiency.';
    }
}

function restartQuiz() {
    currentQuestion = 0;
    score = 0;
    shuffleArray(questions);
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('progress-container').style.display = 'block';
    document.getElementById('summary-container').style.display = 'none';
    showQuestion();
}

document.getElementById('submit-btn').addEventListener('click', submitAnswer);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
document.getElementById('finish-btn').addEventListener('click', showSummary);
document.getElementById('restart-btn').addEventListener('click', restartQuiz);

loadQuestions();