import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  document.getElementById("userEmail").innerText = user.email;
});

window.logout = async () => {
  await signOut(auth);
  location.href = "index.html";
};
