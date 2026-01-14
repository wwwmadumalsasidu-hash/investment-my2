import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const balanceEl = document.getElementById("balance");

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  try {
    const snap = await getDoc(doc(db, "users", user.uid));

    if (snap.exists()) {
      const data = snap.data();
      const balance = data.balance || 0;

      // 🔥 BALANCE SHOW
      balanceEl.innerText = "LKR " + balance;
    } else {
      balanceEl.innerText = "LKR 0";
    }

  } catch (err) {
    console.error(err);
    balanceEl.innerText = "LKR 0";
  }
});
