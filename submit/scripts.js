document.getElementById('suggestionForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value || 'N/A';
    const suggestion = document.getElementById('suggestion').value;

    const suggestionData = {
        name: name,
        email: email,
        suggestion: suggestion
    };

    try {
        const response = await fetch('https://api.github.com/repos/CellIJel/GPTMade/issues', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_GITHUB_TOKEN'
            },
            body: JSON.stringify({
                title: `Suggestion by ${name}`,
                body: `**Name:** ${name}\n**Email:** ${email}\n**Suggestion:**\n${suggestion}`
            })
        });

        if (response.ok) {
            alert('Suggestion submitted successfully!');
        } else {
            const errorData = await response.json();
            alert(`Failed to submit suggestion: ${errorData.message}`);
        }
    } catch (error) {
        alert('Error submitting suggestion.');
    }
});
