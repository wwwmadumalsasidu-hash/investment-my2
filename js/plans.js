import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser;

/* ================= AUTH ================= */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
  currentUser = user;
  loadActivePlans();
});

/* ================= BUY PLAN ================= */
window.buyPlan = async (planId, price, totalReturn) => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) return;

  const data = userSnap.data();

  if (data.balance < price) {
    alert("❌ Insufficient Balance");
    return;
  }

  const planRef = doc(db, "users", currentUser.uid, "plans", planId);
  const planSnap = await getDoc(planRef);

  if (planSnap.exists() && planSnap.data().status === "ACTIVE") {
    alert("⚠️ This plan is already active");
    return;
  }

  const startDate = Date.now();
  const endDate = startDate + (30 * 24 * 60 * 60 * 1000);
  const dailyProfit = Math.floor(totalReturn / 30);

  /* deduct balance */
  await updateDoc(userRef, {
    balance: data.balance - price
  });

  /* save plan */
  await setDoc(planRef, {
    planId,
    price,
    totalReturn,
    dailyProfit,
    startDate,
    endDate,
    status: "ACTIVE"
  });

  alert("✅ Plan Activated");
  loadActivePlans();
};

/* ================= LOAD ACTIVE PLANS ================= */
async function loadActivePlans() {
  const plansRef = collection(db, "users", currentUser.uid, "plans");
  const snap = await getDocs(plansRef);

  snap.forEach((docSnap) => {
    const plan = docSnap.data();

    if (plan.status === "ACTIVE") {
      startTimer(plan.planId, plan.endDate);

      const btn = document.querySelector(
        `button[onclick*="${plan.planId}"]`
      );
      if (btn) {
        btn.disabled = true;
        btn.innerText = "ACTIVE";
      }
    }
  });
}

/* ================= TIMER ================= */
function startTimer(planId, endDate) {
  const statusEl = document.getElementById("status-" + planId);

  const interval = setInterval(() => {
    const now = Date.now();
    const diff = endDate - now;

    if (diff <= 0) {
      clearInterval(interval);
      statusEl.innerHTML = "✅ Plan Completed";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    statusEl.innerHTML = `
      ⏳ Remaining:
      <b>${days}d ${hours}h ${minutes}m ${seconds}s</b>
    `;
  }, 1000);
    }
