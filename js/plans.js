import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

/* AUTH CHECK */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
  currentUser = user;
  loadActivePlans();
});

/* LOAD ACTIVE PLANS ON PAGE LOAD */
async function loadActivePlans() {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const activePlans = snap.data().activePlans || {};

  Object.keys(activePlans).forEach(planId => {
    disableButton(planId);
    startTimer(planId, activePlans[planId].endDate);
  });
}

/* BUY PLAN */
window.buyPlan = async (planId, price, totalReturn) => {
  if (!currentUser) return;

  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const data = snap.data();
  const activePlans = data.activePlans || {};

  if (activePlans[planId]) {
    alert("⏳ This plan is already active");
    return;
  }

  if (data.balance < price) {
    alert("❌ Insufficient balance");
    return;
  }

  const startDate = Date.now();
  const endDate = startDate + 30 * 24 * 60 * 60 * 1000;

  await updateDoc(userRef, {
    balance: data.balance - price,
    [`activePlans.${planId}`]: {
      price,
      totalReturn,
      startDate,
      endDate,
      status: "ACTIVE"
    }
  });

  alert("✅ Plan Activated Successfully");
  disableButton(planId);
  startTimer(planId, endDate);
};

/* DISABLE BUTTON */
function disableButton(planId) {
  const box = document.querySelector(`[data-plan="${planId}"]`);
  if (!box) return;
  const btn = box.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Active";
}

/* TIMER */
function startTimer(planId, endDate) {
  const el = document.getElementById("status-" + planId);
  if (!el) return;

  const interval = setInterval(() => {
    const diff = endDate - Date.now();

    if (diff <= 0) {
      el.innerText = "✅ Completed";
      clearInterval(interval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);

    el.innerText = `🟢 Active | ${days}d ${hours}h ${minutes}m`;
  }, 1000);
}
