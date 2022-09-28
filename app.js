import notes from './storage.js';

//Element creation
const getNotes = (note, archiveClass, archive) => {
    let {name, created, category, content, dates, id} = note;
    dates = getDates(content);
        return `
        <div class="container-row">
            <div class="table-row">
                <div>${name}</div>
                <div>${created}</div>
                <div class="${category} category">${category}</div>
                <div>${content}</div>
                <div>${dates}</div>
                <div>
                    <button class="edit_button">Edit</button>
                    <button class=${archiveClass} id=${id}>${archive}</button>
                    <button class="delete_button" id=${id}>Delete</button>
                </div>
            </div>
        </div>
    `;
};

//Render tables
const tableActive = document.querySelector('.table-active');
const tableArchive = document.querySelector('.table-archive');

function renderNotes(note) {
    for (let i = 0; i < note.length; i++) {
        if (note[i].archived) {
            tableArchive.insertAdjacentHTML("beforeend", getNotes((note[i]), 'unarchive_button', 'Archive'));
        } else {
            tableActive.insertAdjacentHTML("beforeend", getNotes((note[i]), 'archive_button', 'Archive'));
        }
    }
};
renderNotes(notes);

//Dynamic notes
let dynamicNotes = notes;
//Add note
const formHandler = document.querySelector('.form');

const createNote = (name, category, content) => {
    const newNote = {
        name,
        category,
        content,
    };
    newNote.created = getCurrentDate();
    newNote.dates = getDates(content);
    newNote.archived = false;
    newNote.id = dynamicNotes.length + 1;

    dynamicNotes.push(newNote);
    console.log(dynamicNotes)

    categoryCount();
    return newNote;
};

const addNote = (e) => {
    e.preventDefault();

    const name = e.currentTarget.name.value;
    const category = e.currentTarget.category.value;
    const content = e.currentTarget.content.value;

    const newRow = createNote(name, category, content);
    const newElement = document.querySelector('.table-active');
    newElement.insertAdjacentHTML("beforeend", getNotes(newRow, 'archive_button', 'Archive'));

};

formHandler.addEventListener('submit', addNote);

//Current date
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
      year: "numeric",
      month: "long",
      day: "numeric"
  };
  return currentDate.toLocaleDateString('en-US', options);
};

//Dates from text
function getDates(text) {
 const regex = /^[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}$/;
 let dates = [];
 text.split(' ').forEach(s => {
     let date = s.match(regex);
    if(date) {
        dates.push(date)
    }
 })
    return dates.join(', ');
};

//Edit note
// function edit(e) {
//     if (e.target.className === 'edit_button') {
//         let currentValue = e.currentTarget.name.value;
//         console.log(currentValue)
//     };
// };
// table.addEventListener('click', edit);

//Delete note
function del(e) {
    if (e.target.className === 'delete_button') {
        let item = e.target.parentNode.parentNode.parentNode;
        item.parentNode.removeChild(item);
        let delNote = dynamicNotes.filter(el => el.id === Number(e.target.id));
        dynamicNotes = dynamicNotes.filter(el => el.id !== Number(e.target.id));
        //categoryCount([delNote[0].category, 0, 0]);
        rerenderSummary([delNote[0].category, 0, 0]);
    };
};
tableActive.addEventListener('click', del);
tableArchive.addEventListener('click', del);

//Archive note
function archive(e) {
    if (e.target.className === 'archive_button') {
        let item = e.target.parentNode.parentNode.parentNode;
        document.querySelector('.table-active').removeChild(item);
        //let archNote = dynamicNotes.filter(el => el.id === Number(e.target.id));
        for (let i = 0; i < dynamicNotes.length; i++) {
          if (dynamicNotes[i].id === Number(e.target.id)) {
              dynamicNotes[i].archived = true;
              rerenderSummary([dynamicNotes[i].category, 0, 0]);
          }
        };
        e.target.className = 'unarchive_button';
        e.target.innerHTML = 'Unarchive';
        document.querySelector('.table-archive').appendChild(item);
    };
};
tableActive.addEventListener('click', archive);

//Unarchive note
function unArchive(e) {
    if (e.target.className === 'unarchive_button') {
        let item = e.target.parentNode.parentNode.parentNode;
        document.querySelector('.table-archive').removeChild(item);
        //let unarchNote = dynamicNotes.filter(el => el.id === Number(e.target.id));
        for (let i = 0; i < dynamicNotes.length; i++) {
            if (dynamicNotes[i].id === Number(e.target.id)) {
                dynamicNotes[i].archived = false;
                rerenderSummary([dynamicNotes[i].category, 0, 0]);
            }
        };
        e.target.className = 'archive_button';
        e.target.innerHTML = 'Archive';
        document.querySelector('.table-active').appendChild(item);
    };
};
tableArchive.addEventListener('click', unArchive);


//summary table
const taskItems = ['Task', 0, 0];
const thoughtItems = ['Random Thought', 0, 0];
const ideaItems = ['Idea', 0, 0];

function categoryCount(category) {
    let arr = category;
    for (let i = 0; i < dynamicNotes.length; i++) {
        if (dynamicNotes[i].category === arr[0]) {
            if (dynamicNotes[i].archived) {
                arr[2]++;
            }
            if (!dynamicNotes[i].archived) {
                arr[1]++;
            }
        }
    }
    console.log(arr)
    return arr;
};


const renderSummary = (note) => {
    let [category, active, archive] = note;
    console.log(note)
    return `
    <div class="container-row">
    <div class="table-row">
        <div>${category}</div>
        <div class="active-count">${active}</div>
        <div class="archive-count">${archive}</div>
    </div>
    </div>
    `;
};
const tableSummary = document.querySelector('.table-summary');
tableSummary.insertAdjacentHTML('beforeend', renderSummary(categoryCount(taskItems)));
tableSummary.insertAdjacentHTML('beforeend', renderSummary(categoryCount(thoughtItems)));
tableSummary.insertAdjacentHTML('beforeend', renderSummary(categoryCount(ideaItems)));

const rerenderSummary = (category) => {
    let arri = categoryCount(category);
    let activeCount = document.querySelector('.active-count')
    activeCount.innerHTML = arri[1]
    let archiveCount = document.querySelector('.archive-count')
    archiveCount.innerHTML = arri[2]
};

