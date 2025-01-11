const fs = require('fs');
const path = require('path');

// Path to the index.html file
const indexPath = path.join(__dirname, 'index.html');

// Read the current content of index.html
let indexContent = fs.readFileSync(indexPath, 'utf-8');

// Find the existing directories in the repository
const directories = fs.readdirSync(__dirname).filter(dir => 
  fs.statSync(path.join(__dirname, dir)).isDirectory() && dir !== '.git' && dir !== 'node_modules' && !dir.startsWith('.github')
);

// Generate the new list items for each directory
const newListItems = directories.map(dir => {
  const dirName = dir.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
  return `<li><a href="https://cellijel.github.io/GPTMade/${dir}/">${dirName}</a></li>`;
}).join('\n');

// Replace the old list items with the new ones within the <div class="div2"> element
indexContent = indexContent.replace(/<div class="div2">([\s\S]*?)<\/div>/, `<div class="div2">\n${newListItems}\n</div>`);

// Write the updated content back to index.html
fs.writeFileSync(indexPath, indexContent, 'utf-8');
