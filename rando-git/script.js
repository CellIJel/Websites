// This file fetches a random GitHub repository and updates the HTML to display its details.

document.addEventListener('DOMContentLoaded', function() {
    const repoInfo = document.getElementById('repo-info');
    const viewRepoButton = document.getElementById('view-repo-button');
    const newRepoButton = document.getElementById('new-repo-button');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const tooltip = document.getElementById('dark-mode-tooltip');
    const clearHistoryButton = document.getElementById('clear-history');
    let currentRepoUrl = '';
    let seenRepos = JSON.parse(localStorage.getItem('seenRepos') || '[]');

    // Check if dark mode was enabled in previous visit
    if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark-mode');
    }

    // Show tooltip if it's the first visit
    if (!localStorage.getItem('darkModeClicked')) {
        tooltip.classList.add('visible');
    }

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark-mode');
        
        // Save dark mode preference
        if (document.documentElement.classList.contains('dark-mode')) {
            localStorage.setItem('darkMode', 'enabled');
        } else {
            localStorage.setItem('darkMode', 'disabled');
        }
        
        // Hide tooltip and save to localStorage
        tooltip.classList.remove('visible');
        localStorage.setItem('darkModeClicked', 'true');
    });

    clearHistoryButton.addEventListener('click', () => {
        seenRepos = [];
        localStorage.setItem('seenRepos', JSON.stringify(seenRepos));
        fetchRandomRepo(); // Fetch a new repo after clearing history
    });

    function fetchRandomRepo() {
        const apiUrl = 'https://api.github.com/repositories';
        repoInfo.innerHTML = '<p>Loading repository...</p>';

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (!data || data.length === 0) {
                    repoInfo.innerHTML = '<p>No repositories found.</p>';
                    return;
                }

                // Filter out previously seen repos
                const unseenRepos = data.filter(repo => !seenRepos.includes(repo.id));

                if (unseenRepos.length === 0) {
                    repoInfo.innerHTML = '<p>You\'ve seen all available repositories! Clear history to start over.</p>';
                    return;
                }

                const randomRepo = unseenRepos[Math.floor(Math.random() * unseenRepos.length)];
                
                // Add the repo ID to seen repos
                seenRepos.push(randomRepo.id);
                localStorage.setItem('seenRepos', JSON.stringify(seenRepos));

                currentRepoUrl = randomRepo.html_url;
                repoInfo.innerHTML = `
                    <h2>${randomRepo.name}</h2>
                    <p>${randomRepo.description || 'No description available'}</p>
                `;
            })
            .catch(error => {
                repoInfo.innerHTML = `<p>Error loading repository: ${error.message}</p>`;
            });
    }

    viewRepoButton.addEventListener('click', function() {
        if (currentRepoUrl) {
            window.open(currentRepoUrl, '_blank');
        }
    });

    newRepoButton.addEventListener('click', fetchRandomRepo);

    fetchRandomRepo();
});
