async function translateText(apiType) {
    const sourceLang = document.getElementById('source-lang').value;
    const targetLang = document.getElementById('target-lang').value;
    const inputText = document.getElementById('input-text').value;

    let translatedText = "";

    if (apiType === 'google') {
        // Google Translate API integration (requires an API key)
        const apiKey = 'YOUR_GOOGLE_API_KEY';
        const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: inputText,
                source: sourceLang,
                target: targetLang,
                format: 'text',
            }),
        });
        const data = await response.json();
        translatedText = data.data.translations[0].translatedText;

    } else if (apiType === 'chatgpt') {
        // ChatGPT API integration (requires an OpenAI API key)
        const apiKey = 'YOUR_CHATGPT_API_KEY';
        const url = 'https://api.openai.com/v1/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'gpt-4',
                prompt: `Translate this text from ${sourceLang} to ${targetLang}: ${inputText}`,
                max_tokens: 200,
            }),
        });
        const data = await response.json();
        translatedText = data.choices[0].text.trim();
    }

    // Display the translated text
    document.getElementById('translated-text').textContent = translatedText;
}
