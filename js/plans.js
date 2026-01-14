import { auth, db } from "./firebase.js";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { onAuthStateChanged } from
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let currentUser = null;

/* ---------------- AUTH ---------------- */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  currentUser = user;
  loadPlansStatus();
});

/* ---------------- BUY PLAN ---------------- */
window.buyPlan = async (planId, price, totalReturn) => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const planRef = doc(db, "users", currentUser.uid, "plans", planId);

  const userSnap = await getDoc(userRef);
  const planSnap = await getDoc(planRef);

  if (!userSnap.exists()) {
    alert("User data not found");
    return;
  }

  // already active
  if (planSnap.exists()) {
    alert("⚠️ This plan is already active");
    return;
  }

  const balance = userSnap.data().balance;

  if (balance < price) {
    alert("❌ Insufficient balance");
    return;
  }

  const startTime = Date.now();
  const endTime = startTime + (30 * 24 * 60 * 60 * 1000);

  // deduct balance
  await updateDoc(userRef, {
    balance: balance - price
  });

  // save plan
  await setDoc(planRef, {
    price,
    totalReturn,
    startTime,
    endTime,
    status: "ACTIVE"
  });

  alert("✅ Plan Activated Successfully");
  loadPlansStatus();
};

/* ---------------- LOAD PLAN STATUS ---------------- */
async function loadPlansStatus() {
  if (!currentUser) return;

  const planIds = [
    "PLAN_1000",
    "PLAN_3000",
    "PLAN_5000",
    "PLAN_10000",
    "PLAN_30000"
  ];

  for (let id of planIds) {
    const planRef = doc(db, "users", currentUser.uid, "plans", id);
    const snap = await getDoc(planRef);

    const statusEl = document.getElementById("status-" + id);
    const btn = statusEl?.nextElementSibling;

    if (!snap.exists()) {
      if (statusEl) statusEl.innerText = "";
      if (btn) {
        btn.disabled = false;
        btn.innerText = "Buy Now";
      }
      continue;
    }

    const data = snap.data();

    if (Date.now() >= data.endTime) {
      statusEl.innerHTML = "✅ Completed";
      btn.disabled = true;
      btn.innerText = "Completed";
      continue;
    }

    btn.disabled = true;
    btn.innerText = "ACTIVE";

    startCountdown(statusEl, data.endTime);
  }
}

/* ---------------- TIMER ---------------- */
function startCountdown(el, endTime) {
  function update() {
    const diff = endTime - Date.now();

    if (diff <= 0) {
      el.innerHTML = "✅ Completed";
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    el.innerHTML = `⏳ Active: <b>${days}d ${hours}h</b> remaining`;
  }

  update();
  setInterval(update, 1000 * 60);
}
