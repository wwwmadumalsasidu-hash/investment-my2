import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (!user) {
    location.href = "index.html";
  } else {
    currentUser = user;
  }
});

/**
 * BUY PLAN
 * @param {string} planId  (ex: PLAN_1000)
 * @param {number} price
 * @param {number} totalReturn
 */
window.buyPlan = async (planId, price, totalReturn) => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    alert("User data not found");
    return;
  }

  const userData = userSnap.data();

  // ❌ balance check
  if (userData.balance < price) {
    alert("❌ Insufficient balance");
    return;
  }

  // ❌ check if same plan already ACTIVE
  const plansRef = collection(db, "users", currentUser.uid, "plans");
  const q = query(
    plansRef,
    where("planId", "==", planId),
    where("status", "==", "ACTIVE")
  );
  const existing = await getDocs(q);

  if (!existing.empty) {
    alert("⚠️ This plan is already active");
    return;
  }

  // dates
  const startDate = Date.now();
  const endDate = startDate + 30 * 24 * 60 * 60 * 1000;
  const dailyProfit = Math.floor(totalReturn / 30);

  // ✅ deduct balance
  await updateDoc(userRef, {
    balance: userData.balance - price
  });

  // ✅ save plan
  await setDoc(doc(plansRef), {
    planId,
    price,
    totalReturn,
    dailyProfit,
    startDate,
    endDate,
    status: "ACTIVE",
    createdAt: serverTimestamp()
  });

  alert("✅ Plan Activated Successfully");
  location.reload();
};
