document.addEventListener("DOMContentLoaded", () => {
    const wordContainer = document.getElementById("word-container");
    const typingArea = document.getElementById("typing-area");
    const result = document.getElementById("result");
    const logList = document.getElementById("log-list");
    const toggleThemeButton = document.getElementById("toggle-theme");

    // Fetch words and phrases from english_1k.json
    let wordsAndPhrases = [];
    fetch('https://raw.githubusercontent.com/monkeytypegame/monkeytype/master/frontend/static/languages/english_1k.json')
        .then(response => response.json())
        .then(data => {
            wordsAndPhrases = data.words;
            startTest();
        });

    let currentWord = "";
    let lastWord = "";
    let startTime;
    let log = [];

    // Function to get a random word/phrase from the array
    function getRandomWordOrPhrase() {
        let newWord;
        do {
            const randomIndex = Math.floor(Math.random() * wordsAndPhrases.length);
            newWord = wordsAndPhrases[randomIndex];
        } while (newWord === lastWord);
        lastWord = newWord;
        return newWord;
    }

    function startTest() {
        if (wordsAndPhrases.length === 0) return;
        currentWord = getRandomWordOrPhrase();
        wordContainer.textContent = currentWord;
        typingArea.value = "";
        typingArea.focus();
        startTime = new Date();
    }

    function endTest() {
        const endTime = new Date();
        const timeTaken = (endTime - startTime) / 1000; // time in seconds
        const typedText = typingArea.value.trim();
        const isCorrect = typedText === currentWord;
        result.textContent = isCorrect ? `Correct! Time taken: ${timeTaken} seconds` : "Incorrect. Try again!";
        if (isCorrect) {
            log.push({ word: currentWord, time: timeTaken });
            if (log.length > 5) {
                log.shift();
            }
            updateLog();
            startTest();
        }
    }

    function updateLog() {
        logList.innerHTML = "";
        log.forEach(entry => {
            const li = document.createElement("li");
            li.textContent = `${entry.word}: ${entry.time} seconds`;
            logList.appendChild(li);
        });
    }

    typingArea.addEventListener("input", () => {
        if (typingArea.value.trim() === currentWord) {
            endTest();
        }
    });

    toggleThemeButton.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
    });
});