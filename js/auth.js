import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   REGISTER FUNCTION
========================= */
window.register = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    // Create user
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    // Send verification email
    await sendEmailVerification(cred.user);

    // Save user data to Firestore
    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      balance: 0,
      createdAt: serverTimestamp()
    });

    alert("Registration successful! Please verify your email before login.");
    window.location.href = "index.html"; // back to login
  } catch (error) {
    alert(error.message);
  }
};

/* =========================
   LOGIN FUNCTION
========================= */
window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("Please enter email and password");
    return;
  }

  try {
    const cred = await signInWithEmailAndPassword(auth, email, password);

    // Check email verification
    if (!cred.user.emailVerified) {
      alert("Please verify your email first. Check your inbox.");
      return;
    }

    // Login success
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
};
