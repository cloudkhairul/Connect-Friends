let addBtn = document.querySelector('#addBtn');
let floatingOne = document.querySelector('#floatingOne');
let closeForm = document.querySelector('#closeForm');
let closeDiv = document.querySelector('#closeDiv');

addBtn.addEventListener('click', ()=>{
  floatingOne.style.display = 'flex';
  closeDiv.style.display = 'block';
  
})
closeForm.addEventListener('click', ()=>{
  closeAll()
})

function closeAll() {
  floatingOne.style.display = 'none'
  closeDiv.style.display = 'none'
}









// Import required functions from Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, where } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDhO2LAo7GtB7AREkU5lEwYB013bZW7Nhw",
  authDomain: "connect-friends-01.firebaseapp.com",
  projectId: "connect-friends-01",
  storageBucket: "connect-friends-01.firebasestorage.app",
  messagingSenderId: "973896944976",
  appId: "1:973896944976:web:bf3cd06d06ac729aabf055"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const contactForm = document.getElementById('contactForm');
const contactTableBody = document.getElementById('contactTableBody');

document.addEventListener('DOMContentLoaded', loadContacts);

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  closeAll();

  const name = document.getElementById('name').value.trim();
  const number = document.getElementById('number').value.trim();

  if (name && number) {
    await addContactToDatabase(name, number);
    addContactToTable(name, number, true);

    // Clear form inputs
    document.getElementById('name').value = '';
    document.getElementById('number').value = '';
  }
});

async function addContactToDatabase(name, number) {
  await addDoc(collection(db, 'contacts'), {
    name: name,
    number: number
  });
}

function addContactToTable(name, number, isNew = false, docId = null) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${name}</td>
    <td>${number}</td>
    <td><button class="delete-btn" onclick="deleteContact('${docId}')"><i class="fa-solid fa-xmark"></i></button></td>
  `;

  if (isNew) {
    const q = query(collection(db, 'contacts'), where('name', '==', name), where('number', '==', number));
    getDocs(q).then(snapshot => {
      snapshot.forEach(doc => {
        row.querySelector('button').setAttribute('onclick', `deleteContact('${doc.id}')`);
      });
    });
  }

  contactTableBody.appendChild(row);
}

async function loadContacts() {
  const contactsSnapshot = await getDocs(collection(db, 'contacts'));
  contactsSnapshot.forEach(doc => {
    const contact = doc.data();
    addContactToTable(contact.name, contact.number, false, doc.id);
  });
}

// Define deleteContact globally
window.deleteContact = async function(docId) {
  if (docId) {
    await deleteDoc(doc(db, 'contacts', docId));
    refreshTable();
  }
};

function refreshTable() {
  contactTableBody.innerHTML = '';
  loadContacts();
}





let searchBar = document.getElementById('searchBar');
let navBtn = document.getElementById('navBtn');
let isClose = true
navBtn.addEventListener('click', ()=>{
  if (isClose) {
    searchBar.style.display = 'flex';
    navBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
    isClose = false
  } else {
    searchBar.style.display = 'none';
    navBtn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i>';
    isClose = true
  }
});



// Filter contacts based on search input
const searchInput = document.getElementById('search');
let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', searchContacts);
function searchContacts() {
 const searchTerm = searchInput.value.toLowerCase();

// Get all rows in the table
const rows = contactTableBody.getElementsByTagName('tr');

for (let row of rows) {
  const name = row.cells[0].textContent.toLowerCase();
  const number = row.cells[1].textContent.toLowerCase();

  // Check if name or number contains the search term
  if (name.includes(searchTerm) || number.includes(searchTerm)) {

    row.style.display = ''; // Show row
  } else {
    row.style.display = 'none'; // Hide row
  }
}

}

window.addEventListener('load', ()=>{
  document.getElementById('loading').style.display = 'none'
})