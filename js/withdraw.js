import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const whatsappNumber = "94717503915";

let userEmail = "";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
  userEmail = user.email;
});

window.openWithdrawWhatsApp = () => {
  const message = `
WITHDRAW REQUEST

📧 Email: ${userEmail}
💰 Withdraw Amount:
🏦 Bank Name:
🏦 Account Number:
👤 Account Holder Name:
🧾 Receipt Screenshot (if any):

Please process my withdrawal.
  `.trim();

  const url =
    "https://wa.me/" +
    whatsappNumber +
    "?text=" +
    encodeURIComponent(message);

  window.open(url, "_blank");
};
