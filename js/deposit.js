import { auth } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let userEmail = "";

// Check user login
onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
  } else {
    userEmail = user.email;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("submitDepositBtn");

  btn.addEventListener("click", () => {
    const amount = document.getElementById("amount").value;

    if (!amount || amount <= 0) {
      alert("❌ Please enter a valid amount");
      return;
    }

    // Telegram username
    const telegramUser = "Sasindumadumal";

    const message = `
📥 NEW DEPOSIT REQUEST (TELEGRAM)

👤 User Email:
${userEmail}

💰 Deposit Amount:
LKR ${amount}

🏦 Bank Details:
National Savings Bank
Account No: 100085101379
Name: U.P.S. MADHUMAL
Branch: Kuliyapitiya

🆔 Binance ID:
799445746

📸 Receipt will be sent here
    `;

    const telegramUrl =
      "https://t.me/" +
      telegramUser +
      "?text=" +
      encodeURIComponent(message);

    window.open(telegramUrl, "_blank");
  });
});
