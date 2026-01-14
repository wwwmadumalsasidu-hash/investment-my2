import { auth, db } from "./firebase.js";
import { addDoc, collection, serverTimestamp } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.sendWithdraw = async () => {
  await addDoc(collection(db, "withdraws"), {
    uid: auth.currentUser.uid,
    email: auth.currentUser.email,
    bank: bank.value,
    amount: amount.value,
    createdAt: serverTimestamp()
  });
  alert("Withdraw request sent");
};
