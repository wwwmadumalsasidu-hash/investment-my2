import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let userEmail = "";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
  } else {
    userEmail = user.email;
  }
});

window.submitDeposit = () => {
  const amount = document.getElementById("amount").value;

  if (!amount || amount <= 0) {
    alert("❌ Please enter a valid amount");
    return;
  }

  // YOUR WHATSAPP LINK
  const whatsappLink = "https://wa.me/94717503915";

  const message = `
📥 NEW DEPOSIT REQUEST

👤 User Email:
${userEmail}

💰 Deposit Amount:
LKR ${amount}

🏦 Bank: NSB
🆔 Binance ID: 799445746

📸 Please find my payment receipt attached below.
  `;

  const finalUrl =
    whatsappLink + "?text=" + encodeURIComponent(message);

  window.open(finalUrl, "_blank");

  alert("✅ WhatsApp opened. Please attach receipt image & send.");
};
