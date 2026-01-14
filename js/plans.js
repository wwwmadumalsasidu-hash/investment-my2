import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  doc,
  getDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

let currentUser;

onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }
  currentUser = user;
  loadActivePlans();
});

async function loadActivePlans() {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  if (!snap.exists()) return;

  const activePlans = snap.data().activePlans || {};

  Object.keys(activePlans).forEach(planId => {
    startTimer(planId, activePlans[planId].endDate);
    disableButton(planId);
  });
}

window.buyPlan = async (planId, price, total) => {
  const userRef = doc(db, "users", currentUser.uid);
  const snap = await getDoc(userRef);
  const data = snap.data();

  if (data.activePlans && data.activePlans[planId]) {
    alert("⏳ This plan is already active");
    return;
  }

  if (data.balance < price) {
    alert("❌ Insufficient balance");
    return;
  }

  const start = Date.now();
  const end = start + 30 * 24 * 60 * 60 * 1000;

  await updateDoc(userRef, {
    balance: data.balance - price,
    [`activePlans.${planId}`]: {
      price,
      total,
      startDate: start,
      endDate: end
    }
  });

  alert("✅ Plan Activated");
  disableButton(planId);
  startTimer(planId, end);
};

function disableButton(planId) {
  const planBox = document.querySelector(`[data-plan="${planId}"]`);
  if (!planBox) return;
  const btn = planBox.querySelector("button");
  btn.disabled = true;
  btn.innerText = "Active";
}

function startTimer(planId, end) {
  const el = document.getElementById("status-" + planId);
  if (!el) return;

  const timer = setInterval(() => {
    const diff = end - Date.now();

    if (diff <= 0) {
      el.innerText = "✅ Completed";
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);

    el.innerText = `🟢 Active | ${days} days ${hours} hours`;
  }, 1000);
    }
