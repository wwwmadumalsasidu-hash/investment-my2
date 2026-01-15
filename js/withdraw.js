import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let userEmail = "";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  userEmail = user.email;

  // auto add email to message
  const textarea = document.getElementById("withdrawMessage");
  textarea.value = textarea.value.replace(
    "📧 Email:",
    "📧 Email: " + userEmail
  );
});

window.sendWithdrawWhatsApp = () => {
  const message = document.getElementById("withdrawMessage").value;

  const phone = "94717503915"; // WhatsApp number
  const url =
    "https://wa.me/" + phone + "?text=" + encodeURIComponent(message);

  window.open(url, "_blank");
};
