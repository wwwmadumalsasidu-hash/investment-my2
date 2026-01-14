import { auth, db } from "./firebase.js";
import { signOut, onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("userUID").innerText = user.uid;

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    document.getElementById("userBalance").innerText =
      snap.data().balance || 0;
  }
});

window.logout = async () => {
  await signOut(auth);
  location.href = "index.html";
};
