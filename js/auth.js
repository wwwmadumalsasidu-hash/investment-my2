import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  doc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* REGISTER */
window.register = async function () {
  try {
    const email = emailInput();
    const password = passwordInput();

    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);

    await setDoc(doc(db, "users", cred.user.uid), {
      email: email,
      balance: 0,
      createdAt: serverTimestamp()
    });

    alert("Registered successfully. Please verify your email.");
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

/* LOGIN */
window.login = async function () {
  try {
    const email = emailInput();
    const password = passwordInput();

    const cred = await signInWithEmailAndPassword(auth, email, password);

    if (!cred.user.emailVerified) {
      alert("Please verify your email first");
      return;
    }

    location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

function emailInput() {
  return document.getElementById("email").value;
}
function passwordInput() {
  return document.getElementById("password").value;
}
