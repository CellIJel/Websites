let currentIssue = null;
let correctRepoIndex = null;
let wins = 0;
let losses = 0;
let canGuess = true;
let timerInterval = null;
const shownIssues = new Set(JSON.parse(sessionStorage.getItem('shownIssues') || '[]'));

document.addEventListener("DOMContentLoaded", () => {
    if (getCookie("dark-mode") === "true") {
        document.body.classList.add("dark-mode");
    }
    loadGame();
});

async function fetchRandomRepositories() {
    try {
        const response = await fetch('https://api.github.com/repositories');
        const repositories = await response.json();

        const filteredRepositories = repositories.filter(repo => 
            !repo.name.toLowerCase().includes('scan reminder') &&
            !repo.description?.toLowerCase().includes('scan reminder')
        );

        return filteredRepositories.sort(() => 0.5 - Math.random()).slice(0, 3);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        return [];
    }
}

async function fetchIssue(repo) {
    try {
        const response = await fetch(`https://api.github.com/repos/${repo.full_name}/issues`);
        const issues = await response.json();
        return issues.find(issue => 
            !shownIssues.has(issue.id) && 
            !issue.user.login.includes('bot') && 
            issue.user.login !== 'ghost'
        ) || null;
    } catch (error) {
        console.error('Error fetching issues:', error);
        return null;
    }
}

async function loadGame() {
    try {
        canGuess = true;
        clearInterval(timerInterval);
        document.getElementById('result').textContent = '';
        document.getElementById('issue-title').textContent = 'Loading issue...';
        document.getElementById('issue-description').textContent = '';
        const timerElement = document.getElementById('timer');
        timerElement.textContent = '';

        const randomRepos = await fetchRandomRepositories();
        if (randomRepos.length === 0) {
            throw new Error('No repositories available');
        }

        correctRepoIndex = Math.floor(Math.random() * 3);
        currentIssue = await fetchIssue(randomRepos[correctRepoIndex]);

        while (!currentIssue) {
            randomRepos[correctRepoIndex] = (await fetchRandomRepositories())[0];
            currentIssue = await fetchIssue(randomRepos[correctRepoIndex]);
        }

        shownIssues.add(currentIssue.id);
        sessionStorage.setItem('shownIssues', JSON.stringify(Array.from(shownIssues)));

        const blurredRepoTitle = currentIssue.title.replace(new RegExp(randomRepos[correctRepoIndex].name, 'gi'), '_____');
        document.getElementById('issue-title').textContent = blurredRepoTitle;
        document.getElementById('issue-description').textContent = currentIssue.body || 'No description provided.';
        const buttons = document.querySelectorAll('.option-button');
        buttons.forEach((button, index) => {
            button.textContent = randomRepos[index].full_name;
        });
    } catch (error) {
        console.error('Error loading game:', error);
        document.getElementById('issue-title').textContent = 'Failed to load issue. Please try again.';
    }
}

function checkAnswer(selectedIndex) {
    if (!canGuess) return;
    canGuess = false;
    const resultElement = document.getElementById('result');
    const correctRepoName = document.querySelectorAll('.option-button')[correctRepoIndex].textContent;
    if (selectedIndex === correctRepoIndex) {
        resultElement.innerHTML = `Correct! The issue belongs to <a href="https://github.com/${correctRepoName}" target="_blank">${correctRepoName}</a>`;
        resultElement.style.color = 'green';
        wins++;
    } else {
        resultElement.innerHTML = `Wrong! The correct answer is <a href="https://github.com/${correctRepoName}" target="_blank">${correctRepoName}</a>`;
        resultElement.style.color = 'red';
        losses++;
    }
    updateScore();
    startTimer();
}

function updateScore() {
    document.getElementById('score').textContent = `Wins: ${wins} | Losses: ${losses}`;
}

function startTimer() {
    const timerElement = document.getElementById('timer');
    let timeLeft = 5;
    timerElement.textContent = `Next question in: ${timeLeft}`;
    timerInterval = setInterval(() => {
        timeLeft--;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            loadGame();
        } else {
            timerElement.textContent = `Next question in: ${timeLeft}`;
        }
    }, 1000);
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    setCookie("dark-mode", document.body.classList.contains("dark-mode"), 365);
}

function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}
