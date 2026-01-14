import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { doc, getDoc, updateDoc } from
"https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const plans = [
  {name:"Starter Plan", price:50, daily:2},
  {name:"Silver Plan", price:100, daily:5},
  {name:"Gold Plan", price:300, daily:20}
];

onAuthStateChanged(auth, async(user)=>{
  if(!user) location.href="index.html";

  const container = document.getElementById("plans");
  const ref = doc(db,"users",user.uid);
  const snap = await getDoc(ref);
  let balance = snap.data().balance;

  plans.forEach(plan=>{
    const div = document.createElement("div");
    div.className="plan";
    div.innerHTML=`
      <h3>${plan.name}</h3>
      <p>Price: $${plan.price}</p>
      <p>Daily Profit: $${plan.daily}</p>
      <button>Buy</button>
    `;
    div.querySelector("button").onclick = async()=>{
      if(balance < plan.price){
        alert("Insufficient balance");
        return;
      }
      balance -= plan.price;
      await updateDoc(ref,{ balance });
      alert("Plan purchased successfully");
      location.reload();
    };
    container.appendChild(div);
  });
});
