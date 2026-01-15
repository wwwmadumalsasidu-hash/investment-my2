import { auth } from "./firebase.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const whatsappNumber = "94717503915";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const email = user.email;

  const message = `
Withdraw Request

Email: ${email}
Bank Name:
Account Name:
Account Number:
Receipt Screenshot:
  `;

  const encoded = encodeURIComponent(message.trim());
  const link = document.getElementById("whatsappLink");

  if (link) {
    link.href = `https://wa.me/${whatsappNumber}?text=${encoded}`;
  }
});
