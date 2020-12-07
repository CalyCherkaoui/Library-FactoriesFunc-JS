const myLibrary = localStorage.getItem('myLibrary') ? JSON.parse(localStorage.getItem('myLibrary')) : [];
let count = localStorage.getItem('count') ? JSON.parse(localStorage.getItem('count')) : 0;

function findBook(index) {
  let min = 0;
  let max = myLibrary.length - 1;
  let i = Math.floor((min + max) / 2);
  let found = false;
  while (min <= max && !found) {
    found = myLibrary[i].count === index;
    if (!found) {
      if (myLibrary[i].count > index) {
        max = i - 1;
      } else {
        min = i + 1;
      }
      i = Math.floor((min + max) / 2);
    }
  }
  return i;
}

function changeReadStatus(i) {
  myLibrary[i].read = !myLibrary[i].read;
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function removeFromLibrary(index) {
  const i = findBook(index);
  myLibrary.splice(i, 1);
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

// Book.prototype.addBookToPage = function show() {
function addBookToPage(title, author, pageNums, read, libcount) {
  const table = document.querySelector('table');
  const row = document.createElement('tr');
  row.setAttribute('id', `row_${libcount}`);
  const titleTd = document.createElement('td');
  titleTd.textContent = title;
  row.appendChild(titleTd);

  const authorTd = document.createElement('td');
  authorTd.textContent = author;
  row.appendChild(authorTd);

  const pageNumsTd = document.createElement('td');
  pageNumsTd.textContent = pageNums;
  row.appendChild(pageNumsTd);

  const readTd = document.createElement('td');
  const readBtn = document.createElement('button');
  readBtn.classList.add('reading_status');
  console.log( typeof(read));
  console.log( read );
  readBtn.textContent = ( read ? 'Already Read!' : 'Not Read Yet!' );

  readBtn.setAttribute('id', `read_${libcount}`);
  readBtn.dataset.indexNumber = libcount;
  readTd.appendChild(readBtn);
  row.appendChild(readTd);

  readBtn.addEventListener('click', (e) => {
    const index = e.target.dataset.indexNumber;
    const i = findBook(index);
    changeReadStatus(i);
    e.target.textContent = (myLibrary[i].read ? 'Already Read!' : 'Not Read Yet!');
  });

  const removeTd = document.createElement('td');
  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove_book');
  removeBtn.textContent = 'Delete';
  removeTd.appendChild(removeBtn);
  row.appendChild(removeTd);
  table.appendChild(row);

  removeBtn.setAttribute('id', `delete_${libcount}`);
  removeBtn.dataset.indexNumber = libcount;
  removeBtn.addEventListener('click', (e) => {
    const index = e.target.dataset.indexNumber;
    removeFromLibrary(index);
    const table = document.querySelector('table');
    const target = document.querySelector(`#row_${index}`);
    table.removeChild(target);
  });
}

const addBookToLibrary = (title, author, pageNums, read = false) => {
  count = +1;
  myLibrary.push({
    title, author, pageNums, read,
  });
  addBookToPage(title, author, pageNums, read, count);
};

function dispalybooks(arr) {
  for (let i = 0; i < arr.length; i += 1) {
    addBookToPage(arr[i].title, arr[i].author, arr[i].pageNums, arr[i].read);
  }
}

// Adding Book button
const addBookBtn = document.querySelector('#addbook_btn');
addBookBtn.addEventListener('click', () => {
  const addBookForm = document.querySelector('#addbook_form');
  addBookForm.classList.toggle('hide_element');
});

const cancelBookBtn = document.querySelector('#cancel_book_data');
cancelBookBtn.addEventListener('click', () => {
  const addBookForm = document.querySelector('#addbook_form');
  addBookForm.classList.toggle('hide_element');
});

const submitBtn = document.querySelector('#submit_book_data');
submitBtn.addEventListener('click', () => {
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  let pagesnum = document.querySelector('#pagesnum').value;
  pagesnum = parseInt(pagesnum, 10);
  let read = document.querySelector('input[name="read"]:checked').value;
  read = read === 'true';
  addBookToLibrary(title, author, pagesnum, read);
  const addBookForm = document.querySelector('#addbook_form');
  addBookForm.classList.toggle('hide_element');
  localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
  localStorage.setItem('count', JSON.stringify(count));
});

dispalybooks(myLibrary);
