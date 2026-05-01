// ads.js

// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } 
  from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot } 
  from "https://www.gstatic.com/firebasejs/12.12.1/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDpICFMrUy8uYXJxJHx3i9cZ_xpfh_adJQ",
  authDomain: "ryanracers-b9665.firebaseapp.com",
  projectId: "ryanracers-b9665",
  storageBucket: "ryanracers-b9665.firebasestorage.app",
  messagingSenderId: "543694465821",
  appId: "1:543694465821:web:cf0e95bfa580a8c000cff4",
  measurementId: "G-673TW6ENZ7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Auth functions
window.signUp = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then(userCredential => console.log("Signed up:", userCredential.user))
    .catch(error => console.error(error.message));
};

window.signIn = function() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(userCredential => console.log("Signed in:", userCredential.user))
    .catch(error => console.error(error.message));
};

window.logOut = function() {
  signOut(auth).then(() => console.log("Signed out"));
};

// Auth state listener
onAuthStateChanged(auth, user => {
  if (user) {
    console.log("Logged in:", user.email);
    document.getElementById("adForm").style.display = "block";
  } else {
    console.log("No user logged in");
    document.getElementById("adForm").style.display = "none";
  }
});

// Firestore: Post ad
window.postAd = async function() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const user = auth.currentUser;

  if (!user) {
    alert("You must be logged in to post ads!");
    return;
  }

  await addDoc(collection(db, "ads"), {
    title,
    description,
    user: user.email,
    createdAt: new Date()
  });
};

// Firestore: Display ads
onSnapshot(collection(db, "ads"), snapshot => {
  const adsDiv = document.getElementById("ads");
  adsDiv.innerHTML = "";
  snapshot.forEach(doc => {
    const ad = doc.data();
    adsDiv.innerHTML += `<p><strong>${ad.title}</strong>: ${ad.description} (posted by ${ad.user})</p>`;
  });
});
