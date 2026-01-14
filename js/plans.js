import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
  } else {
    currentUser = user;
  }
});

window.buyPlan = async (price, totalReturn) => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    alert("User data not found");
    return;
  }

  const data = snap.data();

  if (data.balance < price) {
    alert("❌ Insufficient balance");
    return;
  }

  const dailyProfit = Math.floor(totalReturn / 30);
  const startDate = Date.now();
  const endDate = startDate + 30 * 24 * 60 * 60 * 1000;

  // deduct balance
  await updateDoc(userRef, {
    balance: data.balance - price
  });

  // save active plan
  await setDoc(doc(db, "users", currentUser.uid, "plans", String(startDate)), {
    price,
    totalReturn,
    dailyProfit,
    startDate,
    endDate,
    status: "ACTIVE",
    createdAt: serverTimestamp()
  });

  alert("✅ Plan Activated Successfully");
};
