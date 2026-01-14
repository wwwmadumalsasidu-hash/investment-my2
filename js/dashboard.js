import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) location.href = "index.html";
  const snap = await getDoc(doc(db, "users", user.uid));
  document.getElementById("balance").innerText =
    "Balance: LKR " + snap.data().balance;
});
