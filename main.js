const bookshelves = [];
const STORAGE_KEY = 'RND_BOOKSHELF';
const SAVED_EVENT = 'saved-bookshelf';
const RENDER_EVENT = 'render-bookshelf';

// STORAGE LOGIC
function isStorageExist() {
  if (typeof (Storage) === undefined) {
    toast('Browser kamu tidak mendukung local storage', 'danger');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(bookshelves);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
  if (data !== null) {
    for (const b of data) {
      bookshelves.push(b);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function switchBookshelfStatus(bookId) {
  const book = findBook(bookId);
  book.isComplete = !book.isComplete;
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBook(bookId){
  const todoTarget = findBookIndex(bookId);
  if (todoTarget === -1) return;
  bookshelves.splice(todoTarget, 1);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookId) {
  for (const book of bookshelves) {
    if (book.id === bookId) {
      return book;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in bookshelves) {
    if (bookshelves[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

// DOM LOGIC

const makeBook = (bookObject) => {
  const {id, title, author, year, isComplete} = bookObject;

  const container = document.createElement('article');
  container.setAttribute('id', `book-${id}`);
  container.classList.add('book');

  const infoContainer = document.createElement('div');
  infoContainer.classList.add('book_info');

  const bookTitle = document.createElement('h4');
  bookTitle.classList.add('book_title');
  bookTitle.innerText = title;

  const bookAuthor = document.createElement('p');
  bookAuthor.classList.add('book_author');
  bookAuthor.innerText = `Author: ${author}`;

  const bookYear = document.createElement('p');
  bookYear.classList.add('book_year');
  bookYear.innerText = `Publication Year: ${year}`;

  infoContainer.append(bookTitle, bookAuthor, bookYear);

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('book_action');

  const statusButton = document.createElement('button');
  statusButton.classList.add('btn', 'btn-sm', 'rounded-0');
  statusButton.classList.add(isComplete ? 'btn-secondary' : 'btn-success');
  statusButton.innerHTML = isComplete ? '<i class="bi bi-bookmark-dash"></i>' : '<i class="bi bi-bookmark-check"></i>';
  statusButton.title = 'Tambahkan ke list ' + (isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca');
  statusButton.addEventListener('click', () => {
    switchBookshelfStatus(id);
    toast(`Buku <b>${title} (${year})</b> berhasil dipindahkan ke <i>Rak ${isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</i>`, 'success');
  });
  
  const trashButton = document.createElement('button');
  trashButton.classList.add('btn', 'btn-danger', 'btn-sm', 'rounded-0');
  trashButton.innerHTML = '<i class="bi bi-trash"></i>';
  trashButton.title = 'Hapus buku';
  trashButton.addEventListener('click', () => {
    if(confirm(`Apakah kamu yakin ingin menghapus buku ${title} (${year})?`)){
      removeBook(id);
      toast(`Buku <b>${title} (${year})</b> berhasil dihapus`, 'success');
    }
  });
  
  buttonContainer.append(statusButton, trashButton);

  container.append(infoContainer);
  container.append(buttonContainer);

  return container;
}

const searchBook = (keyword) => {
  const bookItem = document.querySelectorAll(".book");
  for (const item of bookItem) {
      const title = item.querySelector(".book_title");
      if (title.innerText.toUpperCase().includes(keyword.toUpperCase())) {
          title.parentElement.parentElement.style.display = "";
      } else {
          title.parentElement.parentElement.style.display = "none";
      }
  }
};

const generateId = () => {
  return +new Date();
}

const generateBookshelfObject = (id, title, author, year, isComplete) => {
  return {id, title, author, year, isComplete}
}

function addBookshelf() {
  const bookID = generateId();
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = parseInt(document.getElementById('inputBookYear').value);
  const bookIsComplete = document.getElementById('inputBookIsComplete').checked;

  const bookshelfObject = generateBookshelfObject(bookID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  bookshelves.push(bookshelfObject);

  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', () => {
  const formInputBook = document.getElementById('inputBook');
  const formSearchBook = document.getElementById('searchBook');

  if (isStorageExist()) {
    loadDataFromStorage()
  }

  formInputBook.addEventListener('submit', (e) => {
    e.preventDefault();
    addBookshelf();
    e.target.reset();
    toast('Buku berhasil ditambahkan', 'success');
  });

  formSearchBook.addEventListener('input', (e) => {
    e.preventDefault();
    searchBook(e.target.value);
  });
  
  formSearchBook.addEventListener('submit', (e) => {
    e.preventDefault();
  });

});

document.addEventListener(SAVED_EVENT, () => {
  console.log('Data berhasil di simpan.');
});

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
  const completeBookshelfList = document.getElementById('completeBookshelfList');

  // clearing list item
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';

  for (const book of bookshelves) {
    const todoElement = makeBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(todoElement);
    } else {
      incompleteBookshelfList.append(todoElement);
    }
  }
})