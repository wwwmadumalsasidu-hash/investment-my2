import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.register = async () => {
  const email = emailInput();
  const password = passwordInput();

  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(cred.user);

  await setDoc(doc(db, "users", cred.user.uid), {
    email,
    balance: 0,
    createdAt: serverTimestamp()
  });

  alert("Registered. Verify email.");
};

window.login = async () => {
  const email = emailInput();
  const password = passwordInput();

  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!cred.user.emailVerified) {
    alert("Verify your email first");
    return;
  }
  location.href = "dashboard.html";
};

function emailInput() {
  return document.getElementById("email").value;
}
function passwordInput() {
  return document.getElementById("password").value;
}
