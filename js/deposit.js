import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let userEmail = "";

// check login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
  } else {
    userEmail = user.email;
  }
});

// wait until page loads
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitDepositBtn");

  if (!btn) {
    console.error("Submit button not found");
    return;
  }

  btn.addEventListener("click", () => {
    const amount = document.getElementById("amount").value;

    if (!amount || amount <= 0) {
      alert("❌ Please enter a valid amount");
      return;
    }

    const whatsappLink = "https://wa.me/94717503915";

    const message = `
📥 NEW DEPOSIT REQUEST

👤 User Email:
${userEmail}

💰 Deposit Amount:
LKR ${amount}

🏦 Bank: NSB
Account: 100085101379
Name: U.P.S. MADHUMAL

🆔 Binance ID: 799445746

📸 Receipt attached below
    `;

    const finalUrl =
      whatsappLink + "?text=" + encodeURIComponent(message);

    window.open(finalUrl, "_blank");
  });
});
