const bookshelves = [];
const STORAGE_KEY = 'RND_BOOKSHELF';
const SAVED_EVENT = 'saved-bookshelf';
const RENDER_EVENT = 'render-bookshelf';

function isStorageExist() {
  if (typeof(Storage) === 'undefined') {
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
  if (book) {
    book.isComplete = !book.isComplete;
    saveData();
    document.dispatchEvent(new Event(RENDER_EVENT));
  }
}

function removeBook(bookId) {
  const index = findBookIndex(bookId);
  if (index === -1) return;
  bookshelves.splice(index, 1);
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

const makeBook = (bookObject) => {
  const { id, title, author, year, isComplete } = bookObject;
  const container = document.createElement('div');
  container.setAttribute('data-bookid', id);
  container.setAttribute('data-testid', 'bookItem');
  container.classList.add('book-entry');
  const infoContainer = document.createElement('div');
  infoContainer.classList.add('book-info');
  const bookTitle = document.createElement('h3');
  bookTitle.setAttribute('data-testid', 'bookItemTitle');
  bookTitle.innerText = title;
  const bookAuthor = document.createElement('p');
  bookAuthor.setAttribute('data-testid', 'bookItemAuthor');
  bookAuthor.innerText = 'Penulis: ' + author;
  const bookYear = document.createElement('p');
  bookYear.setAttribute('data-testid', 'bookItemYear');
  bookYear.innerText = 'Tahun: ' + year;
  infoContainer.append(bookTitle, bookAuthor, bookYear);
  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('book_action');
  const statusButton = document.createElement('button');
  statusButton.setAttribute('data-testid', 'bookItemIsCompleteButton');
  statusButton.classList.add('btn', 'btn-sm', 'rounded-0');
  if (isComplete) {
    statusButton.classList.add('btn-secondary');
    statusButton.innerHTML = '<i class="bi bi-bookmark-dash"></i>';
    statusButton.title = 'Pindahkan ke Rak Belum selesai dibaca';
  } else {
    statusButton.classList.add('btn-success');
    statusButton.innerHTML = '<i class="bi bi-bookmark-check"></i>';
    statusButton.title = 'Pindahkan ke Rak Selesai dibaca';
  }
  statusButton.addEventListener('click', () => {
    switchBookshelfStatus(id);
    toast(`Buku <b>${title} (${year})</b> berhasil dipindahkan`, 'success');
  });
  const deleteButton = document.createElement('button');
  deleteButton.setAttribute('data-testid', 'bookItemDeleteButton');
  deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'rounded-0');
  deleteButton.innerHTML = '<i class="bi bi-trash"></i>';
  deleteButton.title = 'Hapus Buku';
  deleteButton.addEventListener('click', () => {
    if (confirm(`Apakah kamu yakin ingin menghapus buku ${title} (${year})?`)) {
      removeBook(id);
      toast(`Buku <b>${title} (${year})</b> berhasil dihapus`, 'success');
    }
  });
  const editButton = document.createElement('button');
  editButton.setAttribute('data-testid', 'bookItemEditButton');
  editButton.classList.add('btn', 'btn-secondary', 'btn-sm', 'rounded-0');
  editButton.innerText = 'Edit Buku';
  buttonContainer.append(statusButton, deleteButton, editButton);
  container.append(infoContainer, buttonContainer);
  return container;
};

const searchBook = (keyword) => {
  const bookItems = document.querySelectorAll(".book-entry");
  for (const item of bookItems) {
    const title = item.querySelector("[data-testid='bookItemTitle']");
    if (title.innerText.toUpperCase().includes(keyword.toUpperCase())) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  }
};

const generateId = () => {
  return +new Date();
};

const generateBookshelfObject = (id, title, author, year, isComplete) => {
  return { id, title, author, year, isComplete };
};

function addBookshelf() {
  const bookID = generateId();
  const bookTitle = document.getElementById('bookFormTitle').value;
  const bookAuthor = document.getElementById('bookFormAuthor').value;
  const bookYear = parseInt(document.getElementById('bookFormYear').value);
  const bookIsComplete = document.getElementById('bookFormIsComplete').checked;
  const bookshelfObject = generateBookshelfObject(bookID, bookTitle, bookAuthor, bookYear, bookIsComplete);
  bookshelves.push(bookshelfObject);
  saveData();
  document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', () => {
  const formInputBook = document.getElementById('bookForm');
  const formSearchBook = document.getElementById('searchBook');
  if (isStorageExist()) {
    loadDataFromStorage();
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
  console.log('Data berhasil disimpan.');
});

document.addEventListener(RENDER_EVENT, () => {
  const incompleteBookshelfList = document.getElementById('incompleteBookList');
  const completeBookshelfList = document.getElementById('completeBookList');
  incompleteBookshelfList.innerHTML = '';
  completeBookshelfList.innerHTML = '';
  for (const book of bookshelves) {
    const bookElement = makeBook(book);
    if (book.isComplete) {
      completeBookshelfList.append(bookElement);
    } else {
      incompleteBookshelfList.append(bookElement);
    }
  }
});