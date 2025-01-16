// script.js

// Function to set a cookie
function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Morse code dictionary including letters, numbers, and common symbols
const morseCode = {
    'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
    'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
    'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
    'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
    'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', 
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': '/', '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
    '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
    ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-',
    '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.'
};

const textToMorse = (text) => {
    return text.toUpperCase().split('').map(char => morseCode[char] || char).join(' ');
};

const morseToText = (morse) => {
    const morseToChar = Object.keys(morseCode).reduce((obj, char) => {
        obj[morseCode[char]] = char;
        return obj;
    }, {});
    return morse.split(' ').map(symbol => morseToChar[symbol] || symbol).join('');
};

const translate = () => {
    const input = document.getElementById('inputBox').value;
    if (input.includes('.') || input.includes('-')) {
        document.getElementById('outputBox').value = morseToText(input);
    } else {
        document.getElementById('outputBox').value = textToMorse(input);
    }
};

const toggleDarkMode = () => {
    document.documentElement.classList.toggle('dark-mode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (document.documentElement.classList.contains('dark-mode')) {
        darkModeIcon.textContent = '🌙';
        setCookie('theme', 'dark', 30); // Set cookie for 30 days
    } else {
        darkModeIcon.textContent = '☀️';
        setCookie('theme', 'light', 30); // Set cookie for 30 days
    }
};

document.getElementById('darkModeToggle').addEventListener('change', toggleDarkMode);

// Ensure the correct icon is set when the page loads based on the initial state
window.addEventListener('DOMContentLoaded', () => {
    const darkModeIcon = document.getElementById('darkModeIcon');
    const theme = getCookie('theme');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        darkModeIcon.textContent = '🌙';
        document.getElementById('darkModeToggle').checked = true;
    } else {
        darkModeIcon.textContent = '☀️';
    }

    // Check if the user has visited the site before
    if (!localStorage.getItem('visited')) {
        // Show the tooltip
        const tooltip = document.getElementById('tooltip');
        tooltip.style.display = 'block';
        // Set a timeout to hide the tooltip after a few seconds
        setTimeout(() => {
            tooltip.style.display = 'none';
            // Remove the tooltip from the DOM
            tooltip.remove();
        }, 5000);
        // Mark the user as having visited
        localStorage.setItem('visited', 'true');
    } else {
        // Remove the tooltip from the DOM if the user has visited before
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }

    // Add event listener to translate input in real-time
    document.getElementById('inputBox').addEventListener('input', translate);
});
