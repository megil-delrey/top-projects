const tbody = document.querySelector("tbody");
const addDialog = document.querySelector(".add-dialog");
const deleteDialog = document.querySelector(".delete-dialog");
const showAddDialogBtn = document.querySelector(".show-add-dialog-btn");
const closeAddDialogBtn = addDialog.querySelector(".cancel-btn");
const closeDeleteDialogBtn = deleteDialog.querySelector(".cancel-btn");
const deleteBtn = deleteDialog.querySelector(".delete-btn");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const readingStatusInput = document.querySelector("#reading-status");
const dateOptions = { month: "short", day: "numeric", year: "numeric" };

const library = [
    {
        id: crypto.randomUUID(),
        title: "Chrome Shelled Regios",
        author: "Shuusuke Amagi",
        startDate: new Date(2006, 2, 18),
        endDate: new Date(2013, 8, 20),
        readingStatus: "reading"
    },
    {
        id: crypto.randomUUID(),
        title: "The Irregular at Magic High School",
        author: "Tsutomu Satou",
        startDate: new Date(2011, 6, 8),
        endDate: new Date(2020, 8, 10),
        readingStatus: "completed"
    }
];

function Book(id, title, author, startDate, endDate, readingStatus) {
    this.id = id;
    this.title = title;
    this.author = author;
    this.startDate = startDate;
    this.endDate = endDate
    this.readingStatus = readingStatus;
}

function addBookToLibrary(id, title, author, startDate, endDate, readingStatus) {
    const book = new Book(...arguments);
    library.push(book);
}

// Display books as rows in table
function displayBooks() {
    tbody.innerHTML = "";
    library.forEach(book => {
        const startDate = book.startDate !== "" ? book.startDate.toLocaleDateString("en", dateOptions) : ""; 
        const endDate = book.endDate !== "" ? book.endDate.toLocaleDateString("en", dateOptions) : "";
        // Insert a row for the book
        tbody.insertAdjacentHTML("beforeend", `
            <tr data-id=${book.id}>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${startDate}</td>
                <td>${endDate}</td>
                <td>
                    <select>
                        <option value="untracked">Untracked</option>
                        <option value="reading">Reading</option>
                        <option value="plan-to-read">Plan to read</option>
                        <option value="completed">Completed</option>
                        <option value="dropped">Dropped</option>
                    </select>
                </td>
                <td><button class="show-delete-dialog-btn">Delete</button></td>
            </tr>
        `);

        const select = tbody.querySelector(`tr[data-id="${book.id}"] select`);
        
        // Set select's value to readingStatus of book 
        select.value = book.readingStatus;
        
        select.addEventListener("change", () => {
            book.readingStatus = select.value;
            displayBooks();
        });
        
        // Pass book id to delete dialog's delete button when clicking delete button inside row
        tbody.querySelector(`tr[data-id="${book.id}"] .show-delete-dialog-btn`).addEventListener("click", () => {
            deleteDialog.showModal();
            deleteBtn.dataset.id = book.id;
        });
    });
}

showAddDialogBtn.addEventListener("click", () => {
    addDialog.showModal();
});

closeAddDialogBtn.addEventListener("click", () => {
    addDialog.close();
});

addDialog.addEventListener("submit", () => {
    const startDate = startDateInput.value !== "" ? new Date(startDateInput.value) : "";
    const endDate = endDateInput.value !== "" ? new Date(endDateInput.value) : "";
    addBookToLibrary(
        crypto.randomUUID(),
        titleInput.value,
        authorInput.value,
        startDate,
        endDate,
        readingStatusInput.value
    );
    addDialog.querySelector("form").reset();
    displayBooks();
    
});

closeDeleteDialogBtn.addEventListener("click", () => {
    deleteDialog.close();
});

deleteBtn.addEventListener("click", () => {
    const index = library.findIndex(book => book.id === deleteBtn.dataset.id)
    library.splice(index, 1);
    deleteDialog.close();
    displayBooks();
});

displayBooks();
