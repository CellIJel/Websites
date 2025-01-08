document.addEventListener('DOMContentLoaded', () => {
    const addNoteButtons = document.querySelectorAll('.add-note');
    addNoteButtons.forEach(button => {
        button.addEventListener('click', addNote);
    });

    const deleteNotesButton = document.querySelector('.delete-notes');
    if (deleteNotesButton) {
        deleteNotesButton.addEventListener('click', deleteAllNotes);
    }

    const exportNotesButton = document.getElementById('export-notes');
    if (exportNotesButton) {
        exportNotesButton.addEventListener('click', exportNotes);
    }

    const importNotesInput = document.getElementById('import-notes');
    if (importNotesInput) {
        importNotesInput.addEventListener('change', importNotes);
    }

    const notesContainers = document.querySelectorAll('.notes');
    notesContainers.forEach(container => {
        container.addEventListener('dragover', dragOver);
        container.addEventListener('drop', drop);
    });
});

function addNote() {
    const noteText = prompt("Enter your note:");
    if (noteText) {
        const note = document.createElement('div');
        note.className = 'note';
        note.textContent = noteText;
        note.setAttribute('draggable', 'true');
        note.addEventListener('dragstart', dragStart);
        note.addEventListener('dragend', dragEnd);
        this.previousElementSibling.appendChild(note);
    }
}

function deleteAllNotes() {
    const doneColumnNotes = document.querySelector('.column:nth-child(3) .notes');
    doneColumnNotes.innerHTML = '';
}

function dragStart(e) {
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
}

function dragEnd(e) {
    e.target.classList.remove('dragging');
}

function dragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(this, e.clientY);
    const dragging = document.querySelector('.dragging');
    if (dragging && afterElement !== dragging) {
        this.insertBefore(dragging, afterElement);
    }
}

function drop(e) {
    e.preventDefault();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.note:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function exportNotes() {
    const notesData = [];
    document.querySelectorAll('.column').forEach((column, columnIndex) => {
        const columnNotes = [];
        column.querySelectorAll('.note').forEach(note => {
            columnNotes.push(note.textContent);
        });
        notesData.push({ columnIndex, notes: columnNotes });
    });

    const dataStr = JSON.stringify(notesData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'notes.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function importNotes(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const notesData = JSON.parse(e.target.result);
            notesData.forEach(({ columnIndex, notes }) => {
                const column = document.querySelector(`.column:nth-child(${columnIndex + 1}) .notes`);
                column.innerHTML = ''; // Clear existing notes
                notes.forEach(noteText => {
                    const note = document.createElement('div');
                    note.className = 'note';
                    note.textContent = noteText;
                    note.setAttribute('draggable', 'true');
                    note.addEventListener('dragstart', dragStart);
                    note.addEventListener('dragend', dragEnd);
                    column.appendChild(note);
                });
            });
        };
        reader.readAsText(file);
    }
}
