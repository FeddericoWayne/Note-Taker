// declarations of variables
let noteTitle;
let noteText;
let saveNoteBtn;
let newNoteBtn;
let noteList;


// selects elements in notes.html
if (window.location.pathname === '/notes.html') {
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
  activeListItem = document.querySelector('.list-group-item');
}

// show an element
const show = (elem) => {
  elem.style.display = 'inline';
}; 

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote = {};

// GET request to retrieve latest notes
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  })

// POST request to update notes database
const saveNote = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

// DELETE request to remove note from note database
const deleteNote = (id) =>
  
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);

  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = (e) => {

  e.preventDefault();
  // assgins a 4-digit random string to a variable for new note
  const randomId = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1)

  // adds date and time info to save in note database
  const date = new Date();
  // assigns new note content and unique id to an obj variable
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
    date: `${date}`,
    id: randomId
  };



  // chained functions to save the new note and update the note listing
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
// TODO: fix bug that makes note undeletable when "No Saved Note" has been clicked
const handleNoteDelete = (e) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();

  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  // chained functions to delete clicked note and update note listing
  deleteNote(noteId).then(() => {
    
    getAndRenderNotes();
    renderActiveNote();

  });
};

// Sets the activeNote and displays it
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// Sets the activeNote to an empty object and allows the user to enter a new note
const handleNewNoteView = (e) => {
  e.preventDefault();
  activeNote = {};
  renderActiveNote();
};

// only shows the save button if both note title and note text are not empty
const handleRenderSaveBtn = () => {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();

  if (window.location.pathname === '/notes.html') {
    noteList.forEach((el) => (el.innerHTML = ""));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  // when no saved list item is present, display "No Saved Notes" instead
  if (jsonNotes.length === 0) {
    const emptyList = createLi('No Saved Notes', false);
    emptyList.setAttribute("style","cursor:auto; user-select:none");

    noteListItems.push(emptyList);

  }

  // assembles array of note titles for rendering
  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    // stores note content in data attribute
    li.dataset.note = JSON.stringify(note);
    noteListItems.push(li);
  });

  // renders notes on note.html
  if (window.location.pathname === '/notes.html') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);


if (window.location.pathname === '/notes.html') {
  // event listener to handle note saving 
  saveNoteBtn.addEventListener('click', handleNoteSave);
  // event listener to handle new note entry function
  newNoteBtn.addEventListener('click', handleNewNoteView);
  // event listener for note title and text
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
}

// retrieves existing notes and renders note list on page load
getAndRenderNotes(); 
