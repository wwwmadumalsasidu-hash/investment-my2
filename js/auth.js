import { auth, db } from "./firebase.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, setDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.register = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const username = document.getElementById("username").value;

  const user = await createUserWithEmailAndPassword(auth,email,password);

  await setDoc(doc(db,"users",user.user.uid),{
    username,
    email,
    balance: 0
  });

  alert("Account created");
  location.href="index.html";
}

window.login = async function(){
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  await signInWithEmailAndPassword(auth,email,password);
  location.href="dashboard.html";
}
