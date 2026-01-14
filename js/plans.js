import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
  currentUser = user;
  loadActivePlans();
});

async function loadActivePlans() {
  const snap = await getDoc(doc(db, "users", currentUser.uid));
  if (!snap.exists()) return;

  const activePlans = snap.data().activePlans || {};
  Object.keys(activePlans).forEach(planId => {
    disableButton(planId);
    startTimer(planId, activePlans[planId].endDate);
  });
}

function buyPlan(planId, price, totalReturn) {
  activatePlan(planId, price, totalReturn);
}

async function activatePlan(planId, price, totalReturn) {
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

  activePlans[planId] = {
    price,
    totalReturn,
    startDate,
    endDate,
    status: "ACTIVE"
  };

  await updateDoc(userRef, {
    balance: data.balance - price,
    activePlans: activePlans
  });

  alert("✅ Plan Activated");
  disableButton(planId);
  startTimer(planId, endDate);
}

function disableButton(planId) {
  const box = document.querySelector(`[data-plan="${planId}"]`);
  if (!box) return;
  const btn = box.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Active";
}

function startTimer(planId, endDate) {
  const el = document.getElementById("status-" + planId);
  if (!el) return;

  const timer = setInterval(() => {
    const diff = endDate - Date.now();
    if (diff <= 0) {
      el.innerText = "✅ Completed";
      clearInterval(timer);
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);

    el.innerText = `🟢 Active | ${d}d ${h}h ${m}m`;
  }, 1000);
}

window.buyPlan = buyPlan;
