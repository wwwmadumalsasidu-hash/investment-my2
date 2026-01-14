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

/* AUTH */
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    location.href = "index.html";
    return;
  }

  currentUser = user;
  initButtons();
  loadPlans();
});

/* BUTTON EVENTS */
function initButtons() {
  document.querySelectorAll(".buy-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      const planId = btn.dataset.plan;
      const price = Number(btn.dataset.price);
      const total = Number(btn.dataset.total);
      await buyPlan(planId, price, total);
    });
  });
}

/* BUY PLAN */
async function buyPlan(planId, price, totalReturn) {
  const userRef = doc(db, "users", currentUser.uid);
  const planRef = doc(db, "users", currentUser.uid, "plans", planId);

  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) {
    alert("User not found");
    return;
  }

  const balance = userSnap.data().balance;

  if (balance < price) {
    alert("❌ Insufficient balance");
    return;
  }

  const planSnap = await getDoc(planRef);
  if (planSnap.exists()) {
    alert("⚠️ Plan already active");
    return;
  }

  const start = Date.now();
  const end = start + 30 * 24 * 60 * 60 * 1000;

  await updateDoc(userRef, {
    balance: balance - price
  });

  await setDoc(planRef, {
    price,
    totalReturn,
    start,
    end,
    status: "ACTIVE"
  });

  alert("✅ Plan Activated");
  loadPlans();
}

/* LOAD PLANS */
async function loadPlans() {
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
    const btn = document.querySelector(`[data-plan="${id}"]`);

    if (!snap.exists()) {
      statusEl.innerText = "";
      btn.disabled = false;
      btn.innerText = "Buy Now";
      continue;
    }

    const data = snap.data();

    btn.disabled = true;
    btn.innerText = "ACTIVE";

    startTimer(statusEl, data.end);
  }
}

/* TIMER */
function startTimer(el, endTime) {
  function tick() {
    const diff = endTime - Date.now();
    if (diff <= 0) {
      el.innerHTML = "✅ Completed";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);

    el.innerHTML = `⏳ ${d} days ${h} hours remaining`;
  }

  tick();
  setInterval(tick, 60000);
}
