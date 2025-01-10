const fs = require('fs');
const path = require('path');

// Path to the root index.html file
const indexPath = path.join(__dirname, 'index.html');

// Get all directories in the root of the repository
const directories = fs.readdirSync(__dirname, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
  .map(dirent => dirent.name);

// Read the current content of the index.html
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Find the position to insert new links (e.g., before </body>)
const insertionPoint = indexContent.indexOf('</body>');

// Generate new links for each directory
const newLinks = directories.map(dir => `<a href="https://cellijel.github.io/GPTMade/${dir}/">${dir}</a><br>`).join('\n');

// Create the updated content for index.html
const updatedContent = [
  indexContent.slice(0, insertionPoint),
  newLinks,
  indexContent.slice(insertionPoint)
].join('');

// Write the updated content to index.html
fs.writeFileSync(indexPath, updatedContent, 'utf-8');
