import { auth, db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.sendDeposit = async () => {
  await addDoc(collection(db, "deposits"), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    amount: document.getElementById("amount").value,
    createdAt: serverTimestamp()
  });
  alert("Deposit request sent");
};
