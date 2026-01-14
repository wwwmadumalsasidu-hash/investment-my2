import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  // show email
  document.getElementById("userEmail").innerText = user.email;

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();
      document.getElementById("userBalance").innerText =
        data.balance ?? 0;
    } else {
      document.getElementById("userBalance").innerText = 0;
    }
  } catch (e) {
    console.error(e);
    document.getElementById("userBalance").innerText = 0;
  }
});

window.logout = async () => {
  await signOut(auth);
  location.href = "index.html";
};
