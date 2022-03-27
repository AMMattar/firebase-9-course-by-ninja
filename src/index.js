import { initializeApp } from 'firebase/app';
import {
    getFirestore, collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where, orderBy, serverTimestamp, getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyCpseUZ9sU8ZMN_tCr8hLLHNO8cIuS08Q4",
    authDomain: "fir-9-dojo-7b6ad.firebaseapp.com",
    projectId: "fir-9-dojo-7b6ad",
    storageBucket: "fir-9-dojo-7b6ad.appspot.com",
    messagingSenderId: "2264533508",
    appId: "1:2264533508:web:41fd794097076b507b0351"
  };

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore()
const auth = getAuth()

// collection ref
const colRef = collection(db, 'books')

// queries
const q = query(colRef, orderBy('createdAt', 'desc'))

// get collection data
// getDocs(colRef).then((snapshot) => {
//     let books = []
//     snapshot.docs.forEach((doc) => {
//         books.push({ ...doc.data(), id: doc.id })
//     })
//     console.log(books);
// }).catch(err => {
//     console.log(err.message);
// }) 

//real time data collection
const unsubCol = onSnapshot(q, (snapshot) => {
    let books = []
    snapshot.docs.forEach((doc) => {
        books.push({ ...doc.data(), id: doc.id })
    })
    console.log(books);
})

// adding documents
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    addDoc(colRef, {
        title: addBookForm.title.value ,
        author: addBookForm.author.value,
        createdAt: serverTimestamp()
    }).then(() => {
        addBookForm.reset()
    })
})

// deleting documents
const deleteBookForm = document.querySelector('.delete')
deleteBookForm.addEventListener('submit', (e)=> {
    e.preventDefault()

    const docRef = doc(db, 'books', deleteBookForm.id.value)
    deleteDoc(docRef).then(()=> {
        deleteBookForm.reset()
    })
})

// get a single document
const docRef = doc(db, 'books', 'WHH3hC6UiCrIN7xkzxVA')

// getDoc(docRef).then((doc) => {
//     console.log(doc.data(), doc.id);
// })

const unsubDoc = onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id);
})

//updating a document 
const updateForm = document.querySelector('.update')
updateForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'books', updateForm.id.value)

    updateDoc(docRef, {
        title: 'updated title'
    }).then(() => {
        updateForm.reset()
    })

})

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm.email.value
    const password = signupForm.password.value

    createUserWithEmailAndPassword(auth, email, password).then((cred) => {
        console.log('user created', cred.user);
        signupForm.reset()
    }).catch((err)=> {
        console.log(err.message);
    })
})

// logging in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
    signOut(auth).then(() => {
        console.log('the user signed out');
    }).catch((err) => {
        console.log(err.message);
    })
})

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = loginForm.email.value
    const password = loginForm.password.value

    signInWithEmailAndPassword(auth, email, password).then((cred) => {
        console.log('user logged in:', cred.user);
    }).catch((err) => {
        console.log(err.message);
    })
})

// subscribing to auth changes
const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user);
})

// unsubscribing from changes (auth & db)
const unsubButton = document.querySelector('.unsub')
unsubButton.addEventListener('click', () => {
    console.log('unsubscribing');
    unsubAuth()
    unsubDoc()
    unsubCol()
})